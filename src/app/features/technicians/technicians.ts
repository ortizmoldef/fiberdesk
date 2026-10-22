
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

  validationErrors: Record<string, string> = {};

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

  openCreateForm(): void {
    if (!this.can('technicians.edit')) return;

    this.editing = false;
    this.formData = this.createEmptyTechnician();
    this.validationErrors = {};
    this.showForm = true;
  }

  editTechnician(technician: Technician): void {
    if (!this.can('technicians.edit')) return;

    this.formData = { ...technician };
    this.editing = true;
    this.validationErrors = {};
    this.showForm = true;
  }

  clearValidationError(field: string): void {
    delete this.validationErrors[field];
  }

  private validateTechnician(): boolean {
    const errors: Record<string, string> = {};

    const name = this.formData.name.trim();
    const email = this.formData.email.trim();
    const phone = this.formData.phone.trim();
    const specialization = this.formData.specialization.trim();

    if (!name) {
      errors['name'] = 'El nombre es obligatorio.';
    } else if (name.length < 3 || name.length > 100) {
      errors['name'] = 'El nombre debe tener entre 3 y 100 caracteres.';
    }

    if (!email) {
      errors['email'] = 'El correo electrónico es obligatorio.';
    } else if (
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      errors['email'] = 'Introduce un correo electrónico válido.';
    }

    if (!phone) {
      errors['phone'] = 'El teléfono es obligatorio.';
    } else if (
      phone.length > 20 ||
      !/^[\d+\s().-]+$/.test(phone) ||
      phone.replace(/\D/g, '').length < 9 ||
      phone.replace(/\D/g, '').length > 15
    ) {
      errors['phone'] = 'Introduce un teléfono válido.';
    }

    if (!specialization) {
      errors['specialization'] = 'La especialización es obligatoria.';
    } else if (specialization.length > 100) {
      errors['specialization'] =
        'La especialización no puede superar los 100 caracteres.';
    }

    const validStatuses = [
      'Disponible',
      'Ocupado',
      'Fuera de servicio',
    ];

    if (!validStatuses.includes(this.formData.status)) {
      errors['status'] = 'Selecciona un estado válido.';
    }

    if (
      !Number.isInteger(this.formData.installations) ||
      this.formData.installations < 0
    ) {
      errors['installations'] =
        'Las instalaciones deben ser un número entero igual o superior a 0.';
    }

    this.validationErrors = errors;

    return Object.keys(errors).length === 0;
  }

  saveTechnician(): void {
    if (!this.can('technicians.edit')) return;

    if (!this.validateTechnician()) return;

    const technicianData: Technician = {
      ...this.formData,
      name: this.formData.name.trim(),
      email: this.formData.email.trim(),
      phone: this.formData.phone.trim(),
      specialization: this.formData.specialization.trim(),
      installations: Number(this.formData.installations),
    };

    if (this.editing) {
      const updated = this.technicianService.updateTechnician(
        technicianData.id,
        technicianData,
      );

      if (!updated) return;
    } else {
      const newTechnician: Technician = {
        ...technicianData,
        id: this.technicians.length > 0
          ? Math.max(...this.technicians.map(technician => technician.id)) + 1
          : 1,
      };

      const added = this.technicianService.addTechnician(newTechnician);
      if (!added) {
        this.validationErrors['general'] =
          'No se ha podido registrar el técnico. Inténtalo de nuevo.';
        return;
      }
    }

    this.loadTechnicians();
    this.closeForm();
  }

  closeForm(): void {
    this.showForm = false;
    this.editing = false;
    this.validationErrors = {};
    this.formData = this.createEmptyTechnician();
  }
}
