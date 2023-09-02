import { Module } from '@nestjs/common';
import { UnitsController } from './units.controller';
import { UnitsService } from './units.service';
import { MongooseModule } from '@nestjs/mongoose'; 
import { Units, UnitsSchema } from 'src/units/schemas/units.schema'; // Importa el esquema y el modelo de usuario

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Units.name, 
        schema: UnitsSchema 
      }
    ])
  ],
  controllers: [UnitsController],
  providers: [UnitsService]
})
export class UnitsModule {}
