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

  // Obtener todos los técnicos
  getTechnicians(): Technician[] {
    return this.technicians;
  }

  // Obtener un técnico por su ID
  getTechnicianById(id: number): Technician | undefined {
    return this.technicians.find(technician => technician.id === id);
  }

  // Modificar los datos de un técnico
  updateTechnician(
    id: number,
    updatedData: Partial<Technician>
  ): boolean {
    const index = this.technicians.findIndex(
      technician => technician.id === id
    );

    if (index === -1) {
      return false;
    }

    this.technicians[index] = {
      ...this.technicians[index],
      ...updatedData,
      id: this.technicians[index].id,
    };

    return true;
  }

  // Añadir un nuevo técnico
  addTechnician(technician: Technician): void {
    this.technicians.push(technician);
  }

  // Eliminar un técnico
  deleteTechnician(id: number): void {
    this.technicians = this.technicians.filter(
      technician => technician.id !== id
    );
  }
}