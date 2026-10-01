import { Component } from '@angular/core';

import { Installation } from '../../shared/models/installation.model';
import { InstallationService } from '../../core/services/installation.service';

@Component({
  selector: 'app-installations',
  templateUrl: './installations.html',
})
export class Installations {

  installations: Installation[] = [];

  constructor(
    private installationService: InstallationService
  ) {
    this.installations =
      this.installationService.getInstallations();
  }
}