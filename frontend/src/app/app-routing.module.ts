import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExplorerComponent } from './components/dashboard/explorer/explorer.component';
import { LoginComponent } from './components/login/login.component';
import { IsLoggedInGuard } from './guards/is-logged-in.guard';
import { AuthService } from './services/auth.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [IsLoggedInGuard], children: [
    { path: 'explorer', component: ExplorerComponent }
  ]},
  { path: '**', redirectTo: 'explorer' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
