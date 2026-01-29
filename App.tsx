
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import ChatInput from './components/ChatInput';
import MessageBubble from './components/MessageBubble';
import Settings from './components/Settings';
import TaskAssistant from './components/TaskAssistant';
import CodeWorkspace from './components/CodeWorkspace';
import StudyCompanion from './components/StudyCompanion';
import HomeScreen from './components/HomeScreen';
import TommIcon from './components/TommIcon';
import { TypingWave } from './components/TypingIndicator';
import { Message, ChatSession, AppSettings, PersonaType } from './types';
import { sendMessageToTomm, decodeAudio } from './services/geminiService';
import { MenuIcon, MessageSquareIcon, CodeIcon } from './components/Icons';
import { THEME_CONFIGS } from './constants';

const DEFAULT_SETTINGS: AppSettings = {
  themePack: 'default',
  fontStyle: 'modern',
  layoutMode: 'comfortable',
  theme: 'auto',
  language: 'auto',
  answerStyle: 'normal',
  fontSize: 'medium',
  animationsEnabled: true,
  voiceEnabled: false,
  voiceName: 'Kore',
  safeMode: true,
  assistantMode: 'casual',
  personality: 'friendly'
};

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInputActive, setIsInputActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'chat' | 'tasks' | 'study' | 'code'>('home');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initial Load
  useEffect(() => {
    const savedSessions = localStorage.getItem('tomm_ai_sessions');
    if (savedSessions) {
      const parsed = JSON.parse(savedSessions);
      setSessions(parsed.map((s: any) => ({
        ...s,
        createdAt: new Date(s.createdAt),
        messages: s.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }))
      })));
    }
    const savedSettings = localStorage.getItem('tomm_ai_settings');
    if (savedSettings) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
  }, []);

  // Sync Logic
  useEffect(() => localStorage.setItem('tomm_ai_sessions', JSON.stringify(sessions)), [sessions]);
  useEffect(() => localStorage.setItem('tomm_ai_settings', JSON.stringify(settings)), [settings]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, isLoading]);

  // Theme & Font Application
  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = () => {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = settings.theme === 'dark' || settings.theme === 'amoled' || 
                    (settings.theme === 'auto' && systemDark);
      const isAmoled = settings.theme === 'amoled';
      
      root.classList.toggle('dark', isDark);
      root.classList.toggle('amoled', isAmoled);
      
      if (isAmoled) {
        document.body.style.backgroundColor = '#000000';
      } else {
        document.body.style.backgroundColor = isDark ? '#0f172a' : '#f8fafc';
      }
    };

    applyTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (settings.theme === 'auto') applyTheme();
    };

    mediaQuery.addEventListener('change', handleChange);
    
    const fontFamilies = {
      modern: "'Plus Jakarta Sans', sans-serif",
      minimal: "system-ui, sans-serif",
      futuristic: "'JetBrains Mono', monospace"
    };
    root.style.fontFamily = fontFamilies[settings.fontStyle];

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.theme, settings.fontStyle]);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  const handleSendMessage = async (content: string) => {
    let currentId = activeSessionId;
    if (!currentId) {
      currentId = Date.now().toString();
      const newSession: ChatSession = {
        id: currentId,
        title: content.slice(0, 30) + '...',
        messages: [],
        createdAt: new Date(),
        persona: 'standard'
      };
      setSessions(prev => [newSession, ...prev]);
      setActiveSessionId(currentId);
    }
    
    setActiveTab('chat');
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content, timestamp: new Date() };
    setSessions(prev => prev.map(s => s.id === currentId ? { ...s, messages: [...s.messages, userMessage] } : s));
    
    setIsLoading(true);
    const result = await sendMessageToTomm(activeSession?.messages || [], content, settings, activeSession?.persona);
    
    const botMessage: Message = { 
      id: (Date.now() + 1).toString(), 
      role: 'assistant', 
      content: result.text, 
      timestamp: new Date(),
      audioData: result.audio,
      suggestions: result.suggestions
    };

    setSessions(prev => prev.map(s => s.id === currentId ? { ...s, messages: [...s.messages, botMessage] } : s));
    setIsLoading(false);

    if (result.audio && settings.voiceEnabled) {
      if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const buffer = await decodeAudio(result.audio, audioContextRef.current);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.start();
    }
  };

  const themeColorClass = `bg-gradient-to-r ${THEME_CONFIGS[settings.themePack]}`;

  const isNavAtSide = activeTab !== 'home';
  const navContainerClasses = isNavAtSide 
    ? "fixed right-6 top-1/2 -translate-y-1/2 flex-col p-2" 
    : "fixed bottom-6 left-1/2 -translate-x-1/2 lg:left-[calc(50%+140px)] flex-row p-1.5";

  return (
    <div className={`flex h-screen w-full overflow-hidden`}>
      <Sidebar 
        sessions={sessions}
        activeSessionId={activeSessionId}
        onNewChat={() => {
          setActiveTab('home');
          setActiveSessionId('');
        }}
        onSelectSession={(id) => {
          setActiveSessionId(id);
          setActiveTab('chat');
        }}
        onDeleteSession={(id) => {
          setSessions(p => p.filter(s => s.id !== id));
          if (activeSessionId === id) setActiveSessionId('');
        }}
        onRenameSession={(id, title) => setSessions(p => p.map(s => s.id === id ? { ...s, title } : s))}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="flex-1 flex flex-col h-full lg:ml-[280px] overflow-hidden bg-white dark:bg-slate-900 transition-colors relative">
        <header className="h-16 flex items-center justify-between px-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 z-30">
           <div className="flex items-center gap-3">
             <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
               <MenuIcon className="w-5 h-5 text-slate-800 dark:text-white" />
             </button>
             {activeTab === 'chat' && activeSession ? (
               <div className="flex items-center gap-3">
                 <TommIcon size="sm" mode={isLoading ? 'thinking' : 'idle'} isPremium />
                 <div className="flex flex-col">
                   <h2 className="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[150px]">{activeSession.title}</h2>
                   <span className="text-[10px] text-indigo-500 font-bold uppercase">{activeSession.persona}</span>
                 </div>
               </div>
             ) : (
               <div className="flex items-center gap-2">
                  <TommIcon size="sm" mode="idle" isPremium />
                  <span className="text-sm font-bold dark:text-white">Tomm AI</span>
               </div>
             )}
           </div>
           
           {activeTab === 'chat' && (
             <div className="flex gap-1">
               {(['standard', 'coding', 'teacher', 'motivator', 'creative'] as PersonaType[]).map(p => (
                 <button 
                   key={p} 
                   onClick={() => setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, persona: p } : s))}
                   className={`w-2 h-2 rounded-full transition-all ${activeSession?.persona === p ? 'bg-indigo-500 scale-125' : 'bg-slate-300'}`} 
                 />
               ))}
             </div>
           )}
        </header>

        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'home' && <HomeScreen onAction={handleSendMessage} />}
          
          {activeTab === 'chat' && (
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
                <div className="max-w-4xl mx-auto flex flex-col">
                  {activeSession?.messages.map((msg) => (
                    <div key={msg.id} className="animate-fade-in">
                      <MessageBubble 
                        message={msg} 
                        themeColor={themeColorClass} 
                        fontSize={settings.fontSize}
                      />
                      {msg.role === 'assistant' && msg.suggestions && (
                        <div className="flex flex-wrap gap-2 ml-10 mb-6">
                           {msg.suggestions.map((s, i) => (
                             <button key={i} onClick={() => handleSendMessage(s)} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs rounded-full border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 transition-all dark:text-white">
                               {s}
                             </button>
                           ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && <div className="ml-10"><TypingWave /></div>}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              <ChatInput 
                onSendMessage={handleSendMessage} 
                isLoading={isLoading} 
                onFocusChange={(focused) => setIsInputActive(focused)}
              />
            </div>
          )}

          {activeTab === 'tasks' && <div className="p-6 h-full max-w-4xl mx-auto"><TaskAssistant onAskAI={handleSendMessage} /></div>}
          {activeTab === 'study' && <div className="p-6 h-full max-w-4xl mx-auto"><StudyCompanion onSendMessage={handleSendMessage} /></div>}
          {activeTab === 'code' && <div className="p-4 h-full"><CodeWorkspace /></div>}
        </div>

        <div 
          className={`z-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border border-slate-200 dark:border-slate-700 rounded-[2.5rem] shadow-2xl flex items-center gap-2 transition-all duration-500 ease-in-out ${navContainerClasses} ${isInputActive ? 'opacity-0 translate-y-20 pointer-events-none' : 'opacity-100'}`}
        >
          {[
            { id: 'home', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
            { id: 'chat', icon: <MessageSquareIcon /> },
            { id: 'tasks', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> },
            { id: 'study', icon: <span className="text-lg">🎓</span> },
            { id: 'code', icon: <CodeIcon /> },
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setActiveTab(btn.id as any)}
              className={`p-3.5 rounded-full transition-all duration-300 flex items-center justify-center ${activeTab === btn.id ? `${themeColorClass} text-white shadow-lg scale-110` : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:scale-105'}`}
            >
              {btn.icon}
            </button>
          ))}
        </div>
      </main>

      <Settings 
        settings={settings} 
        onUpdate={updates => setSettings(s => ({...s, ...updates}))} 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
};

export default App;
