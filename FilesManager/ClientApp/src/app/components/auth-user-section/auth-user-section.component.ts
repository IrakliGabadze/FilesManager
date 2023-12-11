import { Component } from '@angular/core';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'auth-user-section',
  templateUrl: './auth-user-section.component.html',
  styleUrl: './auth-user-section.component.css'
})
export class AuthUserSectionComponent {
   constructor(public authService: AuthService){ }

  async logout() {
    await this.authService.logout();
  }
}
