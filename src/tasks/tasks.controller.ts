import { Body, Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/task.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
    constructor(
        private tasksService: TasksService,
    ) { }

    @Get()
    getAllTasks() {
        return this.tasksService.getALLTasks();
    }

    @Post()
    createTasks(@Body() newTask: CreateTaskDto) {
        return this.tasksService.createTasks(newTask.title, newTask.description);
    }

    @Delete(':id')
    deleteTasks(@Param('id') id: string) {
        return this.tasksService.deleteTasks(id);
    }
}
