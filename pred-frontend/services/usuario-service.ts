import { get, post, put, del } from "./api"

export interface Usuario {
  id?: number
  nombre: string
  apellido: string
  email: string
  password?: string
  cedula: string
  telefono: string
  direccion: string
  rol_id?: number
  estado?: string
}

export interface UsuarioFilter {
  search?: string
  rol_id?: number
  estado?: string
}

/**
 * Obtiene la lista de usuarios con paginación y filtros opcionales
 */
export async function getUsuarios(page = 1, filters: UsuarioFilter = {}) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== undefined)),
  })

  return get(`usuarios?${queryParams.toString()}`)
}

/**
 * Obtiene los detalles de un usuario específico
 */
export async function getUsuarioById(id: number) {
  return get(`usuarios/${id}`)
}

/**
 * Crea un nuevo usuario (solo admin)
 */
export async function createUsuario(usuario: Usuario) {
  return post("usuarios", usuario)
}

/**
 * Actualiza un usuario existente
 */
export async function updateUsuario(id: number, usuario: Partial<Usuario>) {
  return put(`usuarios/${id}`, usuario)
}

/**
 * Elimina un usuario (solo admin)
 */
export async function deleteUsuario(id: number) {
  return del(`usuarios/${id}`)
}

/**
 * Obtiene la lista de roles disponibles
 */
export async function getRoles() {
  return get("usuarios/roles")
}

/**
 * Cambia la contraseña del usuario
 */
export async function cambiarPassword(currentPassword: string, newPassword: string) {
  return put("usuarios/cambiar-password", {
    current_password: currentPassword,
    password: newPassword,
  })
}

