import { get, post, put, del } from "./api"
import { API_ROUTES } from "@/lib/config"

export interface Escenario {
  id?: number
  nombre: string
  descripcion: string
  capacidad: number
  dimensiones: string
  localidad_id: number
  deporte_principal_id: number
  direccion: string
  estado: string
  imagen_principal: string | null
  deportes?: number[]
  amenidades?: number[]
  imagenes?: { url: string; es_principal: boolean }[]
  horarios?: {
    dia_semana: string
    hora_inicio: string
    hora_fin: string
    disponible: boolean
  }[]
}

export interface EscenarioFilter {
  search?: string
  localidad_id?: number | string
  deporte_id?: number | string
  estado?: string
}

/**
 * Obtiene la lista de escenarios con paginación y filtros opcionales
 */
export async function getEscenarios(page = 1, filters: EscenarioFilter = {}) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== undefined)),
  })

  return get(`${API_ROUTES.ESCENARIOS}?${queryParams.toString()}`)
}

/**
 * Obtiene los detalles de un escenario específico
 */
export async function getEscenarioById(id: number | string) {
  return get(API_ROUTES.ESCENARIO_BY_ID(id))
}

/**
 * Crea un nuevo escenario (solo admin)
 */
export async function createEscenario(escenario: Escenario) {
  return post(API_ROUTES.ESCENARIOS, escenario)
}

/**
 * Actualiza un escenario existente (solo admin)
 */
export async function updateEscenario(id: number, escenario: Partial<Escenario>) {
  return put(API_ROUTES.ESCENARIO_BY_ID(id), escenario)
}

/**
 * Elimina un escenario (solo admin)
 */
export async function deleteEscenario(id: number) {
  return del(API_ROUTES.ESCENARIO_BY_ID(id))
}

/**
 * Obtiene la lista de localidades
 */
export async function getLocalidades() {
  return get(API_ROUTES.ESCENARIOS_LOCALIDADES)
}

/**
 * Obtiene la lista de deportes
 */
export async function getDeportes() {
  return get(API_ROUTES.ESCENARIOS_DEPORTES)
}

/**
 * Obtiene la lista de amenidades
 */
export async function getAmenidades() {
  return get(API_ROUTES.AMENIDADES)
}

/**
 * Verifica la disponibilidad de un escenario
 */
export async function verificarDisponibilidad(
  escenarioId: number | string,
  fecha: string,
  horaInicio: string,
  horaFin: string,
) {
  return post(API_ROUTES.VERIFICAR_DISPONIBILIDAD, {
    escenario_id: escenarioId,
    fecha,
    hora_inicio: horaInicio,
    hora_fin: horaFin,
  })
}

/**
 * Obtiene los horarios disponibles para un escenario en una fecha específica
 */
export async function getHorariosDisponibles(escenarioId: number | string, fecha: string) {
  return get(API_ROUTES.HORARIOS_DISPONIBLES(escenarioId, fecha))
}

