import axios, { AxiosResponse } from 'axios';
import { format, addDays } from 'date-fns';

export async function getReports(token: string, depot: string, idroute: number) {
  // Obtén la fecha actual en el formato día.mes.año
  const currentDate = format(new Date(), 'dd.MM.yyyy');
  const response: AxiosResponse = await axios.get(`https://nimbus.wialon.com/api/depot/${depot}/report/route/${idroute}?flags=1&df=${currentDate}&dt=${currentDate}&sort=timetable`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  const dataresponse = response.data
  return dataresponse;
}
