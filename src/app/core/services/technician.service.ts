
import { Injectable } from '@angular/core';
import { Technician } from '../../shared/models/technician.model';

@Injectable({
  providedIn: 'root',
})
export class TechnicianService {
  private readonly storageKey = 'fiberdesk_technicians';

  private readonly initialTechnicians: Technician[] = [
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

  private technicians: Technician[] = this.loadInitialTechnicians();

  /**
   * Carga los técnicos guardados.
   * Si todavía no existen datos, utiliza los técnicos iniciales.
   */
  private loadInitialTechnicians(): Technician[] {
    try {
      const storedData = localStorage.getItem(this.storageKey);

      if (storedData !== null) {
        const parsedData: unknown = JSON.parse(storedData);

        if (
          Array.isArray(parsedData) &&
          parsedData.every(this.isTechnician)
        ) {
          return parsedData;
        }

        console.error(
          'Los datos guardados de los técnicos no tienen un formato válido.'
        );
      }
    } catch (error) {
      console.error('No se pudieron cargar los técnicos:', error);
    }

    return this.initialTechnicians.map(technician => ({
      ...technician,
    }));
  }

  /**
   * Comprueba que un registro tenga los campos básicos de un técnico.
   */
  private isTechnician(value: unknown): value is Technician {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const technician = value as Record<string, unknown>;

    return (
      typeof technician['id'] === 'number' &&
      Number.isInteger(technician['id']) &&
      technician['id'] > 0 &&
      typeof technician['name'] === 'string' &&
      typeof technician['email'] === 'string' &&
      typeof technician['phone'] === 'string' &&
      typeof technician['specialization'] === 'string' &&
      ['Disponible', 'Ocupado', 'Fuera de servicio'].includes(
        technician['status'] as string
      ) &&
      typeof technician['installations'] === 'number' &&
      Number.isInteger(technician['installations']) &&
      technician['installations'] >= 0
    );
  }

  /**
   * Guarda la lista actual en localStorage.
   */
  private persistTechnicians(): boolean {
    try {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(this.technicians)
      );

      return true;
    } catch (error) {
      console.error('No se pudieron guardar los técnicos:', error);
      return false;
    }
  }

  // Obtener todos los técnicos.
  getTechnicians(): Technician[] {
    return this.technicians.map(technician => ({
      ...technician,
    }));
  }

  // Obtener un técnico por su ID.
  getTechnicianById(id: number): Technician | undefined {
    const technician = this.technicians.find(
      technician => technician.id === id
    );

    return technician ? { ...technician } : undefined;
  }

  // Actualizar los datos de un técnico.
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

    const previousTechnician = this.technicians[index];

    this.technicians[index] = {
      ...previousTechnician,
      ...updatedData,
      id: previousTechnician.id,
    };

    if (!this.persistTechnicians()) {
      this.technicians[index] = previousTechnician;
      return false;
    }

    return true;
  }

  // Añadir un nuevo técnico.
  addTechnician(technician: Technician): boolean {
    const idExists = this.technicians.some(
      existing => existing.id === technician.id
    );

    if (
      idExists ||
      !Number.isInteger(technician.id) ||
      technician.id <= 0
    ) {
      return false;
    }

    this.technicians.push({ ...technician });

    if (!this.persistTechnicians()) {
      this.technicians = this.technicians.filter(
        existing => existing.id !== technician.id
      );

      return false;
    }

    return true;
  }

  // Eliminar un técnico.
  deleteTechnician(id: number): void {
    const previousTechnicians = this.technicians;

    this.technicians = this.technicians.filter(
      technician => technician.id !== id
    );

    if (!this.persistTechnicians()) {
      this.technicians = previousTechnicians;
    }
  }
}
