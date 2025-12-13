import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./modules/auth/views/login/login.component').then(m => m.LoginComponent)
  },
    {
    path: 'dashboard',
    loadComponent: () => import('./modules/dashboard/pages/dashboard/dashboard').then(m => m.DashboardComponent)
  }
];
