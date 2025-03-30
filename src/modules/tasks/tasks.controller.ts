import { Controller, Get } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
  @Get()
  sendHello() {
    return 'Hello from hot reload';
  }
}
