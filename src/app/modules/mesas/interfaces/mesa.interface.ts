export interface Mesa {
  id: number;
  numero: number;
  capacidad: number;
  estado_id: number;
  estado_nombre: string;
  estado_color: string;
  comensales: number;
  salon_id: number;
  salon_nombre: string;
}

export interface Salon {
  id: number;
  nombre: string;
  orden: number;
  estado_id: number;
}

export interface MesasResponse {
  status: boolean;
  data: Mesa[];
}

export interface SalonesResponse {
  status: boolean;
  data: Salon[];
}
