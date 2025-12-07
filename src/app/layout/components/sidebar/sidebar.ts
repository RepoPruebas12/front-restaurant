import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent {
  menuItems = [
    {
      title: 'Dashboard',
      icon: 'home',
      route: '/dashboard',
      active: true
    },
    {
      title: 'Órdenes',
      icon: 'clipboard',
      route: '/orders',
      active: false
    },
    {
      title: 'Menú',
      icon: 'book',
      route: '/menu',
      active: false
    },
    {
      title: 'Mesas',
      icon: 'grid',
      route: '/tables',
      active: false
    },
    {
      title: 'Cocina',
      icon: 'chef',
      route: '/kitchen',
      active: false
    },
    {
      title: 'Caja',
      icon: 'cash',
      route: '/cashier',
      active: false
    },
    {
      title: 'Reportes',
      icon: 'chart',
      route: '/reports',
      active: false
    }
  ];

  userInfo = {
    name: 'Daniel Dev',
    role: 'Administrador',
    avatar: 'https://ui-avatars.com/api/?name=Daniel+Dev&background=4F46E5&color=fff'
  };
}
