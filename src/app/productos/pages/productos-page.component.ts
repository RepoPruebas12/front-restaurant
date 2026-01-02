import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../services/productos.service';
import { CategoriasService } from '../services/categorias.service';
import { Producto, ProductoStats } from '../interfaces/producto.interface';
import { Categoria } from '../interfaces/categoria.interface';
import { LucideAngularModule, Search, Plus, Edit, Trash2 } from 'lucide-angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './productos-page.component.html',
  styleUrls: ['./productos-page.component.css']
})
export class ProductosPageComponent implements OnInit {
  // Iconos Lucide
  readonly Search = Search;
  readonly Plus = Plus;
  readonly Edit = Edit;
  readonly Trash2 = Trash2;

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categorias: Categoria[] = [];
  stats: ProductoStats | null = null;
  gimnasio_id: number = 1;

  productoForm: Producto = this.resetForm();
  showModal: boolean = false;
  searchTerm: string = '';

  constructor(
    private productosService: ProductosService,
    private categoriasService: CategoriasService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
    this.cargarStats();
  }

  cargarProductos(): void {
    this.productosService.listar(this.gimnasio_id).subscribe({
      next: (response) => {
        if (response.status) {
          this.productos = response.data;
          this.productosFiltrados = response.data;
        }
      },
      error: (error) => console.error('Error al cargar productos:', error)
    });
  }

  buscarProducto(): void {
    if (!this.searchTerm.trim()) {
      this.productosFiltrados = this.productos;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.productosFiltrados = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(term) ||
      p.descripcion?.toLowerCase().includes(term) ||
      p.categoria_nombre?.toLowerCase().includes(term)
    );
  }

  cargarCategorias(): void {
    this.categoriasService.listar().subscribe({
      next: (response) => {
        if (response.status) {
          this.categorias = response.data;
        }
      },
      error: (error) => console.error('Error al cargar categorías:', error)
    });
  }

  cargarStats(): void {
    this.productosService.obtenerStats(this.gimnasio_id).subscribe({
      next: (response) => {
        if (response.status) {
          this.stats = response.data;
        }
      },
      error: (error) => console.error('Error al cargar stats:', error)
    });
  }

  abrirModal(producto?: Producto): void {
    if (producto) {
      this.productoForm = { ...producto };
    } else {
      this.productoForm = this.resetForm();
    }
    this.showModal = true;
  }

  cerrarModal(): void {
    this.showModal = false;
    this.productoForm = this.resetForm();
  }

  guardarProducto(): void {
    this.productoForm.gimnasio_id = this.gimnasio_id;

    if (this.productoForm.categoria_id) {
      this.productoForm.categoria_id = +this.productoForm.categoria_id;
    }

    this.productosService.guardar(this.productoForm).subscribe({
      next: (response) => {
        if (response.status) {
          this.cargarProductos();
          this.cargarStats();
          this.cerrarModal();

          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: this.productoForm.id ? 'Producto actualizado correctamente' : 'Producto creado correctamente',
            timer: 2000,
            showConfirmButton: false
          });
        }
      },
      error: (error) => {
        console.error('Error al guardar producto:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo guardar el producto',
          confirmButtonColor: '#2563eb'
        });
      }
    });
  }

  eliminarProducto(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productosService.eliminar(id, this.gimnasio_id).subscribe({
          next: (response) => {
            if (response.status) {
              this.cargarProductos();
              this.cargarStats();

              Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: 'Producto eliminado correctamente',
                timer: 2000,
                showConfirmButton: false
              });
            }
          },
          error: (error) => {
            console.error('Error al eliminar producto:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el producto',
              confirmButtonColor: '#2563eb'
            });
          }
        });
      }
    });
  }

  resetForm(): Producto {
    return {
      gimnasio_id: this.gimnasio_id,
      nombre: '',
      precio_venta: 0,
      stock_actual: 0,
      stock_minimo: 0
    };
  }
}
