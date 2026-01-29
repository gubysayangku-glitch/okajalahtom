
import React, { useState } from 'react';
import { BotIcon } from './Icons';

interface StudyCompanionProps {
  onSendMessage: (msg: string) => void;
}

const StudyCompanion: React.FC<StudyCompanionProps> = ({ onSendMessage }) => {
  const [subject, setSubject] = useState('');

  const studyTools = [
    { label: 'Buat Kuis', prompt: `Buatkan 5 soal kuis pilihan ganda tentang [SUBJECT]. Berikan kunci jawaban di akhir.`, icon: '📝' },
    { label: 'Latihan Soal', prompt: `Berikan 3 latihan soal esai tentang [SUBJECT] dan cara pengerjaannya.`, icon: '✏️' },
    { label: 'Jadwal Belajar', prompt: `Buatkan jadwal belajar efektif selama 1 minggu untuk menguasai [SUBJECT].`, icon: '📅' },
    { label: 'Evaluasi Jawaban', prompt: `Tolong evaluasi jawaban saya untuk materi [SUBJECT]. Ini jawaban saya: `, icon: '✅' },
  ];

  const handleToolClick = (prompt: string) => {
    const finalPrompt = prompt.replace('[SUBJECT]', subject || 'materi umum');
    onSendMessage(finalPrompt);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white">
          <span className="text-xl">🎓</span>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-lg">AI Study Companion</h3>
          <p className="text-xs text-slate-500">Partner belajarmu yang pintar</p>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Materi yang Dipelajari</label>
        <input 
          type="text" 
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Contoh: Matematika, Sejarah, Coding..."
          className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 transition-all dark:text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {studyTools.map((tool, idx) => (
          <button
            key={idx}
            onClick={() => handleToolClick(tool.prompt)}
            className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-2xl border border-transparent hover:border-amber-200 transition-all text-center group"
          >
            <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{tool.icon}</span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{tool.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
        <div className="flex gap-3">
          <BotIcon className="w-5 h-5 text-indigo-500 shrink-0" />
          <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
            "Sebutkan materi yang ingin kamu kuasai, lalu pilih salah satu alat di atas. Aku akan membantumu belajar dengan kuis dan latihan soal!"
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudyCompanion;
