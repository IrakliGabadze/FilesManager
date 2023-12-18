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

  constructor(private router: Router, private authService: AuthService, private httpClient: HttpClient) {
    this.apiUrl = `${authService.authApiControllerAddress}/GetCurrentUser`;
  }

  apiUrl!:string;

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const roles = next.data['roles'] as Array<string>;

    let authUserFromSig = this.authService.authUserSig();

    if (authUserFromSig.hasJustUpdated() && (!(roles?.length > 0) || authUserFromSig.hasAnyRole(roles)))
      return true;

    let authUser = new AuthUser();

    this.httpClient.get<AuthUserResponse>(this.apiUrl, { withCredentials: true }).subscribe({

      next: (res) => {
        if (res != null)
          authUser.update(res);
        else
          authUser.LastUpdatedAt = new Date(Date.now());

        this.authService.authUserSig.set(authUser);

        if (!(roles?.length > 0) || authUser.hasAnyRole(roles)) {
          this.router.navigateByUrl(state.url == '/' ? 'home' : state.url);
        }
        else {
          this.router.navigateByUrl('login');
        }
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
