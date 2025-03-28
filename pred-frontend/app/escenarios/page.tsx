"use client"

import { useState, useEffect } from "react"
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
  localidad: string
  capacidad: number
  deporte: string
  imagen: string | null
}

interface Localidad {
  id: number
  nombre: string
}

interface Deporte {
  id: number
  nombre: string
}

export default function EscenariosPage() {
  const { toast } = useToast()
  const [escenarios, setEscenarios] = useState<Escenario[]>([])
  const [localidades, setLocalidades] = useState<Localidad[]>([])
  const [deportes, setDeportes] = useState<Deporte[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [localidadFilter, setLocalidadFilter] = useState("all")
  const [deporteFilter, setDeporteFilter] = useState("all")

  useEffect(() => {
    // Cargar localidades y deportes para los filtros
    const fetchFilterData = async () => {
      try {
        const [localidadesRes, deportesRes] = await Promise.all([getLocalidades(), getDeportes()])

        if (localidadesRes.success) {
          setLocalidades(localidadesRes.data || [])
        } else {
          console.error("Error al cargar localidades:", localidadesRes.message)
        }

        if (deportesRes.success) {
          setDeportes(deportesRes.data || [])
        } else {
          console.error("Error al cargar deportes:", deportesRes.message)
        }
      } catch (error) {
        console.error("Error al cargar datos de filtros:", error)
      }
    }

    fetchFilterData()
    fetchEscenarios()
  }, [])

  const fetchEscenarios = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getEscenarios()
      console.log("Escenarios response:", response)

      if (response.success) {
        // Process the response data
        let escenariosData = []

        if (response.data && Array.isArray(response.data.data)) {
          escenariosData = response.data.data
        } else if (Array.isArray(response.data)) {
          escenariosData = response.data
        } else if (response.rawResponse && response.rawResponse.data && Array.isArray(response.rawResponse.data)) {
          escenariosData = response.rawResponse.data
        }

        // Apply client-side filtering
        let filteredEscenarios = escenariosData

        if (searchTerm) {
          filteredEscenarios = filteredEscenarios.filter(
            (escenario) =>
              escenario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (escenario.descripcion && escenario.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (escenario.direccion && escenario.direccion.toLowerCase().includes(searchTerm.toLowerCase())),
          )
        }

        if (localidadFilter !== "all") {
          filteredEscenarios = filteredEscenarios.filter(
            (escenario) =>
              escenario.localidad_id === Number.parseInt(localidadFilter) ||
              (escenario.localidad && escenario.localidad === localidadFilter),
          )
        }

        if (deporteFilter !== "all") {
          filteredEscenarios = filteredEscenarios.filter(
            (escenario) =>
              escenario.deporte_principal_id === Number.parseInt(deporteFilter) ||
              (escenario.deporte && escenario.deporte === deporteFilter) ||
              (escenario.deportes && escenario.deportes.includes(Number.parseInt(deporteFilter))),
          )
        }

        // Client-side pagination
        const itemsPerPage = 9
        const totalItems = filteredEscenarios.length
        const totalPagesCount = Math.ceil(totalItems / itemsPerPage)

        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        const paginatedEscenarios = filteredEscenarios.slice(startIndex, endIndex)

        setEscenarios(paginatedEscenarios)
        setTotalPages(totalPagesCount)
      } else {
        console.error("Error al cargar escenarios:", response.message)
        setError(response.message || "Error al cargar escenarios")
        toast({
          title: "Error",
          description: response.message || "Error al cargar escenarios",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al cargar escenarios:", error)
      setError("Error al cargar escenarios. Por favor, intenta nuevamente.")
      toast({
        title: "Error",
        description: "Error al cargar escenarios. Por favor, intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = (search: string, localidad: string, deporte: string) => {
    setSearchTerm(search)
    setLocalidadFilter(localidad)
    setDeporteFilter(deporte)
    setCurrentPage(1) // Resetear a la primera página

    // Since we're doing client-side filtering, we don't need to refetch
    // Just apply the filters to the existing data
    fetchEscenarios()
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // No need to refetch, just update the current page for client-side pagination
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Barra de navegación */}
      <SiteHeader />

      {/* Contenido principal */}
      <main className="container mx-auto py-8 px-4">
        <h1 className="mb-8 text-3xl font-bold">Escenarios Deportivos</h1>

        {/* Filtros */}
        <div className="mb-8">
          <EscenarioFilter localidades={localidades} deportes={deportes} onFilter={handleFilter} />
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-8 rounded-md bg-destructive/10 p-4 text-destructive">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
            <Button onClick={fetchEscenarios} variant="outline" className="mt-2">
              Reintentar
            </Button>
          </div>
        )}

        {/* Lista de escenarios */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : escenarios.length === 0 ? (
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
            <h2 className="text-xl font-medium">No se encontraron escenarios</h2>
            <p className="text-muted-foreground">Prueba con otros filtros o amplia tu búsqueda</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setLocalidadFilter("all")
                setDeporteFilter("all")
                setCurrentPage(1)
                fetchEscenarios()
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {escenarios.map((escenario) => (
              <EscenarioCard key={escenario.id} {...escenario} />
            ))}
          </div>
        )}

        {/* Paginación */}
        {!loading && escenarios.length > 0 && totalPages > 1 && (
          <Pagination className="mt-8">
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
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      handlePageChange(page)
                    }}
                    isActive={page === currentPage}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage < totalPages) {
                      handlePageChange(currentPage + 1)
                    }
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </main>

      {/* Footer simple */}
      <footer className="border-t bg-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} PRED - Plataforma de Reserva de Escenarios Deportivos
          </p>
        </div>
      </footer>
    </div>
  )
}

