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
import { API_URL } from "@/lib/config"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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
  const [escenarios, setEscenarios] = useState<Escenario[]>([])
  const [localidades, setLocalidades] = useState<Localidad[]>([])
  const [deportes, setDeportes] = useState<Deporte[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  // Filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [localidadFilter, setLocalidadFilter] = useState("all")
  const [deporteFilter, setDeporteFilter] = useState("all")

  useEffect(() => {
    // Cargar localidades y deportes para los filtros
    const fetchFilterData = async () => {
      try {
        const [localidadesRes, deportesRes] = await Promise.all([
          fetch(`${API_URL}/escenarios/localidades`),
          fetch(`${API_URL}/escenarios/deportes`),
        ])

        const localidadesData = await localidadesRes.json()
        const deportesData = await deportesRes.json()

        if (localidadesData.success) {
          setLocalidades(localidadesData.data)
        }

        if (deportesData.success) {
          setDeportes(deportesData.data)
        }
      } catch (error) {
        console.error("Error al cargar datos de filtros:", error)
      }
    }

    fetchFilterData()
    fetchEscenarios()
  }, [currentPage])

  const fetchEscenarios = async () => {
    setLoading(true)
    try {
      // Construir parámetros de filtro
      const params = new URLSearchParams({
        page: currentPage.toString(),
      })

      if (searchTerm) {
        params.append("search", searchTerm)
      }

      if (localidadFilter !== "all") {
        params.append("localidad_id", localidadFilter)
      }

      if (deporteFilter !== "all") {
        params.append("deporte_id", deporteFilter)
      }

      const response = await fetch(`${API_URL}/escenarios?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setEscenarios(data.data.data)
        setTotalPages(data.data.last_page)
      }
    } catch (error) {
      console.error("Error al cargar escenarios:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = (search: string, localidad: string, deporte: string) => {
    setSearchTerm(search)
    setLocalidadFilter(localidad)
    setDeporteFilter(deporte)
    setCurrentPage(1) // Resetear a la primera página

    // Ejecutar búsqueda con los nuevos filtros
    fetchEscenarios()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Barra de navegación */}
      <header className="bg-white border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">PRED</span>
          </Link>
          <nav className="hidden space-x-4 md:flex">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Inicio
            </Link>
            <Link href="/escenarios" className="text-sm font-medium text-primary">
              Escenarios
            </Link>
            <Link href="/#como-funciona" className="text-sm font-medium hover:text-primary">
              Cómo Funciona
            </Link>
            <Link href="/#contacto" className="text-sm font-medium hover:text-primary">
              Contacto
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Iniciar Sesión</Button>
            </Link>
            <Link href="/register" className="hidden md:block">
              <Button>Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto py-8 px-4">
        <h1 className="mb-8 text-3xl font-bold">Escenarios Deportivos</h1>

        {/* Filtros */}
        <div className="mb-8">
          <EscenarioFilter localidades={localidades} deportes={deportes} onFilter={handleFilter} />
        </div>

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
        {!loading && escenarios.length > 0 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1) {
                      setCurrentPage(currentPage - 1)
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
                      setCurrentPage(page)
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
                      setCurrentPage(currentPage + 1)
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

