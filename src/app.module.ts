import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UnitsModule } from './units/units.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/minutoscaidosMovil'),
    TasksModule,
    AuthModule,
    UsersModule,
    UnitsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
