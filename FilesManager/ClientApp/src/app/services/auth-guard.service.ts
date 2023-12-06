import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth-service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      const roles = next.data['roles'] as Array<string>;

    if (roles && roles.length > 0) {
      // Check if the user has any of the required roles
      if (this.authService.hasAnyRole(roles)) {
        return true;
      } else {
        // Redirect to unauthorized page or handle accordingly
        this.router.navigate(['/unauthorized']);
        return false;
      }
    } else {
      // No specific roles required, just check for authentication
      if (this.authService.isAuthenticated()) {
        return true;
      } else {
        // Redirect to login page or handle unauthorized access
        this.router.navigate(['/login']);
        return false;
      }
    }
  }
}

export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(PermissionsService).canActivate(next, state);
}
