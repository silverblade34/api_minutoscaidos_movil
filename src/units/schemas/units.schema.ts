// Importamos los decoradores que nos ofrece mongoose
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Declaramos un tipo de dato que representa un documento de tipo User en la base de datos
export type UnitsDocument = Units & Document;

// Definimos el esquema de la entidad "User" usando el decorador @Schema()
@Schema({ collection: 'units', versionKey: false })
export class Units {
    @Prop()
    owner: string;

    @Prop()
    plate: string;
}

// Creamos el esquema real utilizando la fábrica de esquemas de Mongoose
export const UnitsSchema = SchemaFactory.createForClass(Units);
