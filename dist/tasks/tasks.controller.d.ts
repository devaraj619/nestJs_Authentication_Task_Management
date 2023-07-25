import { TasksService } from './tasks.service';
import { CreateTaskDto } from './Dto/create-task.dto';
import { GetTaskFilterDto } from './Dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './Dto/update-task-status.dto';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';
export declare class TasksController {
    private taskService;
    private logger;
    constructor(taskService: TasksService);
    getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]>;
    getTaskById(id: string, user: User): Promise<Task>;
    CreateTask(createTaskDto: CreateTaskDto, user: User): Promise<Task>;
    deleteById(id: string, user: User): Promise<void>;
    updateTaskStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto, user: User): Promise<Task>;
}
