import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth-service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const roles = next.data['roles'] as Array<string>;

    if (!(roles?.length > 0) || this.authService.authUserSig().hasAnyRole(roles))
      return true;

    this.router.navigate(['/login']);

    return false;
  }
}

export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(PermissionsService).canActivate(next, state);
}
