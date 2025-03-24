"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EscenarioGallery } from "@/components/escenarios/escenario-gallery"
import { DisponibilidadSelector } from "@/components/escenarios/disponibilidad-selector"
import { API_URL } from "@/lib/config"
import { MapPin, Users, Calendar, Clock, BadgeInfo } from "lucide-react"
import Link from "next/link"

interface EscenarioPageProps {
  params: {
    id: string
  }
}

interface Imagen {
  id: number
  url_imagen: string
  es_principal: boolean
}

interface Amenidad {
  id: number
  nombre: string
}

interface Escenario {
  id: number
  nombre: string
  descripcion: string
  direccion: string
  localidad: string
  capacidad: number
  dimensiones: string
  deporte: string
  estado: string
  amenidades: Amenidad[]
  imagenes: Imagen[]
}

export default function EscenarioPage({ params }: EscenarioPageProps) {
  const { id } = params
  const [escenario, setEscenario] = useState<Escenario | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>("")
  const [horasDisponibles, setHorasDisponibles] = useState<string[]>([])
  const [cargandoHorarios, setCargandoHorarios] = useState<boolean>(false)

  useEffect(() => {
    const fetchEscenario = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${API_URL}/escenarios/${id}`)
        const data = await response.json()

        if (data.success) {
          setEscenario(data.data)

          // Establecer la fecha actual como fecha seleccionada por defecto
          const hoy = new Date()
          setFechaSeleccionada(hoy.toISOString().split("T")[0])
        } else {
          setError(data.message || "Error al cargar el escenario")
        }
      } catch (error) {
        console.error("Error al cargar el escenario:", error)
        setError("Error de conexión. Por favor, intenta nuevamente.")
      } finally {
        setLoading(false)
      }
    }

    fetchEscenario()
  }, [id])

  useEffect(() => {
    // Cuando cambia la fecha seleccionada, obtener los horarios disponibles
    if (fechaSeleccionada) {
      fetchHorariosDisponibles()
    }
  }, [fechaSeleccionada])

  const fetchHorariosDisponibles = async () => {
    setCargandoHorarios(true)
    try {
      const response = await fetch(`${API_URL}/escenarios/${id}/horarios-disponibles?fecha=${fechaSeleccionada}`)
      const data = await response.json()

      if (data.success) {
        setHorasDisponibles(data.data)
      } else {
        console.error("Error al obtener horarios:", data.message)
        setHorasDisponibles([])
      }
    } catch (error) {
      console.error("Error al obtener horarios:", error)
      setHorasDisponibles([])
    } finally {
      setCargandoHorarios(false)
    }
  }

  const handleFechaChange = (fecha: string) => {
    setFechaSeleccionada(fecha)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (error || !escenario) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-4 text-center">
        <h1 className="text-2xl font-bold text-red-500">Error</h1>
        <p>{error || "No se pudo cargar el escenario"}</p>
        <Button asChild>
          <Link href="/escenarios">Volver a escenarios</Link>
        </Button>
      </div>
    )
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
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/escenarios" className="hover:text-foreground">
            Escenarios
          </Link>
          <span>/</span>
          <span className="text-foreground">{escenario.nombre}</span>
        </div>

        <div className="grid gap-8 md:grid-cols-5">
          {/* Galería e información (3/5) */}
          <div className="space-y-8 md:col-span-3">
            <h1 className="text-3xl font-bold">{escenario.nombre}</h1>

            <EscenarioGallery imagenes={escenario.imagenes} nombre={escenario.nombre} />

            <div className="space-y-6">
              <Card>
                <CardContent className="grid gap-4 p-6">
                  <h2 className="text-xl font-semibold">Detalles del escenario</h2>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Dirección</p>
                        <p className="text-sm text-muted-foreground">{escenario.direccion}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Capacidad</p>
                        <p className="text-sm text-muted-foreground">{escenario.capacidad} personas</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Deporte principal</p>
                        <p className="text-sm text-muted-foreground">{escenario.deporte}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Dimensiones</p>
                        <p className="text-sm text-muted-foreground">{escenario.dimensiones || "No especificado"}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-xl font-semibold">Descripción</h2>
                  <p className="text-muted-foreground">
                    {escenario.descripcion || "No hay descripción disponible para este escenario."}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-xl font-semibold">Servicios y Amenidades</h2>
                  {escenario.amenidades.length === 0 ? (
                    <p className="text-muted-foreground">No hay amenidades registradas para este escenario.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {escenario.amenidades.map((amenidad) => (
                        <div key={amenidad.id} className="flex items-center gap-2">
                          <BadgeInfo className="h-4 w-4 text-primary" />
                          <span className="text-sm">{amenidad.nombre}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Selector de disponibilidad (2/5) */}
          <div className="md:col-span-2">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Reservar este escenario</h2>

                {cargandoHorarios ? (
                  <div className="flex justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  </div>
                ) : (
                  <DisponibilidadSelector
                    escenarioId={id}
                    fecha={fechaSeleccionada}
                    horasDisponibles={horasDisponibles}
                    onFechaChange={handleFechaChange}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
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

