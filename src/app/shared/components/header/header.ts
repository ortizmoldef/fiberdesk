
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { IncidentService } from '../../../core/services/incident.service';
import { Incident } from '../../models/incident.model';
import { User, UserRole } from '../../models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
})
export class Header {
  isUserMenuOpen = false;
  isNotificationsOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private incidentService: IncidentService,
  ) {}

  // Usuario que ha iniciado sesión.
  get currentUser(): User | null {
    return this.authService.getCurrentUser();
  }

  // Nombre que se muestra en el perfil.
  get displayName(): string {
    return this.currentUser?.name ?? 'Usuario';
  }

  // Nombre del rol en español.
  get displayRole(): string {
    const roles: Record<UserRole, string> = {
      admin: 'Administrador',
      technician: 'Técnico',
      supervisor: 'Supervisor',
    };

    const role = this.currentUser?.role;
    return role ? roles[role] : 'Sin rol';
  }

  // Iniciales del usuario para el avatar.
  get userInitials(): string {
    const name = this.displayName.trim();

    if (!name || name === 'Usuario') {
      return 'U';
    }

    return name
      .split(/\s+/)
      .slice(0, 2)
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  }

  // Incidencias que todavía requieren atención.
  get pendingIncidents(): Incident[] {
    return this.incidentService.getIncidents().filter(
      incident =>
        incident.status !== 'Resuelta' &&
        incident.status !== 'Cerrada',
    );
  }

  // Número de notificaciones pendientes.
  get notificationCount(): number {
    return this.pendingIncidents.length;
  }

  toggleNotifications(): void {
    this.isNotificationsOpen = !this.isNotificationsOpen;
    this.isUserMenuOpen = false;
  }

  openIncident(incident: Incident): void {
    this.isNotificationsOpen = false;
    this.router.navigate(['/incidencias']);
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    this.isNotificationsOpen = false;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  openSection(section: string): void {
  this.closeUserMenu();

  if (section === 'perfil') {
    this.router.navigate(['/perfil']);
  }
}

  logout(): void {
    this.closeUserMenu();
    this.isNotificationsOpen = false;
    this.authService.logout();
  }

  // Cierra los menús al pulsar fuera de ellos.
  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeUserMenu();
    this.isNotificationsOpen = false;
  }
}
