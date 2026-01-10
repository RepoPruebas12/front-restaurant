import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MesasApiService } from '../../services/mesas-api.service';
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
  isLoading = false;
  showModal = false;
  mesaSeleccionada: Mesa | null = null;
  comensalesTemp = 0;
  salonSeleccionado: number | null = null;

  constructor(
    private mesasApiService: MesasApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cargarSalones();
    this.cargarMesas();
  }

  cargarSalones() {
    const restauranteId = this.authService.currentUserValue?.restaurante_id || 1;

    this.mesasApiService.listarSalones(restauranteId).subscribe({
      next: (response) => {
        this.salones = response.data;
        // Seleccionar el primer salón por defecto
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
        this.aplicarFiltro();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar mesas:', error);
        this.isLoading = false;
      }
    });
  }

  aplicarFiltro() {
    if (this.salonSeleccionado === null) {
      this.mesasFiltradas = this.mesas;
    } else {
      this.mesasFiltradas = this.mesas.filter(m => m.salon_id === this.salonSeleccionado);
    }
  }

  filtrarPorSalon(salonId: number) {
    this.salonSeleccionado = salonId;
    this.aplicarFiltro();
  }

  abrirModal(mesa: Mesa) {
    this.mesaSeleccionada = mesa;
    this.comensalesTemp = mesa.comensales;
    this.showModal = true;
  }

  cerrarModal() {
    this.showModal = false;
    this.mesaSeleccionada = null;
  }

  cambiarEstado(nuevoEstadoId: number) {
    if (!this.mesaSeleccionada) return;

    const comensales = nuevoEstadoId === 0 ? 0 : this.comensalesTemp;

    const data = {
      mesa_id: this.mesaSeleccionada.id,
      estado_id: nuevoEstadoId,
      comensales: comensales
    };

    this.mesasApiService.actualizarEstadoMesa(data).subscribe({
      next: () => {
        this.cargarMesas();
        this.cerrarModal();
      },
      error: (error) => {
        console.error('Error al actualizar mesa:', error);
      }
    });
  }

  registrarMesa() {
    if (!this.mesaSeleccionada) return;

    if (this.comensalesTemp < 1) {
      alert('Debe seleccionar al menos 1 comensal');
      return;
    }

    this.cambiarEstado(1);
  }

  incrementarComensales() {
    if (this.comensalesTemp < 10) {
      this.comensalesTemp++;
    }
  }

  decrementarComensales() {
    if (this.comensalesTemp > 0) {
      this.comensalesTemp--;
    }
  }
}
