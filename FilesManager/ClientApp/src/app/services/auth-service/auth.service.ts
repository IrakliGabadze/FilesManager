import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authUserSig = signal

  hasAnyRole(roles: string[]): boolean {
          return true;
  }

  isAuthenticated(): boolean {
    return true;
  }

  constructor() { }
}
