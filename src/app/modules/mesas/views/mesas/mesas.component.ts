import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MesasApiService } from '../../services/mesas-api.service';
import { OrdenesApiService } from '../../../ordenes/services/ordenes-api.service';
import { Mesa, Salon } from '../../interfaces/mesa.interface';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-mesas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mesas.component.html',
  styleUrls: ['./mesas.component.css']
})
export class MesasComponent implements OnInit {
  mesas: Mesa[] = [];
  mesasFiltradas: Mesa[] = [];
  salones: Salon[] = [];
  salonSeleccionado: number | null = null;

  // Modal comensales
  showModal = false;
  mesaSeleccionada: Mesa | null = null;
  comensalesTemp = 0;

  // Modal cobro
  showModalCobro = false;
  ordenCobro: any = null;
  itemsCobro: any[] = [];
  metodoPago: string = 'efectivo';

  isLoading = false;

  constructor(
    private mesasApiService: MesasApiService,
    private ordenesApiService: OrdenesApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  get esRolCaja(): boolean {
    const rol = this.authService.currentUserValue?.rol;
    return rol === 'caja' || rol === 'admin';
  }

  ngOnInit() {
    this.cargarSalones();
    this.cargarMesas();
  }

  cargarSalones() {
    const restauranteId = this.authService.currentUserValue?.restaurante_id || 1;

    this.mesasApiService.listarSalones(restauranteId).subscribe({
      next: (response) => {
        this.salones = response.data;
        if (this.salones.length > 0) {
          this.salonSeleccionado = this.salones[0].id;
          this.filtrarPorSalon(this.salonSeleccionado);
        }
      },
      error: (error) => {
        console.error('Error al cargar salones:', error);
      }
    });
  }

  cargarMesas() {
    this.isLoading = true;
    const restauranteId = this.authService.currentUserValue?.restaurante_id || 1;

    this.mesasApiService.listarMesas(restauranteId).subscribe({
      next: (response) => {
        this.mesas = response.data;
        this.filtrarPorSalon(this.salonSeleccionado);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar mesas:', error);
        this.isLoading = false;
      }
    });
  }

  filtrarPorSalon(salonId: number | null) {
    this.salonSeleccionado = salonId;

    if (salonId === null) {
      this.mesasFiltradas = this.mesas;
    } else {
      this.mesasFiltradas = this.mesas.filter(mesa => mesa.salon_id === salonId);
    }
  }

  abrirModal(mesa: Mesa) {
    // Si es CAJA y mesa pide cuenta → Abrir modal cobro
    if (this.esRolCaja && mesa.estado_id === 2) {
      this.abrirModalCobro(mesa);
      return;
    }

    // Si la mesa está libre, registrar comensales primero
    if (mesa.estado_id === 0) {
      this.mesaSeleccionada = mesa;
      this.comensalesTemp = 0;
      this.showModal = true;
    } else {
      // Si está ocupada, ir a tomar orden
      this.router.navigate(['/ordenes/tomar-orden'], {
        queryParams: {
          mesa_id: mesa.id,
          mesa_numero: mesa.numero
        }
      });
    }
  }

  cerrarModal() {
    this.showModal = false;
    this.mesaSeleccionada = null;
    this.comensalesTemp = 0;
  }

  incrementarComensales() {
    if (this.mesaSeleccionada && this.comensalesTemp < this.mesaSeleccionada.capacidad) {
      this.comensalesTemp++;
    }
  }

  decrementarComensales() {
    if (this.comensalesTemp > 0) {
      this.comensalesTemp--;
    }
  }

  registrarMesa() {
    if (!this.mesaSeleccionada) return;

    if (this.comensalesTemp < 1) {
      alert('Debe seleccionar al menos 1 comensal');
      return;
    }

    // Cambiar mesa a ocupada
    const data = {
      mesa_id: this.mesaSeleccionada.id,
      estado_id: 1,
      comensales: this.comensalesTemp
    };

    this.mesasApiService.actualizarEstadoMesa(data).subscribe({
      next: () => {
        // Ir a tomar orden
        this.router.navigate(['/ordenes/tomar-orden'], {
          queryParams: {
            mesa_id: this.mesaSeleccionada!.id,
            mesa_numero: this.mesaSeleccionada!.numero
          }
        });
        this.cerrarModal();
      },
      error: (error) => {
        console.error('Error al actualizar mesa:', error);
      }
    });
  }

  cambiarEstado(estado_id: number) {
    if (!this.mesaSeleccionada) return;

    const data = {
      mesa_id: this.mesaSeleccionada.id,
      estado_id: estado_id,
      comensales: estado_id === 0 ? 0 : this.mesaSeleccionada.comensales
    };

    this.mesasApiService.actualizarEstadoMesa(data).subscribe({
      next: () => {
        this.cargarMesas();
        this.cerrarModal();
      },
      error: (error) => {
        console.error('Error al cambiar estado:', error);
      }
    });
  }

  // MÉTODOS PARA MODAL COBRO

  abrirModalCobro(mesa: Mesa) {
    this.mesaSeleccionada = mesa;

    // Cargar orden de la mesa
    this.ordenesApiService.obtenerOrdenMesa(mesa.id).subscribe({
      next: (response) => {
        if (response.data && Object.keys(response.data).length > 0) {
          const data: any = response.data;
          this.ordenCobro = data.orden;
          this.itemsCobro = data.items || [];
          this.metodoPago = 'efectivo';
          this.showModalCobro = true;
        }
      },
      error: (error) => {
        console.error('Error al cargar orden:', error);
      }
    });
  }

  cerrarModalCobro() {
    this.showModalCobro = false;
    this.mesaSeleccionada = null;
    this.ordenCobro = null;
    this.itemsCobro = [];
  }

  cobrar() {
    if (!this.ordenCobro) return;

    if (!confirm(`¿Cobrar S/ ${this.ordenCobro.total}?`)) return;

    this.ordenesApiService.cobrarOrden(this.ordenCobro.id).subscribe({
      next: () => {
        alert('Orden cobrada exitosamente');
        // TODO: Aquí iría la impresión de boleta
        this.cerrarModalCobro();
        this.cargarMesas();
      },
      error: (error) => {
        console.error('Error al cobrar:', error);
        alert('Error al cobrar orden');
      }
    });
  }

  getItemsPorEnvio(envioNumero: number): any[] {
    return this.itemsCobro.filter(i => i.envio_numero === envioNumero);
  }

  getEnviosUnicos(): number[] {
    return [...new Set(this.itemsCobro.map(i => i.envio_numero))].sort();
  }
}
