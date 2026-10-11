
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Technician } from '../../shared/models/technician.model';
import { TechnicianService } from '../../core/services/technician.service';

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
    private technicianService: TechnicianService
  ) {
    this.loadTechnicians();
  }

  // Cargar técnicos
  loadTechnicians(): void {
    this.technicians = this.technicianService.getTechnicians();
  }

  // Crear un formulario vacío
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

  // Abrir el formulario para editar
  editTechnician(technician: Technician): void {
    this.formData = { ...technician };
    this.editing = true;
    this.showForm = true;
  }

  // Guardar los cambios
  saveTechnician(): void {
    if (
      !this.formData.name.trim() ||
      !this.formData.email.trim() ||
      !this.formData.phone.trim() ||
      !this.formData.specialization.trim()
    ) {
      return;
    }

    if (this.editing) {
      const updated = this.technicianService.updateTechnician(
        this.formData.id,
        this.formData
      );

      if (!updated) {
        return;
      }
    }

    this.loadTechnicians();
    this.closeForm();
  }

  // Cerrar el formulario
  closeForm(): void {
    this.showForm = false;
    this.editing = false;
    this.formData = this.createEmptyTechnician();
  }
}
