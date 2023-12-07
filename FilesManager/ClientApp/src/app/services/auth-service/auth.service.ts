import { Injectable, signal } from '@angular/core';
import { AuthUser } from '../../models/auth-user';
import { HttpClientService } from '../http-client/http-client.service';
import { environment } from '../../../environments/environment';
import { AuthUserResponse } from '../../models/auth-user-response';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, public http: HttpClientService) {
    this.authApiControllerAddress = `${environment.filesApiBaseAddress}Auth`
  }

  authApiControllerAddress!: string;

  authUserSig = signal<AuthUser>(new AuthUser());

  async getCurrentUser() {
    let url = `${this.authApiControllerAddress}/GetCurrentUser`;

    let authUser = new AuthUser();

    try {
      let currentUserResponse = await this.http.get<AuthUserResponse>(url);

      if (currentUserResponse != null) {
        authUser.isAuthenticated = true;
        authUser.username = currentUserResponse.Username;
        authUser.roles = currentUserResponse.Roles;
      }
    }
    catch {
      //ignore
    }

    this.authUserSig.set(authUser);

    if (!authUser.isAuthenticated)
      this.router.navigate(['/login']);
  }

  async logout() {

    this.authUserSig.set(new AuthUser());

    let url = `${this.authApiControllerAddress}/Logout`;

    await this.http.get(url);

    this.router.navigate(['/login']);
  }
}
