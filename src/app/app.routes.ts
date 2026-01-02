import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/productos',  // ← ejemplo temporal asi se usaran los routers , seguir la hilacion porfavor ,no complicarse
    pathMatch: 'full'
  },
  // {
  //   path: 'auth',
  //   loadChildren: () => import('./auth/routes/auth.routes').then(m => m.authRoutes)
  // },
  // {
  //   path: 'productos',
  //   loadChildren: () => import('./productos/routes/productos.routes').then(m => m.productosRoutes)
  // },
  // {
  //   path: '**',
  //   redirectTo: '/productos'  // ← Cambiar aquí también
  // }
];
