"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/context/auth-context"
import { getSolicitudById, cambiarEstadoSolicitud, getEstadosSolicitud } from "@/services/solicitud-service"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Clock, MapPin, User, ArrowLeft, FileText, MessageSquare, CheckCircle, XCircle } from "lucide-react"

export default function AdminSolicitudDetallePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [solicitud, setSolicitud] = useState(null)
  const [estados, setEstados] = useState([])
  const [loading, setLoading] = useState(true)
  const [procesando, setProcesando] = useState(false)
  const [nuevoEstado, setNuevoEstado] = useState("")
  const [adminNotas, setAdminNotas] = useState("")

  const id = params?.id as string

  useEffect(() => {
    if (id) {
      fetchSolicitud()
      fetchEstados()
    }
  }, [id])

  const fetchSolicitud = async () => {
    try {
      setLoading(true)
      console.log("🔄 COMPONENT - Iniciando fetchSolicitud para ID:", id)
      const response = await getSolicitudById(id)
      console.log("📥 COMPONENT - Respuesta recibida:", response)

      if (response.success) {
        console.log("✅ COMPONENT - Respuesta exitosa, datos:", response.data)
        setSolicitud(response.data)

        if (response.data.estado && response.data.estado.nombre) {
          setNuevoEstado(response.data.estado.nombre)
          console.log("🔧 COMPONENT - Estado inicial establecido:", response.data.estado.nombre)
        } else if (response.data.estado_nombre) {
          setNuevoEstado(response.data.estado_nombre)
          console.log("🔧 COMPONENT - Estado inicial establecido (plano):", response.data.estado_nombre)
        } else {
          setNuevoEstado("creada") // valor por defecto
          console.log("🔧 COMPONENT - Estado inicial por defecto: creada")
        }
      } else {
        console.error("❌ COMPONENT - Respuesta no exitosa:", response)
        toast({
          title: "Error",
          description: response.message || "No se pudo cargar la solicitud",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("💥 COMPONENT - Error al cargar solicitud:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar la solicitud",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchEstados = async () => {
    try {
      const response = await getEstadosSolicitud()
      if (response.success) {
        // ✅ CORRECCIÓN: Manejar estructura anidada de estados
        if (Array.isArray(response.data)) {
          setEstados(response.data)
        } else if (response.data && Array.isArray(response.data.data)) {
          setEstados(response.data.data)
        } else {
          console.warn("⚠️ Estructura de estados inesperada:", response.data)
          setEstados([
            { id: 1, nombre: "creada", color: "#FFC107" },
            { id: 2, nombre: "en_proceso", color: "#007BFF" },
            { id: 3, nombre: "aprobada", color: "#28A745" },
            { id: 4, nombre: "rechazada", color: "#DC3545" },
          ])
        }
      }
    } catch (error) {
      console.error("Error al cargar estados:", error)
      // Fallback a estados mock
      setEstados([
        { id: 1, nombre: "creada", color: "#FFC107" },
        { id: 2, nombre: "en_proceso", color: "#007BFF" },
        { id: 3, nombre: "aprobada", color: "#28A745" },
        { id: 4, nombre: "rechazada", color: "#DC3545" },
      ])
    }
  }

  const handleCambiarEstado = async () => {
    if (!solicitud || nuevoEstado === (solicitud.estado?.nombre || solicitud.estado_nombre)) {
      toast({
        title: "Sin cambios",
        description: "No se ha seleccionado un estado diferente",
        variant: "destructive",
      })
      return
    }

    try {
      setProcesando(true)
      console.log("🔄 COMPONENT - Cambiando estado a:", nuevoEstado, "con notas:", adminNotas)
      const response = await cambiarEstadoSolicitud(solicitud.id, nuevoEstado, adminNotas)
      console.log("📥 COMPONENT - Respuesta cambio estado:", response)

      if (response.success) {
        toast({
          title: "Estado actualizado",
          description: `La solicitud ha sido ${nuevoEstado}`,
        })
        fetchSolicitud() // Recargar datos
        setAdminNotas("")
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
      setProcesando(false)
    }
  }

  // ✅ CORRECCIÓN: Función para acciones rápidas que ejecuta el cambio inmediatamente
  const handleAccionRapida = async (estado: string, notas: string) => {
    if (!solicitud) return

    try {
      setProcesando(true)
      console.log("⚡ COMPONENT - Acción rápida:", estado, "con notas:", notas)
      const response = await cambiarEstadoSolicitud(solicitud.id, estado, notas)
      console.log("📥 COMPONENT - Respuesta acción rápida:", response)

      if (response.success) {
        toast({
          title: "Estado actualizado",
          description: `La solicitud ha sido ${estado}`,
        })
        fetchSolicitud() // Recargar datos
        setAdminNotas("")
        setNuevoEstado(estado) // Actualizar el dropdown
      } else {
        toast({
          title: "Error",
          description: response.message || "No se pudo actualizar el estado",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error en acción rápida:", error)
      toast({
        title: "Error",
        description: "Error de conexión",
        variant: "destructive",
      })
    } finally {
      setProcesando(false)
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

  // ✅ DEBUGGING: Agregar logs para verificar el estado del componente
  console.log("🔍 COMPONENT RENDER - Estado actual:")
  console.log("🔍 loading:", loading)
  console.log("🔍 solicitud:", solicitud)
  console.log("🔍 estados:", estados)

  if (loading) {
    console.log("⏳ COMPONENT - Mostrando loading...")
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-green border-t-transparent"></div>
      </div>
    )
  }

  if (!solicitud) {
    console.log("❌ COMPONENT - No hay solicitud, mostrando error...")
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-4">
        <h2 className="text-xl font-semibold">Solicitud no encontrada</h2>
        <Button onClick={() => router.back()}>Volver</Button>
      </div>
    )
  }

  console.log("✅ COMPONENT - Renderizando solicitud:", solicitud)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Gestión de Solicitud</h1>
          <p className="text-muted-foreground">Código: {solicitud.codigo_reserva || "Sin código"}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Información principal */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Información de la Reserva</CardTitle>
                <Badge className={getEstadoColor(solicitud.estado?.nombre || solicitud.estado_nombre || "creada")}>
                  {(solicitud.estado?.nombre || solicitud.estado_nombre || "Sin estado").charAt(0).toUpperCase() +
                    (solicitud.estado?.nombre || solicitud.estado_nombre || "Sin estado").slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="font-semibold">Escenario</h3>
                  <p>{solicitud.escenario?.nombre || solicitud.escenario_nombre || "Sin escenario"}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{solicitud.escenario?.localidad || solicitud.localidad_nombre || "Sin localidad"}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Fecha y Hora</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {solicitud.fecha_reserva ? new Date(solicitud.fecha_reserva).toLocaleDateString() : "Sin fecha"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {solicitud.hora_inicio || "Sin hora"} - {solicitud.hora_fin || "Sin hora"}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="font-semibold">Propósito</h3>
                  <p>{solicitud.proposito?.nombre || solicitud.proposito_nombre || "Sin propósito"}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Participantes</h3>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{solicitud.num_participantes || 0} personas</span>
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
                {solicitud.historial && Array.isArray(solicitud.historial) && solicitud.historial.length > 0 ? (
                  solicitud.historial.map((evento, index) => (
                    <div key={evento?.id || index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-primary-green rounded-full"></div>
                        {index < solicitud.historial.length - 1 && <div className="w-px h-8 bg-border mt-2"></div>}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          {evento?.estado_anterior && (
                            <>
                              <Badge variant="outline" className="text-xs">
                                {evento.estado_anterior?.nombre || "Estado anterior"}
                              </Badge>
                              <span className="text-xs text-muted-foreground">→</span>
                            </>
                          )}
                          <Badge className={getEstadoColor(evento?.estado_nuevo?.nombre || "creada")}>
                            {evento?.estado_nuevo?.nombre || "Estado desconocido"}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium">
                          {evento?.usuario?.nombre || "Usuario"} {evento?.usuario?.apellido || ""}
                        </p>
                        {evento?.notas && <p className="text-sm text-muted-foreground mt-1">{evento.notas}</p>}
                        <p className="text-xs text-muted-foreground mt-1">
                          {evento?.created_at ? new Date(evento.created_at).toLocaleString() : "Fecha desconocida"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-primary-green rounded-full"></div>
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          className={getEstadoColor(solicitud.estado?.nombre || solicitud.estado_nombre || "creada")}
                        >
                          {solicitud.estado?.nombre || solicitud.estado_nombre || "Creada"}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">
                        {solicitud.usuario?.nombre || solicitud.usuario_nombre || "Usuario"}{" "}
                        {solicitud.usuario?.apellido || solicitud.usuario_apellido || ""}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Solicitud creada</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {solicitud.created_at ? new Date(solicitud.created_at).toLocaleString() : "Fecha desconocida"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel lateral */}
        <div className="space-y-6">
          {/* Información del solicitante */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Solicitante</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-medium">Nombre completo</h4>
                <p className="text-sm text-muted-foreground">
                  {solicitud.usuario?.nombre || solicitud.usuario_nombre || "Sin nombre"}{" "}
                  {solicitud.usuario?.apellido || solicitud.usuario_apellido || ""}
                </p>
              </div>
              <div>
                <h4 className="font-medium">Email</h4>
                <p className="text-sm text-muted-foreground">
                  {solicitud.usuario?.email || solicitud.usuario_email || "Sin email"}
                </p>
              </div>
              <div>
                <h4 className="font-medium">Teléfono</h4>
                <p className="text-sm text-muted-foreground">{solicitud.usuario?.telefono || "Sin teléfono"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Cambiar estado */}
          <Card>
            <CardHeader>
              <CardTitle>Gestionar Solicitud</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="estado">Cambiar Estado</Label>
                <Select value={nuevoEstado} onValueChange={setNuevoEstado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(estados) &&
                      estados.map((estado) => (
                        <SelectItem key={estado.id} value={estado.nombre}>
                          {estado.nombre.charAt(0).toUpperCase() + estado.nombre.slice(1)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-notas">Notas del Administrador</Label>
                <Textarea
                  id="admin-notas"
                  value={adminNotas}
                  onChange={(e) => setAdminNotas(e.target.value)}
                  placeholder="Agregar comentarios sobre la decisión..."
                  rows={3}
                />
              </div>

              <Button
                onClick={handleCambiarEstado}
                disabled={procesando || nuevoEstado === (solicitud.estado?.nombre || solicitud.estado_nombre)}
                className="w-full bg-primary-green hover:bg-primary-dark-green"
              >
                {procesando ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Actualizando...
                  </>
                ) : (
                  "Actualizar Estado"
                )}
              </Button>

              {/* Acciones rápidas */}
              <div className="space-y-2 pt-2">
                <p className="text-sm font-medium">Acciones Rápidas:</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleAccionRapida("aprobada", "Solicitud aprobada")}
                    disabled={procesando || (solicitud.estado?.nombre || solicitud.estado_nombre) === "aprobada"}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Aprobar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleAccionRapida("rechazada", "Solicitud rechazada por revisión administrativa")}
                    disabled={procesando || (solicitud.estado?.nombre || solicitud.estado_nombre) === "rechazada"}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Rechazar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información adicional */}
          <Card>
            <CardHeader>
              <CardTitle>Información de la Solicitud</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-medium">Fecha de creación</h4>
                <p className="text-sm text-muted-foreground">
                  {solicitud.created_at ? new Date(solicitud.created_at).toLocaleString() : "Fecha desconocida"}
                </p>
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

          {/* Acciones adicionales */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full" asChild>
                <a href={`/admin/escenarios/${solicitud.escenario?.id || solicitud.escenario_id}`}>Ver escenario</a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href={`/admin/usuarios/${solicitud.usuario?.id || solicitud.usuario_id}`}>Ver usuario</a>
              </Button>
              <Button className="w-full bg-primary-green hover:bg-primary-dark-green">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contactar usuario
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
