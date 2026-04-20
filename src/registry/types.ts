import { z } from 'zod';
import { StartNodeSchema, TaskNodeSchema, ApprovalNodeSchema, AutomatedNodeSchema, EndNodeSchema } from './schemas';

export type StartNodeConfig = z.infer<typeof StartNodeSchema>;
export type TaskNodeConfig = z.infer<typeof TaskNodeSchema>;
export type ApprovalNodeConfig = z.infer<typeof ApprovalNodeSchema>;
export type AutomatedNodeConfig = z.infer<typeof AutomatedNodeSchema>;
export type EndNodeConfig = z.infer<typeof EndNodeSchema>;

export type AnyNodeConfig = StartNodeConfig | TaskNodeConfig | ApprovalNodeConfig | AutomatedNodeConfig | EndNodeConfig;
