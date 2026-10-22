
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
  }

  saveIncident(): void {
    if (
      !this.newIncident.title.trim() ||
      !this.newIncident.clientName.trim()
    ) {
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
          description: this.newIncident.description,
          status: this.newIncident.status,
        };
      } else {
        updatedIncident = {
          id: this.editingIncidentId,
          ...this.newIncident,
        };
      }

      this.incidentService.updateIncident(updatedIncident);
    } else {
      // Creación de una incidencia.
      if (!this.can('incidents.create')) {
        return;
      }

      const newIncident: Incident = {
        id: this.incidents.length > 0
          ? Math.max(...this.incidents.map(incident => incident.id)) + 1
          : 1,
        ...this.newIncident,
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
      createdAt: '',
    };
  }
}
