
import React from 'react';

export const AIOrb = ({ active = false }: { active?: boolean }) => (
  <div className={`relative w-12 h-12 flex items-center justify-center transition-all duration-700 ${active ? 'scale-110' : 'scale-100'}`}>
    <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 opacity-20 blur-xl animate-pulse ${active ? 'opacity-40 scale-150' : ''}`} />
    <div className={`relative w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-lg flex items-center justify-center overflow-hidden`}>
      <div className={`w-full h-full absolute top-0 left-0 bg-white/20 animate-spin-slow`} style={{ animationDuration: '3s' }} />
      <div className="w-2 h-2 rounded-full bg-white shadow-inner animate-ping" />
    </div>
  </div>
);

export const TypingWave = () => (
  <div className="flex gap-1 items-center p-2">
    {[0, 1, 2].map((i) => (
      <div 
        key={i} 
        className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" 
        style={{ animationDelay: `${i * 0.15}s` }} 
      />
    ))}
  </div>
);
