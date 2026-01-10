import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';
import { ProductosResponse, CategoriasResponse } from '../interfaces/producto.interface';
import { CrearProductoRequest, ActualizarProductoRequest } from '../interfaces/crear-producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductosApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listarCategorias(): Observable<CategoriasResponse> {
    return this.http.get<CategoriasResponse>(`${this.apiUrl}/productos/categorias`);
  }

  listarProductos(restaurante_id: number): Observable<ProductosResponse> {
    return this.http.get<ProductosResponse>(`${this.apiUrl}/productos/listar?restaurante_id=${restaurante_id}`);
  }

  listarProductosPorCategoria(restaurante_id: number, categoria_id: number): Observable<ProductosResponse> {
    return this.http.get<ProductosResponse>(`${this.apiUrl}/productos/listar-por-categoria?restaurante_id=${restaurante_id}&categoria_id=${categoria_id}`);
  }

  crearProducto(data: CrearProductoRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/productos/crear`, data);
  }

  actualizarProducto(data: ActualizarProductoRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/productos/actualizar`, data);
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/productos/eliminar/${id}`);
  }
}
