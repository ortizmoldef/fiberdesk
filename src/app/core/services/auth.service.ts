import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { User, UserRole } from '../../shared/models/user.model';
import {
  Permission,
  ROLE_PERMISSIONS,
} from '../../shared/models/permission.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'fiberdesk_token';
  private readonly userKey = 'fiberdesk_user';

  constructor(
    private router: Router,
    private userService: UserService,
  ) {}

  /**
   * Inicio de sesión provisional para desarrollo.
   */
  login(email: string, password: string): boolean {
    const user = this.userService.authenticate(email, password);

    if (!user || typeof localStorage === 'undefined') {
      return false;
    }

    localStorage.setItem(this.tokenKey, 'development-token');
    localStorage.setItem(this.userKey, JSON.stringify(user));

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
   * Devuelve los datos actuales del usuario.
   * Sincroniza nombre, correo y rol con UserService.
   */
  getCurrentUser(): User | null {
    if (
      typeof localStorage === 'undefined' ||
      !this.getToken()
    ) {
      return null;
    }

    const storedUser = localStorage.getItem(this.userKey);

    if (!storedUser) {
      return null;
    }

    try {
      const sessionUser = JSON.parse(storedUser) as User;

      if (typeof sessionUser.id !== 'number') {
        this.clearSession();
        return null;
      }

      const currentUser = this.userService.getUserById(sessionUser.id);

      // Si el usuario ya no existe o está desactivado,
      // se invalida su sesión.
      if (!currentUser || !currentUser.active) {
        this.logout();
        return null;
      }

      // Actualiza los datos guardados si han cambiado.
      if (JSON.stringify(sessionUser) !== JSON.stringify(currentUser)) {
        localStorage.setItem(this.userKey, JSON.stringify(currentUser));
      }

      return currentUser;
    } catch {
      this.clearSession();
      return null;
    }
  }

  /**
   * Comprueba si existe una sesión válida.
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
   * Comprueba los permisos del usuario actual.
   */
  hasPermission(permission: Permission): boolean {
    const user = this.getCurrentUser();

    if (!user) {
      return false;
    }

    return ROLE_PERMISSIONS[user.role]?.includes(permission) ?? false;
  }

  /**
   * Elimina los datos de sesión sin navegar.
   */
  private clearSession(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  /**
   * Cierra la sesión y vuelve al login.
   */
  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }
}
