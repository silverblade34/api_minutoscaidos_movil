import axios, { AxiosResponse } from 'axios';

interface Cache {
    EID?: string;
}

interface ResultSID {
    eid: string;
}

interface ListarUnidadesResponse {
    items?: any[];
    error?: string;
}

export async function listarUnidadesEID(EID: string): Promise<ListarUnidadesResponse> {
    const url = "https://hst-api.wialon.com/wialon/ajax.html";
    const querystring = {
        svc: "core/search_items",
        params: JSON.stringify({
            spec: {
                itemsType: "avl_unit",
                propName: "sys_name",
                propValueMask: "*",
                sortType: "sys_name",
                propType: "propitemname"
            },
            force: 1,
            flags: 1,
            from: 0,
            to: 0
        }),
        sid: EID
    };

    try {
        const response: AxiosResponse<ListarUnidadesResponse> = await axios.get(url, {
            params: querystring
        });
        return response.data;
    } catch (error) {
        throw new Error("Error al obtener las unidades: " + error.message);
    }
}

export async function generarEIDNimbus(): Promise<ResultSID> {
    const urlGetSid = "https://hst-api.wialon.com/wialon/ajax.html";
    const querystringForSid = {
        svc: "token/login",
        params: JSON.stringify({
            token: "a21e2472955b1cb0847730f34edcf3e86C885B7268C5383FBB3DBEE7CAA6973B85AB57E1",
            fl: "2"
        })
    };

    try {
        const response: AxiosResponse<ResultSID> = await axios.get(urlGetSid, {
            params: querystringForSid
        });
        return response.data;
    } catch (error) {
        throw new Error("Error al generar EID Nimbus: " + error.message);
    }
}

export async function getNamesOfUnits(cache: Cache) {
    if (!('EID' in cache)) {
        //VARIABLE CACHE EID NO EXISTE EN LA CACHE
        const resultSID = await generarEIDNimbus();
        cache.EID = resultSID.eid;
    }
    const result = await listarUnidadesEID(cache.EID);
    if ('error' in result) {
        //VARIABLE CACHE EID YA HA VENCIDO
        const resultSID = await generarEIDNimbus();
        cache.EID = resultSID.eid;
        const resultFin = await listarUnidadesEID(cache.EID);
        return resultFin.items;
    } else {
        //VARIABLE CACHE EID VALIDA
        return result.items;
    }
}
