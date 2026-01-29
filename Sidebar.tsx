
import React, { useState } from 'react';
import { ChatSession } from '../types';
import { PlusIcon, TrashIcon, MessageSquareIcon } from './Icons';
import TommIcon from './TommIcon';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onRenameSession,
  isOpen,
  onClose,
  onOpenSettings
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleRename = (id: string) => {
    if (editValue.trim()) {
      onRenameSession(id, editValue.trim());
    }
    setEditingId(null);
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      <aside className={`fixed top-0 left-0 h-full w-[280px] bg-slate-900 text-white z-40 transition-transform duration-300 ease-in-out transform flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-4 flex items-center gap-3">
          <TommIcon size="sm" mode="idle" />
          <div>
            <h1 className="font-bold text-lg tracking-tight">Tomm AI</h1>
            <p className="text-xs text-slate-400">Asisten Pintar & Ramah</p>
          </div>
        </div>

        <div className="p-4">
          <button
            onClick={() => { onNewChat(); onClose(); }}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 transition-all py-3 rounded-xl border border-slate-700/50 group active:scale-95 shadow-sm"
          >
            <PlusIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Chat Baru</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-hide">
          <h2 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3 px-2">Riwayat Chat</h2>
          <div className="space-y-1">
            {sessions.length === 0 ? (
              <p className="text-xs text-slate-500 px-2 italic">Belum ada percakapan</p>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                    activeSessionId === session.id 
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-600/30' 
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                  onClick={() => { onSelectSession(session.id); }}
                >
                  <MessageSquareIcon className="w-4 h-4 flex-shrink-0" />
                  
                  {editingId === session.id ? (
                    <input 
                      autoFocus
                      className="bg-transparent text-sm w-full outline-none border-b border-indigo-500"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onBlur={() => handleRename(session.id)}
                      onKeyDown={e => e.key === 'Enter' && handleRename(session.id)}
                    />
                  ) : (
                    <span className="text-sm truncate flex-1">{session.title}</span>
                  )}

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(session.id);
                        setEditValue(session.title);
                      }}
                      className="p-1 hover:text-indigo-400"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      className="p-1 hover:text-red-400"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-800/50 space-y-3">
          <button 
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl text-slate-300 transition-all border border-transparent hover:border-slate-700 active:scale-95 group"
          >
             <svg className="w-5 h-5 transition-transform duration-500 group-hover:rotate-90 group-hover:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
             <span className="text-sm font-medium">Pengaturan</span>
          </button>
          
          <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl border border-slate-800/50">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-black shadow-inner">
              PRO
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">Teman Tomm</p>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Premium Mode</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
