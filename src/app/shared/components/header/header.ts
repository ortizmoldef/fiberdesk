import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { IncidentService } from '../../../core/services/incident.service';
import { Incident } from '../../models/incident.model';

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

  // Incidencias que todavía requieren atención
  get pendingIncidents(): Incident[] {
    return this.incidentService.getIncidents().filter(
      incident =>
        incident.status !== 'Resuelta' &&
        incident.status !== 'Cerrada'
    );
  }

  // Número de notificaciones pendientes
  get notificationCount(): number {
    return this.pendingIncidents.length;
  }

  toggleNotifications(): void {
    this.isNotificationsOpen = !this.isNotificationsOpen;
    this.isUserMenuOpen = false;
  }

  openIncident(incident: Incident): void {
    this.isNotificationsOpen = false;

    // Navega a la sección de incidencias
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

    // Estas páginas se implementarán más adelante.
    console.log(`Sección seleccionada: ${section}`);
  }

  logout(): void {
    this.closeUserMenu();
    this.isNotificationsOpen = false;
    this.authService.logout();
  }

  // Cierra los menús al pulsar fuera de ellos
  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeUserMenu();
    this.isNotificationsOpen = false;
  }
}