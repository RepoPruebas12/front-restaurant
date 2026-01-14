import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdenesApiService } from '../../services/ordenes-api.service';
import { ProductosApiService } from '../../../productos/services/productos-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Orden, OrdenItem } from '../../interfaces/orden.interface';
import { Producto } from '../../../productos/interfaces/producto.interface';
import { MesasApiService } from '../../../mesas/services/mesas-api.service';

@Component({
  selector: 'app-tomar-orden',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tomar-orden.component.html',
  styleUrls: ['./tomar-orden.component.css']
})
export class TomarOrdenComponent implements OnInit {
  mesaId: number = 0;
  mesaNumero: number = 0;
  orden: Orden | null = null;
  items: OrdenItem[] = [];

  // Productos disponibles
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categorias: any[] = [];
  categoriaSeleccionada: number | null = null;
  searchTerm = '';

  // Modal agregar producto
  showModalAgregar = false;
  productoSeleccionado: Producto | null = null;
  cantidadTemp = 1;
  observacionesTemp = '';

  // Items pendientes de enviar
  itemsPendientes: OrdenItem[] = [];
  itemsEnviados: OrdenItem[] = [];

  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordenesApiService: OrdenesApiService,
    private productosApiService: ProductosApiService,
    private mesasApiService: MesasApiService,  // ← AGREGA
    private authService: AuthService

  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.mesaId = parseInt(params['mesa_id']);
      this.mesaNumero = parseInt(params['mesa_numero']);

      if (!this.mesaId) {
        this.router.navigate(['/mesas']);
        return;
      }

      this.cargarCategorias();
      this.cargarProductos();
      this.cargarOrdenMesa();
    });
  }

  cargarCategorias() {
    this.productosApiService.listarCategorias().subscribe({
      next: (response) => {
        this.categorias = response.data;
      }
    });
  }

  cargarProductos() {
    const restauranteId = this.authService.currentUserValue?.restaurante_id || 1;

    this.productosApiService.listarProductos(restauranteId).subscribe({
      next: (response) => {
        this.productos = response.data.filter((p: Producto) => p.disponible === 1);
        this.aplicarFiltros();
      }
    });
  }

  aplicarFiltros() {
    let resultado = this.productos;

    if (this.searchTerm) {
      resultado = resultado.filter(p =>
        p.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.categoriaSeleccionada !== null) {
      resultado = resultado.filter(p => p.categoria_id === this.categoriaSeleccionada);
    }

    this.productosFiltrados = resultado;
  }

  cargarOrdenMesa() {
    this.isLoading = true;

    this.ordenesApiService.obtenerOrdenMesa(this.mesaId).subscribe({
      next: (response) => {
        if (response.data && Object.keys(response.data).length > 0) {
          const data: any = response.data;
          this.orden = data.orden;
          this.items = data.items || [];

          // Separar items pendientes y enviados
          this.itemsPendientes = this.items.filter(i => i.estado_item_id === 0);
          this.itemsEnviados = this.items.filter(i => i.estado_item_id === 1);
        } else {
          // No hay orden, crear una
          this.crearOrden();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar orden:', error);
        this.isLoading = false;
      }
    });
  }

  crearOrden() {
    const usuario = this.authService.currentUserValue;

    const data = {
      mesa_id: this.mesaId,
      usuario_id: usuario?.id || 0,
      restaurante_id: usuario?.restaurante_id || 1
    };

    this.ordenesApiService.crearOrden(data).subscribe({
      next: (response) => {
        this.orden = response.data;
      }
    });
  }

  abrirModalAgregar(producto: Producto) {
    this.productoSeleccionado = producto;
    this.cantidadTemp = 1;
    this.observacionesTemp = '';
    this.showModalAgregar = true;
  }

  cerrarModalAgregar() {
    this.showModalAgregar = false;
  }

  agregarProducto() {
    if (!this.orden || !this.productoSeleccionado) return;

    const items = [{
      producto_id: this.productoSeleccionado.id,
      cantidad: this.cantidadTemp,
      observaciones: this.observacionesTemp
    }];

    this.ordenesApiService.agregarItems({
      orden_id: this.orden.id,
      items: items
    }).subscribe({
      next: () => {
        this.cargarOrdenMesa();
        this.cerrarModalAgregar();
      },
      error: (error) => {
        console.error('Error al agregar producto:', error);
        alert(error.error?.message || 'Error al agregar producto');
      }
    });
  }

  enviarCocina() {
    if (!this.orden || this.itemsPendientes.length === 0) return;

    if (!confirm(`¿Enviar ${this.itemsPendientes.length} items a cocina?`)) return;

    const envioNumero = this.itemsPendientes[0].envio_numero;

    this.ordenesApiService.enviarCocina({
      orden_id: this.orden.id,
      envio_numero: envioNumero
    }).subscribe({
      next: () => {
        alert('Items enviados a cocina exitosamente');
        this.cargarOrdenMesa();
      },
      error: (error) => {
        console.error('Error al enviar a cocina:', error);
        alert('Error al enviar a cocina');
      }
    });
  }

  eliminarItem(item: OrdenItem) {
    if (item.estado_item_id !== 0) {
      alert('No se puede eliminar un item ya enviado a cocina');
      return;
    }

    if (!confirm(`¿Eliminar ${item.producto_nombre}?`)) return;

    this.ordenesApiService.eliminarItem(item.id).subscribe({
      next: () => {
        this.cargarOrdenMesa();
      },
      error: (error) => {
        console.error('Error al eliminar item:', error);
        alert('Error al eliminar item');
      }
    });
  }

  incrementarCantidad() {
    if (this.cantidadTemp < 20) {
      this.cantidadTemp++;
    }
  }

  decrementarCantidad() {
    if (this.cantidadTemp > 1) {
      this.cantidadTemp--;
    }
  }

  getCategoriaColor(categoria: string): string {
    const colores: { [key: string]: string } = {
      'Entradas': 'bg-green-100 text-green-700',
      'Platos Principales': 'bg-orange-100 text-orange-700',
      'Marinos': 'bg-teal-100 text-teal-700',
      'Bebidas': 'bg-blue-100 text-blue-700',
      'Postres': 'bg-pink-100 text-pink-700'
    };
    return colores[categoria] || 'bg-gray-100 text-gray-700';
  }
  solicitarCuenta() {
  if (!this.orden) return;

  if (this.itemsPendientes.length > 0) {
    alert('Debe enviar todos los items a cocina antes de solicitar la cuenta');
    return;
  }

  if (!confirm('¿Solicitar cuenta para esta mesa?')) return;

  // Cambiar estado de mesa a "pide_cuenta"
  this.mesasApiService.actualizarEstadoMesa({
    mesa_id: this.mesaId,
    estado_id: 2,  // pide_cuenta
    comensales: 0   // Mantener comensales
  }).subscribe({
    next: () => {
      alert('Cuenta solicitada. La mesa está lista para caja.');
      this.router.navigate(['/mesas']);
    },
    error: (error) => {
      console.error('Error al solicitar cuenta:', error);
      alert('Error al solicitar cuenta');
    }
  });
}

  volver() {
    this.router.navigate(['/mesas']);
  }
}
