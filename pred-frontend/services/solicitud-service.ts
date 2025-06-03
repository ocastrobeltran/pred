import { get, post, put } from "./api"

export interface SolicitudData {
  id: number
  codigo_reserva: string
  usuario: {
    id: number
    nombre: string
    apellido: string
    email: string
  }
  escenario: {
    id: number
    nombre: string
    localidad: string
  }
  fecha_reserva: string
  hora_inicio: string
  hora_fin: string
  proposito: {
    id: number
    nombre: string
  }
  num_participantes: number
  estado: {
    id: number
    nombre: string
    color: string
  }
  admin?: {
    id: number
    nombre: string
    apellido: string
  }
  admin_notas?: string
  fecha_respuesta?: string
  notas: string
  created_at: string
}

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
  usuario_id?: number | string
  limit?: number
}

export interface EstadoSolicitud {
  id: number
  nombre: string
  color: string
}

// Mock data para fallback
const getMockSolicitudes = () => [
  {
    id: 1,
    codigo_reserva: "RES-20250128-1234",
    escenario: {
      id: 1,
      nombre: "Estadio Jaime Morón",
      localidad: "Olaya Herrera",
    },
    usuario: {
      id: 1,
      nombre: "Juan",
      apellido: "Pérez",
      email: "juan.perez@email.com",
    },
    fecha_reserva: "2025-02-15",
    hora_inicio: "14:00",
    hora_fin: "16:00",
    estado: {
      id: 1,
      nombre: "pendiente",
      color: "yellow",
    },
    proposito: {
      id: 1,
      nombre: "Entrenamiento deportivo",
    },
    num_participantes: 22,
    notas: "Entrenamiento de fútbol para equipo juvenil.",
    created_at: "2025-01-28T10:00:00Z",
  },
]

/**
 * Obtiene la lista de solicitudes con paginación y filtros opcionales
 */
