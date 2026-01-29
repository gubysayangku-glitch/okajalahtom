
import React from 'react';
import { AppSettings, ThemeMode, Language, AnswerStyle, FontSize, AssistantMode, Personality, ThemePack, FontStyle } from '../types';

interface SettingsProps {
  settings: AppSettings;
  onUpdate: (updates: Partial<AppSettings>) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Settings = ({ settings, onUpdate, isOpen, onClose }: SettingsProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" 
        onClick={onClose} 
      />
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800 scrollbar-hide animate-bounce-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Preferensi</h2>
            <p className="text-xs text-slate-500 font-medium">Kustomisasi Asisten Tomm AI-mu</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-all hover:rotate-90 active:scale-90"
          >
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">🎨 Theme Packs</h3>
            <div className="grid grid-cols-2 gap-3">
              {(['default', 'cyber-blue', 'neon-dark', 'soft-pastel'] as ThemePack[]).map(pack => (
                <button
                  key={pack}
                  onClick={() => onUpdate({ themePack: pack })}
                  className={`relative p-4 rounded-2xl border-2 transition-all text-left overflow-hidden group hover:scale-[1.02] active:scale-[0.98] ${
                    settings.themePack === pack ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-slate-100 dark:border-slate-800'
                  }`}
                >
                  <span className="relative z-10 text-xs font-bold dark:text-white capitalize">{pack.replace('-', ' ')}</span>
                  <div className={`absolute bottom-0 right-0 w-8 h-8 rounded-tl-full transition-transform group-hover:scale-125 ${
                    pack === 'default' ? 'bg-indigo-600' :
                    pack === 'cyber-blue' ? 'bg-cyan-500' :
                    pack === 'neon-dark' ? 'bg-purple-600' : 'bg-rose-300'
                  }`} />
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">✨ Personalisasi UI</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                <div>
                  <p className="text-sm font-bold dark:text-white">Gaya Font</p>
                  <p className="text-[10px] text-slate-500">Ubah tipografi aplikasi</p>
                </div>
                <select 
                  value={settings.fontStyle}
                  onChange={(e) => onUpdate({ fontStyle: e.target.value as FontStyle })}
                  className="bg-white dark:bg-slate-900 border-none rounded-xl text-xs font-bold p-2 focus:ring-2 focus:ring-indigo-500 shadow-sm"
                >
                  <option value="modern">Modern</option>
                  <option value="minimal">Minimal</option>
                  <option value="futuristic">Futuristik</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                <div>
                  <p className="text-sm font-bold dark:text-white">Ukuran Teks</p>
                  <p className="text-[10px] text-slate-500">Sesuaikan ukuran font chat</p>
                </div>
                <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl shadow-inner border border-slate-100 dark:border-slate-800">
                   {(['small', 'medium', 'large'] as FontSize[]).map(size => (
                     <button
                       key={size}
                       onClick={() => onUpdate({ fontSize: size })}
                       className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${settings.fontSize === size ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                     >
                       {size === 'small' ? 'Kecil' : size === 'medium' ? 'Sedang' : 'Besar'}
                     </button>
                   ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                 <p className="text-sm font-bold dark:text-white">Dark Mode</p>
                 <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl shadow-inner border border-slate-100 dark:border-slate-800">
                   {(['light', 'dark', 'amoled'] as ThemeMode[]).map(m => (
                     <button
                       key={m}
                       onClick={() => onUpdate({ theme: m })}
                       className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${settings.theme === m ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                     >
                       {m}
                     </button>
                   ))}
                 </div>
              </div>
            </div>
          </section>

          <section>
             <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">💡 AI Intelligence</h3>
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="text-[10px] font-bold text-slate-400 mb-2 block uppercase">Answer Style</label>
                 <select 
                   value={settings.answerStyle}
                   onChange={(e) => onUpdate({ answerStyle: e.target.value as AnswerStyle })}
                   className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold p-3 dark:text-white shadow-sm"
                 >
                   <option value="brief">Singkat</option>
                   <option value="normal">Normal</option>
                   <option value="detailed">Detail</option>
                 </select>
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-400 mb-2 block uppercase">Personality</label>
                  <select 
                    value={settings.personality}
                    onChange={(e) => onUpdate({ personality: e.target.value as Personality })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold p-3 dark:text-white shadow-sm"
                  >
                    <option value="friendly">Ramah</option>
                    <option value="humorous">Humoris</option>
                    <option value="firm">Tegas</option>
                  </select>
               </div>
             </div>
          </section>

          <section className="pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Asisten Tomm AI siap membantu kapan pun.</p>
            <p className="text-[10px] text-slate-400 mt-2 font-medium tracking-tight">Tomm AI Assistant v3.1 Ultimate</p>
          </section>
        </div>
      </div>
      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.9) translateY(20px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Settings;
