import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Tasks, TasksSchema } from './schema/tasks.schema';

@Module({
  // Definimos los módulos importados
  imports: [
    // Importamos el módulo Mongoose y registramos la entidad "Tasks" y su esquema "TasksSchema"
    MongooseModule.forFeature([
      {
        name: Tasks.name, 
        schema: TasksSchema 
      }
    ])
  ],
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule { }
