import { z } from 'zod';

export const StartNodeSchema = z.object({
  schedule: z.string().optional(),
});

export const TaskNodeSchema = z.object({
  assigneeEmail: z.string().email("Invalid email address").min(1, "Assignee is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
});

export const ApprovalNodeSchema = z.object({
  approverRole: z.enum(["Manager", "HR", "Finance"], {
    errorMap: () => ({ message: "Please select a valid role" })
  }),
});

export const AutomatedNodeSchema = z.object({
  actionType: z.enum(["email", "slack", "webhook"], {
    errorMap: () => ({ message: "Please select an action type" })
  }),
});

export const EndNodeSchema = z.object({
  notifyCompletion: z.boolean().default(false).optional(),
});
