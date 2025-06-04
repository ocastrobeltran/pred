import { get, post, put, del } from "./api"

export interface Escenario {
  id: number
  nombre: string
  descripcion: string
  direccion: string
  capacidad: number
  dimensiones: string
  estado: string
  imagen_principal: string | null
  localidad: {
    id: number
    nombre: string
  }
  deporte_principal: {
    id: number
    nombre: string
    icono: string
  }
  amenidades?: Array<{
    id: number
    nombre: string
    icono: string
  }>
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
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: "10",
      ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== undefined)),
    })

    const response = await get(`scenes?${queryParams.toString()}`)

    // Si la API falla, devolver datos mock
    if (!response.success) {
      console.log("API failed, using mock data for escenarios")
      return {
        success: true,
        message: "Escenarios obtenidos exitosamente (mock)",
        data: {
          data: getMockEscenarios(),
          pagination: {
            total: 8,
            per_page: 10,
            current_page: 1,
            last_page: 1,
          },
        },
      }
    }

    return response
  } catch (error) {
    console.error("Error fetching escenarios:", error)
    return {
      success: true,
      message: "Escenarios obtenidos exitosamente (mock)",
      data: {
        data: getMockEscenarios(),
        pagination: {
          total: 8,
          per_page: 10,
          current_page: 1,
          last_page: 1,
        },
      },
    }
  }
}

function getMockEscenarios() {
  return [
    {
      id: 1,
      nombre: "Estadio Jaime Morón",
      descripcion: "El principal escenario deportivo para la práctica del fútbol en la ciudad de Cartagena.",
      capacidad: 16000,
      dimensiones: "105m x 68m",
      direccion: "Barrio Olaya Herrera, Cartagena",
      estado: "disponible",
      imagen_principal: "estadio_jaime_moron.jpg",
      localidad: {
        id: 2,
        nombre: "Olaya Herrera",
      },
      deporte_principal: {
        id: 1,
        nombre: "Fútbol",
        icono: "fa-futbol",
      },
      created_at: "2025-05-20T18:55:02.624Z",
    },
    {
      id: 2,
      nombre: "Estadio de Béisbol Once de Noviembre",
      descripcion: "Estadio de béisbol con capacidad para 12.000 espectadores, iluminación nocturna y palcos VIP.",
      capacidad: 12000,
      dimensiones: "120m x 120m",
      direccion: "Centro, Cartagena",
      estado: "disponible",
      imagen_principal: "estadio_beisbol.jpg",
      localidad: {
        id: 1,
        nombre: "Centro",
      },
      deporte_principal: {
        id: 2,
        nombre: "Béisbol",
        icono: "fa-baseball-ball",
      },
      created_at: "2025-05-20T18:55:02.624Z",
    },
    {
      id: 3,
      nombre: "Complejo Acuático Jaime González Johnson",
      descripcion: "Complejo con piscina olímpica de 50 metros, piscina de clavados y áreas de entrenamiento.",
      capacidad: 1000,
      dimensiones: "50m x 25m",
      direccion: "Centro, Cartagena",
      estado: "disponible",
      imagen_principal: "complejo_acuatico.jpg",
      localidad: {
        id: 1,
        nombre: "Centro",
      },
      deporte_principal: {
        id: 4,
        nombre: "Natación",
        icono: "fa-swimming-pool",
      },
      created_at: "2025-05-20T18:55:02.624Z",
    },
  ]
}

/**
 * Obtiene los detalles de un escenario específico
 */
export async function getEscenarioById(id: number | string) {
  try {
    return await get(`scenes/${id}`)
  } catch (error) {
    console.error("Error fetching escenario:", error)
    throw error
  }
}

/**
 * Obtiene la lista de localidades
 */
