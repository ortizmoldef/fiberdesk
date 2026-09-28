import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard').then(
        (m) => m.Dashboard
      ),
  },
  {
    path: 'clients',
    loadComponent: () =>
      import('./features/clients/clients').then(
        (m) => m.Clients
      ),
  },
  {
    path: 'installations',
    loadComponent: () =>
      import('./features/installations/installations').then(
        (m) => m.Installations
      ),
  },
  {
    path: 'technicians',
    loadComponent: () =>
      import('./features/technicians/technicians').then(
        (m) => m.Technicians
      ),
  },
  {
    path: 'incidents',
    loadComponent: () =>
      import('./features/incidents/incidents').then(
        (m) => m.Incidents
      ),
  },
];