export async function getSolicitudes(page = 1, filters: SolicitudFilter = {}) {
  try {
    console.log("🔄 Llamando API de solicitudes con filtros:", { page, filters })

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: (filters.limit || 10).toString(),
      ...Object.fromEntries(
        Object.entries(filters)
          .filter(([key, value]) => key !== "limit" && value !== undefined && value !== "")
          .map(([key, value]) => [key, String(value)]),
      ),
    })

    const response = await get(`requests?${queryParams.toString()}`)
    console.log("📥 Respuesta completa del API:", response)

    if (response && response.success) {
      console.log("✅ API respondió exitosamente")
      console.log("📊 Datos recibidos:", response.data)

      let solicitudesData: any[] = []

      // ✅ CORRECCIÓN: Manejo de estructura triple anidada
      if (response.data && response.data.data && response.data.data.data && Array.isArray(response.data.data.data)) {
        solicitudesData = response.data.data.data
        console.log(`✅ Extraídas ${solicitudesData.length} solicitudes de response.data.data.data (triple anidado)`)
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        solicitudesData = response.data.data
        console.log(`✅ Extraídas ${solicitudesData.length} solicitudes de response.data.data (doble anidado)`)
      } else if (Array.isArray(response.data)) {
        solicitudesData = response.data
        console.log(`✅ Extraídas ${solicitudesData.length} solicitudes de response.data (array directo)`)
      } else {
        console.warn("⚠️ Estructura de datos inesperada:", response.data)
        solicitudesData = []
      }

      return response // Devolver la respuesta completa tal como viene
    } else {
      console.log("❌ API falló, usando datos mock")
      return {
        success: true,
        message: "Solicitudes obtenidas exitosamente (mock)",
        data: {
          data: getMockSolicitudes(),
          pagination: {
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: getMockSolicitudes().length,
          },
        },
      }
    }
  } catch (error) {
    console.error("💥 Error en getSolicitudes:", error)
    return {
      success: true,
      message: "Solicitudes obtenidas exitosamente (mock)",
      data: {
        data: getMockSolicitudes(),
        pagination: {
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: getMockSolicitudes().length,
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
    console.log(`🔍 Obteniendo solicitud con ID: ${id}`)
    const response = await get(`requests/${id}`)
    console.log("📥 Respuesta de solicitud por ID:", response)

    if (response && response.success) {
      console.log("✅ API respondió exitosamente para solicitud individual")
      console.log("📊 Datos recibidos:", response.data)

      let solicitudData: any = null

      // ✅ CORRECCIÓN: Manejo de estructura doble anidada para solicitud individual
      if (response.data && response.data.data) {
        solicitudData = response.data.data
        console.log("✅ Extraída solicitud de response.data.data (doble anidado)")
      } else if (response.data) {
        solicitudData = response.data
        console.log("✅ Extraída solicitud de response.data (directo)")
      } else {
        console.warn("⚠️ Estructura de datos inesperada:", response.data)
        solicitudData = null
      }

      if (solicitudData) {
        // Asegurar que el historial tenga el formato correcto
        if (!solicitudData.historial || !Array.isArray(solicitudData.historial)) {
          solicitudData.historial = [
            {
              id: 1,
              estado_nuevo: solicitudData.estado,
              usuario: solicitudData.usuario,
              notas: "Solicitud creada",
              created_at: solicitudData.created_at,
            },
          ]
        }

        return {
          success: true,
          message: response.message,
          data: solicitudData,
        }
      } else {
        throw new Error("No se pudieron extraer los datos de la solicitud")
      }
    } else {
      // Fallback a datos mock
      const mockSolicitud = getMockSolicitudes().find((s) => s.id === Number(id))
      if (mockSolicitud) {
        return {
          success: true,
          message: "Solicitud obtenida exitosamente (mock)",
          data: {
            ...mockSolicitud,
            historial: [
              {
                id: 1,
                estado_nuevo: mockSolicitud.estado,
                usuario: mockSolicitud.usuario,
                notas: "Solicitud creada",
                created_at: mockSolicitud.created_at,
              },
            ],
          },
        }
      }
      throw new Error("Solicitud no encontrada")
    }
  } catch (error) {
    console.error("💥 Error en getSolicitudById:", error)
    return {
      success: false,
      message: "No se pudo cargar la solicitud",
    }
  }
}

/**
 * Crea una nueva solicitud de reserva
 */
export async function createSolicitud(solicitud: Solicitud) {
  try {
    console.log("📝 Creando solicitud:", solicitud)
    const response = await post("requests", solicitud)
    console.log("📥 Respuesta de creación:", response)
    return response
  } catch (error) {
    console.error("💥 Error en createSolicitud:", error)
    return {
      success: false,
      message: "No se pudo crear la solicitud",
    }
  }
}

/**
 * Cambia el estado de una solicitud (admin/supervisor)
 */
export async function cambiarEstadoSolicitud(id: number | string, estado: string, adminNotas?: string) {
  try {
    return await put(`requests/${id}/cambiar-estado`, {
      estado,
      admin_notas: adminNotas,
    })
  } catch (error) {
    console.error("💥 Error en cambiarEstadoSolicitud:", error)
    return {
      success: false,
      message: "No se pudo cambiar el estado de la solicitud",
    }
  }
}

/**
 * Busca una solicitud por código
 */
export async function buscarSolicitudPorCodigo(codigo: string) {
  try {
    return await get(`requests/buscar?codigo=${codigo}`)
  } catch (error) {
    console.error("💥 Error en buscarSolicitudPorCodigo:", error)
    return {
      success: false,
      message: "No se pudo buscar la solicitud",
    }
  }
}

/**
 * Obtiene la lista de estados de solicitud
 */
export async function getEstadosSolicitud() {
  try {
    console.log("🔄 Obteniendo estados de solicitud")
    const response = await get("request-states")
    console.log("📥 Respuesta de estados:", response)

    if (response && response.success) {
      return response
    } else {
      console.log("🔄 Estados falló, usando mock")
      return {
        success: true,
        message: "Estados obtenidos exitosamente (mock)",
        data: [
          { id: 1, nombre: "creada", color: "#FFC107" },
          { id: 2, nombre: "pendiente", color: "#FFC107" },
          { id: 3, nombre: "en_proceso", color: "#007BFF" },
          { id: 4, nombre: "aprobada", color: "#28A745" },
          { id: 5, nombre: "rechazada", color: "#DC3545" },
          { id: 6, nombre: "completada", color: "#6C757D" },
        ],
      }
    }
  } catch (error) {
    console.error("💥 Error en getEstadosSolicitud:", error)
    return {
      success: true,
      message: "Estados obtenidos exitosamente (mock)",
      data: [
        { id: 1, nombre: "creada", color: "#FFC107" },
        { id: 2, nombre: "pendiente", color: "#FFC107" },
        { id: 3, nombre: "en_proceso", color: "#007BFF" },
        { id: 4, nombre: "aprobada", color: "#28A745" },
        { id: 5, nombre: "rechazada", color: "#DC3545" },
        { id: 6, nombre: "completada", color: "#6C757D" },
      ],
    }
  }
}

/**
 * Obtiene la lista de propósitos de reserva
 */
export async function getPropositos() {
  try {
    console.log("🔄 Obteniendo propósitos")
    const response = await get("purposes")
    console.log("📥 Respuesta de propósitos:", response)

    if (response && response.success) {
      return response
    } else {
      return {
        success: true,
        message: "Propósitos obtenidos exitosamente (mock)",
        data: [
          { id: 1, nombre: "Entrenamiento" },
          { id: 2, nombre: "Competencia" },
          { id: 3, nombre: "Evento deportivo" },
          { id: 4, nombre: "Recreación" },
          { id: 5, nombre: "Clase" },
        ],
      }
    }
  } catch (error) {
    console.error("💥 Error en getPropositos:", error)
    return {
      success: true,
      message: "Propósitos obtenidos exitosamente (mock)",
      data: [
        { id: 1, nombre: "Entrenamiento" },
        { id: 2, nombre: "Competencia" },
        { id: 3, nombre: "Evento deportivo" },
        { id: 4, nombre: "Recreación" },
        { id: 5, nombre: "Clase" },
      ],
    }
  }
}
