
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
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

  private readonly readNotificationsKey = 'fiberdesk_read_notifications';

  constructor(
    private authService: AuthService,
    private router: Router,
    private incidentService: IncidentService,
    private themeService: ThemeService,
  ) {
     this.themeService.loadSavedTheme();
  }

  get currentUser(): User | null {
    return this.authService.getCurrentUser();
  }

  get displayName(): string {
    return this.currentUser?.name ?? 'Usuario';
  }

  get displayRole(): string {
    const roles: Record<UserRole, string> = {
      admin: 'Administrador',
      technician: 'Técnico',
      supervisor: 'Supervisor',
    };

    const role = this.currentUser?.role;
    return role ? roles[role] : 'Sin rol';
  }

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

  /**
   * Incidencias pendientes, ordenadas por prioridad.
   */
  get pendingIncidents(): Incident[] {
    const priorityOrder: Record<string, number> = {
      'Crítica': 0,
      'Alta': 1,
      'Media': 2,
      'Baja': 3,
    };

    return this.incidentService
      .getIncidents()
      .filter(
        incident =>
          incident.status !== 'Resuelta' &&
          incident.status !== 'Cerrada',
      )
      .sort((a, b) => {
        const priorityDifference =
          (priorityOrder[a.priority] ?? 4) -
          (priorityOrder[b.priority] ?? 4);

        if (priorityDifference !== 0) {
          return priorityDifference;
        }

        return (
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        );
      });
  }


  get unreadIncidents(): Incident[] {
    const readIds = this.readNotificationIds;

    return this.pendingIncidents.filter(
      incident => !readIds.includes(incident.id),
    );
  }

  /**
   * Identificadores de notificaciones ya leídas.
   */
  private get readNotificationIds(): number[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    try {
      const stored = localStorage.getItem(
        this.readNotificationsKey,
      );

      if (!stored) {
        return [];
      }

      const parsed: unknown = JSON.parse(stored);

      if (
        !Array.isArray(parsed) ||
        !parsed.every(id => Number.isInteger(id))
      ) {
        return [];
      }

      return parsed as number[];
    } catch {
      return [];
    }
  }

  /**
   * Número de incidencias pendientes de revisar.
   */
  get notificationCount(): number {
    const readIds = this.readNotificationIds;

    return this.pendingIncidents.filter(
      incident => !readIds.includes(incident.id),
    ).length;
  }

  /**
   * Comprueba si una notificación ya se ha leído.
   */
  isNotificationRead(incident: Incident): boolean {
    return this.readNotificationIds.includes(incident.id);
  }

  /**
   * Marca una notificación como leída.
   */
  private markAsRead(incident: Incident): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    const readIds = this.readNotificationIds;

    if (!readIds.includes(incident.id)) {
      readIds.push(incident.id);

      localStorage.setItem(
        this.readNotificationsKey,
        JSON.stringify(readIds),
      );
    }
  }

  /**
   * Marca todas las incidencias pendientes como leídas.
   */
  
    
  markAllNotificationsAsRead(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    const readIds = new Set(this.readNotificationIds);

    for (const incident of this.pendingIncidents) {
      readIds.add(incident.id);
    }

    localStorage.setItem(
      this.readNotificationsKey,
      JSON.stringify([...readIds]),
    );

    // Mantenemos el panel abierto para que el usuario
    // vea el resultado de la acción.
    this.isNotificationsOpen = true;
  }



  toggleNotifications(): void {
    this.isNotificationsOpen = !this.isNotificationsOpen;
    this.isUserMenuOpen = false;
  }

  openIncident(incident: Incident): void {
    this.markAsRead(incident);
    this.isNotificationsOpen = false;

    void this.router.navigate(['/incidencias']);
  }

  /**
   * Abre la lista completa de incidencias.
   */
  openAllIncidents(): void {
    this.isNotificationsOpen = false;
    this.isUserMenuOpen = false;

    void this.router.navigate(['/incidencias']);
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    this.isNotificationsOpen = false;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

 openSection(section: string): void {
  console.log('Sección seleccionada:', section);

  this.closeUserMenu();

  if (section === 'configuracion') {
    this.router.navigate(['/configuracion']).then(
      (success) => {
        console.log('Navegación completada:', success);
        console.log('URL actual:', this.router.url);
      }
    );
  }

  if (section === 'perfil') {
    this.router.navigate(['/perfil']).then(
      (success) => {
        console.log('Navegación completada:', success);
        console.log('URL actual:', this.router.url);
      }
    );
  }
}

testConfiguration(): void {
  const parentRoute = this.router.config.find(
    (route) => route.path === ''
  );

  console.log(
    'Rutas hijas registradas:',
    parentRoute?.children?.map((route) => ({
      path: route.path,
      component: route.component,
      loadComponent: route.loadComponent,
      redirectTo: route.redirectTo,
    }))
  );

  void this.router.navigateByUrl('/configuracion');
}

  logout(): void {
    this.closeUserMenu();
    this.isNotificationsOpen = false;
    this.authService.logout();
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeUserMenu();
    this.isNotificationsOpen = false;
  }
}
