export interface Technician {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  status: 'Disponible' | 'Ocupado' | 'Fuera de servicio';
  installations: number;
}