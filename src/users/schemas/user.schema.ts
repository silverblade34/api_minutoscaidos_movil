// Importamos los decoradores que nos ofrece mongoose
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Declaramos un tipo de dato que representa un documento de tipo User en la base de datos
export type UserDocument = User & Document;

// Definimos el esquema de la entidad "User" usando el decorador @Schema()
@Schema({ collection: 'users', versionKey: false })
export class User {
    @Prop()
    user: string;

    @Prop()
    password: string;

    @Prop()
    rol: string;

    @Prop()
    status: boolean;

    @Prop()
    code: string; 

    @Prop()
    business: string;
}

// Creamos el esquema real utilizando la fábrica de esquemas de Mongoose
export const UserSchema = SchemaFactory.createForClass(User);
