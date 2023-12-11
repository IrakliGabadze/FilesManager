import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth-service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor(private authService: AuthService) { }

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const roles = next.data['roles'] as Array<string>;

    await this.authService.getCurrentUser();

    if (!(roles?.length > 0) || this.authService.authUserSig().hasAnyRole(roles))
      return true;

    this.authService.logout();

    return false;
  }
}

export const AuthGuard: CanActivateFn = async (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> => {
  return await inject(PermissionsService).canActivate(next, state);
}
