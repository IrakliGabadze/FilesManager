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

  hasAnyRole(mustHaveRoles: string[]): boolean {

    return mustHaveRoles.some(role => this.Roles?.includes(role)) == true;
  }
}
