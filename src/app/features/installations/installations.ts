
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Installation } from '../../shared/models/installation.model';
import { InstallationService } from '../../core/services/installation.service';

@Component({
  selector: 'app-installations',
  imports: [FormsModule],
  templateUrl: './installations.html',
})
export class Installations {
  installations: Installation[] = [];

  showForm = false;
  editingInstallationId: number | null = null;

  newInstallation: Omit<Installation, 'id'> = {
    clientName: '',
    address: '',
    technician: '',
    date: '',
    status: 'Programada',
    plan: 'FTTH 600 Mbps',
  };

  constructor(
    private installationService: InstallationService
  ) {
    this.loadInstallations();
  }

  loadInstallations(): void {
    this.installations = this.installationService.getInstallations();
  }

  openForm(): void {
    this.editingInstallationId = null;
    this.resetForm();
    this.showForm = true;
  }

  editInstallation(installation: Installation): void {
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

  closeForm(): void {
    this.showForm = false;
    this.editingInstallationId = null;
    this.resetForm();
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
      const updatedInstallation: Installation = {
        id: this.editingInstallationId,
        ...this.newInstallation,
      };

      this.installationService.updateInstallation(updatedInstallation);
    } else {
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

  resetForm(): void {
    this.newInstallation = {
      clientName: '',
      address: '',
      technician: '',
      date: '',
      status: 'Programada',
      plan: 'FTTH 600 Mbps',
    };
  }
}
