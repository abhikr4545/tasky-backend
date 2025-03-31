import { z } from 'zod';

// Create enums that match your PostgreSQL enums
export const TaskStatusEnum = z.enum([
  'NOT_STARTED',
  'IN_PROGRESS',
  'COMPLETED',
]);
export const TaskPriorityEnum = z.enum(['P1', 'P2', 'P3']);

export const taskBaseSchema = z.object({
  createdBy: z.string().min(1, 'Created by is required'),
  taskName: z.string().min(1, 'Task name is required'),
  taskDescription: z.string().nullable().optional(),
  status: TaskStatusEnum.default('NOT_STARTED'),
  priority: TaskPriorityEnum.default('P3'),
  category: z.string().max(100).nullable().optional(),
});

export const createTaskSchema = taskBaseSchema.extend({
  completedAt: z.date().nullable().optional(),
});

export const taskSchema = taskBaseSchema.extend({
  id: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
  completedAt: z.date().nullable().optional(),
});

export const updateTaskSchema = taskBaseSchema.partial().extend({
  completedAt: z.date().nullable().optional(),
});

// Type definitions
export type TaskStatus = z.infer<typeof TaskStatusEnum>;
export type TaskPriority = z.infer<typeof TaskPriorityEnum>;
export type CreateTaskDto = z.infer<typeof createTaskSchema>;
export type TaskDto = z.infer<typeof taskSchema>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
