export interface CrearOrdenRequest {
  mesa_id: number;
  usuario_id: number;
  restaurante_id: number;
}

export interface AgregarItemRequest {
  producto_id: number;
  cantidad: number;
  observaciones?: string;
}

export interface AgregarItemsRequest {
  orden_id: number;
  items: AgregarItemRequest[];
}

export interface EnviarCocinaRequest {
  orden_id: number;
  envio_numero: number;
}
