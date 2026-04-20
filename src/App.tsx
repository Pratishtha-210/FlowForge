import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { ConfigPanel } from './components/ConfigPanel';
import { Play, Moon, Sun, LayoutDashboard } from 'lucide-react';
import { SimulationPanel } from './components/SimulationPanel';
import { runSimulation } from './engine/simulator';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSimulate = () => {
    runSimulation();
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <header className="h-14 border-b border-slate-200/50 dark:border-slate-800/50 flex flex-shrink-0 items-center justify-between px-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-20 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-sm shadow-indigo-500/20">
            <LayoutDashboard size={18} className="text-white" />
          </div>
          <h1 className="font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
            FlowForge
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
            title="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          
          <button 
            onClick={handleSimulate}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:to-indigo-400 text-white text-sm font-medium rounded-lg transition-all shadow-[0_2px_10px_-3px_rgba(79,70,229,0.5)] hover:shadow-[0_4px_14px_-4px_rgba(79,70,229,0.6)] cursor-pointer"
          >
            <Play size={16} className="fill-white/20" />
            <span>Simulate</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex relative overflow-hidden bg-slate-50 dark:bg-slate-950">
        <Sidebar />
        <Canvas />
        <ConfigPanel />
      </main>

      <SimulationPanel />
    </div>
  );
}

export default App;
