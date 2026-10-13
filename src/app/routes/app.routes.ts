
import { Routes } from '@angular/router';

import { authGuard } from '../core/guards/auth.guard';

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
    children: [
      {
        path: '',
        component: Dashboard,
      },
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'clientes',
        component: Clients,
      },
      {
        path: 'instalaciones',
        component: Installations,
      },
      {
        path: 'tecnicos',
        component: Technicians,
      },
      {
        path: 'incidencias',
        component: Incidents,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
