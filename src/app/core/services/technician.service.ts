import { Injectable } from '@angular/core';
import { Technician } from '../../shared/models/technician.model';

@Injectable({
  providedIn: 'root',
})
export class TechnicianService {

  private technicians: Technician[] = [
    {
      id: 1,
      name: 'Carlos Sánchez',
      email: 'carlos@fiberdesk.com',
      phone: '600 111 222',
      specialization: 'Instalaciones FTTH',
      status: 'Disponible',
      installations: 24,
    },
    {
      id: 2,
      name: 'Miguel Torres',
      email: 'miguel@fiberdesk.com',
      phone: '611 222 333',
      specialization: 'Fibra y redes',
      status: 'Ocupado',
      installations: 31,
    },
    {
      id: 3,
      name: 'David Moreno',
      email: 'david@fiberdesk.com',
      phone: '622 333 444',
      specialization: 'Mantenimiento',
      status: 'Disponible',
      installations: 18,
    },
    {
      id: 4,
      name: 'Javier Ruiz',
      email: 'javier@fiberdesk.com',
      phone: '633 444 555',
      specialization: 'Redes y routers',
      status: 'Fuera de servicio',
      installations: 27,
    },
  ];

  getTechnicians(): Technician[] {
    return this.technicians;
  }
}