import { PassportStrategy } from '@nestjs/passport'; // Importa PassportStrategy para crear una estrategia de autenticación
import { Injectable } from '@nestjs/common'; // Importa Injectable para que la estrategia pueda ser inyectada
import { ExtractJwt, Strategy } from 'passport-jwt'; // Importa componentes relacionados con JWT de passport-jwt
import { jwtConstants } from './jwt.constants'; // Importa las constantes de configuración JWT

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    async validate(payload: any) {
        return { userId: payload.id, user: payload.user }; // Valida y extrae información del token JWT (aquí extrae userId y user del payload)
    }
}
