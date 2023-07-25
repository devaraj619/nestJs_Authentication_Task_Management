import { Repository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./Dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { GetTaskFilterDto } from "./Dto/get-task-filter.dto";
import { User } from "src/auth/user.entity";
export declare class TasksRepository extends Repository<Task> {
    private taskRepository;
    private logger;
    constructor(taskRepository: Repository<Task>);
    getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]>;
    findTaskById(id: string, user: User): Promise<Task>;
    createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task>;
    deleteTaskById(id: string, user: User): Promise<void>;
    updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task>;
}
