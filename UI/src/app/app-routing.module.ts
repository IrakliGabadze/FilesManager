import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/files/pages/home/home.component';
import { FilesComponent } from './modules/files/pages/files/files.component';
import { AboutComponent } from './modules/files/pages/about/about.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'files', component: FilesComponent },
  { path: 'about', component:  AboutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
