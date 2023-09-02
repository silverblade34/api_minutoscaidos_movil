import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UnitsModule } from './units/units.module';
import { RidesModule } from './rides/rides.module';
import { ResponseFormatMiddleware } from './middlewares/response-format.middleware'; // Importa el middleware

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://precisoGps:cf358ab274d24ea18d100a2835050df2@157.230.189.65:27017', {
      dbName: 'dbminutoscaidosmovil',
    }),
    TasksModule,
    AuthModule,
    UsersModule,
    UnitsModule,
    RidesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
    // Registra el middleware
    configure(consumer: MiddlewareConsumer) {
      consumer.apply(ResponseFormatMiddleware).forRoutes('*');
    }
}
