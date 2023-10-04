import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NavigationModule } from '@progress/kendo-angular-navigation';
import { AppComponent } from './app.component';
import { LayoutModule } from '@progress/kendo-angular-layout';
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
      NavigationModule,
      LayoutModule
    ]
})
export class AppModule {
}
