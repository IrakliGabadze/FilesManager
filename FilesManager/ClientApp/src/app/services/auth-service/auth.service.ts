import { Injectable, signal } from '@angular/core';
import { AuthUser } from '../../models/auth-user';
import { HttpClientService } from '../http-client/http-client.service';
import { environment } from '../../../environments/environment';
import { AuthUserResponse } from '../../models/auth-user-response';
import { Router } from '@angular/router';
import { LoginRequest } from '../../models/login-request';
import { SnackBarService } from '../snack-bar/snack-bar.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SnackBarType } from '../../enums/snack-bar-type';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, public httpClientServcie: HttpClientService, private httpClient: HttpClient, private _snackBarService: SnackBarService) {
    this.authApiControllerAddress = `${environment.filesApiBaseAddress}Auth`
  }

  authApiControllerAddress!: string;

  authUserSig = signal<AuthUser>(new AuthUser());

  async login(loginRequest: LoginRequest) {

    let url = `${this.authApiControllerAddress}/Login`;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    let authUser = new AuthUser();

    try {

      let authUserResponse = await lastValueFrom(this.httpClient.post<AuthUserResponse>(url, loginRequest, { headers, withCredentials: true }));

      if (authUserResponse != null) {
        authUser.isAuthenticated = true;
        authUser.username = authUserResponse.Username;
        authUser.roles = authUserResponse.Roles;
      }
      else {
        this._snackBarService.openSnackBar(SnackBarType.Error, "Username or password is incorrect !!!");
      }
    }
    catch (e) {

      console.log(e) //TODO handle error

      this._snackBarService.openSnackBar(SnackBarType.Error, HttpClientService.errorOperationMessage);

      throw e;
    }

    this.authUserSig.set(authUser);

    if (authUser.isAuthenticated)
      this.router.navigateByUrl("files");
  }

  async getCurrentUser() {
    let url = `${this.authApiControllerAddress}/GetCurrentUser`;

    let authUser = new AuthUser();

    try {
      let currentUserResponse = await this.httpClientServcie.get<AuthUserResponse>(url);

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

  async logout(redirectToLoginPage: boolean = true) {

    let url = `${this.authApiControllerAddress}/Logout`;

    await this.httpClientServcie.get(url);

    this.authUserSig.set(new AuthUser());

    this.router.navigate(['/login']);
  }
}
