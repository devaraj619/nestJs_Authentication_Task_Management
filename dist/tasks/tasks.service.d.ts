import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './Dto/create-task.dto';
import { GetTaskFilterDto } from './Dto/get-task-filter.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';
export declare class TasksService {
    private taskRepository;
    constructor(taskRepository: TasksRepository);
    getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]>;
    getTaskById(id: string, user: User): Promise<Task>;
    createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task>;
    deleteTaskById(id: string, user: User): Promise<void>;
    updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task>;
}
