"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Search, Plus, Edit, Trash2, MapPin, Filter } from "lucide-react"
import { EscenarioForm } from "@/components/admin/escenario-form"

// Simulamos un servicio para escenarios
const mockEscenarios = [
  {
    id: 1,
    nombre: "Estadio Jaime Morón",
    direccion: "Olaya Herrera, Cartagena",
    localidad: "Olaya Herrera",
    capacidad: 16000,
    tipo: "Fútbol",
    estado: "activo",
    created_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 2,
    nombre: "Complejo Acuático",
    direccion: "Centro, Cartagena",
    localidad: "Centro",
    capacidad: 500,
    tipo: "Natación",
    estado: "activo",
    created_at: "2023-01-02T00:00:00Z",
  },
  {
    id: 3,
    nombre: "Coliseo Norton Madrid",
    direccion: "Chiquinquirá, Cartagena",
    localidad: "Chiquinquirá",
    capacidad: 3000,
    tipo: "Múltiple",
    estado: "mantenimiento",
    created_at: "2023-01-03T00:00:00Z",
  },
]

interface Escenario {
  id: number
  nombre: string
  direccion: string
  localidad: string
  capacidad: number
  tipo: string
  estado: string
  created_at: string
}

export default function EscenariosPage() {
  const { toast } = useToast()
  const [escenarios, setEscenarios] = useState<Escenario[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFilter, setTipoFilter] = useState("all")
  const [estadoFilter, setEstadoFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedEscenario, setSelectedEscenario] = useState<Escenario | null>(null)

  // Tipos de escenarios
  const tiposEscenario = [
    { id: "Fútbol", nombre: "Fútbol" },
    { id: "Baloncesto", nombre: "Baloncesto" },
    { id: "Natación", nombre: "Natación" },
    { id: "Tenis", nombre: "Tenis" },
    { id: "Múltiple", nombre: "Múltiple" },
  ]

  useEffect(() => {
    fetchEscenarios()
  }, [currentPage])

  const fetchEscenarios = async () => {
    try {
      setLoading(true)
      console.log("🔄 Fetching escenarios from API...")

      // Try to get real data from API first
      const { getEscenarios } = await import("@/services/escenario-service")
      const filters = {
        search: searchTerm || undefined,
        estado: estadoFilter !== "all" ? estadoFilter : undefined,
      }

      const response = await getEscenarios(currentPage, filters)
      console.log("📥 Escenarios API response:", response)

      if (response.success && response.data) {
        let escenariosData = []

        // Handle different response structures
        if (Array.isArray(response.data)) {
          escenariosData = response.data
        } else if (response.data.data) {
          // Check if response.data.data is an array
          if (Array.isArray(response.data.data)) {
            escenariosData = response.data.data
          } else if (response.data.data.data && Array.isArray(response.data.data.data)) {
            // Handle nested structure: response.data.data.data
            escenariosData = response.data.data.data
          } else if (response.data.data.escenarios && Array.isArray(response.data.data.escenarios)) {
            escenariosData = response.data.data.escenarios
          }
        } else if (response.data.escenarios && Array.isArray(response.data.escenarios)) {
          escenariosData = response.data.escenarios
        } else {
          console.warn("⚠️ Unexpected escenarios structure:", response.data)
          console.log("🔍 Response.data keys:", Object.keys(response.data))
          console.log("🔍 Full response.data:", response.data)

          // Try to find the array in the response
          const possibleArrays = Object.values(response.data).filter(Array.isArray)
          if (possibleArrays.length > 0) {
            escenariosData = possibleArrays[0] as any[]
            console.log("🔍 Found array in response:", escenariosData)
          } else {
            // Look deeper in nested objects
            for (const value of Object.values(response.data)) {
              if (typeof value === "object" && value !== null) {
                const nestedArrays = Object.values(value).filter(Array.isArray)
                if (nestedArrays.length > 0) {
                  escenariosData = nestedArrays[0] as any[]
                  console.log("🔍 Found nested array in response:", escenariosData)
                  break
                }
              }
            }
          }
        }

        console.log("🔍 Raw escenarios data:", escenariosData)

        // Transform API data to match our interface
        const transformedEscenarios = escenariosData.map((escenario) => {
          console.log("🔄 Transforming escenario:", escenario)

          return {
            id: escenario.id,
            nombre: escenario.nombre,
            direccion: escenario.direccion,
            localidad:
              escenario.localidad_nombre || escenario.localidad?.nombre || escenario.localidad || "No especificada",
            capacidad: escenario.capacidad,
            tipo:
              escenario.deporte_nombre || escenario.deporte_principal?.nombre || escenario.tipo || "No especificado",
            estado: escenario.estado,
            created_at: escenario.created_at,
          }
        })

        console.log("✅ Setting transformed escenarios:", transformedEscenarios)
        setEscenarios(transformedEscenarios)

        // Handle pagination
        if (response.data.data && response.data.data.pagination) {
          setTotalPages(response.data.data.pagination.last_page || 1)
        } else if (response.data.pagination) {
          setTotalPages(response.data.pagination.last_page || 1)
        } else if (response.data.total && response.data.per_page) {
          setTotalPages(Math.ceil(response.data.total / response.data.per_page))
        } else {
          setTotalPages(1)
        }
      } else {
        console.log("❌ API failed, using mock data")
        // Fallback to mock data
        setEscenarios(mockEscenarios)
        setTotalPages(1)
      }
    } catch (error) {
      console.error("💥 Error al cargar escenarios:", error)
      console.log("🎭 Using mock data due to error")
      setEscenarios(mockEscenarios)
      setTotalPages(1)
      toast({
        title: "Error",
        description: "No se pudieron cargar los escenarios desde la API, mostrando datos de ejemplo",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchEscenarios()
  }

  const handleFilterChange = () => {
    setCurrentPage(1)
    fetchEscenarios()
  }

  const handleDeleteEscenario = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este escenario?")) {
      try {
        // Simulamos la eliminación
        setEscenarios((prev) => prev.filter((e) => e.id !== id))
        toast({
          title: "Escenario eliminado",
          description: "El escenario ha sido eliminado exitosamente",
        })
      } catch (error) {
        console.error("Error al eliminar escenario:", error)
        toast({
          title: "Error",
          description: "Error de conexión",
          variant: "destructive",
        })
      }
    }
  }

  const handleEditEscenario = (escenario: Escenario) => {
    setSelectedEscenario(escenario)
    setIsDialogOpen(true)
  }

  const handleCreateEscenario = () => {
    setSelectedEscenario(null)
    setIsDialogOpen(true)
  }

  const handleDialogClose = (refresh = false) => {
    setIsDialogOpen(false)
    if (refresh) {
      fetchEscenarios()
    }
  }

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case "activo":
        return "bg-green-100 text-green-800"
      case "inactivo":
        return "bg-gray-100 text-gray-800"
      case "mantenimiento":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading && escenarios.length === 0) {
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
          <h1 className="text-3xl font-bold">Gestión de Escenarios</h1>
          <p className="text-muted-foreground">Administra los escenarios deportivos</p>
        </div>
        <Button onClick={handleCreateEscenario} className="bg-primary-green hover:bg-primary-dark-green">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Escenario
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o ubicación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select
                value={tipoFilter}
                onValueChange={(value) => {
                  setTipoFilter(value)
                  handleFilterChange()
                }}
              >
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {tiposEscenario.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="mantenimiento">En mantenimiento</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleSearch}>
                Buscar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de escenarios */}
      <Card>
        <CardHeader>
          <CardTitle>Escenarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium">Nombre</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Ubicación</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Tipo</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Capacidad</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(escenarios) && escenarios.length > 0 ? (
                  escenarios.map((escenario) => (
                    <tr key={escenario.id} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-3 text-sm font-medium">{escenario.nombre}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {escenario.direccion}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{escenario.tipo}</td>
                      <td className="px-4 py-3 text-sm">{escenario.capacidad.toLocaleString()} personas</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge className={getEstadoBadgeColor(escenario.estado)}>
                          {escenario.estado.charAt(0).toUpperCase() + escenario.estado.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditEscenario(escenario)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEscenario(escenario.id)}
                            title="Eliminar"
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      {loading ? "Cargando escenarios..." : "No hay escenarios disponibles"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

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
        </CardContent>
      </Card>

      {/* Diálogo para crear/editar escenario */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedEscenario ? "Editar Escenario" : "Crear Escenario"}</DialogTitle>
          </DialogHeader>
          <EscenarioForm escenario={selectedEscenario} tiposEscenario={tiposEscenario} onClose={handleDialogClose} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
