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
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    public httpClientServcie: HttpClientService,
    private httpClient: HttpClient,
    private _snackBarService: SnackBarService,
    private translate: TranslateService) {
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
        authUser.update(authUserResponse);
      }
      else {
        this._snackBarService.openSnackBar(SnackBarType.Error, this.translate.instant("IncorrectUsernameOrPassword"));
      }
    }
    catch (e) {

      console.log(e) //TODO handle error

      this._snackBarService.openSnackBar(SnackBarType.Error, this.translate.instant(HttpClientService.errorOperationMessage));

      throw e;
    }

    this.authUserSig.set(authUser);

    if (authUser.IsAuthenticated)
      this.router.navigateByUrl("files");
  }

  async getCurrentUser() {
    let url = `${this.authApiControllerAddress}/GetCurrentUser`;

    let authUser = new AuthUser();

    try {
      let currentUserResponse = await this.httpClientServcie.get<AuthUserResponse>(url);

      if (currentUserResponse != null) {
        authUser.update(currentUserResponse);
      }
    }
    catch {
      //ignore
    }

    this.authUserSig.set(authUser);
  }

  async logout(redirectToLoginPage: boolean = true) {

    let url = `${this.authApiControllerAddress}/Logout`;

    await this.httpClientServcie.get(url);

    this.authUserSig.set(new AuthUser());

    if (redirectToLoginPage)
      this.router.navigate(['/login']);
  }
}
