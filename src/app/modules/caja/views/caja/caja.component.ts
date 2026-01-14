import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MesasApiService } from '../../../mesas/services/mesas-api.service';
import { OrdenesApiService } from '../../../ordenes/services/ordenes-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Mesa } from '../../../mesas/interfaces/mesa.interface';

interface MesaConOrden extends Mesa {
  total?: number;
}

@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css']
})
export class CajaComponent implements OnInit {
  mesas: Mesa[] = [];
  mesasConCuenta: MesaConOrden[] = [];
  isLoading = false;

  constructor(
    private mesasApiService: MesasApiService,
    private ordenesApiService: OrdenesApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarMesasConCuenta();
  }

  cargarMesasConCuenta() {
    this.isLoading = true;
    const restauranteId = this.authService.currentUserValue?.restaurante_id || 1;

    this.mesasApiService.listarMesas(restauranteId).subscribe({
      next: (response) => {
        // Filtrar solo mesas que piden cuenta (estado_id = 2)
        const mesasRojas = response.data.filter((m: Mesa) => m.estado_id === 2);

        // Cargar total de cada mesa
        this.cargarTotalesMesas(mesasRojas);
      },
      error: (error) => {
        console.error('Error al cargar mesas:', error);
        this.isLoading = false;
      }
    });
  }

  cargarTotalesMesas(mesas: Mesa[]) {
    if (mesas.length === 0) {
      this.mesasConCuenta = [];
      this.isLoading = false;
      return;
    }

    let cargadas = 0;
    this.mesasConCuenta = [];

    mesas.forEach(mesa => {
      this.ordenesApiService.obtenerOrdenMesa(mesa.id).subscribe({
        next: (response) => {
          if (response.data && Object.keys(response.data).length > 0) {
            const data: any = response.data;
            this.mesasConCuenta.push({
              ...mesa,
              total: data.orden.total
            });
          }

          cargadas++;
          if (cargadas === mesas.length) {
            this.isLoading = false;
            // Ordenar por número de mesa
            this.mesasConCuenta.sort((a, b) => a.numero - b.numero);
          }
        },
        error: () => {
          cargadas++;
          if (cargadas === mesas.length) {
            this.isLoading = false;
          }
        }
      });
    });
  }

  irACobrar(mesa: MesaConOrden) {
    this.router.navigate(['/caja/cobrar'], {
      queryParams: {
        mesa_id: mesa.id
      }
    });
  }
}
