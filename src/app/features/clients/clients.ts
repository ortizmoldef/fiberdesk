
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Client } from '../../shared/models/client.model';
import { ClientService } from '../../core/services/client.service';
import { AuthService } from '../../core/services/auth.service';
import { Permission } from '../../shared/models/permission.model';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './clients.html',
})
export class Clients {
  editingClientId: number | null = null;
  searchTerm = '';
  showForm = false;
  clients: Client[] = [];

  newClient: Omit<Client, 'id'> = this.createEmptyClient();

  constructor(
    private clientService: ClientService,
    private authService: AuthService,
  ) {
    this.loadClients();
  }

  can(permission: Permission): boolean {
    return this.authService.hasPermission(permission);
  }

  loadClients(): void {
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
    if (!this.can('clients.create')) {
      return;
    }

    this.editingClientId = null;
    this.newClient = this.createEmptyClient();
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingClientId = null;
    this.newClient = this.createEmptyClient();
  }

  addClient(): void {
    if (!this.can('clients.create')) {
      return;
    }

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
      ...this.newClient,
    };

    this.clientService.addClient(newClient);
    this.loadClients();
    this.closeForm();
  }

  editClient(client: Client): void {
    if (!this.can('clients.edit')) {
      return;
    }

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
    if (
      !this.can('clients.edit') ||
      this.editingClientId === null
    ) {
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
      ...this.newClient,
    };

    this.clientService.updateClient(updatedClient);
    this.loadClients();
    this.closeForm();
  }

  deleteClient(client: Client): void {
    if (!this.can('clients.delete')) {
      return;
    }

    const confirmed = confirm(
      `¿Seguro que quieres eliminar al cliente "${client.name}"?`
    );

    if (!confirmed) {
      return;
    }

    this.clientService.deleteClient(client.id);
    this.loadClients();
  }

  resetForm(): void {
    this.newClient = this.createEmptyClient();
  }

  private createEmptyClient(): Omit<Client, 'id'> {
    return {
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
