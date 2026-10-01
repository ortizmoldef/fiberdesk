export interface Incident {
  id: number;
  title: string;
  description: string;
  clientName: string;
  technician: string;
  priority: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  status: 'Abierta' | 'En curso' | 'Resuelta' | 'Cerrada';
  createdAt: string;
}