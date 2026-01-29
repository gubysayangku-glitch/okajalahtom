
import React, { useState } from 'react';

interface FileAssistantProps {
  onFileProcessed: (content: string) => void;
}

const FileAssistant: React.FC<FileAssistantProps> = ({ onFileProcessed }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      onFileProcessed(`Menganalisis file: ${file.name}\n\nIsi: ${text.slice(0, 1000)}...`);
    };
    reader.readAsText(file);
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all ${
        dragActive ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10' : 'border-slate-200 dark:border-slate-700'
      }`}
      onDragOver={() => setDragActive(true)}
      onDragLeave={() => setDragActive(false)}
    >
      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
      </div>
      <h4 className="font-bold dark:text-white mb-1">Upload File</h4>
      <p className="text-xs text-slate-500 mb-4">Mendukung TXT, MD, atau paste teks besar</p>
      <input type="file" onChange={handleFile} className="hidden" id="file-upload" accept=".txt,.md,.json,.js,.py" />
      <label htmlFor="file-upload" className="cursor-pointer px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all">
        PILIH FILE
      </label>
    </div>
  );
};

export default FileAssistant;
