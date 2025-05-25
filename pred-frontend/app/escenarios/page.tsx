"use client"

import { useState, useEffect, useMemo } from "react"
import { EscenarioCard } from "@/components/escenarios/escenario-card"
import { EscenarioFilter } from "@/components/escenarios/escenario-filter"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { getEscenarios, getLocalidades, getDeportes } from "@/services/escenario-service"
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

interface Localidad {
  id: number
  nombre: string
}

interface Deporte {
  id: number
  nombre: string
}

// Función para renderizar objetos de forma segura
const safeRender = (value: any): string => {
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null && 'nombre' in value) {
    return value.nombre
  }
  return ''
}

// Función para procesar datos de escenarios
const processEscenarioData = (escenario: any): Escenario => {
  return {
    ...escenario,
    localidad: {
      id: escenario.localidad?.id || 0,
      nombre: safeRender(escenario.localidad)
    },
    deporte_principal: {
      id: escenario.deporte_principal?.id || 0,
      nombre: safeRender(escenario.deporte_principal),
      icono: escenario.deporte_principal?.icono || ''
    }
  }
}

export default function EscenariosPage() {
  const { toast } = useToast()
  
  // Estados para datos
  const [allEscenarios, setAllEscenarios] = useState<Escenario[]>([])
  const [localidades, setLocalidades] = useState<Localidad[]>([])
  const [deportes, setDeportes] = useState<Deporte[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [localidadFilter, setLocalidadFilter] = useState("all")
  const [deporteFilter, setDeporteFilter] = useState("all")

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 6

  // Cargar datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Cargar escenarios, localidades y deportes en paralelo
        const [escenariosRes, localidadesRes, deportesRes] = await Promise.all([
          getEscenarios(),
          getLocalidades(),
          getDeportes()
        ])

        // Procesar escenarios
        if (escenariosRes.success) {
          let escenariosData = []
          
          if (escenariosRes.data && Array.isArray(escenariosRes.data.data)) {
            escenariosData = escenariosRes.data.data
          } else if (Array.isArray(escenariosRes.data)) {
            escenariosData = escenariosRes.data
          }

          // Procesar cada escenario para asegurar formato correcto
          const processedEscenarios = escenariosData.map(processEscenarioData)
          setAllEscenarios(processedEscenarios)
        } else {
          throw new Error(escenariosRes.message || "Error al cargar escenarios")
        }

        // Procesar localidades
        if (localidadesRes.success) {
          setLocalidades(localidadesRes.data || [])
        } else {
          console.warn("Error al cargar localidades:", localidadesRes.message)
        }

        // Procesar deportes
        if (deportesRes.success) {
          setDeportes(deportesRes.data || [])
        } else {
          console.warn("Error al cargar deportes:", deportesRes.message)
        }

      } catch (error) {
        console.error("Error al cargar datos:", error)
        setError("Error al cargar datos. Por favor, intenta nuevamente.")
        toast({
          title: "Error",
          description: "Error al cargar datos. Por favor, intenta nuevamente.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [toast])

  // Aplicar filtros usando useMemo para optimizar rendimiento
  const filteredEscenarios = useMemo(() => {
    let filtered = [...allEscenarios]

    // Filtro por búsqueda
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim()
      filtered = filtered.filter(escenario =>
        escenario.nombre.toLowerCase().includes(searchLower) ||
        (escenario.descripcion && escenario.descripcion.toLowerCase().includes(searchLower)) ||
        (escenario.direccion && escenario.direccion.toLowerCase().includes(searchLower)) ||
        escenario.localidad.nombre.toLowerCase().includes(searchLower) ||
        escenario.deporte_principal.nombre.toLowerCase().includes(searchLower)
      )
    }

    // Filtro por localidad
    if (localidadFilter !== "all") {
      filtered = filtered.filter(escenario => 
        escenario.localidad.id === parseInt(localidadFilter)
      )
    }

    // Filtro por deporte
    if (deporteFilter !== "all") {
      filtered = filtered.filter(escenario => 
        escenario.deporte_principal.id === parseInt(deporteFilter)
      )
    }

    return filtered
  }, [allEscenarios, searchTerm, localidadFilter, deporteFilter])

  // Calcular paginación
  const totalPages = Math.ceil(filteredEscenarios.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedEscenarios = filteredEscenarios.slice(startIndex, endIndex)

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, localidadFilter, deporteFilter])

  // Manejar cambios en filtros
  const handleFilter = (search: string, localidad: string, deporte: string) => {
    setSearchTerm(search)
    setLocalidadFilter(localidad)
    setDeporteFilter(deporte)
  }

  // Manejar cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll hacia arriba cuando cambia la página
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm("")
    setLocalidadFilter("all")
    setDeporteFilter("all")
    setCurrentPage(1)
  }

  // Reintentar carga de datos
  const retryFetch = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Barra de navegación */}
      <SiteHeader />

      {/* Contenido principal */}
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Escenarios Deportivos</h1>
          <p className="text-muted-foreground">
            Encuentra y reserva el escenario deportivo perfecto para tu actividad
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-8">
          <EscenarioFilter 
            localidades={localidades} 
            deportes={deportes} 
            onFilter={handleFilter}
            initialSearch={searchTerm}
            initialLocalidad={localidadFilter}
            initialDeporte={deporteFilter}
          />
        </div>

        {/* Información de resultados */}
        {!loading && !error && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando {paginatedEscenarios.length} de {filteredEscenarios.length} escenarios
              {(searchTerm || localidadFilter !== "all" || deporteFilter !== "all") && (
                <span className="ml-2">
                  (filtrados de {allEscenarios.length} total)
                </span>
              )}
            </p>
            {(searchTerm || localidadFilter !== "all" || deporteFilter !== "all") && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            )}
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="mb-8 rounded-md bg-destructive/10 p-4 text-destructive">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
            <Button onClick={retryFetch} variant="outline" className="mt-2">
              Reintentar
            </Button>
          </div>
        )}

        {/* Lista de escenarios */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-green border-t-transparent mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando escenarios...</p>
            </div>
          </div>
        ) : filteredEscenarios.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-lg border bg-white p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-10 w-10 text-muted-foreground"
              >
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" x2="12" y1="9" y2="13" />
                <line x1="12" x2="12.01" y1="17" y2="17" />
              </svg>
            </div>
            <h2 className="text-xl font-medium">
              {allEscenarios.length === 0 ? "No hay escenarios disponibles" : "No se encontraron escenarios"}
            </h2>
            <p className="text-muted-foreground">
              {allEscenarios.length === 0 
                ? "Actualmente no hay escenarios registrados en el sistema"
                : "Prueba con otros filtros o amplia tu búsqueda"
              }
            </p>
            {allEscenarios.length > 0 && (
              <Button onClick={clearFilters}>
                Limpiar filtros
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Grid de escenarios - 6 por página */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedEscenarios.map((escenario) => (
                <EscenarioCard key={escenario.id} {...escenario} />
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage > 1) {
                            handlePageChange(currentPage - 1)
                          }
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>

                    {/* Mostrar páginas */}
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNumber
                      if (totalPages <= 5) {
                        pageNumber = i + 1
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i
                      } else {
                        pageNumber = currentPage - 2 + i
                      }

                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              handlePageChange(pageNumber)
                            }}
                            isActive={pageNumber === currentPage}
                            className="cursor-pointer"
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    })}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage < totalPages) {
                            handlePageChange(currentPage + 1)
                          }
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>

                {/* Información de paginación */}
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages} 
                  ({startIndex + 1}-{Math.min(endIndex, filteredEscenarios.length)} de {filteredEscenarios.length} escenarios)
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} PRED - Plataforma de Reserva de Escenarios Deportivos
          </p>
        </div>
      </footer>
    </div>
  )
}