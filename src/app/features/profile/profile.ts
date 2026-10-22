
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { User, UserRole } from '../../shared/models/user.model';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.html',
})
export class Profile implements OnInit {
  currentUser: User | null = null;

  form = {
    name: '',
    email: '',
  };

  errorMessage = '';
  successMessage = '';
  isSaving = false;

  passwordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

    isChangingPassword = false;
    passwordError = '';
    passwordSuccess = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  get displayRole(): string {
    const roles: Record<UserRole, string> = {
      admin: 'Administrador',
      technician: 'Técnico',
      supervisor: 'Supervisor',
    };

    return this.currentUser
      ? roles[this.currentUser.role]
      : 'Sin rol';
  }

  get userInitials(): string {
    const name = this.currentUser?.name.trim();

    if (!name) {
      return 'U';
    }

    return name
      .split(/\s+/)
      .slice(0, 2)
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  }

  loadProfile(): void {
    this.currentUser = this.authService.getCurrentUser();

    if (!this.currentUser) {
      this.errorMessage =
        'No se ha podido cargar la información de tu cuenta.';
      return;
    }

    this.form = {
      name: this.currentUser.name,
      email: this.currentUser.email,
    };
  }

  saveProfile(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.currentUser) {
      this.errorMessage = 'No se ha encontrado tu cuenta.';
      return;
    }

    const name = this.form.name.trim();
    const email = this.form.email.trim().toLowerCase();

    if (!name || !email) {
      this.errorMessage =
        'Completa el nombre y el correo electrónico.';
      return;
    }

    this.isSaving = true;

    try {
      const updated = this.userService.updateUser(
        this.currentUser.id,
        { name, email },
      );

      if (!updated) {
        this.errorMessage =
          'No se pudo guardar el perfil. Comprueba que el correo no esté registrado por otro usuario.';
        return;
      }

      this.currentUser = this.authService.getCurrentUser();

      if (this.currentUser) {
        this.form = {
          name: this.currentUser.name,
          email: this.currentUser.email,
        };
      }

      this.successMessage = 'Tu perfil se ha actualizado correctamente.';
    } finally {
      this.isSaving = false;
    }
  }

  
    changeMyPassword(): void {
    this.passwordError = '';
    this.passwordSuccess = '';

    if (!this.currentUser) {
        this.passwordError = 'No se ha encontrado tu cuenta.';
        return;
    }

    const { currentPassword, newPassword, confirmPassword } =
        this.passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
        this.passwordError = 'Completa los tres campos de contraseña.';
        return;
    }

    if (!this.userService.verifyPassword(
        this.currentUser.id,
        currentPassword,
    )) {
        this.passwordError = 'La contraseña actual no es correcta.';
        return;
    }

    if (newPassword.length < 8) {
        this.passwordError =
        'La nueva contraseña debe tener al menos 8 caracteres.';
        return;
    }

    if (newPassword !== confirmPassword) {
        this.passwordError = 'Las nuevas contraseñas no coinciden.';
        return;
    }

    if (newPassword === currentPassword) {
        this.passwordError =
        'La nueva contraseña debe ser diferente de la actual.';
        return;
    }

    this.isChangingPassword = true;

    try {
        const changed = this.userService.changePassword(
        this.currentUser.id,
        newPassword,
        );

        if (!changed) {
        this.passwordError = 'No se pudo cambiar la contraseña.';
        return;
        }

        this.passwordForm = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        };

        this.passwordSuccess = 'Tu contraseña se ha cambiado correctamente.';
    } finally {
        this.isChangingPassword = false;
    }
    }



  cancelChanges(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.currentUser) {
      this.form = {
        name: this.currentUser.name,
        email: this.currentUser.email,
      };
    }
  }
}
