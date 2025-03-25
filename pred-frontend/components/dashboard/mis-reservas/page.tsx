"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { getSolicitudes } from "@/services/solicitud-service"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import Link from "next/link"
import type { Solicitud } from "@/lib/types"

export default function MisReservasPage() {
  const { toast } = useToast()
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSolicitudes()
  }, [])

  const fetchSolicitudes = async () => {
    setLoading(true)
    try {
      const response = await getSolicitudes()

      if (response.success) {
        setSolicitudes(response.data.data)
      } else {
        toast({
          title: "Error",
          description: response.message || "Error al cargar solicitudes",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al cargar solicitudes:", error)
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filtrar solicitudes por estado
  const solicitudesPendientes = solicitudes.filter((s) => s.estado === "pendiente")
  const solicitudesAprobadas = solicitudes.filter((s) => s.estado === "aprobada")
  const solicitudesRechazadas = solicitudes.filter((s) => s.estado === "rechazada")
  const solicitudesCompletadas = solicitudes.filter((s) => s.estado === "completada")

  // Función para renderizar el estado con color
  const renderEstado = (estado: string) => {
    const estados: Record<string, { color: string; text: string }> = {
      pendiente: { color: "bg-yellow-100 text-yellow-800", text: "Pendiente" },
      aprobada: { color: "bg-green-100 text-green-800", text: "Aprobada" },
      rechazada: { color: "bg-red-100 text-red-800", text: "Rechazada" },
      completada: { color: "bg-blue-100 text-blue-800", text: "Completada" },
    }

    const estadoInfo = estados[estado] || { color: "bg-gray-100 text-gray-800", text: estado }

    return <span className={`rounded-full px-2 py-1 text-xs font-medium ${estadoInfo.color}`}>{estadoInfo.text}</span>
  }

  // Función para renderizar una tarjeta de solicitud
  const renderSolicitudCard = (solicitud: Solicitud) => {
    const timeAgo = formatDistanceToNow(new Date(solicitud.created_at), { locale: es, addSuffix: true })

    return (
      <Card key={solicitud.id} className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-lg font-semibold">{solicitud.escenario?.nombre || "Escenario"}</h3>
                {renderEstado(solicitud.estado)}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary-green" />
                  <span>Fecha: {new Date(solicitud.fecha_reserva).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary-green" />
                  <span>
                    Horario: {solicitud.hora_inicio.substring(0, 5)} - {solicitud.hora_fin.substring(0, 5)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary-green" />
                  <span>{solicitud.escenario?.direccion || "Dirección no disponible"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary-green" />
                  <span>Participantes: {solicitud.num_participantes}</span>
                </div>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Código: {solicitud.codigo} • Solicitado {timeAgo}
              </p>
            </div>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-primary-green text-primary-green hover:bg-primary-light-green"
            >
              <Link href={`/dashboard/mis-reservas/${solicitud.id}`}>Ver detalles</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mis Reservas</h1>
        <Button asChild className="bg-primary-green hover:bg-primary-dark-green">
          <Link href="/escenarios">Nueva Reserva</Link>
        </Button>
      </div>

      <Tabs defaultValue="todas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="todas">Todas ({solicitudes.length})</TabsTrigger>
          <TabsTrigger value="pendientes">Pendientes ({solicitudesPendientes.length})</TabsTrigger>
          <TabsTrigger value="aprobadas">Aprobadas ({solicitudesAprobadas.length})</TabsTrigger>
          <TabsTrigger value="rechazadas">Rechazadas ({solicitudesRechazadas.length})</TabsTrigger>
          <TabsTrigger value="completadas">Completadas ({solicitudesCompletadas.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="todas">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-green border-t-transparent"></div>
            </div>
          ) : solicitudes.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="mb-4 rounded-full bg-primary-light-green p-3">
                  <Calendar className="h-6 w-6 text-primary-green" />
                </div>
                <h3 className="mb-2 text-lg font-medium">No tienes reservas</h3>
                <p className="mb-4 text-sm text-muted-foreground">Aún no has realizado ninguna solicitud de reserva</p>
                <Button asChild className="bg-primary-green hover:bg-primary-dark-green">
                  <Link href="/escenarios">Explorar escenarios</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">{solicitudes.map(renderSolicitudCard)}</div>
          )}
        </TabsContent>

        <TabsContent value="pendientes">
          {solicitudesPendientes.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No tienes solicitudes pendientes</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">{solicitudesPendientes.map(renderSolicitudCard)}</div>
          )}
        </TabsContent>

        <TabsContent value="aprobadas">
          {solicitudesAprobadas.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No tienes solicitudes aprobadas</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">{solicitudesAprobadas.map(renderSolicitudCard)}</div>
          )}
        </TabsContent>

        <TabsContent value="rechazadas">
          {solicitudesRechazadas.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No tienes solicitudes rechazadas</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">{solicitudesRechazadas.map(renderSolicitudCard)}</div>
          )}
        </TabsContent>

        <TabsContent value="completadas">
          {solicitudesCompletadas.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No tienes solicitudes completadas</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">{solicitudesCompletadas.map(renderSolicitudCard)}</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

