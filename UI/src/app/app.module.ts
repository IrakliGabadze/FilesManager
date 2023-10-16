import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FolderItemComponent } from './components/folder-item/folder-item.component';
import { FilesComponent } from './pages/files/files.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { PathNavigatorComponent } from './components/path-navigator/path-navigator.component';
import { MatCardModule } from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import { ContextMenuComponent } from './components/context-menu/context-menu.component';

@NgModule({
    bootstrap: [AppComponent],
    declarations: [
      AppComponent,
      FolderItemComponent,
      FilesComponent,
      HomeComponent,
      AboutComponent,
      PathNavigatorComponent,
      ContextMenuComponent],
    imports: [
      RouterModule,
      AppRoutingModule,
      BrowserModule,
      HttpClientModule,
      BrowserAnimationsModule,
      MatToolbarModule,
      MatButtonModule,
      MatIconModule,
      MatCardModule,
      MatIconModule,
      MatMenuModule
    ]
  })
  export class AppModule {
  }
