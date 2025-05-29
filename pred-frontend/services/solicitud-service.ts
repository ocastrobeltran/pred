const API_URL = process.env.NEXT_PUBLIC_API_URL 
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
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== undefined)),
    })

    return get(`solicitudes?${queryParams.toString()}`)
  } catch (error) {
    console.error("Error fetching solicitudes:", error)
    // Return mock data
    return {
      success: true,
      message: "Solicitudes obtenidas exitosamente (mock)",
      data: {
        data: [
          {
            id: 1,
            codigo: "SOL-001",
            escenario_id: 8,
            escenario: {
              nombre: "Coliseo Norton Madrid",
              direccion: "Centro, Cartagena",
            },
            usuario_id: 1,
            usuario: {
              nombre: "Juan",
              apellido: "Pérez",
            },
            fecha_reserva: "2025-03-20",
            hora_inicio: "10:00:00",
            hora_fin: "12:00:00",
            proposito_id: 1,
            proposito: "Evento deportivo",
            num_participantes: 50,
            estado: "aprobada",
            created_at: "2025-03-19T10:00:00",
            updated_at: "2025-03-19T12:00:00",
          },
          {
            id: 2,
            codigo: "SOL-002",
            escenario_id: 7,
            escenario: {
              nombre: "Patinódromo de El Campestre",
              direccion: "El Campestre, Cartagena",
            },
            usuario_id: 2,
            usuario: {
              nombre: "María",
              apellido: "Gómez",
            },
            fecha_reserva: "2025-03-21",
            hora_inicio: "14:00:00",
            hora_fin: "16:00:00",
            proposito_id: 2,
            proposito: "Entrenamiento",
            num_participantes: 20,
            estado: "pendiente",
            created_at: "2025-03-19T11:00:00",
            updated_at: "2025-03-19T11:30:00",
          },
          {
            id: 3,
            codigo: "SOL-003",
            escenario_id: 6,
            escenario: {
              nombre: "Estadio de Softbol de Chiquinquirá",
              direccion: "Chiquinquirá, Cartagena",
            },
            usuario_id: 3,
            usuario: {
              nombre: "Carlos",
              apellido: "López",
            },
            fecha_reserva: "2025-03-22",
            hora_inicio: "09:00:00",
            hora_fin: "11:00:00",
            proposito_id: 3,
            proposito: "Competencia",
            num_participantes: 30,
            estado: "rechazada",
            created_at: "2025-03-19T12:00:00",
            updated_at: "2025-03-19T12:30:00",
          },
        ],
        pagination: {
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 3,
        },
      },
    }
  }
}

/**
 * Obtiene los detalles de una solicitud específica
 */
export async function getSolicitudById(id: number | string) {
  try {
    return get(`solicitudes/${id}`)
  } catch (error) {
    console.error("Error fetching solicitud:", error)
    // Return mock data
    return {
      success: true,
      message: "Solicitud obtenida exitosamente (mock)",
      data: {
        id: Number(id),
        codigo: `SOL-00${id}`,
        escenario_id: 1,
        escenario: {
          nombre: "Estadio El Campín",
          direccion: "Calle 57 #21-83, Bogotá",
          capacidad: 36343,
        },
        usuario_id: 1,
        usuario: {
          nombre: "Juan",
          apellido: "Pérez",
        },
        fecha_reserva: "2023-06-15",
        hora_inicio: "15:00:00",
        hora_fin: "17:00:00",
        proposito_id: 1,
        proposito: "Evento deportivo",
        num_participantes: 20,
        notas: "Necesitamos acceso a los vestidores",
        admin_notas: "Aprobado sin observaciones",
        estado: "aprobada",
        created_at: "2023-06-01T10:00:00",
        updated_at: "2023-06-02T14:30:00",
      },
    }
  }
}

/**
 * Crea una nueva solicitud de reserva
 */
export async function createSolicitud(solicitud: Solicitud, token?: string) {
  try {
    const response = await fetch(`${API_URL}/solicitudes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(solicitud),
    })

    const contentType = response.headers.get("content-type")
    if (!response.ok) {
      const text = await response.text()
      throw new Error(text)
    }
    if (contentType && contentType.includes("application/json")) {
      return await response.json()
    } else {
      throw new Error("Respuesta inesperada del servidor")
    }
  } catch (error) {
    console.error("Error creating solicitud:", error)
    return {
      success: false,
      message: "No se pudo crear la solicitud",
      data: null,
    }
  }
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
  return {
    success: true,
    message: "Estados obtenidos exitosamente (mock)",
    data: [
      { id: 1, nombre: "pendiente" },
      { id: 2, nombre: "aprobada" },
      { id: 3, nombre: "rechazada" },
      { id: 4, nombre: "completada" },
    ],
  }
}

/**
 * Obtiene la lista de propósitos de reserva
 */
export async function getPropositos() {
  try {
    return get("solicitudes/propositos")
  } catch (error) {
    console.error("Error fetching propósitos:", error)
    // Return mock data
    return {
      success: true,
      message: "Propósitos obtenidos exitosamente (mock)",
      data: [
        { id: 1, nombre: "Evento deportivo" },
        { id: 2, nombre: "Entrenamiento" },
        { id: 3, nombre: "Competencia" },
        { id: 4, nombre: "Recreación" },
        { id: 5, nombre: "Clase" },
      ],
    }
  }
}

