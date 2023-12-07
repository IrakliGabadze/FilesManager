export class AuthUser {

  constructor(public isAuthenticated: boolean = false, public username: string | undefined = undefined, public roles: string[] | undefined = undefined) {}

  hasAnyRole(mustHaveRoles: string[]): boolean {

    return mustHaveRoles.some(role => this.roles?.includes(role)) == true;
  }
}
