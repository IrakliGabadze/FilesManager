import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { AuthService } from "./services/auth-service/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  title: string = "FilesManager";

  constructor(private authService: AuthService){ }

  ngOnInit(): void {
      this.authService.getCurrentUser();
  }
}
