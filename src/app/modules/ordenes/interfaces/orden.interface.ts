export interface Orden {
  id: number;
  mesa_id: number;
  mesa_numero: number;
  estado_orden_id: number;
  estado_nombre: string;
  total: number;
  fecha_registro: string;
}

export interface OrdenItem {
  id: number;
  producto_id: number;
  producto_nombre: string;
  producto_imagen: string | null;
  cantidad: number;
  precio: number;
  subtotal: number;
  observaciones: string;
  envio_numero: number;
  estado_item_id: number;
  estado_item_nombre: string;
  fecha_envio: string | null;
}

export interface OrdenCompleta {
  orden: Orden;
  items: OrdenItem[];
}

export interface OrdenResponse {
  status: boolean;
  data: OrdenCompleta | {};
}
