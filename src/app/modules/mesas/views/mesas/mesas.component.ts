import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MesasApiService } from '../../services/mesas-api.service';
import { OrdenesApiService } from '../../../ordenes/services/ordenes-api.service';
import { Mesa, Salon } from '../../interfaces/mesa.interface';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ModalComensalesComponent } from '../../components/modal-comensales/modal-comensales.component';
import { ModalCobroComponent } from '../../components/modal-cobro/modal-cobro.component';

@Component({
  selector: 'app-mesas',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComensalesComponent, ModalCobroComponent],
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
    private router: Router,
    private toastService: ToastService
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
        this.toastService.error('Error', 'No se pudieron cargar los salones');
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
        this.toastService.error('Error', 'No se pudieron cargar las mesas');
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
    // Si es CAJA y mesa pide cuenta → Ir a cobrar
    if (this.esRolCaja && mesa.estado_id === 2) {
      this.router.navigate(['/caja/cobrar'], {
        queryParams: { mesa_id: mesa.id }
      });
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
      this.toastService.warning('Seleccione comensales', 'Debe tener al menos 1 comensal');
      return;
    }

    const data = {
      mesa_id: this.mesaSeleccionada.id,
      estado_id: 1,
      comensales: this.comensalesTemp
    };

    this.mesasApiService.actualizarEstadoMesa(data).subscribe({
      next: () => {
        this.toastService.success(
          'Mesa registrada',
          `Mesa ${this.mesaSeleccionada!.numero} con ${this.comensalesTemp} comensales`
        );
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
        this.toastService.error('Error', 'No se pudo registrar la mesa');
      }
    });
  }

  // MÉTODOS PARA MODAL COBRO

  cerrarModalCobro() {
    this.showModalCobro = false;
    this.mesaSeleccionada = null;
    this.ordenCobro = null;
    this.itemsCobro = [];
  }

  cambiarMetodoPago(metodo: string) {
    this.metodoPago = metodo;
  }

  cobrar() {
    if (!this.ordenCobro) return;

    this.ordenesApiService.cobrarOrden(this.ordenCobro.id).subscribe({
      next: () => {
        this.toastService.success('✅ Orden cobrada', `S/ ${this.ordenCobro.total}`);
        this.cerrarModalCobro();
        this.cargarMesas();
      },
      error: (error) => {
        console.error('Error al cobrar:', error);
        this.toastService.error('Error', 'No se pudo cobrar la orden');
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
