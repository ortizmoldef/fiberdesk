
import { Injectable } from '@angular/core';
import { Incident } from '../../shared/models/incident.model';

@Injectable({
  providedIn: 'root',
})
export class IncidentService {
  private readonly storageKey = 'fiberdesk_incidents';

  private incidents: Incident[] = [];

  private readonly initialIncidents: Incident[] = [
    {
      id: 1,
      title: 'Sin conexión a Internet',
      description:
        'El cliente indica que no tiene conexión desde esta mañana.',
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

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Recupera las incidencias guardadas.
   * Si es la primera ejecución, carga los datos iniciales.
   */
  private loadFromStorage(): void {
    if (typeof localStorage === 'undefined') {
      this.incidents = this.initialIncidents.map(incident => ({
        ...incident,
      }));
      return;
    }

    try {
      const stored = localStorage.getItem(this.storageKey);

      if (stored === null) {
        this.incidents = this.initialIncidents.map(incident => ({
          ...incident,
        }));

        this.persist();
        return;
      }

      const parsed: unknown = JSON.parse(stored);

      if (
        Array.isArray(parsed) &&
        parsed.every(
          incident =>
            incident !== null &&
            typeof incident === 'object' &&
            Number.isInteger(incident.id),
        )
      ) {
        this.incidents = parsed as Incident[];
      } else {
        this.incidents = this.initialIncidents.map(incident => ({
          ...incident,
        }));
        this.persist();
      }
    } catch {
      this.incidents = this.initialIncidents.map(incident => ({
        ...incident,
      }));
      this.persist();
    }
  }

  /**
   * Guarda el estado actual de las incidencias.
   */
  private persist(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(this.incidents),
    );
  }

  getIncidents(): Incident[] {
    return [...this.incidents];
  }

  addIncident(incident: Incident): void {
    this.incidents.unshift({ ...incident });
    this.persist();
  }

  updateIncident(updatedIncident: Incident): void {
    const index = this.incidents.findIndex(
      incident => incident.id === updatedIncident.id,
    );

    if (index === -1) {
      return;
    }

    this.incidents[index] = { ...updatedIncident };
    this.persist();
  }

  deleteIncident(id: number): void {
    this.incidents = this.incidents.filter(
      incident => incident.id !== id,
    );

    this.persist();
  }
}
