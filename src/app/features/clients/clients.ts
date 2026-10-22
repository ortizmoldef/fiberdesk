
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

  validationErrors: Record<string, string> = {};

  private readonly maxNameLength = 100;
  private readonly maxEmailLength = 254;
  private readonly maxPhoneLength = 20;
  private readonly maxAddressLength = 200;

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

  getTodayDate(): string {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private isValidDate(date: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return false;
    }

    const [year, month, day] = date.split('-').map(Number);
    const parsedDate = new Date(year, month - 1, day);

    return (
      parsedDate.getFullYear() === year &&
      parsedDate.getMonth() === month - 1 &&
      parsedDate.getDate() === day
    );
  }

  openForm(): void {
    if (!this.can('clients.create')) {
      return;
    }

    this.editingClientId = null;
    this.newClient = this.createEmptyClient();
    this.resetValidation();
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingClientId = null;
    this.newClient = this.createEmptyClient();
    this.resetValidation();
  }

  clearValidationError(field: string): void {
    delete this.validationErrors[field];
  }

  private resetValidation(): void {
    this.validationErrors = {};
  }

  private validateClient(): boolean {
    const errors: Record<string, string> = {};

    const name = String(this.newClient.name ?? '').trim();
    const email = String(this.newClient.email ?? '').trim();
    const phone = String(this.newClient.phone ?? '').trim();
    const address = String(this.newClient.address ?? '').trim();
    const installationDate = String(
      this.newClient.installationDate ?? ''
    ).trim();

    // Validación del nombre.
    if (!name) {
      errors['name'] = 'El nombre del cliente es obligatorio.';
    } else if (name.length < 3) {
      errors['name'] = 'El nombre debe tener al menos 3 caracteres.';
    } else if (name.length > this.maxNameLength) {
      errors['name'] =
        `El nombre no puede superar ${this.maxNameLength} caracteres.`;
    } else if (!/^[\p{L}\p{M}\s.'’()-]+$/u.test(name)) {
      errors['name'] =
        'Utiliza letras, espacios y signos de puntuación habituales.';
    }

    // Validación del email.
    if (!email) {
      errors['email'] = 'El email es obligatorio.';
    } else if (email.length > this.maxEmailLength) {
      errors['email'] = 'El email es demasiado largo.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors['email'] = 'Introduce un email válido.';
    }

    // Validación del teléfono.
    const phoneDigits = phone.replace(/\D/g, '');

    if (!phone) {
      errors['phone'] = 'El teléfono es obligatorio.';
    } else if (
      phone.length > this.maxPhoneLength ||
      !/^[\d+\s().-]+$/.test(phone) ||
      phoneDigits.length < 9 ||
      phoneDigits.length > 15
    ) {
      errors['phone'] = 'Introduce un teléfono válido.';
    }

    // Validación de la dirección (opcional).
    if (address.length > this.maxAddressLength) {
      errors['address'] =
        `La dirección no puede superar ${this.maxAddressLength} caracteres.`;
    }

    // Validación del plan.
    const validPlans = [
      'FTTH 300 Mbps',
      'FTTH 600 Mbps',
      'FTTH 1 Gb',
      'FTTH 2 Gb',
    ];

    if (!validPlans.includes(this.newClient.plan)) {
      errors['plan'] = 'Selecciona un plan válido.';
    }

    // Validación del estado.
    const validStatuses = ['Pendiente', 'Activo', 'Suspendido'];

    if (!validStatuses.includes(this.newClient.status)) {
      errors['status'] = 'Selecciona un estado válido.';
    }

    // La fecha es opcional, pero debe ser válida si se introduce.
    if (installationDate) {
      if (!this.isValidDate(installationDate)) {
        errors['installationDate'] = 'Introduce una fecha válida.';
      } else if (installationDate > this.getTodayDate()) {
        errors['installationDate'] =
          'La fecha de instalación no puede ser futura.';
      }
    }

    this.validationErrors = errors;

    return Object.keys(errors).length === 0;
  }

  addClient(): void {
    if (!this.can('clients.create')) {
      return;
    }

    if (!this.validateClient()) {
      return;
    }

    const newClient: Client = {
      ...this.newClient,
      id: this.clients.length > 0
        ? Math.max(...this.clients.map(client => client.id)) + 1
        : 1,
      name: this.newClient.name.trim(),
      email: this.newClient.email.trim(),
      phone: this.newClient.phone.trim(),
      address: this.newClient.address.trim(),
      installationDate: this.newClient.installationDate || '',
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
      installationDate: client.installationDate || '',
    };

    this.resetValidation();
    this.showForm = true;
  }

  updateClient(): void {
    if (
      !this.can('clients.edit') ||
      this.editingClientId === null
    ) {
      return;
    }

    if (!this.validateClient()) {
      return;
    }

    const updatedClient: Client = {
      ...this.newClient,
      id: this.editingClientId,
      name: this.newClient.name.trim(),
      email: this.newClient.email.trim(),
      phone: this.newClient.phone.trim(),
      address: this.newClient.address.trim(),
      installationDate: this.newClient.installationDate || '',
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
    this.resetValidation();
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
