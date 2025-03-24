import { API_URL } from "@/lib/utils"

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("pred_token")

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${API_URL}/${endpoint}`, {
    ...options,
    headers,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Error en la solicitud")
  }

  return data
}

export async function get(endpoint: string) {
  return fetchWithAuth(endpoint)
}

export async function post(endpoint: string, body: any) {
  return fetchWithAuth(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export async function put(endpoint: string, body: any) {
  return fetchWithAuth(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  })
}

export async function del(endpoint: string) {
  return fetchWithAuth(endpoint, {
    method: "DELETE",
  })
}

