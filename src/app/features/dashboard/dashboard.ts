import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IncidentService } from '../../core/services/incident.service';
import { Incident } from '../../shared/models/incident.model';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  constructor(private incidentService: IncidentService) {}

  // Todas las incidencias registradas
  get incidents(): Incident[] {
    return this.incidentService.getIncidents();
  }

  // Incidencias que todavía requieren atención
  get pendingIncidents(): Incident[] {
    return this.incidents.filter(
      incident =>
        incident.status !== 'Resuelta' &&
        incident.status !== 'Cerrada'
    );
  }

  // Incidencias de prioridad crítica pendientes
  get criticalIncidents(): number {
    return this.pendingIncidents.filter(
      incident => incident.priority === 'Crítica'
    ).length;
  }

  // Máximo de tres incidencias para el resumen
  get recentIncidents(): Incident[] {
    return this.pendingIncidents.slice(0, 3);
  }
}