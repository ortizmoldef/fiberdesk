
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { User, UserRole } from '../../shared/models/user.model';
import {
  Permission,
  ROLE_PERMISSIONS,
} from '../../shared/models/permission.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'fiberdesk_token';
  private readonly userKey = 'fiberdesk_user';

  // Cuentas temporales para desarrollo.
  private readonly testUsers: {
    email: string;
    password: string;
    user: User;
  }[] = [
    {
      email: 'admin@fiberdesk.com',
      password: 'FiberDesk123',
      user: {
        id: 1,
        name: 'Administrador FiberDesk',
        email: 'admin@fiberdesk.com',
        role: 'admin',
        active: true,
        createdAt: new Date().toISOString(),
      },
    },
    {
      email: 'tecnico@fiberdesk.com',
      password: 'Tecnico123',
      user: {
        id: 2,
        name: 'Técnico de prueba',
        email: 'tecnico@fiberdesk.com',
        role: 'technician',
        active: true,
        createdAt: new Date().toISOString(),
      },
    },
    {
      email: 'supervisor@fiberdesk.com',
      password: 'Supervisor123',
      user: {
        id: 3,
        name: 'Supervisor de prueba',
        email: 'supervisor@fiberdesk.com',
        role: 'supervisor',
        active: true,
        createdAt: new Date().toISOString(),
      },
    },
  ];

  constructor(private router: Router) {}

  /**
   * Inicio de sesión provisional para desarrollo.
   */
  login(email: string, password: string): boolean {
    const normalizedEmail = email.trim().toLowerCase();

    const account = this.testUsers.find(
      user =>
        user.email.toLowerCase() === normalizedEmail &&
        user.password === password &&
        user.user.active,
    );

    if (!account) {
      return false;
    }

    if (typeof localStorage === 'undefined') {
      return false;
    }

    localStorage.setItem(this.tokenKey, 'development-token');
    localStorage.setItem(this.userKey, JSON.stringify(account.user));

    return true;
  }

  /**
   * Devuelve el token provisional.
   */
  getToken(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Devuelve el usuario de la sesión actual.
   */
  getCurrentUser(): User | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const storedUser = localStorage.getItem(this.userKey);

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as User;
    } catch {
      return null;
    }
  }

  /**
   * Comprueba si hay una sesión provisional.
   */
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }

  /**
   * Comprueba si el usuario tiene un rol determinado.
   */
  hasRole(role: UserRole): boolean {
    return this.getCurrentUser()?.role === role;
  }

  /**
   * Comprueba si el rol tiene un permiso.
   */
  hasPermission(permission: Permission): boolean {
    const user = this.getCurrentUser();

    if (!user || !user.active) {
      return false;
    }

    return ROLE_PERMISSIONS[user.role]?.includes(permission) ?? false;
  }

  /**
   * Cierra la sesión y elimina los datos locales.
   */
  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }

    this.router.navigate(['/login']);
  }
}
