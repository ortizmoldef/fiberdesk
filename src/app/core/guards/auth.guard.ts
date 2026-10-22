
import { inject } from '@angular/core';
import {
  CanActivateFn,
  CanActivateChildFn,
  Router,
} from '@angular/router';

import { AuthService } from '../services/auth.service';
import { Permission } from '../../shared/models/permission.model';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};

export const permissionGuard: CanActivateChildFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  const permission = route.data['permission'] as
    | Permission
    | undefined;

  // Si la ruta no requiere un permiso específico,
  // basta con que el usuario esté autenticado.
  if (!permission) {
    return true;
  }

  // Si tiene el permiso requerido, puede acceder.
  if (authService.hasPermission(permission)) {
    return true;
  }

  // Si no tiene permiso, vuelve al dashboard.
  return router.createUrlTree(['/dashboard']);
};

