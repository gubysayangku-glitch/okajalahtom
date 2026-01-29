
import React from 'react';
import { Message, FontSize } from '../types';
import { BotIcon } from './Icons';

interface MessageBubbleProps {
  message: Message;
  themeColor?: string;
  fontSize?: FontSize;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  themeColor = 'bg-indigo-600',
  fontSize = 'medium' 
}) => {
  const isAssistant = message.role === 'assistant';
  const emotionMatch = message.content.match(/\[EMOTION:(.*?)\]/);
  const emotion = emotionMatch ? emotionMatch[1] : '';
  const cleanContent = message.content.replace(/\[EMOTION:.*?\]/, '').replace(/\[CARD\]/, '').trim();
  const isCard = message.content.includes('[CARD]');

  // Dynamic Font Size Class
  const fontSizeClass = {
    small: 'text-sm',
    medium: 'text-[15px]',
    large: 'text-lg'
  }[fontSize];

  return (
    <div className={`flex w-full mb-5 animate-slide-in ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[92%] sm:max-w-[85%] ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}>
        {isAssistant && (
          <div className="flex-shrink-0 mr-3 mt-1 relative group">
            <div className={`absolute -inset-1 rounded-2xl blur-md opacity-20 group-hover:opacity-50 transition-all duration-700 ${themeColor} animate-pulse`} />
            <div className={`relative w-10 h-10 rounded-2xl ${themeColor} flex items-center justify-center text-white shadow-xl overflow-hidden transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-60" />
              <BotIcon className="w-6 h-6 z-10 transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full z-20 shadow-sm" />
          </div>
        )}
        
        <div className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
          {emotion && isAssistant && (
             <span className="text-xs mb-1.5 bg-white/80 dark:bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 animate-bounce shadow-sm">
               {emotion}
             </span>
          )}
          
          <div className={`rounded-2xl px-5 py-3.5 shadow-sm transition-all hover:shadow-md ${
            isAssistant 
              ? (isCard 
                  ? 'bg-gradient-to-br from-indigo-50/50 to-white dark:from-slate-800 dark:to-slate-950 border-2 border-indigo-100 dark:border-indigo-900/50 ring-4 ring-indigo-500/5 text-slate-900 dark:text-slate-50' 
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50')
              : `${themeColor} text-white font-medium shadow-indigo-200/50 dark:shadow-none`
          }`}>
            <div className={`whitespace-pre-wrap break-words ${fontSizeClass} leading-relaxed ${isCard ? 'font-medium' : ''}`}>
              {cleanContent}
            </div>
          </div>
          <span className="text-[10px] text-slate-400 mt-1.5 px-1 font-medium tracking-tight">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
