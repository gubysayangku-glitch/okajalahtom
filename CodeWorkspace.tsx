
import React, { useState } from 'react';

const CodeWorkspace: React.FC = () => {
  const [code, setCode] = useState('// Ketik kodemu di sini\nconsole.log("Halo dari Tomm AI!");');
  const [output, setOutput] = useState<string[]>([]);

  const runCode = () => {
    setOutput(['Menjalankan...']);
    try {
      // Very basic sandbox simulation
      const logs: string[] = [];
      const fakeConsole = {
        log: (...args: any[]) => logs.push(args.map(a => JSON.stringify(a)).join(' '))
      };
      
      const func = new Function('console', code);
      func(fakeConsole);
      setOutput(logs.length > 0 ? logs : ['Kode berhasil dijalankan (tanpa output).']);
    } catch (e: any) {
      setOutput([`Error: ${e.message}`]);
    }
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-800 h-full flex flex-col text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
          Coding Workspace
        </h3>
        <button 
          onClick={runCode}
          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-900/20"
        >
          RUN CODE
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <textarea 
          value={code}
          onChange={e => setCode(e.target.value)}
          spellCheck={false}
          className="flex-1 bg-slate-800/50 rounded-2xl p-4 font-mono text-sm border border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
        />
        <div className="h-32 bg-black/40 rounded-2xl p-4 font-mono text-xs overflow-y-auto border border-slate-800">
          <p className="text-slate-500 mb-2 uppercase tracking-widest text-[10px] font-bold">Output Console</p>
          {output.map((line, i) => (
            <div key={i} className={line.startsWith('Error') ? 'text-red-400' : 'text-emerald-400'}>
              {`> ${line}`}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodeWorkspace;
