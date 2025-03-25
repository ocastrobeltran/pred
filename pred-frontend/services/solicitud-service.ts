import { get, post, put } from "./api"

export interface Solicitud {
  id?: number
  escenario_id: number | string
  fecha_reserva: string
  hora_inicio: string
  hora_fin: string
  proposito_id: number | string
  num_participantes: number
  notas?: string
  admin_notas?: string
}

export interface SolicitudFilter {
  search?: string
  estado?: string
  fecha_inicio?: string
  fecha_fin?: string
  escenario_id?: number | string
}

/**
 * Obtiene la lista de solicitudes con paginación y filtros opcionales
 */
export async function getSolicitudes(page = 1, filters: SolicitudFilter = {}) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== undefined)),
  })

  return get(`solicitudes?${queryParams.toString()}`)
}

/**
 * Obtiene los detalles de una solicitud específica
 */
export async function getSolicitudById(id: number | string) {
  return get(`solicitudes/${id}`)
}

/**
 * Crea una nueva solicitud de reserva
 */
export async function createSolicitud(solicitud: Solicitud) {
  return post("solicitudes", solicitud)
}

/**
 * Cambia el estado de una solicitud (admin/supervisor)
 */
export async function cambiarEstadoSolicitud(id: number | string, estado: string, adminNotas?: string) {
  return put(`solicitudes/${id}/cambiar-estado`, {
    estado,
    admin_notas: adminNotas,
  })
}

/**
 * Busca una solicitud por código
 */
export async function buscarSolicitudPorCodigo(codigo: string) {
  return get(`solicitudes/buscar?codigo=${codigo}`)
}

/**
 * Obtiene la lista de estados de solicitud
 */
export async function getEstadosSolicitud() {
  return get("solicitudes/estados")
}

/**
 * Obtiene la lista de propósitos de reserva
 */
export async function getPropositos() {
  return get("solicitudes/propositos")
}

