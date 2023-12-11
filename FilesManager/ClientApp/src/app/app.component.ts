import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { AuthService } from "./services/auth-service/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {

  title: string = "FilesManager";
}
