import React, { useEffect } from 'react';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { cn } from '../utils/cn';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NodeRegistry } from '../registry';

export function ConfigPanel() {
  const { selectedNodeId, nodes, updateNodeData, updateNodeConfig, setSelectedNodeId } = useWorkflowStore();
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const nodeDef = selectedNode ? NodeRegistry[selectedNode.type || 'task'] : null;
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: nodeDef?.schema ? zodResolver(nodeDef.schema as any) : undefined,
    defaultValues: selectedNode?.data.config || nodeDef?.defaultConfig || {}
  });

  useEffect(() => {
    if (selectedNode) {
      reset(selectedNode.data.config || nodeDef?.defaultConfig || {});
    }
  }, [selectedNode?.id, reset]);

  if (!selectedNode || !nodeDef) return null;

  const onSubmit = (data: any) => {
    updateNodeConfig(selectedNode.id, data);
  };

  return (
    <div className="w-80 h-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-l border-slate-200/50 dark:border-slate-800/50 flex flex-col absolute right-0 top-0 shadow-2xl z-20 transition-all">
      <div className="p-5 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between bg-white/30 dark:bg-slate-900/30">
        <div className="flex items-center gap-2">
           <div className={cn("p-1.5 rounded-md", nodeDef.theme.bg, nodeDef.theme.color)}>
             {React.createElement(nodeDef.icon, { size: 16 })}
           </div>
           <h2 className="font-bold text-[13px] tracking-wide text-slate-800 dark:text-slate-100">
             Configure {nodeDef.label}
           </h2>
        </div>
        <button 
          onClick={() => setSelectedNodeId(null)}
          className="p-1 rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="p-5 flex-1 overflow-y-auto w-full space-y-6">
        <div className="space-y-2">
           <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em] block">
             Node Label
           </label>
           <input
             type="text"
             value={selectedNode.data.label}
             onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
             className="w-full px-3 py-2.5 bg-white/50 dark:bg-slate-950/50 border border-slate-300/50 dark:border-slate-700/50 rounded-lg text-sm font-medium text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all shadow-sm"
           />
        </div>

        <form onBlur={handleSubmit(onSubmit)} className="space-y-5 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
          
          {selectedNode.type === 'task' && (
            <>
              <div className="space-y-1.5">
                 <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase block">Assignee Email</label>
                 <input
                   {...register("assigneeEmail")}
                   className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 outline-none"
                 />
                 {errors.assigneeEmail && <span className="text-xs text-rose-500">{errors.assigneeEmail.message as string}</span>}
              </div>
              <div className="space-y-1.5">
                 <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase block">Description</label>
                 <textarea
                   {...register("description")}
                   rows={3}
                   className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 outline-none resize-none"
                 />
                 {errors.description && <span className="text-xs text-rose-500">{errors.description.message as string}</span>}
              </div>
            </>
          )}

          {selectedNode.type === 'approval' && (
            <div className="space-y-1.5">
               <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase block">Approver Role</label>
               <select
                 {...register("approverRole")}
                 className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 outline-none"
               >
                 <option value="Manager">Direct Manager</option>
                 <option value="HR">HR Business Partner</option>
                 <option value="Finance">Finance Director</option>
               </select>
               {errors.approverRole && <span className="text-xs text-rose-500">{errors.approverRole.message as string}</span>}
            </div>
          )}

          {selectedNode.type === 'automated' && (
            <div className="space-y-1.5">
               <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase block">Action</label>
               <select
                 {...register("actionType")}
                 className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 outline-none"
               >
                 <option value="email">Send Email</option>
                 <option value="slack">Slack Notification</option>
                 <option value="webhook">Call Webhook</option>
               </select>
               {errors.actionType && <span className="text-xs text-rose-500">{errors.actionType.message as string}</span>}
            </div>
          )}

          {selectedNode.type === 'end' && (
            <div className="flex items-center gap-2">
               <input
                 type="checkbox"
                 id="notifyCompletion"
                 {...register("notifyCompletion")}
                 className="rounded border-slate-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
               />
               <label htmlFor="notifyCompletion" className="text-sm text-slate-700 dark:text-slate-300">Notify upon completion</label>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
