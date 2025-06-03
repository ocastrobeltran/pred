"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/auth-context"
import { getNotificaciones, marcarComoLeida, marcarTodasComoLeidas } from "@/services/notificacion-service"
import { useToast } from "@/hooks/use-toast"
import { Bell, CheckCircle, AlertCircle, Info, XCircle, BookMarkedIcon as MarkAsUnread, Settings } from "lucide-react"

interface Notificacion {
  id: number
  titulo: string
  mensaje: string
  tipo: "success" | "error" | "warning" | "info"
  leida: boolean
  url?: string
  created_at: string
}

export default function NotificacionesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("todas")

  useEffect(() => {
    fetchNotificaciones()
  }, [])

  const fetchNotificaciones = async () => {
    try {
      setLoading(true)
      const response = await getNotificaciones()
      if (response.success) {
        setNotificaciones(response.data)
      }
    } catch (error) {
      console.error("Error al cargar notificaciones:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las notificaciones",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMarcarComoLeida = async (id: number) => {
    try {
      const response = await marcarComoLeida(id)
      if (response.success) {
        setNotificaciones((prev) => prev.map((notif) => (notif.id === id ? { ...notif, leida: true } : notif)))
      }
    } catch (error) {
      console.error("Error al marcar como leída:", error)
    }
  }

  const handleMarcarTodasComoLeidas = async () => {
    try {
      const response = await marcarTodasComoLeidas()
      if (response.success) {
        setNotificaciones((prev) => prev.map((notif) => ({ ...notif, leida: true })))
        toast({
          title: "Notificaciones marcadas",
          description: "Todas las notificaciones han sido marcadas como leídas",
        })
      }
    } catch (error) {
      console.error("Error al marcar todas como leídas:", error)
      toast({
        title: "Error",
        description: "No se pudieron marcar las notificaciones",
        variant: "destructive",
      })
    }
  }

  const getIconoTipo = (tipo: string) => {
    switch (tipo) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const getColorTipo = (tipo: string) => {
    switch (tipo) {
      case "success":
        return "border-l-green-400 bg-green-50"
      case "error":
        return "border-l-red-400 bg-red-50"
      case "warning":
        return "border-l-yellow-400 bg-yellow-50"
      case "info":
        return "border-l-blue-400 bg-blue-50"
      default:
        return "border-l-gray-400 bg-gray-50"
    }
  }

  const filteredNotificaciones = notificaciones.filter((notif) => {
    switch (activeTab) {
      case "no_leidas":
        return !notif.leida
      case "leidas":
        return notif.leida
      default:
        return true
    }
  })

  const noLeidas = notificaciones.filter((n) => !n.leida).length

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-green border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notificaciones</h1>
          <p className="text-muted-foreground">Mantente al día con las actualizaciones de tus reservas</p>
        </div>
        <div className="flex gap-2">
          {noLeidas > 0 && (
            <Button variant="outline" onClick={handleMarcarTodasComoLeidas} className="flex items-center gap-2">
              <MarkAsUnread className="h-4 w-4" />
              Marcar todas como leídas
            </Button>
          )}
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configurar
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="todas" className="flex items-center gap-2">
            Todas
            <Badge variant="secondary">{notificaciones.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="no_leidas" className="flex items-center gap-2">
            No leídas
            {noLeidas > 0 && <Badge className="bg-red-500">{noLeidas}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="leidas">Leídas</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredNotificaciones.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-4 rounded-full bg-primary-light-green p-3">
                  <Bell className="h-6 w-6 text-primary-green" />
                </div>
                <h3 className="mb-2 text-lg font-medium">
                  {activeTab === "no_leidas"
                    ? "¡Todo al día!"
                    : activeTab === "leidas"
                      ? "No hay notificaciones leídas"
                      : "No hay notificaciones"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {activeTab === "no_leidas"
                    ? "No tienes notificaciones pendientes por leer."
                    : activeTab === "leidas"
                      ? "Las notificaciones que marques como leídas aparecerán aquí."
                      : "Cuando tengas nuevas notificaciones aparecerán aquí."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredNotificaciones.map((notificacion) => (
                <Card
                  key={notificacion.id}
                  className={`border-l-4 transition-all hover:shadow-md ${
                    !notificacion.leida ? "bg-blue-50/50" : ""
                  } ${getColorTipo(notificacion.tipo)}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">{getIconoTipo(notificacion.tipo)}</div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3
                                className={`font-semibold ${!notificacion.leida ? "text-foreground" : "text-muted-foreground"}`}
                              >
                                {notificacion.titulo}
                              </h3>
                              {!notificacion.leida && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                            </div>
                            <p
                              className={`text-sm ${!notificacion.leida ? "text-foreground" : "text-muted-foreground"}`}
                            >
                              {notificacion.mensaje}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(notificacion.created_at).toLocaleString()}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {notificacion.url && (
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                onClick={() => !notificacion.leida && handleMarcarComoLeida(notificacion.id)}
                              >
                                <a href={notificacion.url}>Ver detalles</a>
                              </Button>
                            )}
                            {!notificacion.leida && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarcarComoLeida(notificacion.id)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <MarkAsUnread className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
