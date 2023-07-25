import { Injectable } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './Dto/create-task.dto';
import { GetTaskFilterDto } from './Dto/get-task-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TasksRepository)
        private taskRepository:TasksRepository,
    ) {}

    getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto, user);
    }

    getTaskById(id: string, user: User): Promise<Task> {
        return this.taskRepository.findTaskById(id, user);
    }

    createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
       return this.taskRepository.createTask(createTaskDto, user);
    }

    deleteTaskById(id: string, user: User): Promise<void> {
        return this.taskRepository.deleteTaskById(id, user);
    }

    updateTaskStatus(id: string, status:TaskStatus, user: User): Promise<Task> {
        return this.taskRepository.updateTaskStatus(id, status, user);
    }
}
