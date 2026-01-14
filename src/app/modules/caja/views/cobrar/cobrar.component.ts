import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdenesApiService } from '../../../ordenes/services/ordenes-api.service';
import { MesasApiService } from '../../../mesas/services/mesas-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Orden, OrdenItem } from '../../../ordenes/interfaces/orden.interface';
import { Mesa } from '../../../mesas/interfaces/mesa.interface';
import { ToastService } from '../../../../core/services/toast.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-cobrar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cobrar.component.html',
  styleUrls: ['./cobrar.component.css']
})
export class CobrarComponent implements OnInit {
  mesaId: number = 0;
  mesa: Mesa | null = null;
  orden: Orden | null = null;
  items: OrdenItem[] = [];
  metodoPago: string = 'efectivo';
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordenesApiService: OrdenesApiService,
    private mesasApiService: MesasApiService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.mesaId = parseInt(params['mesa_id']);

      if (!this.mesaId) {
        this.router.navigate(['/mesas']);
        return;
      }

      this.cargarDatos();
    });
  }

  cargarDatos() {
    this.isLoading = true;

    // Cargar datos de la mesa
    const restauranteId = this.authService.currentUserValue?.restaurante_id || 1;
    this.mesasApiService.listarMesas(restauranteId).subscribe({
      next: (response) => {
        this.mesa = response.data.find((m: Mesa) => m.id === this.mesaId) || null;
      }
    });

    // Cargar orden
    this.ordenesApiService.obtenerOrdenMesa(this.mesaId).subscribe({
      next: (response) => {
        if (response.data && Object.keys(response.data).length > 0) {
          const data: any = response.data;
          this.orden = data.orden;
          this.items = data.items || [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar orden:', error);
        this.toastService.error('Error', 'No se pudo cargar la orden');
        this.isLoading = false;
      }
    });
  }

  getItemsPorEnvio(envioNumero: number): OrdenItem[] {
    return this.items.filter(i => i.envio_numero === envioNumero);
  }

  getEnviosUnicos(): number[] {
    return [...new Set(this.items.map(i => i.envio_numero))].sort();
  }

  seleccionarMetodo(metodo: string) {
    this.metodoPago = metodo;
  }

  procederPago() {
    if (!this.orden) return;

    const loadingToast = this.toastService.loading('Procesando pago...');

    this.ordenesApiService.cobrarOrden(this.orden.id).subscribe({
      next: () => {
        toast.dismiss(loadingToast);
        this.toastService.success(
          '✅ Pago procesado',
          `S/ ${this.orden!.total} cobrado en ${this.metodoPago}`
        );
        setTimeout(() => {
          this.router.navigate(['/mesas']);
        }, 1500);
      },
      error: (error) => {
        toast.dismiss(loadingToast);
        console.error('Error al procesar pago:', error);
        this.toastService.error('❌ Error', 'No se pudo procesar el pago');
      }
    });
  }

  volver() {
    this.router.navigate(['/mesas']);
  }
}
