import { get, put } from "./api"

export async function getNotificaciones(page = 1, filters = {}) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    ...filters,
  })

  return get(`notificaciones?${queryParams.toString()}`)
}

export async function marcarLeida(id: number) {
  return put(`notificaciones/${id}/marcar-leida`, {})
}

export async function marcarTodasLeidas() {
  return put("notificaciones/marcar-todas-leidas", {})
}

export async function contarNoLeidas() {
  return get("notificaciones/contar-no-leidas")
}

