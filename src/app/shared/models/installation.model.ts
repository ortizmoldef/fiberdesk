export interface Installation {
  id: number;
  clientName: string;
  address: string;
  technician: string;
  date: string;
  status: 'Programada' | 'En curso' | 'Completada' | 'Cancelada';
  plan: string;
}