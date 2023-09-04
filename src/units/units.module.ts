import { Module } from '@nestjs/common';
import { UnitsController } from './units.controller';
import { UnitsService } from './units.service';
import { MongooseModule } from '@nestjs/mongoose'; 
import { Units, UnitsSchema } from 'src/units/schemas/units.schema'; // Importa el esquema y el modelo de usuario
import { Business, BusinessSchema } from '../rides/schemas/business.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      },
      {
        name: Units.name, 
        schema: UnitsSchema 
      },
      {
        name: Business.name,
        schema: BusinessSchema
      },
    ])
  ],
  controllers: [UnitsController],
  providers: [UnitsService]
})
export class UnitsModule {}