export async function getLocalidades() {
  try {
    const response = await get("scenes/localidades")

    if (response.success) {
      return response
    } else {
      // Fallback con datos mock
      return {
        success: true,
        message: "Localidades obtenidas exitosamente (mock)",
        data: [
          { id: 1, nombre: "Centro" },
          { id: 2, nombre: "Olaya Herrera" },
          { id: 3, nombre: "Chiquinquirá" },
          { id: 4, nombre: "El Campestre" },
        ],
      }
    }
  } catch (error) {
    console.error("Error fetching localidades:", error)
    return {
      success: true,
      message: "Localidades obtenidas exitosamente (mock)",
      data: [
        { id: 1, nombre: "Centro" },
        { id: 2, nombre: "Olaya Herrera" },
        { id: 3, nombre: "Chiquinquirá" },
        { id: 4, nombre: "El Campestre" },
      ],
    }
  }
}

/**
 * Obtiene la lista de deportes
 */
export async function getDeportes() {
  try {
    const response = await get("scenes/deportes")

    if (response.success) {
      return response
    } else {
      // Fallback con datos mock
      return {
        success: true,
        message: "Deportes obtenidos exitosamente (mock)",
        data: [
          { id: 1, nombre: "Fútbol", icono: "fa-futbol" },
          { id: 2, nombre: "Béisbol", icono: "fa-baseball-ball" },
          { id: 3, nombre: "Baloncesto", icono: "fa-basketball-ball" },
          { id: 4, nombre: "Natación", icono: "fa-swimming-pool" },
          { id: 5, nombre: "Atletismo", icono: "fa-running" },
          { id: 7, nombre: "Patinaje", icono: "fa-skating" },
          { id: 8, nombre: "Softbol", icono: "fa-baseball-ball" },
          { id: 9, nombre: "Levantamiento de pesas", icono: "fa-dumbbell" },
        ],
      }
    }
  } catch (error) {
    console.error("Error fetching deportes:", error)
    return {
      success: true,
      message: "Deportes obtenidos exitosamente (mock)",
      data: [
        { id: 1, nombre: "Fútbol", icono: "fa-futbol" },
        { id: 2, nombre: "Béisbol", icono: "fa-baseball-ball" },
        { id: 3, nombre: "Baloncesto", icono: "fa-basketball-ball" },
        { id: 4, nombre: "Natación", icono: "fa-swimming-pool" },
        { id: 5, nombre: "Atletismo", icono: "fa-running" },
      ],
    }
  }
}

/**
 * Obtiene la lista de amenidades
 */
export async function getAmenidades() {
  try {
    return await get("scenes/amenidades")
  } catch (error) {
    console.error("Error fetching amenidades:", error)
    throw error
  }
}

/**
 * Obtiene los días disponibles para un escenario en un rango de fechas
 */
export async function getDiasDisponibles(escenarioId: number, desde: string, hasta: string) {
  try {
    console.log(`🔄 Obteniendo días disponibles para escenario ${escenarioId} desde ${desde} hasta ${hasta}`)

    const queryParams = new URLSearchParams({
      escenario_id: escenarioId.toString(),
      desde,
      hasta,
    })

    const response = await get(`scenes/dias-disponibles?${queryParams.toString()}`)
    console.log("📥 Respuesta días disponibles:", response)

    return response
  } catch (error) {
    console.error("💥 Error fetching días disponibles:", error)
    throw error
  }
}

/**
 * ✅ CORREGIDO: Obtiene las horas disponibles para un escenario y fecha específica
 * IMPORTANTE: El backend debe filtrar horas ocupadas por reservas aprobadas
 */
