import axios, { AxiosResponse } from 'axios';

interface Route {
    n: string;
    tt: { id: number }[];
    st: { id: number }[];
}

interface ApiResponse {
    routes: Route[];
}

interface TimetablesData {
    timetables: Record<number, string>;
    stops_of_every_routes: Record<string, number[]>;
}

interface RouteId{
    nombre: string
    id: number
}

export async function getTimetablesPerRoutes(depot: string, token: string): Promise<TimetablesData> {
    const url = `https://nimbus.wialon.com/api/depot/${depot}/routes`;
    try {
        const response: AxiosResponse<ApiResponse> = await axios.get(url, {
            headers: { "Authorization": `Token ${token}` }
        });
        const result = response.data;
        // Ordenar datos
        const timetables: Record<number, string> = {};
        const stops_of_every_routes: Record<string, number[]> = {};

        if ("routes" in result) {
            result.routes.forEach((route) => {
                stops_of_every_routes[route.n] = [];
                route.tt.forEach((timetable) => {
                    timetables[timetable.id] = route.n;
                });
                route.st.forEach((stopRoute) => {
                    stops_of_every_routes[route.n].push(stopRoute.id);
                });
            });

            return { timetables, stops_of_every_routes };
        } else {
            throw new Error("No se encuentran las rutas, acceso denegado por token inválido");
        }
    } catch (error) {
        throw new Error("Error al obtener los datos de rutas: " + error.message);
    }
}

export async function getIdRoutes(token: string, depot: string): Promise<RouteId[]> {
    try {
        const response: AxiosResponse = await axios.get(`https://nimbus.wialon.com/api/depot/${depot}/routes`, {
            headers: { 'Authorization': `Token ${token}` }
        });

        const resp = response.data;
        const listRutas: RouteId[]= resp.routes.map((ruta: any) => ({
            nombre: ruta.n,
            id: ruta.id
        }));

        return listRutas;
    } catch (error) {
        throw error;
    }
}




