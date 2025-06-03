"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/auth-context"
import { getSolicitudById } from "@/services/solicitud-service"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Clock, MapPin, User, ArrowLeft, FileText, MessageSquare } from "lucide-react"

interface SolicitudDetalle {
  id: number
  codigo_reserva: string
  usuario: {
    nombre: string
    apellido: string
    email: string
    telefono: string
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
  notas: string
  admin_notas?: string
  admin?: {
    nombre: string
    apellido: string
  }
  fecha_respuesta?: string
  created_at: string
  historial: Array<{
    id: number
    estado_anterior?: {
      nombre: string
      color: string
    }
    estado_nuevo: {
      nombre: string
      color: string
    }
    usuario: {
      nombre: string
      apellido: string
    }
    notas: string
    created_at: string
  }>
}

export default function SolicitudDetallePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [solicitud, setSolicitud] = useState<SolicitudDetalle | null>(null)
  const [loading, setLoading] = useState(true)

  const id = params?.id as string

  useEffect(() => {
    if (id) {
      fetchSolicitud()
    }
  }, [id])

  const fetchSolicitud = async () => {
    try {
      setLoading(true)
      const response = await getSolicitudById(id)
      if (response.success && response.data) {
        console.log("✅ Solicitud cargada exitosamente:", response.data)
        setSolicitud(response.data)
      } else {
        console.error("❌ Error en la respuesta:", response)
        toast({
          title: "Error",
          description: response.message || "No se pudo cargar la solicitud",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al cargar solicitud:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar la solicitud",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getEstadoColor = (estado: string | undefined) => {
    if (!estado) return "bg-gray-100 text-gray-800"

    switch (estado.toLowerCase()) {
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

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-green border-t-transparent"></div>
      </div>
    )
  }

  if (!solicitud) {
    // Validación adicional de datos requeridos
    if (!solicitud?.estado || !solicitud?.usuario || !solicitud?.escenario) {
      return (
        <div className="flex flex-col items-center justify-center h-40 gap-4">
          <h2 className="text-xl font-semibold">Datos de solicitud incompletos</h2>
          <Button onClick={() => router.back()}>Volver</Button>
        </div>
      )
    }
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-4">
        <h2 className="text-xl font-semibold">Solicitud no encontrada</h2>
        <Button onClick={() => router.back()}>Volver</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Detalle de Solicitud</h1>
          <p className="text-muted-foreground">Código: {solicitud.codigo_reserva}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Información principal */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Información de la Reserva</CardTitle>
                <Badge className={getEstadoColor(solicitud.estado?.nombre)}>
                  {solicitud.estado.nombre.charAt(0).toUpperCase() + solicitud.estado.nombre.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="font-semibold">Escenario</h3>
                  <p>{solicitud.escenario.nombre}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{solicitud.escenario.localidad}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Fecha y Hora</h3>
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
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="font-semibold">Propósito</h3>
                  <p>{solicitud.proposito.nombre}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Participantes</h3>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{solicitud.num_participantes} personas</span>
                  </div>
                </div>
              </div>

              {solicitud.notas && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="font-semibold">Notas adicionales</h3>
                    <p className="text-sm bg-muted p-3 rounded-md">{solicitud.notas}</p>
                  </div>
                </>
              )}

              {solicitud.admin_notas && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="font-semibold">Notas del administrador</h3>
                    <p className="text-sm bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
                      {solicitud.admin_notas}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Historial */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Historial de Estados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {solicitud.historial.map((evento, index) => (
                  <div key={evento.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-primary-green rounded-full"></div>
                      {index < solicitud.historial.length - 1 && <div className="w-px h-8 bg-border mt-2"></div>}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        {evento.estado_anterior && (
                          <>
                            <Badge variant="outline" className="text-xs">
                              {evento.estado_anterior.nombre}
                            </Badge>
                            <span className="text-xs text-muted-foreground">→</span>
                          </>
                        )}
                        <Badge className={getEstadoColor(evento.estado_nuevo?.nombre)}>
                          {evento.estado_nuevo.nombre}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">
                        {evento.usuario.nombre} {evento.usuario.apellido}
                      </p>
                      {evento.notas && <p className="text-sm text-muted-foreground mt-1">{evento.notas}</p>}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(evento.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Información del solicitante */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Solicitante</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-medium">Nombre completo</h4>
                <p className="text-sm text-muted-foreground">
                  {solicitud.usuario.nombre} {solicitud.usuario.apellido}
                </p>
              </div>
              <div>
                <h4 className="font-medium">Email</h4>
                <p className="text-sm text-muted-foreground">{solicitud.usuario.email}</p>
              </div>
              <div>
                <h4 className="font-medium">Teléfono</h4>
                <p className="text-sm text-muted-foreground">{solicitud.usuario.telefono}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información de la Solicitud</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-medium">Fecha de creación</h4>
                <p className="text-sm text-muted-foreground">{new Date(solicitud.created_at).toLocaleString()}</p>
              </div>
              {solicitud.fecha_respuesta && (
                <div>
                  <h4 className="font-medium">Fecha de respuesta</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(solicitud.fecha_respuesta).toLocaleString()}
                  </p>
                </div>
              )}
              {solicitud.admin && (
                <div>
                  <h4 className="font-medium">Administrador asignado</h4>
                  <p className="text-sm text-muted-foreground">
                    {solicitud.admin.nombre} {solicitud.admin.apellido}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Acciones */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full" asChild>
                <a href={`/escenarios/${solicitud.escenario.id}`}>Ver escenario</a>
              </Button>
              {solicitud.estado.nombre === "aprobada" && (
                <Button className="w-full bg-primary-green hover:bg-primary-dark-green">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contactar soporte
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
