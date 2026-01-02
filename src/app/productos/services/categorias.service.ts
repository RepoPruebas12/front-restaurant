import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../interfaces/categoria.interface';
import { environment } from '../../../environments/environments';

interface ApiResponse<T> {
  status: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listar(): Observable<ApiResponse<Categoria[]>> {
    return this.http.get<ApiResponse<Categoria[]>>(`${this.apiUrl}/productos/categorias/listar`);
  }

  crear(nombre: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/productos/categorias/crear`, { nombre });
  }

  eliminar(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/productos/categorias/eliminar/${id}`);
  }
}
