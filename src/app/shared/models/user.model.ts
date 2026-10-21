export type UserRole = 'admin' | 'technician' | 'supervisor';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
}
