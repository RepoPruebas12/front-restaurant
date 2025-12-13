export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  restaurante_id: number;
}

export interface AuthResponse {
  access_token: string;
  user: Usuario;
}
