// Importamos los decoradores que nos ofrece mongoose
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Declaramos un tipo de dato que representa un documento de tipo Task en la base de datos
export type TasksDocument = Tasks & Document;

// Definimos el esquema de la entidad "Task" usando el decorador @Schema()
@Schema({ collection: 'tasks', versionKey: false })
export class Tasks {
    // Usamos el decorador @Prop() para definir cada campo de la entidad
    @Prop()
    title: string; // Campo "title" de tipo string

    @Prop()
    description: string; // Campo "description" de tipo string

    @Prop()
    status: string; // Campo "status" de tipo string
}

// Creamos el esquema real utilizando la fábrica de esquemas de Mongoose
export const TasksSchema = SchemaFactory.createForClass(Tasks);
