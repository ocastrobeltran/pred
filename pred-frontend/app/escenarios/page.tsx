"use client"

import { useState, useEffect } from "react"
import { EscenarioCard } from "@/components/escenarios/escenario-card"
import { EscenarioFilter } from "@/components/escenarios/escenario-filter"
import { Button } from "@/components/ui/button"
import { Grid, List, Loader2 } from "lucide-react"
import { getEscenarios } from "@/services/escenario-service"
import { useToast } from "@/hooks/use-toast"
import { SiteHeader } from "@/components/layout/site-header"

interface Escenario {
  id: number
  nombre: string
  descripcion: string
  direccion: string
  capacidad: number
  dimensiones: string
  estado: string
  imagen_principal: string | null
  localidad: {
    id: number
    nombre: string
  }
  deporte_principal: {
    id: number
    nombre: string
    icono: string
  }
}

interface FilterValues {
  search?: string
  localidad_id?: string
  deporte_id?: string
  estado?: string
}

export default function EscenariosPage() {
  const { toast } = useToast()

  // Estados
  const [escenarios, setEscenarios] = useState<Escenario[]>([])
  const [filteredEscenarios, setFilteredEscenarios] = useState<Escenario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [mounted, setMounted] = useState(false)

  // Marcar como montado para evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  // Cargar escenarios
  useEffect(() => {
    const fetchEscenarios = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("Iniciando carga de escenarios...")
        const response = await getEscenarios()
        console.log("Respuesta completa del API:", response)

        if (response.success && response.data) {
          let escenariosData = []

          // Verificar la estructura de la respuesta
          console.log("Tipo de response.data:", typeof response.data)
          console.log("response.data:", response.data)

          // La respuesta tiene la estructura: response.data.data
          if (response.data.data && Array.isArray(response.data.data)) {
            escenariosData = response.data.data
            console.log("Datos extraídos de response.data.data:", escenariosData)
          }
          // Si response.data es directamente un array
          else if (Array.isArray(response.data)) {
            escenariosData = response.data
            console.log("Datos extraídos de response.data (array directo):", escenariosData)
          }
          // Si hay una propiedad escenarios
          else if (response.data.escenarios && Array.isArray(response.data.escenarios)) {
            escenariosData = response.data.escenarios
            console.log("Datos extraídos de response.data.escenarios:", escenariosData)
          }
          // Si response es directamente la estructura con data
          else if (response.data && response.data.data && Array.isArray(response.data.data.data)) {
            escenariosData = response.data.data.data
            console.log("Datos extraídos de response.data.data.data:", escenariosData)
          } else {
            console.log("Estructura de datos no reconocida. Intentando acceso directo...")
            console.log("response.data keys:", Object.keys(response.data))

            // Intentar acceder directamente si la respuesta está anidada
            if (response.data.data && response.data.data.data) {
              escenariosData = response.data.data.data
            } else {
              escenariosData = []
            }
          }

          console.log("Array de escenarios a procesar:", escenariosData)
          console.log("Cantidad de escenarios:", escenariosData.length)

          if (escenariosData.length > 0) {
            // Procesar cada escenario para asegurar estructura correcta
            const processedEscenarios = escenariosData.map((escenario: any, index: number) => {
              console.log(`Procesando escenario ${index + 1}:`, escenario)
              return {
                id: escenario.id,
                nombre: escenario.nombre,
                descripcion: escenario.descripcion,
                direccion: escenario.direccion,
                capacidad: escenario.capacidad,
                dimensiones: escenario.dimensiones,
                estado: escenario.estado,
                imagen_principal: escenario.imagen_principal,
                localidad: {
                  id: escenario.localidad.id,
                  nombre: escenario.localidad.nombre,
                },
                deporte_principal: {
                  id: escenario.deporte_principal.id,
                  nombre: escenario.deporte_principal.nombre,
                  icono: escenario.deporte_principal.icono,
                },
              }
            })

            console.log("Escenarios procesados:", processedEscenarios)
            setEscenarios(processedEscenarios)
            setFilteredEscenarios(processedEscenarios)

            toast({
              title: "Éxito",
              description: `Se cargaron ${processedEscenarios.length} escenarios correctamente.`,
              variant: "default",
            })
          } else {
            console.log("No se encontraron escenarios en la respuesta")
            setEscenarios([])
            setFilteredEscenarios([])

            toast({
              title: "Información",
              description: "No se encontraron escenarios en el sistema.",
              variant: "default",
            })
          }
        } else {
          console.log("Respuesta no exitosa o sin datos:", response)
          throw new Error(response.message || "No se pudieron cargar los escenarios")
        }
      } catch (error) {
        console.error("Error al cargar escenarios:", error)
        setError("Error al cargar los escenarios desde el servidor")

        // Datos de prueba como fallback
        const mockEscenarios = [
          {
            id: 1,
            nombre: "Estadio Municipal",
            descripcion: "Estadio principal de la ciudad con capacidad para grandes eventos deportivos",
            direccion: "Calle 50 #25-30",
            capacidad: 15000,
            dimensiones: "105m x 68m",
            estado: "disponible",
            imagen_principal: null,
            localidad: { id: 1, nombre: "Centro" },
            deporte_principal: { id: 1, nombre: "Fútbol", icono: "fa-futbol" },
          },
          {
            id: 2,
            nombre: "Coliseo de Deportes",
            descripcion: "Moderno coliseo para deportes bajo techo",
            direccion: "Carrera 15 #40-20",
            capacidad: 8000,
            dimensiones: "40m x 20m",
            estado: "disponible",
            imagen_principal: null,
            localidad: { id: 2, nombre: "Olaya Herrera" },
            deporte_principal: { id: 3, nombre: "Baloncesto", icono: "fa-basketball-ball" },
          },
        ]

        setEscenarios(mockEscenarios)
        setFilteredEscenarios(mockEscenarios)

        toast({
          title: "Error",
          description: "No se pudieron cargar los escenarios del servidor. Mostrando datos de ejemplo.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (mounted) {
      fetchEscenarios()
    }
  }, [mounted, toast])

  // Aplicar filtros
  const handleFilterChange = (filters: FilterValues) => {
    console.log("Aplicando filtros:", filters)
    console.log("Escenarios disponibles para filtrar:", escenarios.length)

    let filtered = [...escenarios]

    // Filtro por búsqueda
    if (filters.search?.trim()) {
      const searchTerm = filters.search.toLowerCase().trim()
      filtered = filtered.filter(
        (escenario) =>
          escenario.nombre.toLowerCase().includes(searchTerm) ||
          escenario.descripcion.toLowerCase().includes(searchTerm) ||
          escenario.direccion.toLowerCase().includes(searchTerm) ||
          escenario.localidad.nombre.toLowerCase().includes(searchTerm) ||
          escenario.deporte_principal.nombre.toLowerCase().includes(searchTerm),
      )
    }

    // Filtro por localidad
    if (filters.localidad_id && filters.localidad_id !== "all") {
      filtered = filtered.filter((escenario) => escenario.localidad.id === Number.parseInt(filters.localidad_id!))
    }

    // Filtro por deporte
    if (filters.deporte_id && filters.deporte_id !== "all") {
      filtered = filtered.filter((escenario) => escenario.deporte_principal.id === Number.parseInt(filters.deporte_id!))
    }

    // Filtro por estado
    if (filters.estado && filters.estado !== "all") {
      filtered = filtered.filter((escenario) => escenario.estado === filters.estado)
    }

    console.log("Escenarios filtrados:", filtered.length)
    setFilteredEscenarios(filtered)
  }

  // Reintentar carga
  const retryLoad = () => {
    setError(null)
    setMounted(false)
    setTimeout(() => setMounted(true), 100)
  }

  // No renderizar hasta que esté montado
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <main className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <main className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Escenarios Deportivos</h1>
          <p className="text-gray-600">Encuentra y reserva el escenario deportivo perfecto para tu actividad</p>
        </div>

        {/* Filtros */}
        <div className="mb-8">
          <EscenarioFilter onFilterChange={handleFilterChange} />
        </div>

        {/* Controles de vista y resultados */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-600">
              {loading
                ? "Cargando..."
                : `${filteredEscenarios.length} escenario${filteredEscenarios.length !== 1 ? "s" : ""} encontrado${filteredEscenarios.length !== 1 ? "s" : ""}`}
            </p>
            {escenarios.length > 0 && <p className="text-xs text-gray-500">({escenarios.length} total)</p>}
          </div>

          <div className="flex items-center gap-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Contenido */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Cargando escenarios...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-medium text-red-800 mb-2">Error al cargar</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={retryLoad} variant="outline">
                Reintentar
              </Button>
            </div>
          </div>
        ) : filteredEscenarios.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {escenarios.length === 0 ? "No hay escenarios disponibles" : "No se encontraron escenarios"}
              </h3>
              <p className="text-gray-600">
                {escenarios.length === 0
                  ? "No hay escenarios registrados en el sistema"
                  : "Intenta ajustar los filtros de búsqueda"}
              </p>
            </div>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
            {filteredEscenarios.map((escenario) => (
              <EscenarioCard key={escenario.id} escenario={escenario} viewMode={viewMode} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
