
import React from 'react';
import TommIcon from './TommIcon';

interface HomeScreenProps {
  onAction: (prompt: string) => void;
  userName?: string;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onAction, userName = "Teman Tomm" }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  const quickActions = [
    { label: 'Ringkasan Hari Ini', prompt: 'Berikan ringkasan inspirasi dan motivasi untuk hari ini.', icon: '☀️' },
    { label: 'Belajar Sesuatu', prompt: 'Bantu aku belajar hal baru yang menarik hari ini.', icon: '🎓' },
    { label: 'Prompt Generator', prompt: 'Bantu aku buat prompt AI yang bagus untuk...', icon: '✍️' },
    { label: 'Cek Kode', prompt: 'Aku punya kode yang ingin aku diskusikan.', icon: '💻' },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 animate-fade-in overflow-y-auto">
      <div className="mb-8 flex flex-col items-center">
        {/* New Animated Tomm Icon */}
        <TommIcon size="xl" mode="idle" isPremium={true} className="mb-6" />
        
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mt-2 mb-2 tracking-tight text-center">
          {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">{userName}!</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm text-sm">
          Asisten Tomm AI siap menemani produktivitasmu hari ini. Mau mulai dari mana?
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
        {quickActions.map((action, i) => (
          <button
            key={i}
            onClick={() => onAction(action.prompt)}
            className="group p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-4 text-left"
          >
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              {action.icon}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">{action.label}</p>
              <p className="text-xs text-slate-500 mt-1">Ketuk untuk mulai</p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-12 flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-full border border-indigo-100 dark:border-indigo-800 animate-bounce">
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Tomm AI Premium Active</span>
      </div>
    </div>
  );
};

export default HomeScreen;
