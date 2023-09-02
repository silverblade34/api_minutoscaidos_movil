import { Controller, Get, Request, UseGuards, Body, Res } from '@nestjs/common';
import { RidesService } from './rides.service';
import { Request as ExpressRequest } from 'express'; // Importa el tipo Express.Request
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {plateReportDto} from './dto/plate.dto';
import { Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('rides')
export class RidesController {
    constructor(
        private ridesService: RidesService
    ) { }
    @Get()
    async listRides(@Request() req: ExpressRequest, @Res() res: Response) {
        const user = req.user["user"];
        const data = await this.ridesService.listRides(user);
        res.locals.response('Daily routine list', data, true)
    }

    @Get('reportes')
    async listRidesReports(@Body() plate:plateReportDto, @Request() req: ExpressRequest, @Res() res: Response) {
        const user = req.user["user"];
        const data = await this.ridesService.listRidesReports(user, plate.plate);
        res.locals.response('Daily routine list', data, true)
    }
}
