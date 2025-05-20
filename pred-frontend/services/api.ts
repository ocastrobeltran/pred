import { API_URL } from "@/lib/config"

// Modify the fetchWithAuth function to include better debugging and parameter handling
export async function fetchWithAuth(endpoint: string, params: Record<string, any> = {}, options: RequestInit = {}) {
  // Obtener el token del localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("pred_token") : null

  // Configurar los headers con el token si existe
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  // Extract query parameters from params object
  const queryParams = { ...params }
  delete queryParams.body // Remove body if it exists in params

  // Build query string if there are parameters
  const queryString =
    Object.keys(queryParams).length > 0
      ? "?" + new URLSearchParams(Object.entries(queryParams).map(([key, value]) => [key, String(value)])).toString()
      : ""

  // Construir la URL completa correctamente
  const url = `${API_URL}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}${queryString}`

  console.log(`Fetching: ${url}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.parse(options.body as string) : undefined,
  }) // Enhanced debugging

  try {
    // Realizar la petición
    const response = await fetch(url, {
      ...options,
      headers,
    })

    // Log the raw response for debugging
    console.log(`Response status: ${response.status}`)

    // Clone the response to read it twice
    const responseClone = response.clone()
    const rawText = await responseClone.text()
    console.log(`Raw response: ${rawText.substring(0, 500)}${rawText.length > 500 ? "..." : ""}`)

    // Try to parse as JSON if possible
    let data
    try {
      data = JSON.parse(rawText)
    } catch (e) {
      console.log("Response is not valid JSON")
      data = rawText
    }

    // Si la respuesta no es exitosa, manejar el error
    if (!response.ok) {
      // Si el error es de autenticación (401), limpiar el token
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("pred_token")
        }
      }

      return {
        success: false,
        message: data.message || `Error HTTP: ${response.status}`,
        data: null,
        status: response.status,
        rawResponse: data,
      }
    }

    // Return a standardized response
    return {
      success: true,
      message: data.message || "Operación exitosa",
      data: data.data || data,
      status: response.status,
      rawResponse: data,
    }
  } catch (error) {
    console.error("Error en fetchWithAuth:", error)

    // Devolver un objeto de error estructurado
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
      data: null,
      status: 0,
      error,
    }
  }
}

/**
 * Método GET
 */
export async function get(endpoint: string, params: Record<string, any> = {}) {
  return fetchWithAuth(endpoint, params)
}

/**
 * Método POST
 */
export async function post(endpoint: string, body: any) {
  return fetchWithAuth(
    endpoint,
    {},
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  )
}

/**
 * Método PUT
 */
export async function put(endpoint: string, body: any) {
  return fetchWithAuth(
    endpoint,
    {},
    {
      method: "PUT",
      body: JSON.stringify(body),
    },
  )
}

/**
 * Método DELETE
 */
export async function del(endpoint: string) {
  return fetchWithAuth(
    endpoint,
    {},
    {
      method: "DELETE",
    },
  )
}

