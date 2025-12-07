import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../components/sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  isSidebarOpen = true;
  private resizeListener: any;

  ngOnInit() {
    // Configurar estado inicial según tamaño de pantalla
    this.checkScreenSize();

    // Escuchar cambios de tamaño
    this.resizeListener = () => this.checkScreenSize();
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnDestroy() {
    // Limpiar listener
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  checkScreenSize() {
    if (typeof window !== 'undefined') {
      // Cerrar sidebar en pantallas menores a 1024px
      this.isSidebarOpen = window.innerWidth >= 1024;
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
