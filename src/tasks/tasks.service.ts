import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskStatus } from './tasks.entity';
import { Tasks, TasksDocument } from './schema/tasks.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class TasksService {

    constructor(
        @InjectModel(Tasks.name) private tasksModule: Model<TasksDocument>
    ) { }

    getALLTasks() {
        return this.tasksModule.find();
    }
    createTasks(title: string, description: string) {
        const task: Task = {
            title,
            description,
            status: TaskStatus.PENDING
        }
        // Utilizamos el método create() para insertar un único documento
        const newTask = new this.tasksModule(task);
        return newTask.save(); // Guardamos el documento y retornamos la promesa
    }
    updateTasks() {

    }
    deleteTasks(id: string) {
        const objectId = new ObjectId(id); // Convertir el string a ObjectId
        return this.tasksModule.deleteOne({ _id: objectId }).exec();
    }
}
