"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { getSolicitudes, type SolicitudData } from "@/services/solicitud-service"
import { getNotificaciones, contarNoLeidas, type NotificacionData } from "@/services/notificacion-service"
import { useToast } from "@/hooks/use-toast"
import { HydrationBoundary } from "@/components/hydration-boundary"
import Link from "next/link"
import { Calendar, Clock, Bell, FileText, Building, ArrowRight, User } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [solicitudes, setSolicitudes] = useState<SolicitudData[]>([])
  const [notificaciones, setNotificaciones] = useState<NotificacionData[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    solicitudesPendientes: 0,
    solicitudesAprobadas: 0,
    notificacionesNoLeidas: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        console.log("🔄 Dashboard: Iniciando carga de datos...")

        // Cargar solicitudes del usuario actual
        const solicitudesRes = await getSolicitudes(1, { limit: 50 })
        console.log("📥 Dashboard: Respuesta de solicitudes:", solicitudesRes)

        if (solicitudesRes && solicitudesRes.success && solicitudesRes.data) {
          console.log("✅ Dashboard: Procesando solicitudes...")

          // ✅ CORRECCIÓN: Aplicar la misma lógica de triple anidamiento
          let solicitudesData: SolicitudData[] = []

          // Caso 1: Triple anidamiento response.data.data.data
          if (
            solicitudesRes.data.data &&
            solicitudesRes.data.data.data &&
            Array.isArray(solicitudesRes.data.data.data)
          ) {
            solicitudesData = solicitudesRes.data.data.data
            console.log(
              `✅ Dashboard: Extraídas ${solicitudesData.length} solicitudes de response.data.data.data (triple anidado)`,
            )
          }
          // Caso 2: Doble anidamiento response.data.data
          else if (solicitudesRes.data.data && Array.isArray(solicitudesRes.data.data)) {
            solicitudesData = solicitudesRes.data.data
            console.log(
              `✅ Dashboard: Extraídas ${solicitudesData.length} solicitudes de response.data.data (doble anidado)`,
            )
          }
          // Caso 3: Array directo response.data
          else if (Array.isArray(solicitudesRes.data)) {
            solicitudesData = solicitudesRes.data
            console.log(
              `✅ Dashboard: Extraídas ${solicitudesData.length} solicitudes de response.data (array directo)`,
            )
          } else {
            console.warn("⚠️ Dashboard: Estructura de solicitudes inesperada:", solicitudesRes.data)
            solicitudesData = []
          }

          console.log("🔍 Dashboard: Solicitudes procesadas:", solicitudesData)
          console.log("📊 Dashboard: Primera solicitud:", solicitudesData[0])
          setSolicitudes(solicitudesData)

          // Calcular estadísticas de solicitudes
          const pendientes = solicitudesData.filter(
            (s) => s.estado?.nombre === "pendiente" || s.estado?.nombre === "creada",
          ).length
          const aprobadas = solicitudesData.filter((s) => s.estado?.nombre === "aprobada").length

          console.log("📊 Dashboard: Estadísticas calculadas:", {
            pendientes,
            aprobadas,
            total: solicitudesData.length,
          })

          setStats((prev) => ({
            ...prev,
            solicitudesPendientes: pendientes,
            solicitudesAprobadas: aprobadas,
          }))
        } else {
          console.error("❌ Dashboard: Error en respuesta de solicitudes:", solicitudesRes)
        }

        // Cargar notificaciones recientes - ✅ CORRECCIÓN: Sin parámetro limit
        const notificacionesRes = await getNotificaciones(1)
        console.log("📥 Dashboard: Respuesta de notificaciones:", notificacionesRes)

        if (notificacionesRes && notificacionesRes.success && notificacionesRes.data) {
          // ✅ CORRECCIÓN: Aplicar la misma lógica para notificaciones
          let notificacionesData: NotificacionData[] = []

          // Triple anidamiento
          if (
            notificacionesRes.data.data &&
            notificacionesRes.data.data.data &&
            Array.isArray(notificacionesRes.data.data.data)
          ) {
            notificacionesData = notificacionesRes.data.data.data
            console.log(`✅ Dashboard: Extraídas ${notificacionesData.length} notificaciones (triple anidado)`)
          }
          // Doble anidamiento
          else if (notificacionesRes.data.data && Array.isArray(notificacionesRes.data.data)) {
            notificacionesData = notificacionesRes.data.data
            console.log(`✅ Dashboard: Extraídas ${notificacionesData.length} notificaciones (doble anidado)`)
          }
          // Array directo
          else if (Array.isArray(notificacionesRes.data)) {
            notificacionesData = notificacionesRes.data
            console.log(`✅ Dashboard: Extraídas ${notificacionesData.length} notificaciones (array directo)`)
          } else {
            console.warn("⚠️ Dashboard: Estructura de notificaciones inesperada:", notificacionesRes.data)
          }

          // Limitar a 5 notificaciones para el dashboard
          notificacionesData = notificacionesData.slice(0, 5)
          console.log("🔔 Dashboard: Notificaciones procesadas:", notificacionesData)
          setNotificaciones(notificacionesData)
        }

        // Contar notificaciones no leídas
        const noLeidasRes = await contarNoLeidas()
        console.log("📊 Dashboard: Respuesta de conteo no leídas:", noLeidasRes)

        if (noLeidasRes && noLeidasRes.success && noLeidasRes.data) {
          setStats((prev) => ({
            ...prev,
            notificacionesNoLeidas: noLeidasRes.data.count || 0,
          }))
        }
      } catch (error) {
        console.error("💥 Dashboard: Error al cargar datos:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos del dashboard",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [toast, user])

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-green border-t-transparent"></div>
      </div>
    )
  }

  return (
    <HydrationBoundary>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Bienvenido, {user?.nombre}</h1>
          <p className="text-muted-foreground">Aquí puedes gestionar tus reservas y ver notificaciones</p>
        </div>

        {/* Debug info - Temporal para diagnóstico */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-green-800 mb-2">🔍 Dashboard Debug</h3>
            <div className="text-sm text-green-700 space-y-1">
              <p>📊 Total solicitudes: {solicitudes.length}</p>
              <p>⏳ Pendientes: {stats.solicitudesPendientes}</p>
              <p>✅ Aprobadas: {stats.solicitudesAprobadas}</p>
              <p>🔔 Notificaciones no leídas: {stats.notificacionesNoLeidas}</p>
              <p>📧 Notificaciones cargadas: {notificaciones.length}</p>
              <p>📝 Es array solicitudes: {Array.isArray(solicitudes) ? "Sí" : "No"}</p>
              <p>
                👤 Usuario actual: {user?.nombre} (ID: {user?.id})
              </p>
              {solicitudes.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium">Estados de solicitudes:</p>
                  {solicitudes.map((s, i) => (
                    <span key={i} className="inline-block bg-green-100 px-2 py-1 rounded text-xs mr-1 mb-1">
                      ID:{s.id} - {s.estado?.nombre || "sin estado"} - Usuario:{s.usuario?.id}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tarjetas de estadísticas */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Solicitudes Pendientes</CardTitle>
              <FileText className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.solicitudesPendientes}</div>
              <p className="text-xs text-muted-foreground">Esperando aprobación</p>
              <Button variant="link" size="sm" className="mt-2 px-0" asChild>
                <Link href="/dashboard/solicitudes?tab=pendientes">
                  Ver solicitudes <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reservas Aprobadas</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.solicitudesAprobadas}</div>
              <p className="text-xs text-muted-foreground">Reservas confirmadas</p>
              <Button variant="link" size="sm" className="mt-2 px-0" asChild>
                <Link href="/dashboard/solicitudes?tab=aprobadas">
                  Ver reservas <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notificaciones</CardTitle>
              <Bell className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.notificacionesNoLeidas}</div>
              <p className="text-xs text-muted-foreground">No leídas</p>
              <Button variant="link" size="sm" className="mt-2 px-0" asChild>
                <Link href="/dashboard/notificaciones">
                  Ver notificaciones <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Actividad reciente y próximas reservas */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Próximas reservas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Próximas Reservas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Array.isArray(solicitudes) && solicitudes.filter((s) => s.estado?.nombre === "aprobada").length > 0 ? (
                <div className="space-y-4">
                  {solicitudes
                    .filter((s) => s.estado?.nombre === "aprobada")
                    .slice(0, 3)
                    .map((solicitud) => (
                      <div key={solicitud.id} className="flex items-start gap-3 border-b pb-3 last:border-0">
                        <div className="rounded-md bg-primary-light-green p-2">
                          <Calendar className="h-4 w-4 text-primary-green" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{solicitud.escenario?.nombre || "Escenario"}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(solicitud.fecha_reserva).toLocaleDateString()} • {solicitud.hora_inicio} -{" "}
                              {solicitud.hora_fin}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/solicitudes/${solicitud.id}`}>Ver</Link>
                        </Button>
                      </div>
                    ))}
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/dashboard/solicitudes?tab=aprobadas">Ver todas las reservas</Link>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Calendar className="mb-2 h-10 w-10 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No tienes reservas próximas</h3>
                  <p className="text-sm text-muted-foreground">
                    Cuando tus solicitudes sean aprobadas, aparecerán aquí
                  </p>
                  <Button className="mt-4 bg-primary-green hover:bg-primary-dark-green" asChild>
                    <Link href="/escenarios">Reservar escenario</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notificaciones recientes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificaciones Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Array.isArray(notificaciones) && notificaciones.length > 0 ? (
                <div className="space-y-4">
                  {notificaciones.slice(0, 3).map((notificacion) => (
                    <div key={notificacion.id} className="flex items-start gap-3 border-b pb-3 last:border-0">
                      <div
                        className={`rounded-md p-2 ${
                          notificacion.tipo === "success"
                            ? "bg-green-100"
                            : notificacion.tipo === "warning"
                              ? "bg-yellow-100"
                              : notificacion.tipo === "error"
                                ? "bg-red-100"
                                : "bg-blue-100"
                        }`}
                      >
                        <Bell
                          className={`h-4 w-4 ${
                            notificacion.tipo === "success"
                              ? "text-green-600"
                              : notificacion.tipo === "warning"
                                ? "text-yellow-600"
                                : notificacion.tipo === "error"
                                  ? "text-red-600"
                                  : "text-blue-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{notificacion.titulo}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-1">{notificacion.mensaje}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notificacion.created_at).toLocaleString()}
                        </p>
                      </div>
                      {notificacion.url && (
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={notificacion.url}>Ver</Link>
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/dashboard/notificaciones">Ver todas las notificaciones</Link>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Bell className="mb-2 h-10 w-10 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No tienes notificaciones recientes</h3>
                  <p className="text-sm text-muted-foreground">Las actualizaciones importantes aparecerán aquí</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Accesos rápidos */}
        <Card>
          <CardHeader>
            <CardTitle>Accesos Rápidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button variant="outline" className="h-auto flex-col items-center justify-center p-6 space-y-2" asChild>
                <Link href="/escenarios">
                  <Building className="h-8 w-8 mb-2" />
                  <span className="text-lg font-medium">Explorar Escenarios</span>
                  <span className="text-sm text-muted-foreground text-center">
                    Busca y reserva escenarios deportivos
                  </span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col items-center justify-center p-6 space-y-2" asChild>
                <Link href="/dashboard/solicitudes">
                  <FileText className="h-8 w-8 mb-2" />
                  <span className="text-lg font-medium">Mis Solicitudes</span>
                  <span className="text-sm text-muted-foreground text-center">Revisa el estado de tus reservas</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col items-center justify-center p-6 space-y-2" asChild>
                <Link href="/dashboard/perfil">
                  <User className="h-8 w-8 mb-2" />
                  <span className="text-lg font-medium">Mi Perfil</span>
                  <span className="text-sm text-muted-foreground text-center">Actualiza tu información personal</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </HydrationBoundary>
  )
}
