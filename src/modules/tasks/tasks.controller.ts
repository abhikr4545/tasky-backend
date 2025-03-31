import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { CreateTaskDto, createTaskSchema } from './create-task.schema';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getTasks() {
    return this.tasksService.getTasks();
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createTaskSchema))
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    this.tasksService.createTask(createTaskDto);
  }

  @Patch()
  async updateTask(@Body() obj: { id: string; data: any }) {
    this.tasksService.updateTask(obj.id, obj.data);
  }

  @Get(':id')
  async getTaskById(@Param('id') taskId: string) {
    return this.tasksService.getTaskById(taskId);
  }

  @Delete(':id')
  async deleteTask(@Param('id') taskId: string) {
    return this.tasksService.deleteTask(taskId);
  }
}
