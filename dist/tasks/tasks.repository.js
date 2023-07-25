"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksRepository = void 0;
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const task_entity_1 = require("./task.entity");
const exceptions_1 = require("@nestjs/common/exceptions");
const task_status_enum_1 = require("./task-status.enum");
const common_1 = require("@nestjs/common");
let TasksRepository = exports.TasksRepository = class TasksRepository extends typeorm_1.Repository {
    constructor(taskRepository) {
        super(taskRepository.target, taskRepository.manager, taskRepository.queryRunner);
        this.taskRepository = taskRepository;
        this.logger = new common_1.Logger('Task Repository', { timestamp: true });
    }
    async getTasks(filterDto, user) {
        const { status, search } = filterDto;
        const query = this.taskRepository.createQueryBuilder('task');
        query.where({ user });
        if (status) {
            query.andWhere('task.status = :status', { status });
        }
        if (search) {
            query.andWhere('(LOWER(task.title) LIKE LOWER(:search) or LOWER(task.description) LIKE LOWER(:search))', { search: `%${search}%` });
        }
        try {
            const tasks = await query.getMany();
            return tasks;
        }
        catch (error) {
            this.logger.error(`failed to get tasks for user ${user.username}`, error.stack);
            throw new exceptions_1.InternalServerErrorException();
        }
    }
    async findTaskById(id, user) {
        const found = await this.taskRepository.findOne({ where: { id: id, user: user }, });
        if (!found) {
            throw new exceptions_1.NotFoundException(`Task with Id ${id} Not Found`);
        }
        return found;
    }
    async createTask(createTaskDto, user) {
        const { title, description } = createTaskDto;
        const task = this.taskRepository.create({
            title,
            description,
            status: task_status_enum_1.TaskStatus.OPEN,
            user,
        });
        try {
            const newTask = await this.taskRepository.save(task);
            this.logger.verbose(`created task with "title": ${title} and "description": ${description}`);
            return newTask;
        }
        catch (error) {
            this.logger.error(`failed to create task`, error.stack);
            throw new exceptions_1.InternalServerErrorException();
        }
    }
    async deleteTaskById(id, user) {
        const deletedTask = await this.taskRepository.delete({ id, user });
        if (deletedTask.affected == 0) {
            throw new exceptions_1.NotFoundException(`Task with "${id}" not found`);
        }
    }
    async updateTaskStatus(id, status, user) {
        const task = await this.findTaskById(id, user);
        task.status = status;
        await this.taskRepository.save(task);
        return task;
    }
};
exports.TasksRepository = TasksRepository = __decorate([
    __param(0, (0, typeorm_2.InjectRepository)(task_entity_1.Task)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], TasksRepository);
//# sourceMappingURL=tasks.repository.js.map