
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Incident } from '../../shared/models/incident.model';
import { IncidentService } from '../../core/services/incident.service';
import { AuthService } from '../../core/services/auth.service';
import { Permission } from '../../shared/models/permission.model';

@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './incidents.html',
})
export class Incidents {
  incidents: Incident[] = [];

  showForm = false;
  editingIncidentId: number | null = null;
  submitted = false;

  validationErrors: Record<string, string> = {};

  private readonly maxTitleLength = 100;
  private readonly maxDescriptionLength = 1000;
  private readonly maxClientNameLength = 100;
  private readonly maxTechnicianLength = 100;

  newIncident: Omit<Incident, 'id'> = this.createEmptyIncident();

  constructor(
    private incidentService: IncidentService,
    private authService: AuthService,
  ) {
    this.loadIncidents();
  }

  can(permission: Permission): boolean {
    return this.authService.hasPermission(permission);
  }

  get isTechnician(): boolean {
    return this.authService.hasRole('technician');
  }

  loadIncidents(): void {
    this.incidents = this.incidentService.getIncidents();
  }

  openForm(): void {
    if (!this.can('incidents.create')) {
      return;
    }

    this.editingIncidentId = null;
    this.newIncident = this.createEmptyIncident();
    this.resetValidation();
    this.showForm = true;
  }

  editIncident(incident: Incident): void {
    if (!this.can('incidents.edit')) {
      return;
    }

    this.editingIncidentId = incident.id;

    this.newIncident = {
      title: incident.title,
      description: incident.description,
      clientName: incident.clientName,
      technician: incident.technician,
      priority: incident.priority,
      status: incident.status,
      createdAt: incident.createdAt,
    };

    this.resetValidation();
    this.showForm = true;
  }

  deleteIncident(incident: Incident): void {
    if (!this.can('incidents.delete')) {
      return;
    }

    const confirmed = confirm(
      `¿Seguro que quieres eliminar la incidencia "${incident.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    this.incidentService.deleteIncident(incident.id);
    this.loadIncidents();
  }

  closeForm(): void {
    this.showForm = false;
    this.editingIncidentId = null;
    this.newIncident = this.createEmptyIncident();
    this.resetValidation();
  }

  private resetValidation(): void {
    this.submitted = false;
    this.validationErrors = {};
  }

  clearValidationError(field: string): void {
    delete this.validationErrors[field];
  }

  /**
   * Devuelve la fecha actual en formato YYYY-MM-DD.
   * Es público porque se utiliza desde la plantilla HTML.
   */
  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  /**
   * Comprueba que la fecha existe realmente
   * y tiene el formato YYYY-MM-DD.
   */

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


  private validateIncident(): boolean {
    const errors: Record<string, string> = {};

    const title = this.newIncident.title.trim();
    const description = this.newIncident.description.trim();
    const clientName = this.newIncident.clientName.trim();
    const technician = this.newIncident.technician.trim();

    // El técnico solo modifica la descripción y el estado al editar.
    if (!this.isTechnician || this.editingIncidentId === null) {
      // Validación del título.
      if (!title) {
        errors['title'] = 'El título es obligatorio.';
      } else if (title.length < 5) {
        errors['title'] = 'Escribe al menos 5 caracteres.';
      } else if (title.length > this.maxTitleLength) {
        errors['title'] =
          `El título no puede superar ${this.maxTitleLength} caracteres.`;
      }

      // Validación del cliente.
      if (!clientName) {
        errors['clientName'] = 'El cliente es obligatorio.';
      } else if (clientName.length < 3) {
        errors['clientName'] = 'Escribe al menos 3 caracteres.';
      } else if (clientName.length > this.maxClientNameLength) {
        errors['clientName'] =
          `El nombre no puede superar ${this.maxClientNameLength} caracteres.`;
      } else if (!/^[\p{L}\p{M}\d\s.'’()-]+$/u.test(clientName)) {
        errors['clientName'] =
          'Usa letras, números y signos de puntuación habituales.';
      }

      // Validación del técnico asignado.
      if (technician.length > this.maxTechnicianLength) {
        errors['technician'] =
          `El nombre no puede superar ${this.maxTechnicianLength} caracteres.`;
      } else if (
        technician &&
        !/^[\p{L}\p{M}\d\s.'’()-]+$/u.test(technician)
      ) {
        errors['technician'] =
          'Usa letras, números y signos de puntuación habituales.';
      }

      // Validación de la prioridad.
      if (
        !['Crítica', 'Alta', 'Media', 'Baja'].includes(
          this.newIncident.priority,
        )
      ) {
        errors['priority'] = 'Selecciona una prioridad válida.';
      }
    }

    // Validación de la descripción.
    if (description.length > this.maxDescriptionLength) {
      errors['description'] =
        `La descripción no puede superar ${this.maxDescriptionLength} caracteres.`;
    }

    // Validación del estado.
    if (
      !['Abierta', 'En curso', 'Resuelta', 'Cerrada'].includes(
        this.newIncident.status,
      )
    ) {
      errors['status'] = 'Selecciona un estado válido.';
    }

    // Validación de la fecha.
    const date = String(this.newIncident.createdAt ?? '').trim();

    if (!date) {
      errors['createdAt'] = 'La fecha es obligatoria.';
    } else if (!this.isValidDate(date)) {
      errors['createdAt'] = 'Introduce una fecha válida.';
    } else if (date > this.getTodayDate()) {
      errors['createdAt'] = 'La fecha no puede ser futura.';
    }

    this.validationErrors = errors;

    return Object.keys(errors).length === 0;
  }

  saveIncident(): void {
    this.submitted = true;

    if (!this.validateIncident()) {
      return;
    }

    // Edición de una incidencia existente.
    if (this.editingIncidentId !== null) {
      if (!this.can('incidents.edit')) {
        return;
      }

      const originalIncident = this.incidents.find(
        incident => incident.id === this.editingIncidentId,
      );

      if (!originalIncident) {
        return;
      }

      let updatedIncident: Incident;

      if (this.isTechnician) {
        // El técnico solo puede modificar descripción y estado.
        updatedIncident = {
          ...originalIncident,
          description: this.newIncident.description.trim(),
          status: this.newIncident.status,
        };
      } else {
        updatedIncident = {
          ...this.newIncident,
          id: this.editingIncidentId,
          title: this.newIncident.title.trim(),
          description: this.newIncident.description.trim(),
          clientName: this.newIncident.clientName.trim(),
          technician: this.newIncident.technician.trim(),
        };
      }

      this.incidentService.updateIncident(updatedIncident);
    } else {
      // Creación de una incidencia.
      if (!this.can('incidents.create')) {
        return;
      }

      const newIncident: Incident = {
        ...this.newIncident,
        id: Date.now(),
        title: this.newIncident.title.trim(),
        description: this.newIncident.description.trim(),
        clientName: this.newIncident.clientName.trim(),
        technician: this.newIncident.technician.trim(),
        createdAt: this.newIncident.createdAt,
      };

      this.incidentService.addIncident(newIncident);
    }

    this.loadIncidents();
    this.closeForm();
  }

  private createEmptyIncident(): Omit<Incident, 'id'> {
    return {
      title: '',
      description: '',
      clientName: '',
      technician: '',
      priority: 'Media',
      status: 'Abierta',
      createdAt: this.getTodayDate(),
    };
  }
}
