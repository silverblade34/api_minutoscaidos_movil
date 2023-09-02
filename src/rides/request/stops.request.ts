import axios from 'axios';

export async function getStopsNames(depot: string, token: string): Promise<{ [id: string]: string }> {
    try {
        const url = `https://nimbus.wialon.com/api/depot/${depot}/stops`;
        const response = await axios.get(url, { headers: { "Authorization": `Token ${token}` } });
        const stops = response.data["stops"];

        const namesPerId: { [id: string]: string } = {};

        for (const stop of stops) {
            namesPerId[stop["id"]] = stop["n"];
        }
        return namesPerId;
    } catch (error) {
        throw new Error("Error al consumir getStopsNames");
    }
}
