"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, X } from "lucide-react"
import { getLocalidades, getDeportes } from "@/services/escenario-service"

interface FilterValues {
  search?: string
  localidad_id?: string
  deporte_id?: string
  estado?: string
}

interface EscenarioFilterProps {
  onFilterChange?: (filters: FilterValues) => void
}

export function EscenarioFilter({ onFilterChange }: EscenarioFilterProps) {
  const [localidades, setLocalidades] = useState<Array<{ id: number; nombre: string }>>([])
  const [deportes, setDeportes] = useState<Array<{ id: number; nombre: string }>>([])
  const [loading, setLoading] = useState(true)

  // Estados de filtros
  const [search, setSearch] = useState("")
  const [localidadId, setLocalidadId] = useState<string>("all")
  const [deporteId, setDeporteId] = useState<string>("all")
  const [estado, setEstado] = useState<string>("all")

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        const [localidadesRes, deportesRes] = await Promise.all([getLocalidades(), getDeportes()])

        // Procesar localidades
        if (localidadesRes.success && localidadesRes.data) {
          const localidadesData = Array.isArray(localidadesRes.data)
            ? localidadesRes.data
            : localidadesRes.data.data || []
          setLocalidades(localidadesData)
        } else {
          setLocalidades([
            { id: 1, nombre: "Centro" },
            { id: 2, nombre: "Olaya Herrera" },
            { id: 3, nombre: "Chiquinquirá" },
            { id: 4, nombre: "El Campestre" },
          ])
        }

        // Procesar deportes
        if (deportesRes.success && deportesRes.data) {
          const deportesData = Array.isArray(deportesRes.data) ? deportesRes.data : deportesRes.data.data || []
          setDeportes(deportesData)
        } else {
          setDeportes([
            { id: 1, nombre: "Fútbol" },
            { id: 2, nombre: "Béisbol" },
            { id: 3, nombre: "Baloncesto" },
            { id: 4, nombre: "Natación" },
            { id: 5, nombre: "Atletismo" },
          ])
        }
      } catch (error) {
        console.error("Error loading filter data:", error)
        // Usar datos mock como fallback
        setLocalidades([
          { id: 1, nombre: "Centro" },
          { id: 2, nombre: "Olaya Herrera" },
          { id: 3, nombre: "Chiquinquirá" },
          { id: 4, nombre: "El Campestre" },
        ])
        setDeportes([
          { id: 1, nombre: "Fútbol" },
          { id: 2, nombre: "Béisbol" },
          { id: 3, nombre: "Baloncesto" },
          { id: 4, nombre: "Natación" },
          { id: 5, nombre: "Atletismo" },
        ])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Aplicar filtros
  const applyFilters = () => {
    if (onFilterChange) {
      const filters: FilterValues = {}

      if (search.trim()) filters.search = search.trim()
      if (localidadId !== "all") filters.localidad_id = localidadId
      if (deporteId !== "all") filters.deporte_id = deporteId
      if (estado !== "all") filters.estado = estado

      onFilterChange(filters)
    }
  }

  // Limpiar filtros
  const clearFilters = () => {
    setSearch("")
    setLocalidadId("all")
    setDeporteId("all")
    setEstado("all")
    if (onFilterChange) {
      onFilterChange({})
    }
  }

  // Aplicar filtros automáticamente cuando cambian
  useEffect(() => {
    if (!loading) {
      applyFilters()
    }
  }, [search, localidadId, deporteId, estado, loading])

  const hasActiveFilters = search.trim() || localidadId !== "all" || deporteId !== "all" || estado !== "all"

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5" />
              <span className="font-medium">Filtros</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <span className="font-medium">Filtros</span>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Nombre, descripción..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Localidad */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Localidad</label>
            <Select value={localidadId} onValueChange={setLocalidadId}>
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las localidades</SelectItem>
                {localidades.map((localidad) => (
                  <SelectItem key={localidad.id} value={localidad.id.toString()}>
                    {localidad.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Deporte */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Deporte</label>
            <Select value={deporteId} onValueChange={setDeporteId}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los deportes</SelectItem>
                {deportes.map((deporte) => (
                  <SelectItem key={deporte.id} value={deporte.id.toString()}>
                    {deporte.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Estado</label>
            <Select value={estado} onValueChange={setEstado}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="disponible">Disponible</SelectItem>
                <SelectItem value="mantenimiento">En mantenimiento</SelectItem>
                <SelectItem value="reservado">Reservado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Indicador de filtros activos */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              Filtros activos:{" "}
              {[
                search && "búsqueda",
                localidadId !== "all" && "localidad",
                deporteId !== "all" && "deporte",
                estado !== "all" && "estado",
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
