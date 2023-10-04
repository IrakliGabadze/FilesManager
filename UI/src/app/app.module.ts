import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { FilesModule } from './modules/files/files.module';
import { AppRoutingModule } from './app-routing.module';

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
    ]
})
export class AppModule {
}
