import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { DashboardComponent } from './features/dashboard/pages/dashboard/dashboard';
import { TablesDashboardComponent } from './features/tables/pages/tables-dashboard/tables-dashboard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'tables',
        component: TablesDashboardComponent
      }
      // TODO: Descomentar cuando crees estos componentes
      // {
      //   path: 'orders',
      //   loadComponent: () => import('./features/orders/pages/orders-list/orders-list.component').then(m => m.OrdersListComponent)
      // },
      // {
      //   path: 'menu',
      //   loadComponent: () => import('./features/menu/pages/menu-list/menu-list.component').then(m => m.MenuListComponent)
      // },
      // {
      //   path: 'kitchen',
      //   loadComponent: () => import('./features/kitchen/pages/kitchen-display/kitchen-display.component').then(m => m.KitchenDisplayComponent)
      // },
      // {
      //   path: 'cashier',
      //   loadComponent: () => import('./features/cashier/pages/checkout/checkout.component').then(m => m.CheckoutComponent)
      // }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
