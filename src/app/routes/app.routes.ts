
import { Routes } from '@angular/router';

import {
  authGuard,
  permissionGuard,
} from '../core/guards/auth.guard';

import { Dashboard } from '../features/dashboard/dashboard';
import { Clients } from '../features/clients/clients';
import { Installations } from '../features/installations/installations';
import { Technicians } from '../features/technicians/technicians';
import { Incidents } from '../features/incidents/incidents';


export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('../features/login/login').then(m => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    canActivateChild: [permissionGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: Dashboard,
        data: { permission: 'dashboard.view' },
      },
      {
        path: 'clientes',
        component: Clients,
        data: { permission: 'clients.view' },
      },
      {
        path: 'instalaciones',
        component: Installations,
        data: { permission: 'installations.view' },
      },
      {
        path: 'tecnicos',
        component: Technicians,
        data: { permission: 'technicians.view' },
      },
      {
        path: 'incidencias',
        component: Incidents,
        data: { permission: 'incidents.view' },
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('../features/users/users').then(m => m.Users),
        data: { permission: 'users.view' },
      },
      
      {
        path: 'perfil',
        loadComponent: () =>
          import('../features/profile/profile').then(m => m.Profile),
      },

      {
      path: 'configuracion',
      loadComponent: () =>
        import('../features/configuration/configuration').then(
          (m) => m.Configuration
        ),
      data: { permission: 'settings.view' },
    },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