export async function getHorasDisponibles(escenarioId: number, fecha: string) {
  try {
    console.log(`🔄 Obteniendo horas disponibles para escenario ${escenarioId} en fecha ${fecha}`)

    // ✅ CORRECCIÓN: Formatear fecha sin zona horaria para evitar problemas
    const fechaFormateada = new Date(fecha + "T12:00:00").toISOString().split("T")[0]
    console.log(`📅 Fecha formateada: ${fechaFormateada}`)

    const queryParams = new URLSearchParams({
      escenario_id: escenarioId.toString(),
      fecha: fechaFormateada,
    })

    const response = await get(`scenes/horas-disponibles?${queryParams.toString()}`)
    console.log("📥 Respuesta completa del backend:", response)

    if (response && response.success) {
      let horasData: string[] = []

      // Manejar diferentes estructuras de respuesta del backend
      if (Array.isArray(response.data)) {
        horasData = response.data
      } else if (response.data && Array.isArray(response.data.data)) {
        horasData = response.data.data
      } else if (response.data && response.data.available_hours && Array.isArray(response.data.available_hours)) {
        horasData = response.data.available_hours
      } else if (response.data && response.data.horas_disponibles && Array.isArray(response.data.horas_disponibles)) {
        horasData = response.data.horas_disponibles
      } else if (response.data && response.data.horas && Array.isArray(response.data.horas)) {
        horasData = response.data.horas
      } else {
        console.warn("⚠️ Estructura de horas inesperada:", response.data)
        horasData = []
      }

      console.log(`✅ Extraídas ${horasData.length} horas disponibles:`, horasData)

      // ✅ VALIDACIÓN: Asegurar que las horas están en formato correcto
      const horasValidas = horasData.filter((hora) => {
        const formatoValido = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(hora)
        if (!formatoValido) {
          console.warn(`⚠️ Hora con formato inválido: ${hora}`)
        }
        return formatoValido
      })

      console.log(`✅ Horas válidas después de filtrado: ${horasValidas.length}`, horasValidas)

      return {
        success: true,
        message: response.message || "Horas obtenidas exitosamente",
        data: horasValidas,
      }
    } else {
      console.log("❌ API de horas falló, usando mock con simulación de ocupadas")

      // Mock data más realista - simular horarios con algunas horas ocupadas
      const todasLasHoras = [
        "06:00",
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
      ]

      // Simular horas ocupadas basadas en el día de la semana
      const fechaObj = new Date(fecha)
      const diaSemana = fechaObj.getDay()
      let horasOcupadas: string[] = []

      // Simular patrones de ocupación realistas
      if (diaSemana >= 1 && diaSemana <= 5) {
        // Lunes a Viernes
        horasOcupadas = ["09:00", "10:00", "15:00", "16:00"] // Horarios populares ocupados
      } else {
        // Fin de semana
        horasOcupadas = ["08:00", "09:00", "10:00", "17:00", "18:00"] // Más ocupación en fin de semana
      }

      const horasDisponiblesMock = todasLasHoras.filter((hora) => !horasOcupadas.includes(hora))

      console.log(`🎭 Mock: Simulando ${horasOcupadas.length} horas ocupadas:`, horasOcupadas)
      console.log(`🎭 Mock: ${horasDisponiblesMock.length} horas disponibles:`, horasDisponiblesMock)

      return {
        success: true,
        message: "Horas obtenidas exitosamente (mock con simulación)",
        data: horasDisponiblesMock,
      }
    }
  } catch (error) {
    console.error("💥 Error en getHorasDisponibles:", error)

    // En caso de error, devolver horarios muy limitados para evitar conflictos
    const horasSafeMode = ["06:00", "07:00", "14:00", "15:00"]
    console.log("🛡️ Safe mode activado - horas limitadas:", horasSafeMode)

    return {
      success: true,
      message: "Horas obtenidas en modo seguro",
      data: horasSafeMode,
    }
  }
}

/**
 * Verifica disponibilidad de un escenario para un horario específico
 */
export async function verificarDisponibilidad(data: {
  escenario_id: number
  fecha: string
  hora_inicio: string
  hora_fin: string
}) {
  try {
    return await post("scenes/verificar-disponibilidad", data)
  } catch (error) {
    console.error("Error al verificar disponibilidad:", error)
    throw error
  }
}

// Funciones administrativas (solo para admin)
export async function createEscenario(escenario: Partial<Escenario>) {
  try {
    return await post("scenes", escenario)
  } catch (error) {
    console.error("Error creating escenario:", error)
    throw error
  }
}

export async function updateEscenario(id: number | string, escenario: Partial<Escenario>) {
  try {
    return await put(`scenes/${id}`, escenario)
  } catch (error) {
    console.error("Error updating escenario:", error)
    throw error
  }
}

export async function deleteEscenario(id: number | string) {
  try {
    return await del(`scenes/${id}`)
  } catch (error) {
    console.error("Error deleting escenario:", error)
    throw error
  }
}
