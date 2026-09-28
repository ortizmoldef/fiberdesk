import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Client } from '../../shared/models/client.model';

@Component({
  selector: 'app-clients',
  imports: [FormsModule],
  templateUrl: './clients.html',
})
export class Clients {

  searchTerm = '';

  showForm = false;

  newClient = {
    name: '',
    email: '',
    phone: '',
    address: '',
    plan: 'FTTH 600 Mbps',
    status: 'Pendiente' as Client['status'],
    installationDate: '',
  };

  clients: Client[] = [
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

  get filteredClients(): Client[] {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      return this.clients;
    }

    return this.clients.filter(client =>
      client.name.toLowerCase().includes(term) ||
      client.email.toLowerCase().includes(term) ||
      client.phone.includes(term)
    );
  }

  openForm(): void {
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.resetForm();
  }

  addClient(): void {

    if (
      !this.newClient.name.trim() ||
      !this.newClient.email.trim() ||
      !this.newClient.phone.trim()
    ) {
      return;
    }

    const newClient: Client = {
      id: this.clients.length > 0
        ? Math.max(...this.clients.map(client => client.id)) + 1
        : 1,

      name: this.newClient.name,
      email: this.newClient.email,
      phone: this.newClient.phone,
      address: this.newClient.address,
      plan: this.newClient.plan,
      status: this.newClient.status,
      installationDate: this.newClient.installationDate,
    };

    this.clients.unshift(newClient);

    this.closeForm();
  }

  resetForm(): void {
    this.newClient = {
      name: '',
      email: '',
      phone: '',
      address: '',
      plan: 'FTTH 600 Mbps',
      status: 'Pendiente',
      installationDate: '',
    };
  }
}