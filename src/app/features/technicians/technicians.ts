import { Component } from '@angular/core';

import { Technician } from '../../shared/models/technician.model';
import { TechnicianService } from '../../core/services/technician.service';

@Component({
  selector: 'app-technicians',
  templateUrl: './technicians.html',
})
export class Technicians {

  technicians: Technician[] = [];

  constructor(
    private technicianService: TechnicianService
  ) {
    this.technicians = this.technicianService.getTechnicians();
  }
}