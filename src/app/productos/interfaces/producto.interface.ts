export interface Producto {
  id?: number;
  gimnasio_id: number;
  nombre: string;
  categoria_id?: number;
  categoria_nombre?: string;
  descripcion?: string;
  precio_venta: number;
  stock_actual: number;
  stock_minimo: number;
  foto?: string;
  activo?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductoStats {
  total_productos: number;
  productos_activos: number;
  bajo_stock: number;
  sin_stock: number;
  valor_inventario: number;
  total_categorias: number;
}