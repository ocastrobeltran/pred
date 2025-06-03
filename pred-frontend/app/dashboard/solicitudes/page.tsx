"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/auth-context"
import {
  getSolicitudes,
  getEstadosSolicitud,
  type SolicitudData,
  type EstadoSolicitud,
} from "@/services/solicitud-service"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Clock, MapPin, User, Search, Filter } from "lucide-react"
import Link from "next/link"

export default function SolicitudesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [solicitudes, setSolicitudes] = useState<SolicitudData[]>([])
  const [estados, setEstados] = useState<EstadoSolicitud[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [estadoFilter, setEstadoFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("todas")

  useEffect(() => {
    fetchSolicitudes()
    fetchEstados()
  }, [])

  const fetchSolicitudes = async () => {
    try {
      setLoading(true)
      console.log("🔄 Iniciando carga de solicitudes...")

      const response = await getSolicitudes(1, { limit: 50 })
      console.log("📥 Respuesta completa:", response)

      if (response && response.success && response.data) {
        console.log("✅ Respuesta exitosa, procesando datos...")
        console.log("🔍 Estructura completa:", JSON.stringify(response.data, null, 2))

        // ✅ CORRECCIÓN: Manejo de estructura triple anidada
        let solicitudesData: SolicitudData[] = []

        // Caso 1: Triple anidado response.data.data.data
        if (response.data.data && response.data.data.data && Array.isArray(response.data.data.data)) {
          solicitudesData = response.data.data.data
          console.log(`✅ Extraídas ${solicitudesData.length} solicitudes de response.data.data.data (triple anidado)`)
        }
        // Caso 2: Doble anidado response.data.data
        else if (response.data.data && Array.isArray(response.data.data)) {
          solicitudesData = response.data.data
          console.log(`✅ Extraídas ${solicitudesData.length} solicitudes de response.data.data (doble anidado)`)
        }
        // Caso 3: Array directo
        else if (Array.isArray(response.data)) {
          solicitudesData = response.data
          console.log(`✅ Extraídas ${solicitudesData.length} solicitudes de response.data (array directo)`)
        } else {
          console.warn("⚠️ Estructura de datos inesperada:", response.data)
          solicitudesData = []
        }

        // Verificar que cada solicitud tenga la estructura correcta
        if (solicitudesData.length > 0) {
          console.log("🔍 Verificando estructura de solicitudes:")
          solicitudesData.forEach((solicitud, index) => {
            console.log(`  📋 Solicitud ${index + 1}:`, {
              id: solicitud.id,
              codigo: solicitud.codigo_reserva,
              estado: solicitud.estado?.nombre,
              escenario: solicitud.escenario?.nombre,
              hasAllFields: !!(solicitud.id && solicitud.codigo_reserva && solicitud.estado && solicitud.escenario),
            })
          })
        }

        console.log(`🎯 FINAL: Estableciendo ${solicitudesData.length} solicitudes en el estado`)
        setSolicitudes(solicitudesData)
      } else {
        console.error("❌ Error en respuesta:", response)
        setSolicitudes([])
        toast({
          title: "Error",
          description: "No se pudieron cargar las solicitudes",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("💥 Error al cargar solicitudes:", error)
      setSolicitudes([])
      toast({
        title: "Error",
        description: "Error de conexión al cargar solicitudes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchEstados = async () => {
    try {
      console.log("🔄 Cargando estados...")
      const response = await getEstadosSolicitud()
      console.log("📥 Respuesta de estados:", response)

      if (response && response.success && response.data) {
        let estadosData: EstadoSolicitud[] = []

        if (Array.isArray(response.data)) {
          estadosData = response.data
        } else if (response.data.data && Array.isArray(response.data.data)) {
          estadosData = response.data.data
        }

        console.log("📊 Estados procesados:", estadosData)
        setEstados(estadosData)
      }
    } catch (error) {
      console.error("💥 Error al cargar estados:", error)
      setEstados([])
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "creada":
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

  // ✅ CORRECCIÓN: Filtrado mejorado con validación
  const filteredSolicitudes = Array.isArray(solicitudes)
    ? solicitudes.filter((solicitud) => {
        // Verificar que la solicitud tenga la estructura correcta
        if (!solicitud || !solicitud.estado || !solicitud.escenario) {
          console.warn("⚠️ Solicitud con estructura incompleta:", solicitud)
          return false
        }

        const matchesSearch =
          searchTerm === "" ||
          (solicitud.codigo_reserva && solicitud.codigo_reserva.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (solicitud.escenario?.nombre && solicitud.escenario.nombre.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesEstado = estadoFilter === "all" || solicitud.estado?.nombre === estadoFilter

        const matchesTab =
          activeTab === "todas" ||
          (activeTab === "pendientes" &&
            (solicitud.estado?.nombre === "pendiente" || solicitud.estado?.nombre === "creada")) ||
          (activeTab === "aprobadas" && solicitud.estado?.nombre === "aprobada") ||
          (activeTab === "rechazadas" && solicitud.estado?.nombre === "rechazada")

        return matchesSearch && matchesEstado && matchesTab
      })
    : []

  // ✅ Logging mejorado para debug
  console.log("🔍 Estado actual de solicitudes:", {
    totalSolicitudes: solicitudes.length,
    solicitudesArray: Array.isArray(solicitudes),
    filtradas: filteredSolicitudes.length,
    activeTab,
    searchTerm,
    estadoFilter,
    primerasSolicitudes: solicitudes.slice(0, 2).map((s) => ({
      id: s?.id,
      estado: s?.estado?.nombre,
      codigo: s?.codigo_reserva,
    })),
  })

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
          <h1 className="text-3xl font-bold">Mis Solicitudes</h1>
          <p className="text-muted-foreground">Gestiona tus solicitudes de reserva</p>
        </div>
        <Button asChild className="bg-primary-green hover:bg-primary-dark-green">
          <Link href="/escenarios">Nueva Reserva</Link>
        </Button>
      </div>

      {/* Debug info - Temporal para diagnóstico */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h3 className="font-semibold text-blue-800 mb-2">🔍 Información de Debug</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p>📊 Total solicitudes cargadas: {solicitudes.length}</p>
            <p>🔍 Solicitudes filtradas: {filteredSolicitudes.length}</p>
            <p>📋 Estados disponibles: {estados.length}</p>
            <p>🏷️ Tab activo: {activeTab}</p>
            <p>🔎 Término de búsqueda: "{searchTerm}"</p>
            <p>🏷️ Filtro de estado: {estadoFilter}</p>
            <p>📝 Es array solicitudes: {Array.isArray(solicitudes) ? "Sí" : "No"}</p>
            {solicitudes.length > 0 && (
              <div className="mt-2">
                <p className="font-medium">Estados encontrados:</p>
                {solicitudes.map((s, i) => (
                  <span key={i} className="inline-block bg-blue-100 px-2 py-1 rounded text-xs mr-1 mb-1">
                    ID:{s?.id} - {s?.estado?.nombre || "sin estado"}
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por código o escenario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  {estados.map((estado) => (
                    <SelectItem key={estado.id} value={estado.nombre}>
                      {estado.nombre.charAt(0).toUpperCase() + estado.nombre.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="todas">Todas ({solicitudes.length})</TabsTrigger>
          <TabsTrigger value="pendientes">
            Pendientes (
            {solicitudes.filter((s) => s.estado?.nombre === "pendiente" || s.estado?.nombre === "creada").length})
          </TabsTrigger>
          <TabsTrigger value="aprobadas">
            Aprobadas ({solicitudes.filter((s) => s.estado?.nombre === "aprobada").length})
          </TabsTrigger>
          <TabsTrigger value="rechazadas">
            Rechazadas ({solicitudes.filter((s) => s.estado?.nombre === "rechazada").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredSolicitudes.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-4 rounded-full bg-primary-light-green p-3">
                  <Calendar className="h-6 w-6 text-primary-green" />
                </div>
                <h3 className="mb-2 text-lg font-medium">
                  {solicitudes.length === 0 ? "No hay solicitudes" : `No hay solicitudes ${activeTab}`}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {solicitudes.length === 0
                    ? "Aún no has realizado ninguna solicitud de reserva."
                    : `No tienes solicitudes ${activeTab} que coincidan con los filtros.`}
                </p>
                <Button asChild className="bg-primary-green hover:bg-primary-dark-green">
                  <Link href="/escenarios">{solicitudes.length === 0 ? "Crear primera reserva" : "Nueva reserva"}</Link>
                </Button>
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
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>{solicitud.num_participantes} participantes</span>
                          </div>
                        </div>

                        <div className="text-sm">
                          <span className="font-medium">Propósito:</span> {solicitud.proposito?.nombre}
                        </div>

                        <div className="text-sm">
                          <span className="font-medium">Código:</span> {solicitud.codigo_reserva}
                        </div>

                        {solicitud.notas && (
                          <div className="text-sm">
                            <span className="font-medium">Notas:</span> {solicitud.notas}
                          </div>
                        )}

                        {solicitud.admin_notas && (
                          <div className="rounded-md bg-muted p-3">
                            <span className="font-medium text-sm">Notas del administrador:</span>
                            <p className="text-sm mt-1">{solicitud.admin_notas}</p>
                          </div>
                        )}
                      </div>

                      <div className="ml-4">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/solicitudes/${solicitud.id}`}>Ver detalles</Link>
                        </Button>
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
