export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  plan: string;
  status: 'Activo' | 'Pendiente' | 'Suspendido';
  installationDate: String;
}