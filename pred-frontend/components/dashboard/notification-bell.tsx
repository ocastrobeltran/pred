"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  getNotificaciones,
  contarNoLeidas,
  marcarComoLeida,
  type NotificacionData,
} from "@/services/notificacion-service"
import Link from "next/link"

export function NotificationBell() {
  const [notificaciones, setNotificaciones] = useState<NotificacionData[]>([])
  const [noLeidas, setNoLeidas] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchNotificaciones = async () => {
    try {
      setLoading(true)
      console.log("🔔 NotificationBell: Cargando notificaciones...")

      // ✅ CORRECCIÓN: Sin parámetro limit
      const response = await getNotificaciones(1)
      console.log("📥 NotificationBell: Respuesta completa de notificaciones:", response)

      if (response && response.success && response.data) {
        // ✅ CORRECCIÓN: Aplicar la misma lógica de triple anidamiento
        let notificacionesData: NotificacionData[] = []

        // Triple anidamiento
        if (response.data.data && response.data.data.data && Array.isArray(response.data.data.data)) {
          notificacionesData = response.data.data.data
          console.log(`✅ NotificationBell: Extraídas ${notificacionesData.length} notificaciones (triple anidado)`)
        }
        // Doble anidamiento
        else if (response.data.data && Array.isArray(response.data.data)) {
          notificacionesData = response.data.data
          console.log(`✅ NotificationBell: Extraídas ${notificacionesData.length} notificaciones (doble anidado)`)
        }
        // Array directo
        else if (Array.isArray(response.data)) {
          notificacionesData = response.data
          console.log(`✅ NotificationBell: Extraídas ${notificacionesData.length} notificaciones (array directo)`)
        } else {
          console.warn("⚠️ NotificationBell: Estructura de notificaciones inesperada:", response.data)
        }

        // Limitar a 5 notificaciones para el bell
        notificacionesData = notificacionesData.slice(0, 5)
        console.log("🔔 NotificationBell: Notificaciones procesadas:", notificacionesData)
        setNotificaciones(notificacionesData)
      }

      // Contar no leídas
      const countResponse = await contarNoLeidas()
      console.log("📊 NotificationBell: Respuesta de conteo:", countResponse)

      if (countResponse && countResponse.success && countResponse.data) {
        setNoLeidas(countResponse.data.count || 0)
      }
    } catch (error) {
      console.error("💥 NotificationBell: Error al cargar notificaciones:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotificaciones()
  }, [])

  const handleMarcarLeida = async (id: number) => {
    try {
      await marcarComoLeida(id)
      // Actualizar la lista
      fetchNotificaciones()
    } catch (error) {
      console.error("Error al marcar notificación como leída:", error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {noLeidas > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
              {noLeidas > 9 ? "9+" : noLeidas}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          Notificaciones
          {noLeidas > 0 && <Badge variant="secondary">{noLeidas} nuevas</Badge>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        ) : notificaciones.length > 0 ? (
          <>
            {notificaciones.slice(0, 5).map((notificacion) => (
              <DropdownMenuItem
                key={notificacion.id}
                className="flex flex-col items-start p-3 cursor-pointer"
                onClick={() => {
                  if (!notificacion.leida) {
                    handleMarcarLeida(notificacion.id)
                  }
                }}
              >
                <div className="flex w-full items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{notificacion.titulo}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{notificacion.mensaje}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notificacion.created_at).toLocaleString()}
                    </p>
                  </div>
                  {!notificacion.leida && <div className="h-2 w-2 rounded-full bg-blue-500 mt-1 ml-2"></div>}
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/notificaciones" className="w-full text-center">
                Ver todas las notificaciones
              </Link>
            </DropdownMenuItem>
          </>
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">No hay notificaciones</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
