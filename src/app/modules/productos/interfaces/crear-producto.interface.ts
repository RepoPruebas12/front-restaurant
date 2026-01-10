export interface CrearProductoRequest {
  restaurante_id: number;
  nombre: string;
  precio: number;
  categoria_id: number;
  disponible: number;
  controla_stock: number;
  stock_actual: number;
  stock_minimo: number;
  imagen?: string;
}

export interface ActualizarProductoRequest {
  id: number;
  nombre: string;
  precio: number;
  categoria_id: number;
  disponible: number;
  controla_stock: number;
  stock_actual: number;
  stock_minimo: number;
  imagen?: string;
}
