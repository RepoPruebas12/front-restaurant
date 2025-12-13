import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  stats = [
    {
      title: 'Ventas Hoy',
      value: 'S/ 2,450',
      change: '+12.5%',
      changeType: 'increase',
      icon: 'cash'
    },
    {
      title: 'Órdenes Activas',
      value: '18',
      change: '+5',
      changeType: 'increase',
      icon: 'orders'
    },
    {
      title: 'Mesas Ocupadas',
      value: '12/20',
      change: '60%',
      changeType: 'neutral',
      icon: 'tables'
    },
    {
      title: 'Ticket Promedio',
      value: 'S/ 85',
      change: '+8.2%',
      changeType: 'increase',
      icon: 'ticket'
    }
  ];

  recentOrders = [
    { id: '#1234', table: 'Mesa 5', items: 3, total: 'S/ 125', status: 'Preparando', time: '5 min' },
    { id: '#1235', table: 'Mesa 2', items: 5, total: 'S/ 230', status: 'Listo', time: '2 min' },
    { id: '#1236', table: 'Mesa 8', items: 2, total: 'S/ 78', status: 'Pendiente', time: '1 min' },
    { id: '#1237', table: 'Mesa 12', items: 4, total: 'S/ 180', status: 'Entregado', time: 'Ahora' },
  ];
}
