import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mesa } from '../../interfaces/mesa.interface';

@Component({
  selector: 'app-modal-cobro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-cobro.component.html',
  styleUrls: ['./modal-cobro.component.css']
})
export class ModalCobroComponent {
  @Input() mesa: Mesa | null = null;
  @Input() orden: any = null;
  @Input() items: any[] = [];
  @Input() metodoPago: string = 'efectivo';

  @Output() cerrar = new EventEmitter<void>();
  @Output() cobrar = new EventEmitter<void>();
  @Output() cambiarMetodo = new EventEmitter<string>();

  onCerrar() {
    this.cerrar.emit();
  }

  onCobrar() {
    this.cobrar.emit();
  }

  onCambiarMetodo(metodo: string) {
    this.cambiarMetodo.emit(metodo);
  }

  getItemsPorEnvio(envioNumero: number): any[] {
    return this.items.filter(i => i.envio_numero === envioNumero);
  }

  getEnviosUnicos(): number[] {
    return [...new Set(this.items.map(i => i.envio_numero))].sort();
  }
}
