import React from 'react';
import { Handle, Position, NodeToolbar } from '@xyflow/react';
import { cn } from '../utils/cn';
import { NodeRegistry } from '../registry';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { AlertCircle, Loader2, CheckCircle, XCircle, Trash2, Settings2 } from 'lucide-react';

export function CustomNode({ id, data, type, selected }: any) {
  const nodeDef = NodeRegistry[type as string] || NodeRegistry.task;
  const Icon = nodeDef.icon;
  const config = nodeDef.theme;
  
  const { nodeValidationErrors, nodeStatuses, deleteNode, setSelectedNodeId } = useWorkflowStore();
  
  const errors = nodeValidationErrors[id] || [];
  const hasError = errors.length > 0;
  const status = nodeStatuses[id] || 'idle';

  return (
    <>
      <NodeToolbar isVisible={selected} position={Position.Top} className="flex items-center gap-1 p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl mb-2">
        <button 
          onClick={(e) => { e.stopPropagation(); setSelectedNodeId(id); }}
          className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors tooltip-trigger"
          title="Edit Configuration"
        >
          <Settings2 size={14} />
        </button>
        <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-0.5"></div>
        <button 
          onClick={(e) => { e.stopPropagation(); deleteNode(id); }}
          className="p-1.5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded transition-colors"
          title="Delete Node"
        >
          <Trash2 size={14} />
        </button>
      </NodeToolbar>

      <div className={cn(
      "w-64 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 relative group transform hover:-translate-y-0.5",
      "shadow-[inset_0_1px_rgba(255,255,255,0.7)] dark:shadow-[inset_0_1px_rgba(255,255,255,0.05)]",
      selected ? "ring-2 ring-indigo-500 border-transparent shadow-lg" : "border border-slate-200/60 dark:border-slate-800/80",
      hasError && "border-rose-500 ring-2 ring-rose-500/20",
      status === 'running' && "ring-2 ring-indigo-400 border-transparent animate-pulse",
      status === 'success' && "ring-2 ring-emerald-500/60 border-emerald-500/50",
      status === 'failed' && "border-rose-500 ring-2 ring-rose-500"
    )}>
      
      {type !== 'start' && (
        <Handle 
          type="target" 
          position={Position.Top} 
          className="w-3 h-3 !bg-white dark:!bg-slate-900 !border-2 !border-slate-300 dark:!border-slate-600 rounded-full" 
        />
      )}
      
      <div className="p-4 flex gap-3 items-start">
        <div className={cn("p-2 rounded-lg mt-0.5", config.bg, config.color)}>
           <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate flex items-center justify-between">
            {data.label}
            {/* Status Indicators */}
            {status === 'running' && <Loader2 size={14} className="text-indigo-400 animate-spin" />}
            {status === 'success' && <CheckCircle size={14} className="text-emerald-500" />}
            {status === 'failed' && <XCircle size={14} className="text-rose-500" />}
            {hasError && status === 'idle' && (
               <div className="group/tooltip relative">
                 <AlertCircle size={14} className="text-rose-500" />
                 {/* Simple Tooltip */}
                 <div className="absolute hidden group-hover/tooltip:block bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-slate-900 text-white text-xs rounded p-2 z-50 whitespace-normal">
                   {errors.map((err, i) => <div key={i}>• {err}</div>)}
                 </div>
               </div>
            )}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
            {type === 'task' && (data.config?.assigneeEmail || 'Unassigned')}
            {type === 'approval' && (data.config?.approverRole || 'Manager Approval')}
            {type === 'automated' && (data.config?.actionType || 'Action')}
            {type === 'start' && 'Trigger point'}
            {type === 'end' && 'Workflow completes'}
          </div>
        </div>
      </div>

      {type !== 'end' && (
        <Handle 
          type="source" 
          position={Position.Bottom} 
          className="w-3 h-3 !bg-white dark:!bg-slate-900 !border-2 !border-slate-300 dark:!border-slate-600 rounded-full" 
        />
      )}
    </div>
    </>
  );
}
