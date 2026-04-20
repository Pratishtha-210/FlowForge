import React from 'react';
import { NodeRegistry } from '../registry';
import { cn } from '../utils/cn';

export function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/reactflow-label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 h-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col p-5 z-10 shadow-sm relative">
      <div className="mb-6">
        <h2 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] mb-4">
          Node Palette
        </h2>
        <div className="space-y-3 relative">
          {Object.values(NodeRegistry).map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.type}
                className={cn(
                  "p-3 rounded-xl border border-slate-200/70 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm",
                  "cursor-grab active:cursor-grabbing hover:-translate-y-0.5 hover:shadow-[0_8px_16px_-6px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_8px_16px_-6px_rgba(0,0,0,0.4)] hover:border-indigo-400/50 dark:hover:border-indigo-500/50 transition-all duration-300 ease-out",
                  "flex items-center gap-3 group"
                )}
                draggable
                onDragStart={(e) => onDragStart(e, item.type, item.label)}
              >
                <div className={cn("p-2 rounded-lg transition-transform duration-300 group-hover:scale-110", item.theme.bg, item.theme.color)}>
                  <Icon size={18} />
                </div>
                <span className="font-medium text-[13px] text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-auto pt-6 border-t border-slate-200/50 dark:border-slate-800/50">
         <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center leading-relaxed">
           Drag components onto the<br/>canvas to construct rules.
         </p>
      </div>
    </div>
  );
}
