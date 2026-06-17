import { api } from './api';
import { DashboardData, HistorialVarkDetalle } from '../types/api';

export async function getDashboardEstudiante(): Promise<DashboardData> {
  return api.get<DashboardData>('/api/analitica/dashboard/');
}

export async function getHistorialVarkDetalle(): Promise<HistorialVarkDetalle[]> {
  return api.get<HistorialVarkDetalle[]>('/api/analitica/perfil/historial-detalle/');
}
