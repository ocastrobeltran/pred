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
            escenario_id: 1,
            escenario: {
              nombre: "Estadio El Campín",
              direccion: "Calle 57 #21-83, Bogotá",
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
            estado: "aprobada",
            created_at: "2023-06-01T10:00:00",
            updated_at: "2023-06-02T14:30:00",
          },
          {
            id: 2,
            codigo: "SOL-002",
            escenario_id: 2,
            escenario: {
              nombre: "Coliseo El Salitre",
              direccion: "Av. 68 #63-45, Bogotá",
            },
            usuario_id: 1,
            usuario: {
              nombre: "Juan",
              apellido: "Pérez",
            },
            fecha_reserva: "2023-06-10",
            hora_inicio: "18:00:00",
            hora_fin: "20:00:00",
            proposito_id: 2,
            proposito: "Entrenamiento",
            num_participantes: 15,
            estado: "completada",
            created_at: "2023-05-20T09:15:00",
            updated_at: "2023-06-11T10:00:00",
          },
          {
            id: 3,
            codigo: "SOL-003",
            escenario_id: 3,
            escenario: {
              nombre: "Complejo de Tenis",
              direccion: "Calle 163 #8-50, Bogotá",
            },
            usuario_id: 1,
            usuario: {
              nombre: "Juan",
              apellido: "Pérez",
            },
            fecha_reserva: "2023-06-05",
            hora_inicio: "10:00:00",
            hora_fin: "12:00:00",
            proposito_id: 4,
            proposito: "Recreación",
            num_participantes: 4,
            estado: "pendiente",
            created_at: "2023-05-30T16:45:00",
            updated_at: "2023-05-30T16:45:00",
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
export async function createSolicitud(solicitud: Solicitud) {
  try {
    return post("solicitudes", solicitud)
  } catch (error) {
    console.error("Error creating solicitud:", error)
    // Return mock success response
    return {
      success: true,
      message: "Solicitud creada exitosamente (mock)",
      data: {
        id: Math.floor(Math.random() * 1000) + 10,
        codigo: `SOL-${Math.floor(Math.random() * 1000)}`,
        ...solicitud,
        estado: "pendiente",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
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

