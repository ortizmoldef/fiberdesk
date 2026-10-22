
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Technician } from '../../shared/models/technician.model';
import { TechnicianService } from '../../core/services/technician.service';
import { AuthService } from '../../core/services/auth.service';
import { Permission } from '../../shared/models/permission.model';

@Component({
  selector: 'app-technicians',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './technicians.html',
})
export class Technicians {
  technicians: Technician[] = [];

  showForm = false;
  editing = false;

  formData: Technician = this.createEmptyTechnician();

  constructor(
    private technicianService: TechnicianService,
    private authService: AuthService,
  ) {
    this.loadTechnicians();
  }

  can(permission: Permission): boolean {
    return this.authService.hasPermission(permission);
  }

  loadTechnicians(): void {
    this.technicians = this.technicianService.getTechnicians();
  }

  private createEmptyTechnician(): Technician {
    return {
      id: 0,
      name: '',
      email: '',
      phone: '',
      specialization: '',
      status: 'Disponible',
      installations: 0,
    };
  }

  editTechnician(technician: Technician): void {
    if (!this.can('technicians.edit')) return;

    this.formData = { ...technician };
    this.editing = true;
    this.showForm = true;
  }

  saveTechnician(): void {
    if (!this.can('technicians.edit')) return;
    if (!this.editing) return;

    if (
      !this.formData.name.trim() ||
      !this.formData.email.trim() ||
      !this.formData.phone.trim() ||
      !this.formData.specialization.trim()
    ) {
      return;
    }

    const updated = this.technicianService.updateTechnician(
      this.formData.id,
      this.formData
    );

    if (!updated) return;

    this.loadTechnicians();
    this.closeForm();
  }

  closeForm(): void {
    this.showForm = false;
    this.editing = false;
    this.formData = this.createEmptyTechnician();
  }
}
