import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getTimetablesPerRoutes, getIdRoutes } from './request/routes.request';
import { getNamesOfUnits } from './request/units.request';
import { getReports } from './request/report.request';
import { getStopsNames } from './request/stops.request';
import { getRides } from './request/rides.request';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { Business, BusinessDocument } from './schemas/business.schema';
import { Units, UnitsDocument } from 'src/units/schemas/units.schema';
import { Rides, RidesDocument } from './schemas/rides.schema';
import { Stop } from './entity/stop.entity';

@Injectable()
export class RidesService {
    private cache: { EID?: string } = {};

    constructor(
        @InjectModel(User.name) private userModule: Model<UserDocument>,
        @InjectModel(Rides.name) private ridesModule: Model<RidesDocument>,
        @InjectModel(Business.name) private businessModule: Model<BusinessDocument>,
        @InjectModel(Units.name) private unitsModule: Model<UnitsDocument>
    ) { }

    async listRidesReports(user: string, plate: string) {
        const userObject = await this.userModule.findOne({ user });
        const businessObject = await this.businessModule.findOne({ business: userObject.business });
        const listIdRoutes = await getIdRoutes(businessObject.token, businessObject.depot);

        const listRidesReportsPromises = listIdRoutes.map((route) =>
            getReports(businessObject.token, businessObject.depot, route.id)
        );

        const listRidesReports = await Promise.all(listRidesReportsPromises);
        const ridesParsed = this.parsedRides(listRidesReports, plate);
        return ridesParsed;
    }

    parsedRides(listRidesReports: Array<any>, plate: string) {
        const listRouteParsed = []
        for (const route of listRidesReports) {
            for (const rutina of route.report_data.rows) {
                const placa = rutina.cols[0].t.replace(" ", "").slice(-9);
                if (rutina.cols[0].t !== "—" && plate == placa) {
                    const rutinaparadas: Array<Stop> = []
                    for (const parada of rutina.rows) {
                        const objparada: Stop = {
                            doorbell: parada[0].t,
                            plannedTime: parada[3].t,
                            timeExecuted: parada[4].t !== "—" ? parada[4].t : "--:--",
                        };
                        rutinaparadas.push(objparada);
                    }
                    listRouteParsed.push(rutinaparadas);
                }
            }
        }
        return listRouteParsed;
    }

    async listRides(user: string) {
        try {
            const userObject = await this.userModule.findOne({ user });
            const [businessObject, unitsArray] = await Promise.all([
                this.businessModule.findOne({ business: userObject.business }),
                this.unitsModule.find({ owner: user }),
            ]);
            const unitsArrayF = unitsArray.map((units) => units.plate);
            // Realiza todas las llamadas en paralelo
            const [timetablesData, unitsName, stopNamesPerId, ridesWhole] = await Promise.all([
                getTimetablesPerRoutes(businessObject.depot, businessObject.token),
                getNamesOfUnits(this.cache),
                getStopsNames(businessObject.depot, businessObject.token),
                getRides(businessObject.depot, businessObject.token),
            ]);
            const wholeRidesResult = this.processRidesData(
                ridesWhole["rides"],
                timetablesData,
                unitsName,
                stopNamesPerId,
                unitsArrayF
            );
            return wholeRidesResult;
        } catch (error) {
            throw error;
        }
    }

    private processRidesData(rides: any[], timetables: any, unitNames: any, stopNamesPerId: any, unitsArrayF: any) {
        const wholeRidesResult = [];
        for (const ride of rides) {
            // Extraemos el id de la unidad en la rutina
            const unidad_id = ride["u"];
            // Validamos que sea diferente de null
            if (unidad_id) {
                const placa = this.getUnitName(unitNames, unidad_id).substring(8);
                // Validamos que la rutina pertenezca a las placas que tiene asignado el socio
                if (unitsArrayF.includes(placa)) {
                    const rutina_id = ride["id"];
                    const timetable_id = ride["tid"];
                    const planned_stops = ride["pt"];
                    const actual_stops = ride["at"];
                    const date = ride["d"];
                    const active = ride["a"];
                    const flag = ride["f"];
                    const first_stop = ride["si"];
                    const status = ride["a"];
                    if (planned_stops.length > 0 && active) {
                        if (timetables["timetables"][timetable_id]) {
                            const ride_result = {
                                id: rutina_id,
                                plate: placa,
                                route: timetables["timetables"][timetable_id],
                                date,
                                range: `${this.dateFromTimestamp(planned_stops[0])} - ${this.dateFromTimestamp(planned_stops[planned_stops.length - 1])}`,
                                stops: [],
                                additional: { flag, first_stop, status }
                            };
                            const route_stop_ids = timetables["stops_of_every_routes"][timetables["timetables"][timetable_id]];
                            for (let index = 0; index < route_stop_ids.length; index++) {
                                const stop_id = route_stop_ids[index];
                                const parada: any = {
                                    name: `${index + 1}. ${stopNamesPerId[stop_id]}`,
                                    differencetime: this.getDifferenceByStop(planned_stops[index], actual_stops[index]),
                                    plannedtime: planned_stops[index] ? this.dateFromTimestamp(planned_stops[index]) : "--:--",
                                    actualtime: actual_stops[index] ? this.dateFromTimestamp(actual_stops[index]) : "--:--"
                                };
                                ride_result.stops.push(parada);
                            }
                            wholeRidesResult.push(ride_result);
                        }
                    }
                }
            }
        }
        return this.orderData(wholeRidesResult);
    }

    private getUnitName(unitNames: any[], unitId: string): string {
        let unitName: string = "No se halló";
        for (const unit of unitNames) {
            if (unit.id === unitId) {
                unitName = unit.nm;
                break;
            }
        }
        return unitName;
    }

    dateFromTimestamp(timestamp: number): string {
        const date = new Date(timestamp * 1000 - 18000 * 1000).toISOString();
        const time = date.substr(11, 5); // Extrae las horas y minutos en formato HH:mm
        return time;
    }

    getDifferenceByStop(plannedTime: number, actualTime: number): { time: string; status: number } {
        const diff: { time: string; status: number } = { time: "-", status: 3 };
        try {
            const pt = Math.floor(plannedTime);
            const at = Math.floor(actualTime);
            diff.time = "0";

            function currMin(tiempo: number): number {
                return Math.floor(tiempo - (tiempo % 60));
            }

            if (currMin(pt) > currMin(at)) {
                diff.time = `+${Math.floor((currMin(pt) - currMin(at)) / 60).toString()}`;
                diff.status = 2;
            } else if (currMin(pt) < currMin(at)) {
                diff.time = `-${Math.floor((currMin(at) - currMin(pt)) / 60).toString()}`;
                diff.status = 1;
            }
            return diff;
        } catch (error) {
            return diff;
        }
    }

    orderData(lista: any[]): any[] {
        const nuevaLista = lista.slice().sort((a, b) => {
            return a.range.localeCompare(b.range);
        });
        return nuevaLista;
    }
}
