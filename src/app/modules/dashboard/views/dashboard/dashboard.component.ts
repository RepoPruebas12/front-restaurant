import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">¡Bienvenido, {{ userName }}!</h1>
      <p class="text-gray-600 mb-8">Rol: <span class="font-semibold capitalize">{{ userRole }}</span></p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-gray-500 text-sm font-medium">Ventas Hoy</h3>
          <p class="text-3xl font-bold text-gray-900 mt-2">S/ 2,450</p>
          <span class="text-green-600 text-sm">+12.5% vs ayer</span>
        </div>

        <!-- <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-gray-500 text-sm font-medium">Mesas libres </h3>
          <p class="text-3xl font-bold text-gray-900 mt-2">2</p>
          <span class="text-green-600 text-sm">/40</span>
        </div> -->

        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-gray-500 text-sm font-medium">Mesas Ocupadas</h3>
          <p class="text-3xl font-bold text-gray-900 mt-2">12/20</p>
          <span class="text-gray-600 text-sm">60%</span>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-gray-500 text-sm font-medium">compra Promedio</h3>
          <p class="text-3xl font-bold text-gray-900 mt-2">S/ 85</p>
          <span class="text-green-600 text-sm">+10% vs ayer</span>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  userName = '';
  userRole = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.currentUserValue;
    if (user) {
      this.userName = user.nombre;
      this.userRole = user.rol;
    }
  }
}
