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

  newIncident = {
    title: '',
    description: '',
    clientName: '',
    technician: '',
    priority: 'Media' as Incident['priority'],
    status: 'Abierta' as Incident['status'],
    createdAt: '',
  };

  constructor(
    private incidentService: IncidentService
  ) {
    this.incidents = this.incidentService.getIncidents();
  }

  openForm(): void {
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.resetForm();
  }

  addIncident(): void {
    if (
      !this.newIncident.title.trim() ||
      !this.newIncident.clientName.trim()
    ) {
      return;
    }

    const newIncident: Incident = {
      id: this.incidents.length > 0
        ? Math.max(...this.incidents.map(incident => incident.id)) + 1
        : 1,
      title: this.newIncident.title,
      description: this.newIncident.description,
      clientName: this.newIncident.clientName,
      technician: this.newIncident.technician,
      priority: this.newIncident.priority,
      status: this.newIncident.status,
      createdAt: this.newIncident.createdAt,
    };

    this.incidentService.addIncident(newIncident);

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