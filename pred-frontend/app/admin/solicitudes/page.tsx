"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/auth-context"
import { getSolicitudes, cambiarEstadoSolicitud, getEstadosSolicitud } from "@/services/solicitud-service"
import { useToast } from "@/hooks/use-toast"
import { HydrationBoundary } from "@/components/hydration-boundary"
import { Calendar, Clock, MapPin, User, Search, Filter, CheckCircle, XCircle } from "lucide-react"
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

export default function AdminSolicitudesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [solicitudes, setSolicitudes] = useState<SolicitudAdmin[]>([])
  const [estados, setEstados] = useState([])
  const [loading, setLoading] = useState(true)
  const [procesando, setProcesando] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [estadoFilter, setEstadoFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("todas")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchSolicitudes()
    fetchEstados()
  }, [currentPage])

  const fetchSolicitudes = async () => {
    try {
      setLoading(true)
      const filters = {
        search: searchTerm || undefined,
        estado: estadoFilter !== "all" ? estadoFilter : undefined,
      }

      const response = await getSolicitudes(currentPage, filters)
      if (response.success) {
        let solicitudesData: SolicitudAdmin[] = []

        // Manejar diferentes estructuras de respuesta
        if (Array.isArray(response.data)) {
          solicitudesData = response.data
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          solicitudesData = response.data.data
          setTotalPages(response.data.pagination?.last_page || 1)
        } else {
          console.warn("Estructura de solicitudes inesperada:", response.data)
          solicitudesData = []
        }

        setSolicitudes(solicitudesData)
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

  const fetchEstados = async () => {
    try {
      const response = await getEstadosSolicitud()
      if (response.success) {
        setEstados(response.data || [])
      }
    } catch (error) {
      console.error("Error al cargar estados:", error)
    }
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

  const handleSearch = () => {
    setCurrentPage(1)
    fetchSolicitudes()
  }

  const handleFilterChange = () => {
    setCurrentPage(1)
    fetchSolicitudes()
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

  const filteredSolicitudes = Array.isArray(solicitudes)
    ? solicitudes.filter((solicitud) => {
        const matchesTab =
          activeTab === "todas" ||
          (activeTab === "pendientes" && solicitud.estado?.nombre === "pendiente") ||
          (activeTab === "aprobadas" && solicitud.estado?.nombre === "aprobada") ||
          (activeTab === "rechazadas" && solicitud.estado?.nombre === "rechazada")

        return matchesTab
      })
    : []

  if (loading && solicitudes.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-green border-t-transparent"></div>
      </div>
    )
  }

  return (
    <HydrationBoundary>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Solicitudes</h1>
            <p className="text-muted-foreground">Administra las solicitudes de reserva</p>
          </div>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por código, usuario o escenario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select
                  value={estadoFilter}
                  onValueChange={(value) => {
                    setEstadoFilter(value)
                    handleFilterChange()
                  }}
                >
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    {Array.isArray(estados) &&
                      estados.map((estado: any) => (
                        <SelectItem key={estado.id} value={estado.nombre}>
                          {estado.nombre.charAt(0).toUpperCase() + estado.nombre.slice(1)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleSearch}>
                  Buscar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
            <TabsTrigger value="aprobadas">Aprobadas</TabsTrigger>
            <TabsTrigger value="rechazadas">Rechazadas</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredSolicitudes.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="mb-4 rounded-full bg-primary-light-green p-3">
                    <Calendar className="h-6 w-6 text-primary-green" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">No hay solicitudes</h3>
                  <p className="text-sm text-muted-foreground">
                    {activeTab === "todas" ? "No se encontraron solicitudes." : `No hay solicitudes ${activeTab}.`}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredSolicitudes.map((solicitud) => (
                  <Card key={solicitud.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg">{solicitud.escenario?.nombre}</h3>
                            <Badge className={getEstadoColor(solicitud.estado?.nombre)}>
                              {solicitud.estado?.nombre?.charAt(0).toUpperCase() + solicitud.estado?.nombre?.slice(1)}
                            </Badge>
                          </div>

                          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <User className="h-4 w-4" />
                              <span>
                                {solicitud.usuario?.nombre} {solicitud.usuario?.apellido}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(solicitud.fecha_reserva).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>
                                {solicitud.hora_inicio} - {solicitud.hora_fin}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{solicitud.escenario?.localidad}</span>
                            </div>
                          </div>

                          <div className="text-sm">
                            <span className="font-medium">Propósito:</span> {solicitud.proposito?.nombre}
                          </div>

                          <div className="text-sm">
                            <span className="font-medium">Participantes:</span> {solicitud.num_participantes}
                          </div>

                          <div className="text-sm">
                            <span className="font-medium">Código:</span> {solicitud.codigo_reserva}
                          </div>

                          {solicitud.notas && (
                            <div className="rounded-md bg-muted p-3">
                              <span className="font-medium text-sm">Notas:</span>
                              <p className="text-sm mt-1">{solicitud.notas}</p>
                            </div>
                          )}
                        </div>

                        <div className="ml-4 flex flex-col gap-2">
                          {solicitud.estado?.nombre === "pendiente" && (
                            <>
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
                                onClick={() =>
                                  handleCambiarEstado(solicitud.id, "rechazada", "Revisión administrativa")
                                }
                                disabled={procesando === solicitud.id}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Rechazar
                              </Button>
                            </>
                          )}
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

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  <div className="flex items-center px-2">
                    <span className="text-sm">
                      Página {currentPage} de {totalPages}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </HydrationBoundary>
  )
}
