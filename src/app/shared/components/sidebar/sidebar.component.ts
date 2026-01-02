import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Package, DollarSign, Users, BarChart3, Settings, Menu, X } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  readonly Package = Package;
  readonly DollarSign = DollarSign;
  readonly Users = Users;
  readonly BarChart3 = BarChart3;
  readonly Settings = Settings;
  readonly Menu = Menu;
  readonly X = X;

  isCollapsed = false;

  menuItems = [
    { path: '/productos', icon: this.Package, label: 'Productos' },
    { path: '/ventas', icon: this.DollarSign, label: 'Ventas' },
    { path: '/clientes', icon: this.Users, label: 'Clientes' },
    { path: '/reportes', icon: this.BarChart3, label: 'Reportes' },
    { path: '/configuracion', icon: this.Settings, label: 'Configuración' }
  ];

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
