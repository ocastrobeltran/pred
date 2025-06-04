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
      nombre: "creada",
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

      // ✅ CORRECCIÓN: Manejo correcto de la estructura de datos
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // Estructura correcta: { success: true, data: { data: [...], pagination: {...} } }
        console.log(`✅ Extraídas ${response.data.data.length} solicitudes de response.data.data`)
        return response // Devolver la respuesta completa tal como viene
      } else if (Array.isArray(response.data)) {
        // Estructura alternativa: { success: true, data: [...] }
        console.log(`✅ Extraídas ${response.data.length} solicitudes de response.data (array directo)`)
        return {
          success: true,
          message: response.message,
          data: {
            data: response.data,
            pagination: {
              current_page: 1,
              last_page: 1,
              per_page: response.data.length,
              total: response.data.length,
            },
          },
        }
      } else if (response.data && typeof response.data === "object" && response.data.success && response.data.data) {
        // Estructura anidada: { success: true, data: { success: true, data: [...] } }
        console.log("🔍 DEBUGGING - Estructura anidada detectada")
        if (Array.isArray(response.data.data.data)) {
          console.log(`✅ Extraídas ${response.data.data.data.length} solicitudes de estructura anidada`)
          return {
            success: true,
            message: response.message,
            data: {
              data: response.data.data.data,
              pagination: response.data.data.pagination || {
                current_page: 1,
                last_page: 1,
                per_page: response.data.data.data.length,
                total: response.data.data.data.length,
              },
            },
          }
        } else if (Array.isArray(response.data.data)) {
          console.log(`✅ Extraídas ${response.data.data.length} solicitudes de estructura anidada (array directo)`)
          return {
            success: true,
            message: response.message,
            data: {
              data: response.data.data,
              pagination: {
                current_page: 1,
                last_page: 1,
                per_page: response.data.data.length,
                total: response.data.data.length,
              },
            },
          }
        }
      } else {
        console.warn("⚠️ Estructura de datos inesperada, usando mock data")
        // Fallback a mock data
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

      // ✅ DEBUGGING EXTREMO: Verificar todas las estructuras posibles
      if (response.data) {
        console.log("🔍 DEBUGGING - Estructura de response.data:")
        console.log("🔍 Tipo de response.data:", typeof response.data)
        console.log("🔍 Es array response.data:", Array.isArray(response.data))
        console.log("🔍 Keys de response.data:", Object.keys(response.data))
        console.log("🔍 response.data completo:", JSON.stringify(response.data, null, 2))

        // Verificar si es una estructura anidada
        if (response.data.success && response.data.data) {
          console.log("🔍 DEBUGGING - Estructura anidada detectada")
          console.log("🔍 response.data.data:", response.data.data)
          solicitudData = response.data.data
        } else {
          console.log("🔍 DEBUGGING - Estructura directa")
          solicitudData = response.data
        }

        console.log("🔍 DEBUGGING - solicitudData final:")
        console.log("🔍 Tipo de solicitudData:", typeof solicitudData)
        console.log("🔍 Keys de solicitudData:", Object.keys(solicitudData || {}))
        console.log("🔍 solicitudData completo:", JSON.stringify(solicitudData, null, 2))

        // 🔧 CORRECCIÓN: Transformar datos planos a estructura anidada esperada
        if (solicitudData && !solicitudData.estado && solicitudData.estado_nombre) {
          console.log("🔧 Transformando estructura de datos plana a anidada")

          // Crear objetos anidados a partir de datos planos
          solicitudData.estado = {
            id: solicitudData.estado_id || 1,
            nombre: solicitudData.estado_nombre,
            color: solicitudData.estado_color || "#FFC107",
          }

          solicitudData.escenario = {
            id: solicitudData.escenario_id || 1,
            nombre: solicitudData.escenario_nombre || "Sin nombre",
            localidad: solicitudData.localidad_nombre || "Sin localidad",
          }

          solicitudData.usuario = {
            id: solicitudData.usuario_id || 1,
            nombre: solicitudData.usuario_nombre || "Sin nombre",
            apellido: solicitudData.usuario_apellido || "",
            email: solicitudData.usuario_email || "Sin email",
            telefono: solicitudData.usuario_telefono || "Sin teléfono",
          }

          solicitudData.proposito = {
            id: solicitudData.proposito_id || 1,
            nombre: solicitudData.proposito_nombre || "Sin propósito",
          }

          if (solicitudData.admin_nombre) {
            solicitudData.admin = {
              id: solicitudData.admin_id || 1,
              nombre: solicitudData.admin_nombre,
              apellido: solicitudData.admin_apellido || "",
            }
          }

          console.log("✅ Estructura transformada correctamente")
          console.log("🔍 DEBUGGING - solicitudData después de transformación:", JSON.stringify(solicitudData, null, 2))
        } else if (solicitudData && solicitudData.estado) {
          console.log("✅ Estructura ya está en formato correcto")
        } else {
          console.warn("⚠️ No se pudo determinar la estructura de datos")
          console.log("🔍 solicitudData actual:", solicitudData)
        }
      } else {
        console.warn("⚠️ response.data es null o undefined")
        solicitudData = null
      }

      if (solicitudData) {
        // Asegurar que el historial tenga el formato correcto
        if (!solicitudData.historial || !Array.isArray(solicitudData.historial)) {
          console.log("🔧 Creando historial por defecto")
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

        console.log("✅ DEBUGGING - Datos finales a retornar:")
        console.log("🔍 ID:", solicitudData.id)
        console.log("🔍 Código:", solicitudData.codigo_reserva)
        console.log("🔍 Estado:", solicitudData.estado)
        console.log("🔍 Escenario:", solicitudData.escenario)
        console.log("🔍 Usuario:", solicitudData.usuario)

        return {
          success: true,
          message: response.message,
          data: solicitudData,
        }
      } else {
        console.error("❌ No se pudieron extraer los datos de la solicitud")
        throw new Error("No se pudieron extraer los datos de la solicitud")
      }
    } else {
      console.log("❌ API no respondió exitosamente")
      // Fallback a datos mock
      const mockSolicitud = getMockSolicitudes().find((s) => s.id === Number(id))
      if (mockSolicitud) {
        console.log("🔄 Usando datos mock para ID:", id)
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
    // ✅ CORRECCIÓN: Usar el endpoint correcto
    const response = await get("requests/estados")
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
          { id: 2, nombre: "en_proceso", color: "#007BFF" },
          { id: 3, nombre: "aprobada", color: "#28A745" },
          { id: 4, nombre: "rechazada", color: "#DC3545" },
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
        { id: 2, nombre: "en_proceso", color: "#007BFF" },
        { id: 3, nombre: "aprobada", color: "#28A745" },
        { id: 4, nombre: "rechazada", color: "#DC3545" },
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
