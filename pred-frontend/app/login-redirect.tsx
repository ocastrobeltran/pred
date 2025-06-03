"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function LoginRedirect() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Redirección basada en rol
        // rol_id: 1 = administrador, rol_id: 2 = usuario regular
        if (user.rol_id === 1) {
          // Solo administradores van al dashboard de admin
          router.push("/admin/dashboard")
        } else {
          // Usuarios regulares (rol_id: 2) y otros van al dashboard de usuario
          router.push("/dashboard")
        }
      } else {
        // No autenticado - mantener en la página principal
        // No redirigir automáticamente para evitar loops
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-green border-t-transparent"></div>
      </div>
    )
  }

  // Si hay usuario, mostrar loading mientras se redirige
  if (user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-green border-t-transparent"></div>
      </div>
    )
  }

  // Si no hay usuario, no mostrar nada (la página principal se encargará)
  return null
}
