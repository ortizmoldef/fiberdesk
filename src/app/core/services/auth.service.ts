
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
   * Inicia sesión con las credenciales del usuario.
   * Autenticación provisional para desarrollo.
   */
  login(email: string, password: string): boolean {
    if (
      typeof localStorage === 'undefined' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() ||
      !password
    ) {
      return false;
    }

    // Eliminamos cualquier sesión anterior antes de validar.
    this.clearSession();

    const user = this.userService.authenticate(email, password);

    if (!user || !this.isValidUser(user)) {
      return false;
    }

    try {
      localStorage.setItem(this.tokenKey, 'development-token');
      localStorage.setItem(this.userKey, JSON.stringify(user));

      return true;
    } catch {
      // Si el almacenamiento falla, no dejamos una sesión parcial.
      this.clearSession();
      return false;
    }
  }

  /**
   * Devuelve el token provisional de la sesión.
   */
  getToken(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const token = localStorage.getItem(this.tokenKey);

    return token === 'development-token' ? token : null;
  }

  /**
   * Devuelve el usuario actual y sincroniza sus datos.
   */
  getCurrentUser(): User | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const token = this.getToken();
    const storedUser = localStorage.getItem(this.userKey);

    // El token y los datos de usuario deben existir juntos.
    if (!token || !storedUser) {
      this.clearSession();
      return null;
    }

    try {
      const sessionUser: unknown = JSON.parse(storedUser);

      if (!this.isValidUser(sessionUser)) {
        this.clearSession();
        return null;
      }

      const currentUser = this.userService.getUserById(
        sessionUser.id,
      );

      // La cuenta debe seguir existiendo y estar activa.
      if (!currentUser || !currentUser.active) {
        this.clearSession();
        return null;
      }

      // Los datos actuales de UserService son la referencia.
      if (
        JSON.stringify(sessionUser) !==
        JSON.stringify(currentUser)
      ) {
        localStorage.setItem(
          this.userKey,
          JSON.stringify(currentUser),
        );
      }

      return currentUser;
    } catch {
      this.clearSession();
      return null;
    }
  }

  /**
   * Comprueba si existe una sesión local válida.
   */
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  /**
   * Comprueba el rol del usuario actual.
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

    return (
      ROLE_PERMISSIONS[user.role]?.includes(permission) ?? false
    );
  }

  /**
   * Valida la estructura básica de un usuario.
   */
  private isValidUser(value: unknown): value is User {
    if (
      typeof value !== 'object' ||
      value === null
    ) {
      return false;
    }

    const user = value as Partial<User>;

    const validRoles: UserRole[] = [
      'admin',
      'technician',
      'supervisor',
    ];

    return (
      Number.isInteger(user.id) &&
      Number(user.id) > 0 &&
      typeof user.name === 'string' &&
      user.name.trim().length > 0 &&
      typeof user.email === 'string' &&
      user.email.trim().length > 0 &&
      validRoles.includes(user.role as UserRole) &&
      typeof user.active === 'boolean' &&
      typeof user.createdAt === 'string'
    );
  }

  /**
   * Elimina los datos locales de la sesión.
   */
  private clearSession(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  /**
   * Cierra la sesión y vuelve a la pantalla de acceso.
   */
  logout(): void {
    this.clearSession();
    void this.router.navigate(['/login']);
  }
}
