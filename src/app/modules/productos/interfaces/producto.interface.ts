export interface Categoria {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface Producto {
  id: number;
  nombre: string;
  precio: string;
  categoria_id: number;
  categoria_nombre: string;
  disponible: number;
  imagen: string | null;
  controla_stock: number;
  stock_actual: number;
  stock_minimo: number;
}

export interface ProductosResponse {
  status: boolean;
  data: Producto[];
}

export interface CategoriasResponse {
  status: boolean;
  data: Categoria[];
}
