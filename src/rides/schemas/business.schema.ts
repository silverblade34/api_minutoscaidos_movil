// Importamos los decoradores que nos ofrece mongoose
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Declaramos un tipo de dato que representa un documento de tipo User en la base de datos
export type BusinessDocument = Business & Document;

// Definimos el esquema de la entidad "User" usando el decorador @Schema()
@Schema({ collection: 'business', versionKey: false })
export class Business {
    @Prop()
    token: string;

    @Prop()
    depot: string;

    @Prop()
    business: string;

    @Prop()
    name: string;
}

// Creamos el esquema real utilizando la fábrica de esquemas de Mongoose
export const BusinessSchema = SchemaFactory.createForClass(Business);
