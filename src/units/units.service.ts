import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Units, UnitsDocument} from './schemas/units.schema';

@Injectable()
export class UnitsService {
    constructor(
        @InjectModel(Units.name) private unitsModule:Model<UnitsDocument>
    ){}

    listAllUnits(user: string){
        return this.unitsModule.find({owner: user})
    }
}
