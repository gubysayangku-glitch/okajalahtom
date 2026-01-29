
import React, { useState, useRef, useEffect } from 'react';
import { SendIcon, MicIcon, StopIcon, CodeIcon, MessageSquareIcon } from './Icons';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onFocusChange?: (focused: boolean) => void;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, onFocusChange }) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [text]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'id-ID';

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
        }
        if (finalTranscript) setText(prev => (prev ? prev + ' ' : '') + finalTranscript);
      };

      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (isListening) recognitionRef.current?.stop();
    else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
    }, 600);
  };

  const handleSubmit = (e?: React.FormEvent | React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    if (text.trim() && !isLoading) {
      if (isListening) recognitionRef.current?.stop();
      onSendMessage(text.trim());
      setText('');
      setShowTools(false);
      textareaRef.current?.blur();
    }
  };

  const toolShortcuts = [
    { label: 'Jelaskan Kode', prompt: 'Bisa tolong jelaskan baris kode ini?' },
    { label: 'Ringkas Teks', prompt: 'Tolong ringkas teks berikut agar lebih singkat:' },
    { label: 'Translate EN', prompt: 'Terjemahkan kalimat ini ke Bahasa Inggris:' },
    { label: 'Cari Ide Nama', prompt: 'Berikan ide nama keren untuk proyek/bisnis tentang:' },
    { label: 'Debug Error', prompt: 'Tolong bantu cari penyebab error ini:' },
  ];

  return (
    <div className="border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 sticky bottom-0 z-10">
      <div className="max-w-4xl mx-auto">
        {/* Tool Shortcuts Bar */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          <button 
            onClick={() => setShowTools(!showTools)}
            className={`p-2 rounded-lg flex-shrink-0 transition-all ${showTools ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </button>
          {toolShortcuts.map((tool, idx) => (
            <button
              key={idx}
              onClick={() => setText(tool.prompt + ' ')}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-full whitespace-nowrap transition-all border border-transparent hover:border-indigo-200 hover:scale-105 active:scale-95"
            >
              {tool.label}
            </button>
          ))}
        </div>

        <div className="relative flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => onFocusChange?.(true)}
              onBlur={() => onFocusChange?.(false)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
              placeholder={isListening ? "Mendengarkan..." : "Ketik pesan untuk Asisten Tomm AI..."}
              disabled={isLoading}
              className={`w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none min-h-[44px] max-h-[150px] transition-all dark:text-white disabled:opacity-50 ${isListening ? 'ring-2 ring-indigo-500 bg-indigo-50 animate-pulse shadow-inner' : ''}`}
            />
          </div>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={toggleListening}
              disabled={isLoading}
              className={`p-3 rounded-xl transition-all flex-shrink-0 flex items-center justify-center h-[44px] w-[44px] hover:scale-105 active:scale-90 ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200' 
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 shadow-sm'
              }`}
            >
              {isListening ? <StopIcon /> : <MicIcon />}
            </button>

            <button
              onClick={(e) => {
                createRipple(e);
                handleSubmit(e);
              }}
              disabled={!text.trim() || isLoading}
              className={`relative overflow-hidden p-3 rounded-xl flex-shrink-0 flex items-center justify-center h-[44px] w-[44px] transition-all duration-300 group ${
                !text.trim() || isLoading
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 dark:shadow-purple-900/40 hover:scale-110 active:scale-95'
              }`}
            >
              {/* Ripple Effect elements */}
              {ripples.map((ripple) => (
                <span
                  key={ripple.id}
                  className="absolute bg-white/30 rounded-full animate-ripple pointer-events-none"
                  style={{
                    left: ripple.x,
                    top: ripple.y,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              ))}

              {/* Shine effect on enabled */}
              {text.trim() && !isLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
              )}
              
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <SendIcon className={`w-5 h-5 transition-transform duration-300 ${text.trim() ? 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5' : ''}`} />
              )}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes ripple {
          from {
            width: 0;
            height: 0;
            opacity: 0.5;
          }
          to {
            width: 200px;
            height: 200px;
            opacity: 0;
          }
        }
        .animate-ripple {
          animation: ripple 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ChatInput;
