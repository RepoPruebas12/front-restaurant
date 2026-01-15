import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mesa } from '../../interfaces/mesa.interface';

@Component({
  selector: 'app-modal-comensales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-comensales.component.html',
  styleUrls: ['./modal-comensales.component.css']
})
export class ModalComensalesComponent {
  @Input() mesa: Mesa | null = null;
  @Input() comensales: number = 0;

  @Output() cerrar = new EventEmitter<void>();
  @Output() registrar = new EventEmitter<void>();
  @Output() incrementar = new EventEmitter<void>();
  @Output() decrementar = new EventEmitter<void>();

  onCerrar() {
    this.cerrar.emit();
  }

  onRegistrar() {
    this.registrar.emit();
  }

  onIncrementar() {
    this.incrementar.emit();
  }

  onDecrementar() {
    this.decrementar.emit();
  }
}
