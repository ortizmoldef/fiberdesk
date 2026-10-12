
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Incident } from '../../shared/models/incident.model';
import { IncidentService } from '../../core/services/incident.service';

@Component({
  selector: 'app-incidents',
  imports: [FormsModule],
  templateUrl: './incidents.html',
})
export class Incidents {
  incidents: Incident[] = [];

  showForm = false;
  editingIncidentId: number | null = null;

  newIncident: Omit<Incident, 'id'> = {
    title: '',
    description: '',
    clientName: '',
    technician: '',
    priority: 'Media',
    status: 'Abierta',
    createdAt: '',
  };

  constructor(
    private incidentService: IncidentService
  ) {
    this.loadIncidents();
  }

  loadIncidents(): void {
    this.incidents = this.incidentService.getIncidents();
  }

  openForm(): void {
    this.editingIncidentId = null;
    this.resetForm();
    this.showForm = true;
  }

  editIncident(incident: Incident): void {
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
    const confirmed = confirm(
      `¿Seguro que quieres eliminar la incidencia "${incident.title}"?`
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
    this.resetForm();
  }

  saveIncident(): void {
    if (
      !this.newIncident.title.trim() ||
      !this.newIncident.clientName.trim()
    ) {
      return;
    }

    if (this.editingIncidentId !== null) {
      const updatedIncident: Incident = {
        id: this.editingIncidentId,
        ...this.newIncident,
      };

      this.incidentService.updateIncident(updatedIncident);
    } else {
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

  resetForm(): void {
    this.newIncident = {
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
