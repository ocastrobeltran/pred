// Interfaces de tipos para la aplicación

// Usuario autenticado
export interface User {
  id: number
  nombre: string
  apellido: string
  email: string
  cedula: string
  telefono: string
  direccion?: string
  rol_id: number
  estado: string
  avatar?: string
  created_at: string
  updated_at: string
}

// Escenario deportivo
export interface Escenario {
  id: number
  nombre: string
  descripcion: string
  direccion: string
  localidad: string
  localidad_id: number
  capacidad: number
  dimensiones?: string
  deporte: string
  deporte_id: number
  estado: string
  imagen_principal: string | null
  amenidades?: Amenidad[]
  deportes?: Deporte[]
  imagenes?: Imagen[]
  horarios?: Horario[]
}

// Imagen de escenario
export interface Imagen {
  id: number
  url_imagen: string
  es_principal: boolean
  escenario_id: number
}

// Horario de escenario
export interface Horario {
  id: number
  dia_semana: number // 1-7, donde 1 es lunes
  hora_inicio: string
  hora_fin: string
  disponible: boolean
  escenario_id: number
}

// Deporte
export interface Deporte {
  id: number
  nombre: string
}

// Localidad
export interface Localidad {
  id: number
  nombre: string
}

// Amenidad
export interface Amenidad {
  id: number
  nombre: string
}

// Solicitud de reserva
export interface Solicitud {
  id: number
  codigo: string
  escenario_id: number
  escenario?: Escenario
  usuario_id: number
  usuario?: User
  fecha_reserva: string
  hora_inicio: string
  hora_fin: string
  proposito_id: number
  proposito?: string
  num_participantes: number
  notas?: string
  admin_notas?: string
  estado: string
  created_at: string
  updated_at: string
}

// Estado de solicitud
export interface EstadoSolicitud {
  id: number
  nombre: string
}

// Propósito de reserva
export interface Proposito {
  id: number
  nombre: string
}

// // Notificación
// export interface Notificacion {
//   id: number
//   usuario_id: number
//   titulo: string
//   mensaje: string
//   tipo: string
//   url: string
//   leida: boolean
//   created_at: string
// }

// Rol de usuario
export interface Rol {
  id: number
  nombre: string
}

// Archivo
export interface Archivo {
  id: number
  nombre: string
  url: string
  tipo: string
  tamano: number
  created_at: string
}

// Paginación
export interface Pagination {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

// Respuesta API paginada
export interface PaginatedResponse<T> {
  data: T[]
  pagination: Pagination
}

// Respuesta API
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface Rol {
  id: number
  nombre: string
  descripcion?: string
}

export interface Solicitud {
  id: number
  codigo_reserva: string
  usuario_id: number
  escenario_id: number
  fecha_reserva: string
  hora_inicio: string
  hora_fin: string
  proposito_id: number
  num_participantes: number
  estado_id: number
  notas?: string
  admin_notas?: string
  created_at: string
  updated_at: string
}

export interface Estado {
  id: number
  nombre: string
  color: string
  descripcion?: string
}

export interface Notificacion {
  id: number
  usuario_id: number
  titulo: string
  mensaje: string
  tipo: "success" | "error" | "warning" | "info"
  leida: boolean
  url?: string
  created_at: string
}