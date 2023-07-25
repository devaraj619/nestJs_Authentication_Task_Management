import { Controller, Get, Post, Delete, Body, Param, Patch, Query, UseGuards, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './Dto/create-task.dto';
import { GetTaskFilterDto } from './Dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './Dto/update-task-status.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('Task controller');
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTaskFilterDto, @GetUser() user:User): Promise<Task[]> {
    this.logger.verbose(`User ${user.username} is retreviving all tasks with filter: ${JSON.stringify(filterDto)}`);
    return this.taskService.getTasks(filterDto, user);
  }

  @Get('/:id')
  getTaskById(@Param('id') id:string, @GetUser() user:User): Promise<Task> {
    return this.taskService.getTaskById(id, user);
  }

  @Post()
  CreateTask( @Body() createTaskDto: CreateTaskDto, @GetUser() user:User): Promise<Task> {
    return this.taskService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  deleteById(@Param('id') id:string, @GetUser() user:User): Promise<void> {
    return this.taskService.deleteTaskById(id, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(@Param('id') id:string, @Body() updateTaskStatusDto:UpdateTaskStatusDto, @GetUser() user:User): Promise<Task> {
    const {status} = updateTaskStatusDto;
    return this.taskService.updateTaskStatus(id, status, user);
  }

}

