"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { getSolicitudById } from "@/services/solicitud-service"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar, Clock, MapPin, Users, FileText, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Solicitud } from "@/lib/types"

export default function DetalleSolicitudPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [solicitud, setSolicitud] = useState<Solicitud | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchSolicitud(params.id as string)
    }
  }, [params.id])

  const fetchSolicitud = async (id: string) => {
    setLoading(true)
    try {
      const response = await getSolicitudById(id)

      if (response.success) {
        setSolicitud(response.data)
      } else {
        toast({
          title: "Error",
          description: response.message || "Error al cargar la solicitud",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al cargar la solicitud:", error)
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Función para renderizar el estado con color
  const renderEstado = (estado: string) => {
    const estados: Record<string, { color: string; text: string; bgColor: string }> = {
      pendiente: { color: "text-yellow-800", text: "Pendiente", bgColor: "bg-yellow-100" },
      aprobada: { color: "text-green-800", text: "Aprobada", bgColor: "bg-green-100" },
      rechazada: { color: "text-red-800", text: "Rechazada", bgColor: "bg-red-100" },
      completada: { color: "text-blue-800", text: "Completada", bgColor: "bg-blue-100" },
    }

    const estadoInfo = estados[estado] || { color: "text-gray-800", text: estado, bgColor: "bg-gray-100" }

    return (
      <div className={`${estadoInfo.bgColor} ${estadoInfo.color} rounded-lg p-4 text-center`}>
        <p className="text-sm font-medium">Estado de la solicitud</p>
        <p className="text-xl font-bold">{estadoInfo.text}</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-green border-t-transparent"></div>
      </div>
    )
  }

  if (!solicitud) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" className="flex items-center gap-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" /> Volver
        </Button>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <p className="text-lg font-medium">No se encontró la solicitud</p>
            <p className="mb-4 text-sm text-muted-foreground">
              La solicitud que buscas no existe o no tienes permisos para verla
            </p>
            <Button asChild className="bg-primary-green hover:bg-primary-dark-green">
              <Link href="/dashboard/mis-reservas">Ver mis reservas</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" className="flex items-center gap-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" /> Volver
        </Button>
        <h1 className="text-2xl font-bold">Detalle de Reserva</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Escenario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{solicitud.escenario?.nombre || "Escenario"}</h3>
                <p className="text-muted-foreground">{solicitud.escenario?.descripcion || "Sin descripción"}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-green" />
                  <div>
                    <p className="font-medium">Dirección</p>
                    <p className="text-sm text-muted-foreground">{solicitud.escenario?.direccion || "No disponible"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Users className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-green" />
                  <div>
                    <p className="font-medium">Capacidad</p>
                    <p className="text-sm text-muted-foreground">{solicitud.escenario?.capacidad || "N/A"} personas</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Reserva</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-2">
                  <Calendar className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-green" />
                  <div>
                    <p className="font-medium">Fecha</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(solicitud.fecha_reserva), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-green" />
                  <div>
                    <p className="font-medium">Horario</p>
                    <p className="text-sm text-muted-foreground">
                      {solicitud.hora_inicio.substring(0, 5)} - {solicitud.hora_fin.substring(0, 5)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <FileText className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-green" />
                  <div>
                    <p className="font-medium">Propósito</p>
                    <p className="text-sm text-muted-foreground">{solicitud.proposito || "No especificado"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Users className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-green" />
                  <div>
                    <p className="font-medium">Participantes</p>
                    <p className="text-sm text-muted-foreground">{solicitud.num_participantes} personas</p>
                  </div>
                </div>
              </div>

              {solicitud.notas && (
                <div className="mt-4">
                  <p className="font-medium">Notas adicionales:</p>
                  <p className="text-sm text-muted-foreground">{solicitud.notas}</p>
                </div>
              )}

              {solicitud.admin_notas && (
                <div className="mt-4 rounded-lg bg-gray-50 p-4">
                  <p className="font-medium">Notas del administrador:</p>
                  <p className="text-sm text-muted-foreground">{solicitud.admin_notas}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {renderEstado(solicitud.estado)}

          <Card>
            <CardHeader>
              <CardTitle>Información de la Solicitud</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Código de reserva</p>
                <p className="text-lg font-mono">{solicitud.codigo}</p>
              </div>

              <div>
                <p className="text-sm font-medium">Fecha de solicitud</p>
                <p className="text-muted-foreground">
                  {format(new Date(solicitud.created_at), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
                </p>
              </div>

              {solicitud.updated_at !== solicitud.created_at && (
                <div>
                  <p className="text-sm font-medium">Última actualización</p>
                  <p className="text-muted-foreground">
                    {format(new Date(solicitud.updated_at), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {solicitud.estado === "aprobada" && (
            <Card className="bg-primary-light-green border-primary-green">
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-2 rounded-full bg-primary-green p-2 text-white">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <p className="font-medium text-primary-green">¡Reserva confirmada!</p>
                  <p className="text-sm text-muted-foreground">Presenta este código al llegar al escenario</p>
                  <div className="mt-2 rounded-md bg-white p-2 text-center">
                    <p className="text-xl font-mono font-bold">{solicitud.codigo}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

