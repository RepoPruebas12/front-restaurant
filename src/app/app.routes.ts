import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';
import { LayoutComponent } from './shared/components/layout/layout.component';

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
    path: '',
    component: LayoutComponent,
    canActivate: [roleGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./modules/dashboard/views/dashboard/dashboard.component').then(m => m.DashboardComponent),
        data: { roles: ['admin', 'mesero', 'cocina', 'caja'] }
      },
      {
        path: 'mesas',
        loadComponent: () => import('./modules/mesas/views/mesas/mesas.component').then(m => m.MesasComponent),
        data: { roles: ['admin', 'mesero'] }
      },
      {
        path: 'productos',
        loadComponent: () => import('./modules/productos/views/productos/productos.component').then(m => m.ProductosComponent),
        data: { roles: ['admin', 'mesero', 'cocina', 'caja'] }
      }
    ]
  }
];
