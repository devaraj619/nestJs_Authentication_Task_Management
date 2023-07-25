import { Repository } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from "./task.entity";
import { InternalServerErrorException, NotFoundException } from '@nestjs/common/exceptions';
import { CreateTaskDto } from "./Dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { GetTaskFilterDto } from "./Dto/get-task-filter.dto";
import { User } from "src/auth/user.entity";
import { Logger } from "@nestjs/common";

export class TasksRepository extends Repository<Task> {
    private logger = new Logger('Task Repository', {timestamp: true});
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>
    ) {
        super(taskRepository.target, taskRepository.manager, taskRepository.queryRunner);
    }

    async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
        const {status, search} = filterDto;
        const query = this.taskRepository.createQueryBuilder('task');
        query.where({user});

        if(status) {
            query.andWhere('task.status = :status', {status})
        }

        if(search) {
            query.andWhere( '(LOWER(task.title) LIKE LOWER(:search) or LOWER(task.description) LIKE LOWER(:search))', {search: `%${search}%`})
        }

        try {
            const tasks = await query.getMany();
            return tasks;
        } catch (error) {
            this.logger.error(`failed to get tasks for user ${user.username}`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    async findTaskById(id: string, user: User): Promise<Task> {
        const found = await this.taskRepository.findOne({ where: {id: id, user: user}, }); 
        if(!found) {
            throw new NotFoundException(`Task with Id ${id} Not Found`);
        }

        return found;
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const {title, description} = createTaskDto;
        const task = this.taskRepository.create({
            title,
            description,
            status: TaskStatus.OPEN,
            user,
        })

        try {
            const newTask = await this.taskRepository.save(task);
            this.logger.verbose(`created task with "title": ${title} and "description": ${description}`);
            return newTask;
        } catch (error) {
            this.logger.error(`failed to create task`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    async deleteTaskById(id: string, user: User): Promise<void> {
        const deletedTask = await this.taskRepository.delete({id, user});
        if(deletedTask.affected == 0) {
            throw new NotFoundException(`Task with "${id}" not found`);
        }
    }

    async updateTaskStatus(id: string, status:TaskStatus, user: User): Promise<Task> {
        const task = await this.findTaskById(id, user);
        task.status = status;
        await this.taskRepository.save(task);
        return task;
    }

}