import { AuthUserResponse } from "./auth-user-response";

export class AuthUser {

  constructor(isAuthenticated: boolean = false, username: string | undefined = undefined, roles: string[] | undefined = undefined)
  {
    this.IsAuthenticated = isAuthenticated;
    this.Username = username;
    this.Roles = roles;
  }

  IsAuthenticated!: boolean;

  Username: string | undefined;

  Roles: string[] | undefined;

  LastUpdatedAt!: Date;

  hasAnyRole(mustHaveRoles: string[]): boolean {

    return mustHaveRoles.some(role => this.Roles?.includes(role)) == true;
  }

  hasJustUpdated() : boolean {
    return this.LastUpdatedAt > new Date(Date.now() - 1000);  
  }

  update(authUserResponse: AuthUserResponse) {
    this.IsAuthenticated = true;
    this.Username = authUserResponse.username;
    this.Roles = authUserResponse.roles;
    this.LastUpdatedAt = new Date(Date.now());
  }
}
