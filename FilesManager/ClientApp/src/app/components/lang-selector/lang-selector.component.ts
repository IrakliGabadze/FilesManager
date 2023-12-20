import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-lang-selector',
  templateUrl: './lang-selector.component.html',
  styleUrl: './lang-selector.component.css'
})
export class LangSelectorComponent {

  constructor(public translateService:TranslateService){}

  changeLanguage(selectedLanguage:string){

    localStorage.setItem('selectedLanguage', selectedLanguage);

    this.translateService.use(selectedLanguage);
  }
}
