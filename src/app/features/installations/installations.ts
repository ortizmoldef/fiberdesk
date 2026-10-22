
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Installation } from '../../shared/models/installation.model';
import { InstallationService } from '../../core/services/installation.service';
import { AuthService } from '../../core/services/auth.service';
import { Permission } from '../../shared/models/permission.model';

@Component({
  selector: 'app-installations',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './installations.html',
})
export class Installations {
  installations: Installation[] = [];

  showForm = false;
  editingInstallationId: number | null = null;

  newInstallation: Omit<Installation, 'id'> =
    this.createEmptyInstallation();

  constructor(
    private installationService: InstallationService,
    private authService: AuthService,
  ) {
    this.loadInstallations();
  }

  can(permission: Permission): boolean {
    return this.authService.hasPermission(permission);
  }

  loadInstallations(): void {
    this.installations = this.installationService.getInstallations();
  }

  openForm(): void {
    if (!this.can('installations.create')) return;

    this.editingInstallationId = null;
    this.newInstallation = this.createEmptyInstallation();
    this.showForm = true;
  }

  editInstallation(installation: Installation): void {
    if (!this.can('installations.edit')) return;

    this.editingInstallationId = installation.id;

    this.newInstallation = {
      clientName: installation.clientName,
      address: installation.address,
      technician: installation.technician,
      date: installation.date,
      status: installation.status,
      plan: installation.plan,
    };

    this.showForm = true;
  }

  deleteInstallation(installation: Installation): void {
    if (!this.can('installations.delete')) return;

    const confirmed = confirm(
      `¿Seguro que quieres eliminar la instalación de "${installation.clientName}"?`
    );

    if (!confirmed) return;

    this.installationService.deleteInstallation(installation.id);
    this.loadInstallations();
  }

  closeForm(): void {
    this.showForm = false;
    this.editingInstallationId = null;
    this.newInstallation = this.createEmptyInstallation();
  }

  saveInstallation(): void {
    if (
      !this.newInstallation.clientName.trim() ||
      !this.newInstallation.address.trim() ||
      !this.newInstallation.technician.trim() ||
      !this.newInstallation.date
    ) {
      return;
    }

    if (this.editingInstallationId !== null) {
      if (!this.can('installations.edit')) return;

      const updatedInstallation: Installation = {
        id: this.editingInstallationId,
        ...this.newInstallation,
      };

      this.installationService.updateInstallation(updatedInstallation);
    } else {
      if (!this.can('installations.create')) return;

      const newInstallation: Installation = {
        id: this.installations.length > 0
          ? Math.max(...this.installations.map(item => item.id)) + 1
          : 1,
        ...this.newInstallation,
      };

      this.installationService.addInstallation(newInstallation);
    }

    this.loadInstallations();
    this.closeForm();
  }

  private createEmptyInstallation(): Omit<Installation, 'id'> {
    return {
      clientName: '',
      address: '',
      technician: '',
      date: '',
      status: 'Programada',
      plan: 'FTTH 600 Mbps',
    };
  }
}
