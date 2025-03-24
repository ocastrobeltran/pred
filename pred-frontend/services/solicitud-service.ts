import { get, post, put } from "./api"

export interface Solicitud {
  id?: number
  escenario_id: number
  fecha_reserva: string
  hora_inicio: string
  hora_fin: string
  proposito_id: number
  num_participantes: number
  notas?: string
}

export async function getSolicitudes(page = 1, filters = {}) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    ...filters,
  })

  return get(`solicitudes?${queryParams.toString()}`)
}

export async function getSolicitudById(id: number) {
  return get(`solicitudes/${id}`)
}

export async function createSolicitud(solicitud: Solicitud) {
  return post("solicitudes", solicitud)
}

export async function cambiarEstadoSolicitud(id: number, estado: string, adminNotas?: string) {
  return put(`solicitudes/${id}/cambiar-estado`, {
    estado,
    admin_notas: adminNotas,
  })
}

export async function getEstadosSolicitud() {
  return get("solicitudes/estados")
}

export async function getPropositos() {
  return get("solicitudes/propositos")
}

export async function buscarPorCodigo(codigo: string) {
  return get(`solicitudes/buscar-por-codigo?codigo=${codigo}`)
}

