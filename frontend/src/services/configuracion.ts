import { api } from './api';
import { ConfiguracionMotor } from '../types/api';

export async function getConfiguracion(): Promise<ConfiguracionMotor> {
  return api.get<ConfiguracionMotor>('/api/recomendacion/configuracion/');
}

export async function updateConfiguracion(data: Partial<ConfiguracionMotor>): Promise<ConfiguracionMotor> {
  return api.put<ConfiguracionMotor>('/api/recomendacion/configuracion/', data);
}
