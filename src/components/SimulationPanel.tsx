import { useWorkflowStore } from '../store/useWorkflowStore';
import { Terminal, X, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

export function SimulationPanel() {
  const { simulationStatus, simulationLogs, setSimulationStatus } = useWorkflowStore();

  if (simulationStatus === 'idle') return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-8">
      <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-950">
         <div className="flex items-center gap-2">
            <Terminal size={16} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-200">Simulation Runner</span>
            {simulationStatus === 'running' && <Loader2 size={14} className="text-indigo-400 animate-spin ml-2" />}
            {simulationStatus === 'success' && <CheckCircle size={14} className="text-emerald-500 ml-2" />}
            {simulationStatus === 'failed' && <XCircle size={14} className="text-rose-500 ml-2" />}
         </div>
         <button 
           onClick={() => setSimulationStatus('idle')}
           className="text-slate-500 hover:text-slate-300 transition-colors"
         >
           <X size={16} />
         </button>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto space-y-2 bg-slate-900 font-mono text-xs max-h-64">
        {simulationLogs.map((log, i) => (
          <div key={i} className={cn(
            "leading-relaxed",
            log.includes('❌') ? "text-rose-400" :
            log.includes('✅') || log.includes('🎉') ? "text-emerald-400" :
            "text-slate-300"
          )}>
            <span className="text-slate-600 mr-2">{'>'}</span>{log}
          </div>
        ))}
        {simulationStatus === 'running' && (
          <div className="text-slate-500 flex items-center gap-2 mt-2">
            <span className="animate-pulse">_</span>
          </div>
        )}
      </div>
    </div>
  );
}
