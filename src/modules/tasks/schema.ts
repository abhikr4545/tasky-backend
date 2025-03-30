import { pgEnum, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { ulid } from 'ulid';

export const taskStatusEnum = pgEnum('task_status', [
  'NOT_STARTED',
  'IN_PROGRESS',
  'COMPLETED',
]);

export const taskPriorityEnum = pgEnum('task_priority', ['P1', 'P2', 'P3']);

export const tasks = pgTable('tasks', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => ulid())
    .unique(),
  createdBy: text('created_by').notNull(),
  taskName: text('task_name').notNull(),
  taskDescription: text('task_description'),
  createdAt: timestamp({ precision: 6, withTimezone: true }).defaultNow(),
  updatedAt: timestamp({ precision: 6, withTimezone: true }).defaultNow(),
  status: taskStatusEnum('status').default('NOT_STARTED').notNull(),
  priority: taskPriorityEnum('priority').default('P3').notNull(),
  category: varchar({ length: 100 }),
  completedAt: timestamp({ precision: 6, withTimezone: true }).default(null),
});
