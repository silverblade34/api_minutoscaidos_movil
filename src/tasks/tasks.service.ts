import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.entity';
import { v4 } from 'uuid';

@Injectable()
export class TasksService {
    private tasks: Task[] = [
        {
            id: '1',
            title: 'first task',
            description: 'some task',
            status: TaskStatus.PENDING
        }
    ]

    getALLTasks() {
        return this.tasks;
    }
    createTasks(title: string, description: string) {
        const task: Task = {
            id: v4(),
            title,
            description,
            status: TaskStatus.PENDING
        }
        this.tasks.push(task)
        return this.tasks;
    }
    updateTasks() {

    }
    deleteTasks(id: string) {
        this.tasks = this.tasks.filter(task => task.id !== id)
        return this.tasks;
    }
}
