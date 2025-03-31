import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import {
  createTaskSchema,
  TaskStatusEnum,
  TaskPriorityEnum,
} from './create-task.schema';
import { BadRequestException } from '@nestjs/common';

// Mock data
const mockTask = {
  id: '1',
  taskName: 'Test Task',
  taskDescription: 'Test Description',
  status: TaskStatusEnum.enum.IN_PROGRESS,
  priority: TaskPriorityEnum.enum.P2,
  createdBy: 'user123',
  category: 'Work',
  createdAt: new Date(),
  updatedAt: new Date(),
  completedAt: null,
};

const mockTasks = [
  mockTask,
  {
    id: '2',
    taskName: 'Another Task',
    taskDescription: 'Another Description',
    status: TaskStatusEnum.enum.COMPLETED,
    priority: TaskPriorityEnum.enum.P1,
    createdBy: 'user123',
    category: 'Personal',
    createdAt: new Date(),
    updatedAt: new Date(),
    completedAt: new Date(),
  },
];

// Use explicit type for the createTaskDto to match exact enum types
const createTaskDto = {
  taskName: 'New Task',
  taskDescription: 'New Description',
  status: TaskStatusEnum.enum.NOT_STARTED,
  priority: TaskPriorityEnum.enum.P3,
  createdBy: 'user123',
  category: 'Project',
  completedAt: null,
};

// Mock TasksService
const mockTasksService = {
  getTasks: jest.fn(),
  getTaskById: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
};

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);

    // Reset mock function calls before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTasks', () => {
    it('should return an array of tasks', async () => {
      mockTasksService.getTasks.mockResolvedValue(mockTasks);

      const result = await controller.getTasks();

      expect(result).toEqual(mockTasks);
      expect(service.getTasks).toHaveBeenCalled();
    });
  });

  describe('getTaskById', () => {
    it('should return a task by ID', async () => {
      mockTasksService.getTaskById.mockResolvedValue(mockTask);

      const result = await controller.getTaskById('1');

      expect(result).toEqual(mockTask);
      expect(service.getTaskById).toHaveBeenCalledWith('1');
    });
  });

  describe('createTask', () => {
    it('should create a task', async () => {
      mockTasksService.createTask.mockResolvedValue(undefined);

      await controller.createTask(createTaskDto);

      expect(service.createTask).toHaveBeenCalledWith(createTaskDto);
    });

    it('should throw BadRequestException for invalid data', async () => {
      // Create an instance of the validation pipe
      const zodPipe = new ZodValidationPipe(createTaskSchema);

      // Invalid data (missing required fields)
      const invalidData = {
        taskDescription: 'Invalid Data',
        status: TaskStatusEnum.enum.NOT_STARTED,
        priority: TaskPriorityEnum.enum.P3,
        // Missing required createdBy and taskName fields
      };

      // Test the pipe directly
      try {
        zodPipe.transform(invalidData);
        fail('Should have thrown an exception');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      const updateData = {
        taskName: 'Updated Task',
        status: TaskStatusEnum.enum.COMPLETED,
        completedAt: new Date(),
      };
      mockTasksService.updateTask.mockResolvedValue(undefined);

      await controller.updateTask({ id: '1', data: updateData });

      expect(service.updateTask).toHaveBeenCalledWith('1', updateData);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      mockTasksService.deleteTask.mockResolvedValue(undefined);

      await controller.deleteTask('1');

      expect(service.deleteTask).toHaveBeenCalledWith('1');
    });
  });
});
