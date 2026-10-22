
import { Injectable } from '@angular/core';
import { User, UserRole } from '../../shared/models/user.model';

interface UserAccount {
  user: User;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly usersKey = 'fiberdesk_users';
  private readonly credentialsKey = 'fiberdesk_credentials';

  private readonly initialAccounts: UserAccount[] = [
    {
      user: {
        id: 1,
        name: 'Administrador FiberDesk',
        email: 'admin@fiberdesk.com',
        role: 'admin',
        active: true,
        createdAt: new Date().toISOString(),
      },
      password: 'FiberDesk123',
    },
    {
      user: {
        id: 2,
        name: 'Técnico de prueba',
        email: 'tecnico@fiberdesk.com',
        role: 'technician',
        active: true,
        createdAt: new Date().toISOString(),
      },
      password: 'Tecnico123',
    },
    {
      user: {
        id: 3,
        name: 'Supervisor de prueba',
        email: 'supervisor@fiberdesk.com',
        role: 'supervisor',
        active: true,
        createdAt: new Date().toISOString(),
      },
      password: 'Supervisor123',
    },
  ];

  private users: User[] = this.loadUsers();

  private loadUsers(): User[] {
    if (typeof localStorage === 'undefined') {
      return this.initialAccounts.map(account => ({ ...account.user }));
    }

    const stored = localStorage.getItem(this.usersKey);

    if (stored) {
      try {
        const parsed: unknown = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          return parsed as User[];
        }
      } catch {
        // Se inicializan los usuarios si los datos no son válidos.
      }
    }

    const users = this.initialAccounts.map(account => ({ ...account.user }));
    localStorage.setItem(this.usersKey, JSON.stringify(users));

    return users;
  }

  private saveUsers(): void {
    if (typeof localStorage === 'undefined') return;

    localStorage.setItem(this.usersKey, JSON.stringify(this.users));
  }

  private loadCredentials(): UserAccount[] {
    if (typeof localStorage === 'undefined') {
      return this.initialAccounts.map(account => ({
        user: { ...account.user },
        password: account.password,
      }));
    }

    const stored = localStorage.getItem(this.credentialsKey);

    if (stored) {
      try {
        const parsed: unknown = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          return parsed as UserAccount[];
        }
      } catch {
        // Se recuperan las credenciales iniciales.
      }
    }

    const credentials = this.initialAccounts.map(account => ({
      user: { ...account.user },
      password: account.password,
    }));

    localStorage.setItem(this.credentialsKey, JSON.stringify(credentials));

    return credentials;
  }

  private saveCredentials(credentials: UserAccount[]): void {
    if (typeof localStorage === 'undefined') return;

    localStorage.setItem(this.credentialsKey, JSON.stringify(credentials));
  }

  getUsers(): User[] {
    return this.users.map(user => ({ ...user }));
  }

  getUserById(id: number): User | undefined {
    const user = this.users.find(item => item.id === id);
    return user ? { ...user } : undefined;
  }

  authenticate(email: string, password: string): User | null {
    const normalizedEmail = email.trim().toLowerCase();
    const credentials = this.loadCredentials();

    const account = credentials.find(item =>
      item.user.email.toLowerCase() === normalizedEmail &&
      item.password === password,
    );

    if (!account) return null;

    const currentUser = this.users.find(
      user => user.id === account.user.id,
    );

    if (!currentUser || !currentUser.active) return null;

    return { ...currentUser };
  }

  addUser(
    data: {
      name: string;
      email: string;
      role: UserRole;
      active: boolean;
    },
    password: string,
  ): boolean {
    const name = data.name.trim();
    const email = data.email.trim().toLowerCase();

    if (!name || !email || !password.trim()) return false;

    if (this.users.some(user => user.email.toLowerCase() === email)) {
      return false;
    }

    const id = this.users.length
      ? Math.max(...this.users.map(user => user.id)) + 1
      : 1;

    const user: User = {
      id,
      name,
      email,
      role: data.role,
      active: data.active,
      createdAt: new Date().toISOString(),
    };

    this.users.push(user);
    this.saveUsers();

    const credentials = this.loadCredentials();
    credentials.push({ user: { ...user }, password });
    this.saveCredentials(credentials);

    return true;
  }

  updateUser(
    id: number,
    data: Partial<Pick<User, 'name' | 'email' | 'role' | 'active'>>,
  ): boolean {
    const index = this.users.findIndex(user => user.id === id);

    if (index === -1) return false;

    const email = data.email?.trim().toLowerCase();

    if (
      email &&
      this.users.some(user =>
        user.id !== id && user.email.toLowerCase() === email,
      )
    ) {
      return false;
    }

    this.users[index] = {
      ...this.users[index],
      ...data,
      ...(data.name !== undefined ? { name: data.name.trim() } : {}),
      ...(email ? { email } : {}),
    };

    this.saveUsers();

    const credentials = this.loadCredentials();
    const credential = credentials.find(
      item => item.user.id === id,
    );

    if (credential) {
      credential.user = { ...this.users[index] };
      this.saveCredentials(credentials);
    }

    return true;
  }

  /**
   * Cambia la contraseña de un usuario existente.
   * Devuelve false si el usuario no existe o la contraseña está vacía.
   */
  changePassword(id: number, newPassword: string): boolean {
    if (
      !Number.isInteger(id) ||
      id <= 0 ||
      !newPassword ||
      !newPassword.trim() ||
      typeof localStorage === 'undefined'
    ) {
      return false;
    }

    const user = this.users.find(item => item.id === id);

    if (!user) return false;

    const credentials = this.loadCredentials();
    const credential = credentials.find(item => item.user.id === id);

    if (!credential) return false;

    credential.password = newPassword;
    credential.user = { ...user };

    this.saveCredentials(credentials);

    return true;
  }

  toggleUserStatus(id: number): boolean {
    const user = this.users.find(item => item.id === id);

    if (!user) return false;

    user.active = !user.active;
    this.saveUsers();

    const credentials = this.loadCredentials();
    const credential = credentials.find(item => item.user.id === id);

    if (credential) {
      credential.user = { ...user };
      this.saveCredentials(credentials);
    }

    return true;
  }
}
