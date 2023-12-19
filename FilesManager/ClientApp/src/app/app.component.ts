import { Component, ViewEncapsulation } from "@angular/core";
import { AuthService } from "./services/auth-service/auth.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {

  constructor(public authService: AuthService, private translateService: TranslateService) {
    this.translateService.setDefaultLang('en');
    this.translateService.use(localStorage.getItem('selectedLanguage') || 'en');
  }

  title: string = "FilesManager";
}
