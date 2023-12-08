import { Component, OnInit } from '@angular/core';
import { LoginRequest } from '../../models/login-request';
import { AuthService } from '../../services/auth-service/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService) { }

  loginForm: FormGroup = new FormGroup({
    username: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required])
  });

  ngOnInit(): void {
    this.authService.logout(false);
  }

  login() {

    if (!this.loginForm.valid)
      return;

    let loginRequest = new LoginRequest(this.loginForm.get('username')?.value, this.loginForm.get('password')?.value);

    this.authService.login(loginRequest);
  }
}
