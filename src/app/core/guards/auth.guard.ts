import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  const isAuthenticated = localStorage.getItem('fiberdesk_token');

  if (isAuthenticated) {
    return true;
  }

  return router.createUrlTree(['/login']);
};