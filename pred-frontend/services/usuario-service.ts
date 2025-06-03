import { get, post, put, del } from "./api"

export interface Usuario {
  id: number
  nombre: string
  apellido: string
  email: string
  cedula: string
  telefono: string
  direccion: string
  rol_id: number
  estado: string
  created_at: string
  updated_at: string
  rol?: {
    id: number
    nombre: string
  }
}

export interface UsuarioFilter {
  search?: string
  rol_id?: number | string
  estado?: string
}

/**
 * Obtiene la lista de usuarios (solo admin)
 */
export async function getUsuarios(page = 1, filters: UsuarioFilter = {}) {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: "10",
      ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== undefined)),
    })

    return await get(`users?${queryParams.toString()}`)
  } catch (error) {
    console.error("Error fetching usuarios:", error)
    throw error
  }
}

/**
 * Obtiene los detalles de un usuario específico
 */
export async function getUsuarioById(id: number | string) {
  try {
    return await get(`users/${id}`)
  } catch (error) {
    console.error("Error fetching usuario:", error)
    throw error
  }
}

/**
 * Crea un nuevo usuario (solo admin)
 */
export async function createUsuario(usuario: Partial<Usuario> & { password: string }) {
  try {
    return await post("users", usuario)
  } catch (error) {
    console.error("Error creating usuario:", error)
    throw error
  }
}

/**
 * Actualiza un usuario
 */
export async function updateUsuario(id: number | string, usuario: Partial<Usuario>) {
  try {
    return await put(`users/${id}`, usuario)
  } catch (error) {
    console.error("Error updating usuario:", error)
    throw error
  }
}

/**
 * Elimina un usuario (solo admin)
 */
export async function deleteUsuario(id: number | string) {
  try {
    return await del(`users/${id}`)
  } catch (error) {
    console.error("Error deleting usuario:", error)
    throw error
  }
}

/**
 * Obtiene la lista de roles
 */
export async function getRoles() {
  try {
    return await get("users/roles")
  } catch (error) {
    console.error("Error fetching roles:", error)
    throw error
  }
}

/**
 * Cambia la contraseña del usuario actual
 */
export async function cambiarPassword(currentPassword: string, newPassword: string) {
  try {
    return await put("users/cambiar-password", {
      current_password: currentPassword,
      password: newPassword,
    })
  } catch (error) {
    console.error("Error changing password:", error)
    throw error
  }
}
