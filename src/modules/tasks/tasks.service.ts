import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DRIZZLE_OPTIONS } from '../drizzle/drizzle.constants';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { CreateTaskDto, createTaskSchema } from './create-task.schema';
import { tasks } from './schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class TasksService {
  constructor(
    @Inject(DRIZZLE_OPTIONS) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async getTasks() {
    return this.db.query.tasks.findMany();
  }

  async createTask(taskData: CreateTaskDto) {
    try {
      const validatedTaskData = createTaskSchema.parse(taskData);

      const insertData = {
        createdBy: validatedTaskData.createdBy,
        taskName: validatedTaskData.taskName,
        ...(validatedTaskData.taskDescription
          ? { taskDescription: validatedTaskData.taskDescription }
          : {}),
        ...(validatedTaskData.status
          ? { status: validatedTaskData.status }
          : {}),
        ...(validatedTaskData.priority
          ? { priority: validatedTaskData.priority }
          : {}),
        ...(validatedTaskData.category
          ? { category: validatedTaskData.category }
          : {}),
        ...(validatedTaskData.completedAt
          ? { completedAt: validatedTaskData.completedAt }
          : {}),
      };

      const result = await this.db.insert(schema.tasks).values(insertData);

      return result[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getTaskById(taskId: string) {
    try {
      const task = await this.db
        .select()
        .from(tasks)
        .where(eq(tasks.id, taskId))
        .limit(1);

      if (!task.length) {
        throw new NotFoundException(`Task with ID ${taskId} not found`);
      }

      return task[0];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve the task');
    }
  }

  async updateTask(taskId: string, updateData: any) {
    const dataToUpdate = {
      ...updateData,
      updatedAt: new Date(),
    };

    if (updateData.status === 'COMPLETED') {
      dataToUpdate.completedAt = new Date();
    }

    Object.keys(dataToUpdate).forEach(
      (key) => dataToUpdate[key] === undefined && delete dataToUpdate[key],
    );

    // Execute the update
    const updatedTasks = await this.db
      .update(schema.tasks)
      .set(dataToUpdate)
      .where(eq(tasks.id, taskId))
      .returning();

    // Check if task was found and updated
    if (!updatedTasks.length) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    return updatedTasks[0];
  }

  async deleteTask(taskId: string) {
    try {
      // First, check if the task exists and belongs to the user
      const existingTask = await this.db
        .select({ id: tasks.id })
        .from(tasks)
        .where(eq(tasks.id, taskId))
        .limit(1);

      if (!existingTask.length) {
        throw new NotFoundException(`Task with ID ${taskId} not found`);
      }

      await this.db.delete(tasks).where(eq(tasks.id, taskId)).returning();

      return { message: 'Task deleted successfully', id: taskId };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete the task');
    }
  }
}
