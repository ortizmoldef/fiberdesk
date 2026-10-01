import { Injectable } from '@angular/core';
import { Installation } from '../../shared/models/installation.model';

@Injectable({
  providedIn: 'root',
})
export class InstallationService {

  private installations: Installation[] = [
    {
      id: 1,
      clientName: 'Juan García',
      address: 'Calle Sevilla 24',
      technician: 'Carlos Sánchez',
      date: '2026-10-02',
      status: 'Programada',
      plan: 'FTTH 600 Mbps',
    },
    {
      id: 2,
      clientName: 'María López',
      address: 'Avenida Andalucía 18',
      technician: 'Miguel Torres',
      date: '2026-10-03',
      status: 'En curso',
      plan: 'FTTH 1 Gb',
    },
    {
      id: 3,
      clientName: 'Antonio Ruiz',
      address: 'Calle Real 42',
      technician: 'Carlos Sánchez',
      date: '2026-09-28',
      status: 'Completada',
      plan: 'FTTH 600 Mbps',
    },
    {
      id: 4,
      clientName: 'Laura Martín',
      address: 'Calle Granada 7',
      technician: 'David Moreno',
      date: '2026-10-04',
      status: 'Programada',
      plan: 'FTTH 1 Gb',
    },
  ];

  getInstallations(): Installation[] {
    return this.installations;
  }

  addInstallation(installation: Installation): void {
    this.installations.unshift(installation);
  }
}