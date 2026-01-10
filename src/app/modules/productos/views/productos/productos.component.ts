import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosApiService } from '../../services/productos-api.service';
import { Producto, Categoria } from '../../interfaces/producto.interface';
import { CrearProductoRequest, ActualizarProductoRequest } from '../../interfaces/crear-producto.interface';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categorias: Categoria[] = [];
  isLoading = false;
  searchTerm = '';
  categoriaSeleccionada: number | null = null;
  userRole = '';

  // Modal
  showModal = false;
  modoEdicion = false;
  productoForm = {
    id: 0,
    nombre: '',
    precio: 0,
    categoria_id: 0,
    disponible: 1,
    controla_stock: 0,
    stock_actual: 0,
    stock_minimo: 0,
    imagen: ''
  };

  constructor(
    private productosApiService: ProductosApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userRole = this.authService.currentUserValue?.rol || '';
    this.cargarCategorias();
    this.cargarProductos();
  }

  cargarCategorias() {
    this.productosApiService.listarCategorias().subscribe({
      next: (response) => {
        this.categorias = response.data;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
      }
    });
  }

  cargarProductos() {
    this.isLoading = true;
    const restauranteId = this.authService.currentUserValue?.restaurante_id || 1;

    this.productosApiService.listarProductos(restauranteId).subscribe({
      next: (response) => {
        this.productos = response.data;
        this.aplicarFiltros();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.isLoading = false;
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

  filtrarPorCategoria(categoriaId: number | null) {
    this.categoriaSeleccionada = categoriaId;
    this.aplicarFiltros();
  }

  buscar() {
    this.aplicarFiltros();
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

  isAdmin(): boolean {
    return this.userRole === 'admin';
  }

  abrirModalNuevo() {
    this.modoEdicion = false;
    this.productoForm = {
      id: 0,
      nombre: '',
      precio: 0,
      categoria_id: 0,
      disponible: 1,
      controla_stock: 0,
      stock_actual: 0,
      stock_minimo: 0,
      imagen: ''
    };
    this.showModal = true;
  }

  abrirModalEditar(producto: Producto) {
    this.modoEdicion = true;
    this.productoForm = {
      id: producto.id,
      nombre: producto.nombre,
      precio: parseFloat(producto.precio),
      categoria_id: producto.categoria_id,
      disponible: producto.disponible,
      controla_stock: producto.controla_stock,
      stock_actual: producto.stock_actual,
      stock_minimo: producto.stock_minimo,
      imagen: producto.imagen || ''
    };
    this.showModal = true;
  }

  cerrarModal() {
    this.showModal = false;
  }

  guardarProducto() {
  const restauranteId = this.authService.currentUserValue?.restaurante_id || 1;

  if (this.modoEdicion) {
    // Actualizar
    const data: ActualizarProductoRequest = {
      id: this.productoForm.id,
      nombre: this.productoForm.nombre,
      precio: this.productoForm.precio,
      categoria_id: this.productoForm.categoria_id,
      disponible: this.productoForm.disponible,
      controla_stock: this.productoForm.controla_stock,
      stock_actual: this.productoForm.stock_actual,
      stock_minimo: this.productoForm.stock_minimo,
      imagen: this.productoForm.imagen
    };

    console.log('📤 Datos a actualizar:', data); // ← Debug

    this.productosApiService.actualizarProducto(data).subscribe({
      next: () => {
        this.cargarProductos();
        this.cerrarModal();
      },
      error: (error) => {
        console.error('❌ Error completo:', error); // ← Ver error completo
        console.error('❌ Mensaje del servidor:', error.error);
      }
    });
  } else {
    // Crear
    const data: CrearProductoRequest = {
      restaurante_id: restauranteId,
      nombre: this.productoForm.nombre,
      precio: this.productoForm.precio,
      categoria_id: this.productoForm.categoria_id,
      disponible: this.productoForm.disponible,
      controla_stock: this.productoForm.controla_stock,
      stock_actual: this.productoForm.stock_actual,
      stock_minimo: this.productoForm.stock_minimo,
      imagen: this.productoForm.imagen || ''
    };

    console.log('📤 Datos a crear:', data); // ← Debug

    this.productosApiService.crearProducto(data).subscribe({
      next: () => {
        this.cargarProductos();
        this.cerrarModal();
      },
      error: (error) => {
        console.error('❌ Error completo:', error); // ← Ver error completo
        console.error('❌ Mensaje del servidor:', error.error);
      }
    });
  }
}

  eliminarProducto(id: number) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productosApiService.eliminarProducto(id).subscribe({
        next: () => {
          this.cargarProductos();
        },
        error: (error) => {
          console.error('Error al eliminar producto:', error);
        }
      });
    }
  }
}
