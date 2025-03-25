import { API_URL } from "@/lib/config"

/**
 * Función base para realizar peticiones a la API con autenticación
 */
export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // Obtener el token del localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("pred_token") : null

  // Configurar los headers con el token si existe
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  // Construir la URL completa correctamente
  const url = `${API_URL}${endpoint}`

  console.log(`Fetching: ${url}`) // Para depuración

  try {
    // Realizar la petición
    const response = await fetch(url, {
      ...options,
      headers,
    })

    // Si la respuesta no es exitosa, manejar el error
    if (!response.ok) {
      // Si el error es de autenticación (401), limpiar el token
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("pred_token")
        }
      }

      // Intentar obtener el mensaje de error del cuerpo de la respuesta
      let errorMessage = `Error HTTP: ${response.status}`
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch (e) {
        // Si no se puede parsear como JSON, usar el texto de la respuesta
        try {
          errorMessage = await response.text()
        } catch (e2) {
          // Si todo falla, usar el mensaje genérico
        }
      }

      throw new Error(errorMessage)
    }

    // Verificar si la respuesta es JSON
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return await response.json()
    } else {
      // Si la respuesta no es JSON, devolver el texto
      return {
        success: true,
        message: "Operación exitosa",
        data: await response.text(),
      }
    }
  } catch (error) {
    console.error("Error en fetchWithAuth:", error)

    // Devolver un objeto de error estructurado
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
      data: null,
    }
  }
}

/**
 * Método GET
 */
export async function get(endpoint: string) {
  return fetchWithAuth(endpoint)
}

/**
 * Método POST
 */
export async function post(endpoint: string, body: any) {
  return fetchWithAuth(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  })
}

/**
 * Método PUT
 */
export async function put(endpoint: string, body: any) {
  return fetchWithAuth(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  })
}

/**
 * Método DELETE
 */
export async function del(endpoint: string) {
  return fetchWithAuth(endpoint, {
    method: "DELETE",
  })
}

