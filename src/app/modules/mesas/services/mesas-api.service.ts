import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';
import { MesasResponse, SalonesResponse } from '../interfaces/mesa.interface';
import { ActualizarMesaRequest } from '../interfaces/actualizar-mesa.interface';

@Injectable({
  providedIn: 'root'
})
export class MesasApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listarSalones(restaurante_id: number): Observable<SalonesResponse> {
    return this.http.get<SalonesResponse>(`${this.apiUrl}/mesas/salones?restaurante_id=${restaurante_id}`);
  }

  listarMesas(restaurante_id: number): Observable<MesasResponse> {
    return this.http.get<MesasResponse>(`${this.apiUrl}/mesas/listar?restaurante_id=${restaurante_id}`);
  }

  listarMesasPorSalon(restaurante_id: number, salon_id: number): Observable<MesasResponse> {
    return this.http.get<MesasResponse>(`${this.apiUrl}/mesas/listar-por-salon?restaurante_id=${restaurante_id}&salon_id=${salon_id}`);
  }

  actualizarEstadoMesa(data: ActualizarMesaRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/mesas/actualizar-estado`, data);
  }
}
