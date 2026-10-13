import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Credenciales temporales para desarrollo
  private readonly testEmail = 'admin@fiberdesk.com';
  private readonly testPassword = 'FiberDesk123';

  private readonly tokenKey = 'fiberdesk_token';

  constructor(private router: Router) {}

  login(email: string, password: string): boolean {
    const validEmail = email.trim().toLowerCase();

    if (
      validEmail !== this.testEmail &&
      validEmail !== this.testEmail.toLowerCase()
    ) {
      return false;
    }

    if (password !== this.testPassword) {
      return false;
    }

    // Token ficticio: solo para probar la navegación
    localStorage.setItem(this.tokenKey, 'development-token');

    return true;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }
}
