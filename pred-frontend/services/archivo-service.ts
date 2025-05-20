import { API_URL } from "@/lib/config"

/**
 * Sube un archivo al servidor
 */
export async function uploadArchivo(file: File, token: string) {
  const formData = new FormData()
  formData.append("file", file)

  // Construir la URL completa correctamente
  const url = `${API_URL}/archivos/upload`.replace(/([^:]\/)\/+/g, "$1")

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    // Verificar si la respuesta es JSON
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return await response.json()
    } else {
      const text = await response.text()
      console.error("Respuesta no JSON:", text)
      throw new Error("La respuesta no es un JSON válido")
    }
  } catch (error) {
    console.error("Error al subir archivo:", error)
    throw error
  }
}

/**
 * Elimina un archivo del servidor (solo admin)
 */
export async function deleteArchivo(fileId: string, token: string) {
  // Construir la URL completa correctamente
  const url = `${API_URL}/archivos`.replace(/([^:]\/)\/+/g, "$1")

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ file_id: fileId }),
    })

    // Verificar si la respuesta es JSON
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return await response.json()
    } else {
      const text = await response.text()
      console.error("Respuesta no JSON:", text)
      throw new Error("La respuesta no es un JSON válido")
    }
  } catch (error) {
    console.error("Error al eliminar archivo:", error)
    throw error
  }
}

