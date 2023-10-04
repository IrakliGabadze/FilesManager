import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FolderItemComponent } from './components/folder-item.component';
import { FilesComponent } from './pages/files/files.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';

@NgModule({

  declarations: [
    FolderItemComponent,
    FilesComponent,
    HomeComponent,
    AboutComponent
  ],

  imports: [
    CommonModule
  ],
  exports:[
    FolderItemComponent,
    FilesComponent
  ]
})

export class FilesModule { }
