import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';
import {
  CrearOrdenRequest,
  AgregarItemsRequest,
  EnviarCocinaRequest
} from '../interfaces/crear-orden.interface';
import { OrdenResponse } from '../interfaces/orden.interface';

@Injectable({
  providedIn: 'root'
})
export class OrdenesApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  crearOrden(data: CrearOrdenRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/ordenes/crear`, data);
  }

  agregarItems(data: AgregarItemsRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/ordenes/agregar-items`, data);
  }

  enviarCocina(data: EnviarCocinaRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/ordenes/enviar-cocina`, data);
  }

  obtenerOrdenMesa(mesa_id: number): Observable<OrdenResponse> {
    return this.http.get<OrdenResponse>(`${this.apiUrl}/ordenes/obtener-por-mesa?mesa_id=${mesa_id}`);
  }

  listarItemsPendientes(orden_id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/ordenes/items-pendientes?orden_id=${orden_id}`);
  }

  eliminarItem(item_id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/ordenes/eliminar-item/${item_id}`);
  }

  cobrarOrden(orden_id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/ordenes/cobrar`, { orden_id });
  }
}
