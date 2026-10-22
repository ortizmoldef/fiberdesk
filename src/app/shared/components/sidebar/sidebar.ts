
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { Permission } from '../../models/permission.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  constructor(private authService: AuthService) {}

  can(permission: Permission): boolean {
    return this.authService.hasPermission(permission);
  }
}
