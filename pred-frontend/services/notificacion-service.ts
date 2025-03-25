import { get, put } from "./api"

export interface NotificacionFilter {
  leida?: boolean
  tipo?: string
}

/**
 * Obtiene la lista de notificaciones del usuario con paginación y filtros opcionales
 */
export async function getNotificaciones(page = 1, filters: NotificacionFilter = {}) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== undefined)),
  })

  return get(`notificaciones?${queryParams.toString()}`)
}

/**
 * Marca una notificación como leída
 */
export async function marcarLeida(id: number | string) {
  return put(`notificaciones/${id}/marcar-leida`, {})
}

/**
 * Marca todas las notificaciones como leídas
 */
export async function marcarTodasLeidas() {
  return put("notificaciones/marcar-todas-leidas", {})
}

/**
 * Cuenta las notificaciones no leídas
 */
export async function contarNoLeidas() {
  return get("notificaciones/contar-no-leidas")
}

