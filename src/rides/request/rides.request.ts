import axios from 'axios';

export async function getRides(depot: string, token: string): Promise<any> {
    try {
        const url = `https://nimbus.wialon.com/api/depot/${depot}/rides`;
        const response = await axios.get(url, { headers: { "Authorization": `Token ${token}` } });
        const data = response.data;

        return data;
    } catch (error) {
        throw new Error("Error al consumir getRides");
    }
}
