import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getIdRoutes } from '../rides/request/routes.request';
import { getReports } from '../rides/request/report.request';
import { Units, UnitsDocument } from './schemas/units.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { Business, BusinessDocument } from '../rides/schemas/business.schema';

@Injectable()
export class UnitsService {
    constructor(
        @InjectModel(Units.name) private unitsModule: Model<UnitsDocument>,
        @InjectModel(User.name) private userModule: Model<UserDocument>,
        @InjectModel(Business.name) private businessModule: Model<BusinessDocument>,
    ) { }

    async listAllUnits(user: string) {
        const userObject = await this.userModule.findOne({ user });
        const [businessObject, unitsArray] = await Promise.all([
            this.businessModule.findOne({ business: userObject.business }),
            this.unitsModule.find({ owner: user }),
        ]);
        const unitsArrayF = unitsArray.map((units) => units.plate);
        const listIdRoutes = await getIdRoutes(businessObject.token, businessObject.depot);

        const listRidesReportsPromises = listIdRoutes.map((route) =>
            getReports(businessObject.token, businessObject.depot, route.id)
        );

        const listRidesReports = await Promise.all(listRidesReportsPromises);
        const ridesParsed = await this.parsedRides(listRidesReports, unitsArrayF, unitsArray)
        return ridesParsed
    }

    async parsedRides(listRidesReports: any[], plates: string[], unitsArray: any[]): Promise<any[]> {
        // Creamos un objeto para llevar un registro del número de paradas por placa
        const unitsRidesMap: { [plate: string]: Object } = {};

        // Recorremos la lista de informes de viajes
        listRidesReports.forEach((route) => {
            // Recorremos las rutinas en cada informe de viaje
            route.report_data.rows.forEach((rutina) => {
                // Obtenemos la placa del vehículo eliminando espacios y tomando los últimos 9 caracteres
                const plate = rutina.cols[0].t.replace(" ", "").slice(-9);

                // Verificamos si la placa está en la lista proporcionada y no es un valor especial
                if (rutina.cols[0].t !== "—" && plates.includes(plate)) {
                    // Si la placa ya existe en el objeto, sumamos el número de paradas
                    if (unitsRidesMap[plate]) {
                        unitsRidesMap[plate]["stops"] += rutina.rows.length;
                        unitsRidesMap[plate]["rides"] += 1;
                    } else {
                        // Si la placa no existe en el objeto, la inicializamos con el número de paradas
                        unitsRidesMap[plate] = {
                            "stops": rutina.rows.length,
                            "rides": 1
                        }
                    }
                }
            });
        });
        // Convertimos el objeto de map en un array de objetos con placa y número de paradas
        const filteredUnitsRides = Object.keys(unitsRidesMap).map((plate) => {
            const matchingUnit = unitsArray.find((unit) => unit.plate === plate);
            return {
                plate,
                date: this.formatDate(new Date()),
                stops: unitsRidesMap[plate]["stops"],
                laps: unitsRidesMap[plate]["rides"],
                unitName: matchingUnit.unit
            }
        });
        // Devolvemos el resultado final
        return filteredUnitsRides;
    }
    formatDate(date: Date){
        const day = String(date.getDate()).padStart(2, '0'); // Obtiene el día y lo formatea a dos dígitos
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Obtiene el mes (ten en cuenta que los meses en JavaScript comienzan en 0) y lo formatea a dos dígitos
        const year = String(date.getFullYear()); // Obtiene el año en formato completo
        return `${day}-${month}-${year}`;
    }
}
