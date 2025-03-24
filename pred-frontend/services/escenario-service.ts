import { get, post, put, del } from "./api"

export interface Escenario {
  id: number
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

export async function getEscenarios(page = 1, filters = {}) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    ...filters,
  })

  return get(`escenarios?${queryParams.toString()}`)
}

export async function getEscenarioById(id: number) {
  return get(`escenarios/${id}`)
}

export async function createEscenario(escenario: Escenario) {
  return post("escenarios", escenario)
}

export async function updateEscenario(id: number, escenario: Partial<Escenario>) {
  return put(`escenarios/${id}`, escenario)
}

export async function deleteEscenario(id: number) {
  return del(`escenarios/${id}`)
}

export async function getLocalidades() {
  return get("escenarios/localidades")
}

export async function getDeportes() {
  return get("escenarios/deportes")
}

export async function getAmenidades() {
  return get("escenarios/amenidades")
}

export async function verificarDisponibilidad(escenarioId: number, fecha: string, horaInicio: string, horaFin: string) {
  return post("escenarios/verificar-disponibilidad", {
    escenario_id: escenarioId,
    fecha,
    hora_inicio: horaInicio,
    hora_fin: horaFin,
  })
}

