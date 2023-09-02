// Importamos los decoradores que nos ofrece mongoose
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Declaramos un tipo de dato que representa un documento de tipo en la base de datos
export type RidesDocument = Rides & Document;

// Definimos el esquema de la entidad usando el decorador @Schema()
@Schema({ collection: 'report_minutosc', versionKey: false })
export class Rides {
    @Prop()
    ruta: string;

    @Prop()
    ruc: string;

    @Prop()
    rutina: string;

    @Prop()
    placa: string;

    @Prop()
    fecha: string;

    @Prop()
    fechaunix: number;

    @Prop()
    identificador: string;

    @Prop([{ // Define un array de objetos con una estructura específica
        parada: String,
        horaejecutada: String,
        horaplanificada: String,
        min: String
    }])
    rutinaparadas: Array<{
        parada: string; horaejecutada: string;
        horaplanificada: string;
        min: string
    }>;
}

// Creamos el esquema real utilizando la fábrica de esquemas de Mongoose
export const RidesSchema = SchemaFactory.createForClass(Rides);
