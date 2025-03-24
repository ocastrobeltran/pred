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

export async function getUsuarios(page = 1, filters = {}) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    ...filters,
  })

  return get(`usuarios?${queryParams.toString()}`)
}

export async function getUsuarioById(id: number) {
  return get(`usuarios/${id}`)
}

export async function createUsuario(usuario: Usuario) {
  return post("usuarios", usuario)
}

export async function updateUsuario(id: number, usuario: Partial<Usuario>) {
  return put(`usuarios/${id}`, usuario)
}

export async function deleteUsuario(id: number) {
  return del(`usuarios/${id}`)
}

export async function getRoles() {
  return get("usuarios/roles")
}

