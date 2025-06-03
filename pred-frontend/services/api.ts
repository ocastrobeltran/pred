import { API_URL } from "@/lib/config"

interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
}

// Función para obtener el token del localStorage
const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("pred_token")
  }
  return null
}

// Función para manejar respuestas de la API
const handleResponse = async (response: Response): Promise<ApiResponse> => {
  const contentType = response.headers.get("content-type")

  try {
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          message: data.message || `Error ${response.status}`,
          error: data.error,
        }
      }

      return {
        success: true,
        message: data.message || "Operación exitosa",
        data: data,
      }
    } else {
      const text = await response.text()
      return {
        success: false,
        message: text || `Error ${response.status}`,
      }
    }
  } catch (error) {
    return {
      success: false,
      message: "Error al procesar la respuesta del servidor",
    }
  }
}

// Función GET
export const get = async (endpoint: string): Promise<ApiResponse> => {
  try {
    const token = getToken()
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: "GET",
      headers,
    })

    return handleResponse(response)
  } catch (error) {
    console.error("Error en GET request:", error)
    return {
      success: false,
      message: "Error de conexión con el servidor",
    }
  }
}

// Función POST
export const post = async (endpoint: string, data: any): Promise<ApiResponse> => {
  try {
    const token = getToken()
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    })

    return handleResponse(response)
  } catch (error) {
    console.error("Error en POST request:", error)
    return {
      success: false,
      message: "Error de conexión con el servidor",
    }
  }
}

// Función PUT
export const put = async (endpoint: string, data: any): Promise<ApiResponse> => {
  try {
    const token = getToken()
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    })

    return handleResponse(response)
  } catch (error) {
    console.error("Error en PUT request:", error)
    return {
      success: false,
      message: "Error de conexión con el servidor",
    }
  }
}

// Función DELETE
export const del = async (endpoint: string): Promise<ApiResponse> => {
  try {
    const token = getToken()
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: "DELETE",
      headers,
    })

    return handleResponse(response)
  } catch (error) {
    console.error("Error en DELETE request:", error)
    return {
      success: false,
      message: "Error de conexión con el servidor",
    }
  }
}
