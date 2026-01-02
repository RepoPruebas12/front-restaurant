import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto, ProductoStats } from '../interfaces/producto.interface';
import { environment } from '../../../environments/environments';

interface ApiResponse<T> {
  status: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listar(gimnasio_id: number): Observable<ApiResponse<Producto[]>> {
    const params = new HttpParams().set('gimnasio_id', gimnasio_id.toString());
    return this.http.get<ApiResponse<Producto[]>>(`${this.apiUrl}/productos/listar`, { params });
  }

  obtenerStats(gimnasio_id: number): Observable<ApiResponse<ProductoStats>> {
    const params = new HttpParams().set('gimnasio_id', gimnasio_id.toString());
    return this.http.get<ApiResponse<ProductoStats>>(`${this.apiUrl}/productos/stats`, { params });
  }

  guardar(producto: Producto): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/productos/guardar`, producto);
  }

  eliminar(id: number, gimnasio_id: number): Observable<ApiResponse<any>> {
    const params = new HttpParams().set('gimnasio_id', gimnasio_id.toString());
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/productos/eliminar/${id}`, { params });
  }
}
