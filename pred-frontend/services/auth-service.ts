import { API_URL } from "@/lib/config"
import type { User } from "@/lib/types"

interface LoginResponse {
  success: boolean
  message: string
  data: {
    token: string
    user: User
  }
}

interface RegisterData {
  nombre: string
  apellido: string
  email: string
  password: string
  cedula: string
  telefono: string
  direccion: string
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  // Construir la URL completa correctamente
  const url = `${API_URL}/auth/login`.replace(/([^:]\/)\/+/g, "$1")

  console.log(`Login request to: ${url}`) // Para depuración

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`HTTP error! status: ${response.status}, response:`, errorText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const contentType = response.headers.get("content-type")
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return await response.json()
    } else {
      const text = await response.text()
      console.error("Respuesta no JSON:", text)
      throw new Error("La respuesta no es un JSON válido")
    }
  } catch (error) {
    console.error("Error en login:", error)
    throw error
  }
}

export async function register(data: RegisterData): Promise<any> {
  // Construir la URL completa correctamente
  const url = `${API_URL}/auth/register`.replace(/([^:]\/)\/+/g, "$1")

  console.log(`Register request to: ${url}`) // Para depuración

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`HTTP error! status: ${response.status}, response:`, errorText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const contentType = response.headers.get("content-type")
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return await response.json()
    } else {
      const text = await response.text()
      console.error("Respuesta no JSON:", text)
      throw new Error("La respuesta no es un JSON válido")
    }
  } catch (error) {
    console.error("Error en register:", error)
    throw error
  }
}

export async function getCurrentUser(token: string): Promise<any> {
  // Construir la URL completa correctamente
  const url = `${API_URL}/auth/me`.replace(/([^:]\/)\/+/g, "$1")

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`HTTP error! status: ${response.status}, response:`, errorText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const contentType = response.headers.get("content-type")
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return await response.json()
    } else {
      const text = await response.text()
      console.error("Respuesta no JSON:", text)
      throw new Error("La respuesta no es un JSON válido")
    }
  } catch (error) {
    console.error("Error en getCurrentUser:", error)
    throw error
  }
}

