import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose'; 
import { User, UserSchema } from 'src/users/schema/user.schema'; // Importa el esquema y el modelo de usuario
import { JwtModule } from '@nestjs/jwt'; // Importa JwtModule para trabajar con JWT
import { jwtConstants } from './jwt.constants'; // Importa las constantes de configuración JWT
import { JwtStrategy } from './jwt.strategy'; // Importa la estrategia JWT

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name, 
        schema: UserSchema 
      }
    ]),
    JwtModule.register({ // Configura JwtModule para trabajar con JWT
      secret: jwtConstants.secret, // Configura la clave secreta para firmar tokens JWT
      signOptions: {expiresIn: '20h'} // Configura opciones de firma (expiración)
    })
  ],
  controllers: [AuthController], 
  providers: [AuthService, JwtStrategy] 
})
export class AuthModule {}
