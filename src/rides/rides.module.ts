import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RidesController } from './rides.controller';
import { RidesService } from './rides.service';
import { Rides, RidesSchema } from './schemas/rides.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Units, UnitsSchema } from '../units/schemas/units.schema';
import { Business, BusinessSchema } from './schemas/business.schema';

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
      {
        name: Rides.name,
        schema: RidesSchema
      },
    ]),
  ],
  controllers: [RidesController],
  providers: [RidesService],
})
export class RidesModule {}
