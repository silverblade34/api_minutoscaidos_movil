import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ResponseFormatMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Intercepta la respuesta antes de que se envíe al cliente
    res.locals.response = (message: any, data: any, status: boolean = true) => {
      const responseObj = { message, data, status };
      res.json(responseObj);
    };
    next();
  }
}
