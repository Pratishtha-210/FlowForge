import { Play, Target, Settings, GitCommit, CheckSquare } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { z } from 'zod';
import { StartNodeSchema, TaskNodeSchema, ApprovalNodeSchema, AutomatedNodeSchema, EndNodeSchema } from './schemas';

export interface NodeDefinition {
  type: string;
  label: string;
  icon: LucideIcon;
  schema: z.ZodTypeAny;
  defaultConfig: Record<string, any>;
  theme: {
    color: string;
    bg: string;
    border: string;
  }
}

export const NodeRegistry: Record<string, NodeDefinition> = {
  start: {
    type: 'start',
    label: 'Start Trigger',
    icon: Play,
    schema: StartNodeSchema,
    defaultConfig: { schedule: '' },
    theme: { color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-800' }
  },
  task: {
    type: 'task',
    label: 'Manual Task',
    icon: CheckSquare,
    schema: TaskNodeSchema,
    defaultConfig: { assigneeEmail: '', description: '' },
    theme: { color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10', border: 'border-indigo-200 dark:border-indigo-800' }
  },
  approval: {
    type: 'approval',
    label: 'Approval Step',
    icon: Target,
    schema: ApprovalNodeSchema,
    defaultConfig: { approverRole: 'Manager' },
    theme: { color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-800' }
  },
  automated: {
    type: 'automated',
    label: 'Automated Action',
    icon: Settings,
    schema: AutomatedNodeSchema,
    defaultConfig: { actionType: 'email' },
    theme: { color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-200 dark:border-blue-800' }
  },
  end: {
    type: 'end',
    label: 'End Process',
    icon: GitCommit,
    schema: EndNodeSchema,
    defaultConfig: { notifyCompletion: false },
    theme: { color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10', border: 'border-rose-200 dark:border-rose-800' }
  }
};
