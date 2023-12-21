import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FilesComponent } from './pages/files/files.component';
import { AboutComponent } from './pages/about/about.component';
import { AuthGuard } from './services/auth-guard.service';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  { path: '', component: FilesComponent, canActivate: [AuthGuard], data: { roles: ['Administrator']}  },
  { path: 'files', component: FilesComponent, canActivate: [AuthGuard], data: { roles: ['Administrator']} },
  { path: 'about', component:  AboutComponent, canActivate: [AuthGuard] },
  { path: 'login', component:  LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
