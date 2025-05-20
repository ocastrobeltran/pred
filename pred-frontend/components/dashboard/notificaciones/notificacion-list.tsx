"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"
import { getNotificaciones, marcarLeida, marcarTodasLeidas } from "@/services/notificacion-service"
import { NotificacionCard } from "./notificacion-card"
import { CheckCheck } from "lucide-react"
import type { Notificacion } from "@/lib/types"

export function NotificacionList() {
  const { token } = useAuth()
  const { toast } = useToast()
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotificaciones()
  }, [token])

  const fetchNotificaciones = async () => {
    if (!token) return

    setLoading(true)
    try {
      const response = await getNotificaciones()

      if (response.success) {
        setNotificaciones(response.data.data)
      } else {
        toast({
          title: "Error",
          description: response.message || "Error al cargar notificaciones",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al cargar notificaciones:", error)
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMarcarLeida = async (id: number) => {
    if (!token) return

    try {
      const response = await marcarLeida(id)

      if (response.success) {
        // Actualizar el estado local
        setNotificaciones((prevNotificaciones) =>
          prevNotificaciones.map((notif) => (notif.id === id ? { ...notif, leida: true } : notif)),
        )
      } else {
        toast({
          title: "Error",
          description: response.message || "Error al marcar notificación como leída",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al marcar notificación como leída:", error)
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
      })
    }
  }

  const handleMarcarTodasLeidas = async () => {
    if (!token) return

    try {
      const response = await marcarTodasLeidas()

      if (response.success) {
        // Actualizar el estado local
        setNotificaciones((prevNotificaciones) => prevNotificaciones.map((notif) => ({ ...notif, leida: true })))

        toast({
          title: "Éxito",
          description: "Todas las notificaciones han sido marcadas como leídas",
        })
      } else {
        toast({
          title: "Error",
          description: response.message || "Error al marcar todas las notificaciones como leídas",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al marcar todas las notificaciones como leídas:", error)
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-green border-t-transparent"></div>
      </div>
    )
  }

  if (notificaciones.length === 0) {
    return (
      <div className="flex h-40 flex-col items-center justify-center gap-2 text-center">
        <p className="text-lg font-medium">No tienes notificaciones</p>
        <p className="text-sm text-muted-foreground">
          Las notificaciones aparecerán aquí cuando haya actualizaciones importantes
        </p>
      </div>
    )
  }

  const notificacionesNoLeidas = notificaciones.filter((n) => !n.leida)
  const hayNoLeidas = notificacionesNoLeidas.length > 0

  return (
    <div>
      {hayNoLeidas && (
        <div className="mb-6 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Tienes {notificacionesNoLeidas.length} notificaciones sin leer
          </p>
          <Button variant="outline" size="sm" onClick={handleMarcarTodasLeidas}>
            <CheckCheck className="h-4 w-4 mr-2" />
            Marcar todas como leídas
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {notificaciones.map((notificacion) => (
          <NotificacionCard key={notificacion.id} {...notificacion} onMarcarLeida={handleMarcarLeida} />
        ))}
      </div>
    </div>
  )
}

