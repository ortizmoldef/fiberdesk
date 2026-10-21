import { UserRole } from './user.model';

export type Permission =
  | 'dashboard.view'
  | 'clients.view'
  | 'clients.create'
  | 'clients.edit'
  | 'clients.delete'
  | 'installations.view'
  | 'installations.create'
  | 'installations.edit'
  | 'installations.delete'
  | 'technicians.view'
  | 'technicians.create'
  | 'technicians.edit'
  | 'technicians.delete'
  | 'incidents.view'
  | 'incidents.create'
  | 'incidents.edit'
  | 'incidents.delete'
  | 'users.view'
  | 'users.create'
  | 'users.edit'
  | 'users.delete';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'dashboard.view',
    'clients.view',
    'clients.create',
    'clients.edit',
    'clients.delete',
    'installations.view',
    'installations.create',
    'installations.edit',
    'installations.delete',
    'technicians.view',
    'technicians.create',
    'technicians.edit',
    'technicians.delete',
    'incidents.view',
    'incidents.create',
    'incidents.edit',
    'incidents.delete',
    'users.view',
    'users.create',
    'users.edit',
    'users.delete',
  ],

  technician: [
    'dashboard.view',
    'installations.view',
    'incidents.view',
    'incidents.edit',
  ],

  supervisor: [
    'dashboard.view',
    'clients.view',
    'installations.view',
    'technicians.view',
    'incidents.view',
  ],
};
