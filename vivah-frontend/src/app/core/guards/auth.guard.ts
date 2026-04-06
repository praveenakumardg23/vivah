import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { UserRole } from '../../shared/models/user.model';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (!tokenService.hasToken()) {
    router.navigate(['/']);
    return false;
  }

  const requiredRoles = route.data?.['roles'] as UserRole[] | undefined;

  if (requiredRoles && requiredRoles.length > 0) {
    const userRole = tokenService.getRole() as UserRole;
    if (!requiredRoles.includes(userRole)) {
      router.navigate(['/']);
      return false;
    }
  }

  return true;
};