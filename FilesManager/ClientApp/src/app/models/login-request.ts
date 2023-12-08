export class LoginRequest {

  constructor(username: string, password: string) {
    this.Username = username;
    this.Password = password;
  }

  Username: string;

  Password: string;
}
