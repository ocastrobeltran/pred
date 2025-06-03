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
      // Simulamos una llamada a la API
      setTimeout(() => {
        // Filtramos los escenarios según los criterios
        let filteredEscenarios = [...mockEscenarios]

        if (searchTerm) {
          const term = searchTerm.toLowerCase()
          filteredEscenarios = filteredEscenarios.filter(
            (e) =>
              e.nombre.toLowerCase().includes(term) ||
              e.direccion.toLowerCase().includes(term) ||
              e.localidad.toLowerCase().includes(term),
          )
        }

        if (tipoFilter !== "all") {
          filteredEscenarios = filteredEscenarios.filter((e) => e.tipo === tipoFilter)
        }

        if (estadoFilter !== "all") {
          filteredEscenarios = filteredEscenarios.filter((e) => e.estado === estadoFilter)
        }

        setEscenarios(filteredEscenarios)
        setTotalPages(1) // En un caso real, esto vendría de la API
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error("Error al cargar escenarios:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los escenarios",
        variant: "destructive",
      })
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
                {escenarios.map((escenario) => (
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
                        <Button variant="ghost" size="sm" onClick={() => handleEditEscenario(escenario)} title="Editar">
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
                ))}
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
