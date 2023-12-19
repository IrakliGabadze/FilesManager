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
import { MatMenuModule } from '@angular/material/menu';
import { ContextMenuComponent } from './components/context-menu/context-menu.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RenameFolderItemFormComponent } from './components/rename-folder-item-form/rename-folder-item-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { DialogsBaseComponent } from './components/dialogs-base/dialogs-base.component';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { UploadFilesComponent } from './components/upload-files/upload-files.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthUserSectionComponent } from './components/auth-user-section/auth-user-section.component';
import { CreateFolderFormComponent } from './components/create-folder-form/create-folder-form.component';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    FolderItemComponent,
    FilesComponent,
    HomeComponent,
    AboutComponent,
    PathNavigatorComponent,
    ContextMenuComponent,
    ConfirmationDialogComponent,
    RenameFolderItemFormComponent,
    DialogsBaseComponent,
    AudioPlayerComponent,
    VideoPlayerComponent,
    CarouselComponent,
    UploadFilesComponent,
    LoginComponent,
    AuthUserSectionComponent,
    CreateFolderFormComponent
  ],
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
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [{
    provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {
      hasBackdrop: true,
      disableClose: true,
      minWidth: '250px',
      width: '95vw',
      maxWidth: '95vw',
      minHeight: '250px',
      height: '95vh',
      maxHeight: '95vh',
      autoFocus: false
    }
  },
  {
    provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' }
  }
  ]
})
export class AppModule {
}
