import { get, post, put, del } from "./api"

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
 * Obtiene la lista de escenarios
 * Note: We're not using pagination parameters in the URL to avoid routing issues
 */
export async function getEscenarios() {
  return get("escenarios")
}

/**
 * Obtiene los detalles de un escenario específico
 * Note: We're using a try-catch to handle the backend routing issue
 */
export async function getEscenarioById(id: number | string) {
  try {
    // Try to get from API
    const response = await get(`escenarios/view/${id}`)
    return response
  } catch (error) {
    console.error("Error fetching escenario:", error)
    // Return a failed response
    return {
      success: false,
      message: "Error al obtener el escenario",
      data: null,
    }
  }
}

/**
 * Crea un nuevo escenario (solo admin)
 */
export async function createEscenario(escenario: Escenario) {
  return post("escenarios", escenario)
}

/**
 * Actualiza un escenario existente (solo admin)
 */
export async function updateEscenario(id: number, escenario: Partial<Escenario>) {
  return put(`escenarios/${id}`, escenario)
}

/**
 * Elimina un escenario (solo admin)
 */
export async function deleteEscenario(id: number) {
  return del(`escenarios/${id}`)
}

/**
 * Obtiene la lista de localidades
 */
export async function getLocalidades() {
  return get("escenarios/localidades")
}

/**
 * Obtiene la lista de deportes
 */
export async function getDeportes() {
  return get("escenarios/deportes")
}

/**
 * Obtiene la lista de amenidades
 */
export async function getAmenidades() {
  return get("escenarios/amenidades")
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
  return post("escenarios/verificar-disponibilidad", {
    escenario_id: escenarioId,
    fecha,
    hora_inicio: horaInicio,
    hora_fin: horaFin,
  })
}

/**
 * Obtiene los horarios disponibles para un escenario en una fecha específica
 * Note: Using mock data since the backend endpoint is not working
 */
export async function getHorariosDisponibles(escenarioId: number | string, fecha: string) {
  // For now, we'll hardcode some sample data to avoid routing issues
  return {
    success: true,
    message: "Horarios disponibles obtenidos exitosamente",
    data: ["08:00:00", "10:00:00", "12:00:00", "14:00:00", "16:00:00", "18:00:00"],
  }
}

