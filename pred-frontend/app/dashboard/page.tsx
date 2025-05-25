"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { getSolicitudes } from "@/services/solicitud-service"
import { getEscenarios } from "@/services/escenario-service"
import { contarNoLeidas } from "@/services/notificacion-service"

// Función helper para renderizar datos de forma segura
const safeRender = (data: any, fallback = "N/A") => {
  if (data === null || data === undefined) return fallback
  if (typeof data === 'object') {
    return data.nombre || data.name || fallback
  }
  return String(data)
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    reservasActivas: 0,
    solicitudesPendientes: 0,
    escenariosDisponibles: 0,
    notificacionesNoLeidas: 0,
    reservasRecientes: [],
    escenariosDestacados: [],
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        // Obtener datos de solicitudes
        const solicitudesResponse = await getSolicitudes()

        // Obtener datos de escenarios
        const escenariosResponse = await getEscenarios()

        // Obtener conteo de notificaciones
        const notificacionesResponse = await contarNoLeidas()

        // Procesar datos de solicitudes
        let solicitudes = []
        if (solicitudesResponse.success && solicitudesResponse.data && solicitudesResponse.data.data) {
          solicitudes = solicitudesResponse.data.data
        }

        // Procesar datos de escenarios
        let escenarios = []
        if (escenariosResponse.success) {
          if (Array.isArray(escenariosResponse.data)) {
            escenarios = escenariosResponse.data
          } else if (escenariosResponse.data && Array.isArray(escenariosResponse.data.data)) {
            escenarios = escenariosResponse.data.data
          }
        }

        // Calcular estadísticas
        const reservasActivas = solicitudes.filter((s) => s.estado === "aprobada").length
        const solicitudesPendientes = solicitudes.filter((s) => s.estado === "pendiente").length
        const escenariosDisponibles = escenarios.length
        const notificacionesNoLeidas = notificacionesResponse.success ? notificacionesResponse.data.count : 2

        // Obtener reservas recientes (las 3 más recientes)
        const reservasRecientes = solicitudes
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 3)

        // Obtener escenarios destacados (3 aleatorios)
        const escenariosDestacados = escenarios.sort(() => 0.5 - Math.random()).slice(0, 3)

        setDashboardData({
          reservasActivas,
          solicitudesPendientes,
          escenariosDisponibles,
          notificacionesNoLeidas,
          reservasRecientes,
          escenariosDestacados,
        })
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error)
        // Usar datos simulados en caso de error
        setDashboardData({
          reservasActivas: 4,
          solicitudesPendientes: 2,
          escenariosDisponibles: 25,
          notificacionesNoLeidas: 3,
          reservasRecientes: [
            {
              id: 1,
              escenario: { nombre: "Cancha de Fútbol #3" },
              fecha_reserva: "2023-06-15",
              hora_inicio: "15:00:00",
              estado: "aprobada",
            },
            {
              id: 2,
              escenario: { nombre: "Pista de Atletismo" },
              fecha_reserva: "2023-06-10",
              hora_inicio: "18:00:00",
              estado: "completada",
            },
            {
              id: 3,
              escenario: { nombre: "Cancha de Tenis #1" },
              fecha_reserva: "2023-06-05",
              hora_inicio: "10:00:00",
              estado: "pendiente",
            },
          ],
          escenariosDestacados: [
            {
              id: 1,
              nombre: "Estadio Metropolitano",
              deporte: "Fútbol",
              localidad: "Kennedy",
            },
            {
              id: 2,
              nombre: "Complejo Acuático",
              deporte: "Natación",
              localidad: "Teusaquillo",
            },
            {
              id: 3,
              nombre: "Cancha de Baloncesto",
              deporte: "Baloncesto",
              localidad: "Chapinero",
            },
          ],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-green border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <Tabs defaultValue="resumen" className="space-y-4">
        <TabsList>
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="actividad">Actividad Reciente</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mis Reservas</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.reservasActivas}</div>
                <p className="text-xs text-muted-foreground">Reservas activas en el último mes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Solicitudes Pendientes</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.solicitudesPendientes}</div>
                <p className="text-xs text-muted-foreground">Solicitudes esperando aprobación</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Escenarios Disponibles</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 21a9 9 0 0 0 0-18" />
                  <path d="M3.6 9H12V0" />
                  <path d="M12 3.6V12H20.4" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.escenariosDisponibles}</div>
                <p className="text-xs text-muted-foreground">Escenarios para reservar</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Notificaciones</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.notificacionesNoLeidas}</div>
                <p className="text-xs text-muted-foreground">Notificaciones sin leer</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Mis Reservas Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.reservasRecientes.length > 0 ? (
                    dashboardData.reservasRecientes.map((reserva, index) => (
                      <div key={reserva.id || index} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">
                              {safeRender(reserva.escenario?.nombre, "Escenario")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {reserva.fecha_reserva ? new Date(reserva.fecha_reserva).toLocaleDateString() : "Fecha no disponible"} -{" "}
                              {reserva.hora_inicio?.substring(0, 5) || "Hora no disponible"}
                            </p>
                          </div>
                          <div
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              reserva.estado === "aprobada"
                                ? "bg-green-100 text-green-800"
                                : reserva.estado === "completada"
                                  ? "bg-blue-100 text-blue-800"
                                  : reserva.estado === "pendiente"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {safeRender(reserva.estado, "Estado")}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">No tienes reservas recientes</div>
                  )}
                </div>

                <div className="mt-4 text-center">
                  <Link href="/dashboard/mis-reservas" className="text-sm text-primary hover:underline">
                    Ver todas mis reservas
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Escenarios Destacados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.escenariosDestacados.map((escenario, index) => (
                    <div key={escenario.id || index} className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-md bg-gray-200 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold">{safeRender(escenario.nombre, "Escenario")}</p>
                        <p className="text-xs text-muted-foreground">
                          {safeRender(escenario.deporte, "Deporte")} - {safeRender(escenario.localidad, "Localidad")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-center">
                  <Link href="/escenarios" className="text-sm text-primary hover:underline">
                    Explorar todos los escenarios
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="actividad" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4 border-b pb-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-primary"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M21 15v-2a4 4 0 0 0-4-4h-2.5" />
                    <path d="M17 1v4" />
                    <path d="M19 3h-4" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Tu solicitud para la Cancha de Fútbol #3 ha sido aprobada</p>
                  <p className="text-sm text-muted-foreground">Hace 2 horas</p>
                </div>
              </div>

              <div className="flex items-start gap-4 border-b pb-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-primary"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Se ha agregado un nuevo escenario deportivo en Usaquén</p>
                  <p className="text-sm text-muted-foreground">Hace 1 día</p>
                </div>
              </div>

              <div className="flex items-start gap-4 border-b pb-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-primary"
                  >
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Recordatorio: Tienes una reserva para mañana a las 4:00 PM</p>
                  <p className="text-sm text-muted-foreground">Hace 2 días</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-primary"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Tu perfil ha sido actualizado correctamente</p>
                  <p className="text-sm text-muted-foreground">Hace 5 días</p>
                </div>
              </div>

              <div className="mt-4 text-center">
                <Link href="/dashboard/notificaciones" className="text-sm text-primary hover:underline">
                  Ver todas las notificaciones
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

