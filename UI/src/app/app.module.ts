import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { FilesModule } from './modules/files/files.module';
import { AppRoutingModule } from './app-routing.module';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';

@NgModule({
    bootstrap:    [AppComponent],
    declarations: [AppComponent],
    imports:      [
      RouterModule,
      AppRoutingModule,
      BrowserModule,
      BrowserAnimationsModule,
      FilesModule,
      HttpClientModule,
      MatToolbarModule,
      MatButtonModule,
      MatIconModule
    ]
})
export class AppModule {
}
