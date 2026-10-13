
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  login(): void {
    this.errorMessage = '';

    if (!this.email.trim() || !this.password) {
      this.errorMessage = 'Introduce tu correo y contraseña.';
      return;
    }

    const authenticated = this.authService.login(
      this.email,
      this.password,
    );

    if (!authenticated) {
      this.errorMessage = 'Correo o contraseña incorrectos.';
      return;
    }

    this.router.navigate(['/dashboard']);
  }
}
