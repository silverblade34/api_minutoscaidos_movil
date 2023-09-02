import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UnitsService } from './units.service';
import { Request as ExpressRequest } from 'express'; // Importa el tipo Express.Request

@UseGuards(JwtAuthGuard)
@Controller('units')
export class UnitsController {

    constructor(private unitsService: UnitsService) { }

    @Get()
    listAllUnits(@Request() req: ExpressRequest) {
        const user = req.user["user"]
        return this.unitsService.listAllUnits(user);
    }
}
