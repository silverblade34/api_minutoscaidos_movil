import { Body, Controller, Get, Post, Delete, Param, UseGuards, Res } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/task.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  async getAllTasks(@Res() res: Response) {
    const tasks = await this.tasksService.getALLTasks();
    res.locals.response('Tasks retrieved successfully', tasks, true);
  }

  @Post()
  async createTasks(@Body() newTask: CreateTaskDto, @Res() res: Response) {
    const task = await this.tasksService.createTasks(newTask.title, newTask.description);
    res.locals.response('Task created successfully', task, true);
  }

  @Delete(':id')
  async deleteTasks(@Param('id') id: string, @Res() res: Response) {
    await this.tasksService.deleteTasks(id);
    res.locals.response('Task deleted successfully', {}, true);
  }
}
