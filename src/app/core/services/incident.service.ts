import { Injectable } from '@angular/core';
import { Incident } from '../../shared/models/incident.model';

@Injectable({
  providedIn: 'root',
})
export class IncidentService {

  private incidents: Incident[] = [
    {
      id: 1,
      title: 'Sin conexión a Internet',
      description: 'El cliente indica que no tiene conexión desde esta mañana.',
      clientName: 'Juan García',
      technician: 'Carlos Sánchez',
      priority: 'Alta',
      status: 'En curso',
      createdAt: '2026-09-30',
    },
    {
      id: 2,
      title: 'Router no responde',
      description: 'El router del cliente no responde correctamente.',
      clientName: 'María López',
      technician: 'Miguel Torres',
      priority: 'Media',
      status: 'Abierta',
      createdAt: '2026-09-29',
    },
    {
      id: 3,
      title: 'Corte de fibra',
      description: 'Se ha detectado una posible rotura del cable de fibra.',
      clientName: 'Antonio Ruiz',
      technician: 'David Moreno',
      priority: 'Crítica',
      status: 'En curso',
      createdAt: '2026-09-28',
    },
    {
      id: 4,
      title: 'Baja velocidad',
      description: 'La velocidad medida es inferior a la contratada.',
      clientName: 'Laura Martín',
      technician: 'Carlos Sánchez',
      priority: 'Media',
      status: 'Resuelta',
      createdAt: '2026-09-25',
    },
  ];

  getIncidents(): Incident[] {
    return this.incidents;
  }

  addIncident(incident: Incident): void {
    this.incidents.unshift(incident);
  }


  updateIncident(updatedIncident: Incident): void {
  const index = this.incidents.findIndex(
    incident => incident.id === updatedIncident.id
  );

  if (index !== -1) {
    this.incidents[index] = updatedIncident;
  }
}

  deleteIncident(id: number): void {
    this.incidents = this.incidents.filter(
      incident => incident.id !== id
    );
  }

}