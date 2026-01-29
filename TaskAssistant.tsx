
import React, { useState, useEffect } from 'react';
import { Task, SubTask } from '../types';
import { PlusIcon, TrashIcon } from './Icons';

interface TaskAssistantProps {
  onAskAI: (prompt: string) => void;
}

const TaskAssistant: React.FC<TaskAssistantProps> = ({ onAskAI }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('tomm_ai_tasks');
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('tomm_ai_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTaskText.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false,
      subTasks: []
    };
    setTasks([task, ...tasks]);
    setNewTaskText('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleBreakdown = (task: Task) => {
    onAskAI(`Tolong bantu breakdown tugas besar ini menjadi 5 langkah kecil yang praktis: "${task.text}"`);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
          AI Task Manager
        </h3>
      </div>

      <div className="flex gap-2 mb-6">
        <input 
          value={newTaskText}
          onChange={e => setNewTaskText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          placeholder="Ketik tugas besar di sini..."
          className="flex-1 bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 py-3 text-sm dark:text-white focus:ring-2 focus:ring-indigo-500"
        />
        <button onClick={addTask} className="bg-indigo-600 text-white p-3 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none">
          <PlusIcon />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 opacity-40">
            <span className="text-4xl mb-2">📋</span>
            <p className="text-xs font-bold uppercase tracking-widest">Belum ada tugas</p>
          </div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="group flex flex-col p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => toggleTask(task.id)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 dark:border-slate-600'}`}
                >
                  {task.completed && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </button>
                <span className={`text-sm font-medium flex-1 dark:text-white ${task.completed ? 'line-through text-slate-400' : ''}`}>
                  {task.text}
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleBreakdown(task)}
                    className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-indigo-500 text-[10px] font-bold uppercase tracking-tight transition-all opacity-0 group-hover:opacity-100"
                    title="Breakdown with AI"
                  >
                    AI Breakdown
                  </button>
                  <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 transition-all">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskAssistant;
