import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Client } from '../../shared/models/client.model';
import { ClientService } from '../../core/services/client.service';

@Component({
  selector: 'app-clients',
  imports: [FormsModule],
  templateUrl: './clients.html',
})
export class Clients {


  editingClientId: number | null = null;
  searchTerm = '';

  showForm = false;

    newClient: Omit<Client, 'id'> = {
    name: '',
    email: '',
    phone: '',
    address: '',
    plan: 'FTTH 600 Mbps',
    status: 'Pendiente',
    installationDate: '',
  };

  clients: Client[] = [];

  constructor(private clientService: ClientService) {
    this.clients = this.clientService.getClients();
  }

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
    this.editingClientId = null;
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

    this.clientService.addClient(newClient);

    this.closeForm();
  }


  editClient(client: Client): void {
  this.editingClientId = client.id;

  this.newClient = {
    name: client.name,
    email: client.email,
    phone: client.phone,
    address: client.address,
    plan: client.plan,
    status: client.status,
    installationDate: client.installationDate,
  };

  this.showForm = true;
}

updateClient(): void {
  if (this.editingClientId === null) {
    return;
  }

  if (
    !this.newClient.name.trim() ||
    !this.newClient.email.trim() ||
    !this.newClient.phone.trim()
  ) {
    return;
  }

  const updatedClient: Client = {
    id: this.editingClientId,
    name: this.newClient.name,
    email: this.newClient.email,
    phone: this.newClient.phone,
    address: this.newClient.address,
    plan: this.newClient.plan,
    status: this.newClient.status,
    installationDate: this.newClient.installationDate,
  };

  this.clientService.updateClient(updatedClient);

  this.clients = this.clientService.getClients();

  this.closeForm();
}



  deleteClient(client: Client): void {
    const confirmed = confirm(
      `¿Seguro que quieres eliminar al cliente "${client.name}"?`
    );

    if (!confirmed) {
      return;
    }

    this.clientService.deleteClient(client.id);
    this.clients = this.clientService.getClients();
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