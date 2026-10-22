
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { User, UserRole } from '../../shared/models/user.model';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './users.html',
})
export class Users implements OnInit {
  users: User[] = [];

  editingUserId: number | null = null;
  changingPasswordUserId: number | null = null;

  showForm = false;

  errorMessage = '';
  successMessage = '';

  passwordForm = {
    newPassword: '',
    confirmPassword: '',
  };

  form = {
    name: '',
    email: '',
    role: 'technician' as UserRole,
    active: true,
    password: '',
  };

  constructor(
    private userService: UserService,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  get activeUsersCount(): number {
    return this.users.filter(user => user.active).length;
  }

  get inactiveUsersCount(): number {
    return this.users.filter(user => !user.active).length;
  }

  loadUsers(): void {
    this.users = this.userService.getUsers();
  }

  openCreateForm(): void {
    this.closePasswordForm();
    this.resetForm();
    this.editingUserId = null;
    this.showForm = true;
  }

  openEditForm(user: User): void {
    this.closePasswordForm();
    this.resetForm();

    this.editingUserId = user.id;

    this.form = {
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
      password: '',
    };

    this.showForm = true;
  }

  saveUser(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const name = this.form.name.trim();
    const email = this.form.email.trim().toLowerCase();

    if (!name || !email) {
      this.errorMessage =
        'Completa el nombre y el correo electrónico.';
      return;
    }

    if (this.editingUserId === null) {
      if (!this.form.password.trim()) {
        this.errorMessage =
          'Introduce una contraseña para el nuevo usuario.';
        return;
      }

      if (this.form.password.length < 8) {
        this.errorMessage =
          'La contraseña debe tener al menos 8 caracteres.';
        return;
      }

      const created = this.userService.addUser(
        {
          name,
          email,
          role: this.form.role,
          active: this.form.active,
        },
        this.form.password,
      );

      if (!created) {
        this.errorMessage =
          'No se pudo crear el usuario. Comprueba que el correo no esté registrado.';
        return;
      }

      this.successMessage = 'Usuario creado correctamente.';
    } else {
      const updated = this.userService.updateUser(
        this.editingUserId,
        {
          name,
          email,
          role: this.form.role,
          active: this.form.active,
        },
      );

      if (!updated) {
        this.errorMessage =
          'No se pudo actualizar el usuario. Comprueba que el correo no esté duplicado.';
        return;
      }

      this.successMessage = 'Usuario actualizado correctamente.';
    }

    this.loadUsers();
    this.showForm = false;
    this.editingUserId = null;
    this.resetForm();
  }

  openPasswordForm(user: User): void {
    this.showForm = false;
    this.editingUserId = null;
    this.resetForm();

    this.changingPasswordUserId = user.id;
    this.passwordForm = {
      newPassword: '',
      confirmPassword: '',
    };

    this.errorMessage = '';
    this.successMessage = '';
  }

  savePassword(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.changingPasswordUserId === null) {
      this.errorMessage = 'Selecciona un usuario.';
      return;
    }

    const newPassword = this.passwordForm.newPassword;
    const confirmPassword = this.passwordForm.confirmPassword;

    if (!newPassword.trim() || !confirmPassword.trim()) {
      this.errorMessage = 'Completa los dos campos de contraseña.';
      return;
    }

    if (newPassword.length < 8) {
      this.errorMessage =
        'La contraseña debe tener al menos 8 caracteres.';
      return;
    }

    if (newPassword !== confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    const changed = this.userService.changePassword(
      this.changingPasswordUserId,
      newPassword,
    );

    if (!changed) {
      this.errorMessage =
        'No se pudo cambiar la contraseña. Comprueba que el usuario exista.';
      return;
    }

    const changedUser = this.users.find(
      user => user.id === this.changingPasswordUserId,
    );

    this.successMessage = changedUser
      ? `Contraseña de ${changedUser.name} actualizada correctamente.`
      : 'Contraseña actualizada correctamente.';

    this.changingPasswordUserId = null;
    this.passwordForm = {
      newPassword: '',
      confirmPassword: '',
    };
  }

  toggleStatus(user: User): void {
    if (
      user.id === this.authService.getCurrentUser()?.id &&
      user.active
    ) {
      this.errorMessage =
        'No puedes desactivar tu propia cuenta.';
      this.successMessage = '';
      return;
    }

    const updated = this.userService.toggleUserStatus(user.id);

    if (!updated) {
      this.errorMessage =
        'No se pudo cambiar el estado del usuario.';
      return;
    }

    this.errorMessage = '';
    this.successMessage = user.active
      ? 'Usuario desactivado correctamente.'
      : 'Usuario activado correctamente.';

    this.loadUsers();
  }

  closeForm(): void {
    this.showForm = false;
    this.editingUserId = null;
    this.resetForm();
  }

  closePasswordForm(): void {
    this.changingPasswordUserId = null;

    this.passwordForm = {
      newPassword: '',
      confirmPassword: '',
    };
  }

  private resetForm(): void {
    this.form = {
      name: '',
      email: '',
      role: 'technician',
      active: true,
      password: '',
    };

    this.errorMessage = '';
  }
}
