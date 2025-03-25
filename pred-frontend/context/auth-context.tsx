"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getCurrentUser, login as loginService } from "@/services/auth-service"
import type { User } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const { toast } = useToast()

  // Comprobar si hay una sesión guardada al cargar la aplicación
  useEffect(() => {
    const savedToken = localStorage.getItem("pred_token")
    if (savedToken) {
      setToken(savedToken)
      fetchUser(savedToken)
    } else {
      setLoading(false)
    }
  }, [])

  // Obtener datos del usuario actual
  const fetchUser = async (authToken: string) => {
    setLoading(true)
    try {
      const response = await getCurrentUser(authToken)

      if (response.success) {
        setUser(response.data)
      } else {
        // Si hay un error, limpiar el token
        localStorage.removeItem("pred_token")
        setToken(null)
      }
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error)
      localStorage.removeItem("pred_token")
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  // Iniciar sesión
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await loginService(email, password)

      if (response.success) {
        localStorage.setItem("pred_token", response.data.token)
        setToken(response.data.token)
        setUser(response.data.user)
        return true
      } else {
        toast({
          title: "Error de inicio de sesión",
          description: response.message || "Credenciales incorrectas",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      console.error("Error de inicio de sesión:", error)
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
      })
      return false
    }
  }

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem("pred_token")
    setToken(null)
    setUser(null)
  }

  // Refrescar datos del usuario
  const refreshUser = async () => {
    if (token) {
      await fetchUser(token)
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, refreshUser }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}

