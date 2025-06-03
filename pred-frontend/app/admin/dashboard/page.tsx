"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/auth-context"
import { getSolicitudes, cambiarEstadoSolicitud } from "@/services/solicitud-service"
import { useToast } from "@/hooks/use-toast"
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Building,
  Activity,
} from "lucide-react"
import Link from "next/link"

interface SolicitudAdmin {
  id: number
  codigo_reserva: string
  usuario: {
    nombre: string
    apellido: string
    email: string
  }
  escenario: {
    id: number
    nombre: string
    localidad: string
  }
  fecha_reserva: string
  hora_inicio: string
  hora_fin: string
  estado: {
    id: number
    nombre: string
    color: string
  }
  proposito: {
    nombre: string
  }
  num_participantes: number
  created_at: string
  notas?: string
}

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [solicitudes, setSolicitudes] = useState<SolicitudAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [procesando, setProcesando] = useState<number | null>(null)

  // Estadísticas
  const [stats, setStats] = useState({
    totalSolicitudes: 0,
    pendientes: 0,
    aprobadas: 0,
    rechazadas: 0,
    usuariosActivos: 0,
    escenariosDisponibles: 0,
  })

  useEffect(() => {
    fetchSolicitudes()
  }, [])

  const fetchSolicitudes = async () => {
    try {
      setLoading(true)
      const response = await getSolicitudes()
      if (response.success) {
        // Handle both direct array and nested data structure
        let solicitudesData = []

        if (Array.isArray(response.data)) {
          solicitudesData = response.data
        } else if (response.data && Array.isArray(response.data.data)) {
          solicitudesData = response.data.data
        } else {
          solicitudesData = []
        }

        setSolicitudes(solicitudesData)
        calculateStats(solicitudesData)
      }
    } catch (error) {
      console.error("Error al cargar solicitudes:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las solicitudes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (solicitudes: SolicitudAdmin[]) => {
    // Ensure solicitudes is an array
    const solicitudesArray = Array.isArray(solicitudes) ? solicitudes : []

    const pendientes = solicitudesArray.filter((s) => s.estado.nombre === "pendiente").length
    const aprobadas = solicitudesArray.filter((s) => s.estado.nombre === "aprobada").length
    const rechazadas = solicitudesArray.filter((s) => s.estado.nombre === "rechazada").length

    setStats({
      totalSolicitudes: solicitudesArray.length,
      pendientes,
      aprobadas,
      rechazadas,
      usuariosActivos: 45, // Mock data
      escenariosDisponibles: 25, // Mock data
    })
  }

  const handleCambiarEstado = async (solicitudId: number, nuevoEstado: string, notas?: string) => {
    try {
      setProcesando(solicitudId)
      const response = await cambiarEstadoSolicitud(solicitudId, nuevoEstado, notas)

      if (response.success) {
        toast({
          title: "Estado actualizado",
          description: `La solicitud ha sido ${nuevoEstado}`,
        })
        fetchSolicitudes() // Recargar datos
      } else {
        toast({
          title: "Error",
          description: response.message || "No se pudo actualizar el estado",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error)
      toast({
        title: "Error",
        description: "Error de conexión",
        variant: "destructive",
      })
    } finally {
      setProcesando(null)
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "en_proceso":
        return "bg-blue-100 text-blue-800"
      case "aprobada":
        return "bg-green-100 text-green-800"
      case "rechazada":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const solicitudesPendientes = Array.isArray(solicitudes)
    ? solicitudes.filter((s) => s.estado.nombre === "pendiente")
    : []
  const solicitudesRecientes = Array.isArray(solicitudes) ? solicitudes.slice(0, 5) : []

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
          <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
          <p className="text-muted-foreground">Gestión de solicitudes y escenarios deportivos</p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Solicitudes</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSolicitudes}</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendientes}</div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.aprobadas}</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rechazadas</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rechazadas}</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.usuariosActivos}</div>
            <p className="text-xs text-muted-foreground">Último mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escenarios</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.escenariosDisponibles}</div>
            <p className="text-xs text-muted-foreground">Disponibles</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pendientes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pendientes">Solicitudes Pendientes ({stats.pendientes})</TabsTrigger>
          <TabsTrigger value="recientes">Actividad Reciente</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="pendientes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Solicitudes Pendientes de Aprobación</CardTitle>
            </CardHeader>
            <CardContent>
              {solicitudesPendientes.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">¡Todo al día!</h3>
                  <p className="text-muted-foreground">No hay solicitudes pendientes por revisar.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {solicitudesPendientes.map((solicitud) => (
                    <Card key={solicitud.id} className="border-l-4 border-l-yellow-400">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold">{solicitud.escenario.nombre}</h3>
                              <Badge className={getEstadoColor(solicitud.estado.nombre)}>
                                {solicitud.estado.nombre}
                              </Badge>
                            </div>

                            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>
                                  {solicitud.usuario.nombre} {solicitud.usuario.apellido}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(solicitud.fecha_reserva).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>
                                  {solicitud.hora_inicio} - {solicitud.hora_fin}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{solicitud.escenario.localidad}</span>
                              </div>
                            </div>

                            <div className="text-sm">
                              <span className="font-medium">Propósito:</span> {solicitud.proposito.nombre}
                            </div>

                            <div className="text-sm">
                              <span className="font-medium">Participantes:</span> {solicitud.num_participantes}
                            </div>

                            {solicitud.notas && (
                              <div className="text-sm bg-muted p-2 rounded">
                                <span className="font-medium">Notas:</span> {solicitud.notas}
                              </div>
                            )}
                          </div>

                          <div className="ml-4 flex flex-col gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleCambiarEstado(solicitud.id, "aprobada")}
                              disabled={procesando === solicitud.id}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Aprobar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleCambiarEstado(solicitud.id, "rechazada", "Revisión administrativa")}
                              disabled={procesando === solicitud.id}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Rechazar
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/admin/solicitudes/${solicitud.id}`}>Ver detalles</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recientes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {solicitudesRecientes.map((solicitud) => (
                  <div key={solicitud.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">
                        {solicitud.usuario.nombre} {solicitud.usuario.apellido}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Solicitó reserva para {solicitud.escenario.nombre}
                      </p>
                      <p className="text-xs text-muted-foreground">{new Date(solicitud.created_at).toLocaleString()}</p>
                    </div>
                    <Badge className={getEstadoColor(solicitud.estado.nombre)}>{solicitud.estado.nombre}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estadisticas" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Mes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Solicitudes totales:</span>
                    <span className="font-bold">{stats.totalSolicitudes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tasa de aprobación:</span>
                    <span className="font-bold text-green-600">
                      {stats.totalSolicitudes > 0 ? Math.round((stats.aprobadas / stats.totalSolicitudes) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tiempo promedio de respuesta:</span>
                    <span className="font-bold">2.5 días</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Escenarios Más Solicitados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Estadio Jaime Morón</span>
                    <span className="text-sm font-bold">15 solicitudes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Complejo Acuático</span>
                    <span className="text-sm font-bold">12 solicitudes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Coliseo Norton Madrid</span>
                    <span className="text-sm font-bold">8 solicitudes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
