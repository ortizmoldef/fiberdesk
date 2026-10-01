import { Injectable } from '@angular/core';
import { Client } from '../../shared/models/client.model';

@Injectable({
  providedIn: 'root',
})
export class ClientService {

  private clients: Client[] = [
    {
      id: 1,
      name: 'Juan García',
      email: 'juan.garcia@email.com',
      phone: '600 123 456',
      address: 'Calle Sevilla 24',
      plan: 'FTTH 600 Mbps',
      status: 'Activo',
      installationDate: '2026-09-12',
    },
    {
      id: 2,
      name: 'María López',
      email: 'maria.lopez@email.com',
      phone: '611 234 567',
      address: 'Avenida Andalucía 18',
      plan: 'FTTH 1 Gb',
      status: 'Pendiente',
      installationDate: '2026-09-18',
    },
    {
      id: 3,
      name: 'Antonio Ruiz',
      email: 'antonio.ruiz@email.com',
      phone: '622 345 678',
      address: 'Calle Real 42',
      plan: 'FTTH 600 Mbps',
      status: 'Activo',
      installationDate: '2026-09-20',
    },
    {
      id: 4,
      name: 'Laura Martín',
      email: 'laura.martin@email.com',
      phone: '633 456 789',
      address: 'Calle Granada 7',
      plan: 'FTTH 1 Gb',
      status: 'Suspendido',
      installationDate: '2026-08-28',
    },
  ];

  getClients(): Client[] {
    return this.clients;
  }

  addClient(client: Client): void {
    this.clients.unshift(client);
  }
}