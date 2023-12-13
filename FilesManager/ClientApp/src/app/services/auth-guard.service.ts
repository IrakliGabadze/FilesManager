import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth-service/auth.service';
import { HttpClient } from '@angular/common/http';
import { AuthUserResponse } from '../models/auth-user-response';
import { AuthUser } from '../models/auth-user';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor(private router: Router, private authService: AuthService, private httpClient: HttpClient) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const roles = next.data['roles'] as Array<string>;

    let url = `${this.authService.authApiControllerAddress}/GetCurrentUser`;

    let authUserFromSig = this.authService.authUserSig();

    if (!(roles?.length > 0) || (authUserFromSig.hasJustUpdated() && authUserFromSig.hasAnyRole(roles)))
      return true;

    let authUser = new AuthUser();

    this.httpClient.get<AuthUserResponse>(url, { withCredentials: true }).subscribe({

      next: (res) => {
        if (res != null) {
          authUser.update(res);
        }

        this.authService.authUserSig.set(authUser);

        if (!(roles?.length > 0) || authUser.hasAnyRole(roles))
          this.router.navigate([state.url]);
        else
          this.router.navigate(['/login']);
      },
      error: (error) => {
        //TODO handle error
        console.log(error);
      }
    });

    return false;
  }
}

export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(PermissionsService).canActivate(next, state);
}
