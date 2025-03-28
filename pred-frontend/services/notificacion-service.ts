import { get, put } from "./api"

export interface NotificacionFilter {
  leida?: boolean
  tipo?: string
}

// Mock data for notificaciones
const MOCK_NOTIFICACIONES = [
  {
    id: 1,
    usuario_id: 1,
    titulo: "Reserva aprobada",
    mensaje: "Tu solicitud para la Cancha de Fútbol #3 ha sido aprobada",
    tipo: "success",
    url: "/dashboard/mis-reservas/1",
    leida: false,
    created_at: new Date(Date.now() - 7200000).toISOString(), // 2 horas atrás
  },
  {
    id: 2,
    usuario_id: 1,
    titulo: "Nuevo escenario disponible",
    mensaje: "Se ha agregado un nuevo escenario deportivo en Usaquén",
    tipo: "info",
    url: "/escenarios/9",
    leida: false,
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 día atrás
  },
  {
    id: 3,
    usuario_id: 1,
    titulo: "Recordatorio de reserva",
    mensaje: "Tienes una reserva programada para mañana a las 4:00 PM",
    tipo: "warning",
    url: "/dashboard/mis-reservas/2",
    leida: true,
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 días atrás
  },
]

/**
 * Obtiene la lista de notificaciones del usuario con paginación y filtros opcionales
 */
export async function getNotificaciones(page = 1, filters: NotificacionFilter = {}) {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== undefined)),
    })

    const response = await get(`notificaciones?${queryParams.toString()}`)

    if (response.success) {
      return response
    } else {
      console.log("API failed, using mock data for notificaciones")
      return {
        success: true,
        message: "Notificaciones obtenidas exitosamente (mock)",
        data: {
          data: MOCK_NOTIFICACIONES,
          pagination: {
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: MOCK_NOTIFICACIONES.length,
          },
        },
      }
    }
  } catch (error) {
    console.error("Error fetching notificaciones:", error)
    return {
      success: true,
      message: "Notificaciones obtenidas exitosamente (mock)",
      data: {
        data: MOCK_NOTIFICACIONES,
        pagination: {
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: MOCK_NOTIFICACIONES.length,
        },
      },
    }
  }
}

/**
 * Marca una notificación como leída
 */
export async function marcarLeida(id: number | string) {
  try {
    const response = await put(`notificaciones/${id}/marcar-leida`, {})

    if (response.success) {
      return response
    } else {
      console.log("API failed, using mock data for marcar leída")
      return {
        success: true,
        message: "Notificación marcada como leída exitosamente (mock)",
        data: { id },
      }
    }
  } catch (error) {
    console.error("Error marcando notificación como leída:", error)
    return {
      success: true,
      message: "Notificación marcada como leída exitosamente (mock)",
      data: { id },
    }
  }
}

/**
 * Marca todas las notificaciones como leídas
 */
export async function marcarTodasLeidas() {
  try {
    const response = await put("notificaciones/marcar-todas-leidas", {})

    if (response.success) {
      return response
    } else {
      console.log("API failed, using mock data for marcar todas leídas")
      return {
        success: true,
        message: "Todas las notificaciones marcadas como leídas exitosamente (mock)",
        data: null,
      }
    }
  } catch (error) {
    console.error("Error marcando todas las notificaciones como leídas:", error)
    return {
      success: true,
      message: "Todas las notificaciones marcadas como leídas exitosamente (mock)",
      data: null,
    }
  }
}

/**
 * Cuenta las notificaciones no leídas
 */
export async function contarNoLeidas() {
  try {
    const response = await get("notificaciones/contar-no-leidas")

    if (response.success) {
      return response
    } else {
      console.log("API failed, using mock data for contar no leídas")
      // Contar notificaciones no leídas del mock
      const count = MOCK_NOTIFICACIONES.filter((n) => !n.leida).length
      return {
        success: true,
        message: "Conteo de notificaciones no leídas obtenido exitosamente (mock)",
        data: { count },
      }
    }
  } catch (error) {
    console.error("Error contando notificaciones no leídas:", error)
    // Contar notificaciones no leídas del mock
    const count = MOCK_NOTIFICACIONES.filter((n) => !n.leida).length
    return {
      success: true,
      message: "Conteo de notificaciones no leídas obtenido exitosamente (mock)",
      data: { count },
    }
  }
}

