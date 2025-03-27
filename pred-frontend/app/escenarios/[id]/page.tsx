"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EscenarioGallery } from "@/components/escenarios/escenario-gallery"
import { DisponibilidadSelector } from "@/components/escenarios/disponibilidad-selector"
import { getEscenarioById, getHorariosDisponibles } from "@/services/escenario-service"
import { MapPin, Users, Calendar, Clock, BadgeInfo } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useParams } from "next/navigation"

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

// Mock data for escenarios since the backend isn't working correctly
const MOCK_ESCENARIOS: Record<string, Escenario> = {
  "1": {
    id: 1,
    nombre: "Estadio El Campín",
    descripcion: "Estadio principal de la ciudad con capacidad para eventos deportivos de gran escala.",
    direccion: "Calle 57 #21-83, Bogotá",
    localidad: "Teusaquillo",
    capacidad: 36343,
    dimensiones: "105m x 68m",
    deporte: "Fútbol",
    estado: "Activo",
    amenidades: [
      { id: 1, nombre: "Estacionamiento" },
      { id: 2, nombre: "Baños" },
      { id: 3, nombre: "Cafetería" },
    ],
    imagenes: [
      { id: 1, url_imagen: "/placeholder.svg?height=600&width=800", es_principal: true },
      { id: 2, url_imagen: "/placeholder.svg?height=600&width=800", es_principal: false },
      { id: 3, url_imagen: "/placeholder.svg?height=600&width=800", es_principal: false },
    ],
  },
  "2": {
    id: 2,
    nombre: "Coliseo El Salitre",
    descripcion: "Coliseo cubierto ideal para prácticas de baloncesto y competencias.",
    direccion: "Av. 68 #63-45, Bogotá",
    localidad: "Fontibón",
    capacidad: 5000,
    dimensiones: "40m x 20m",
    deporte: "Baloncesto",
    estado: "Activo",
    amenidades: [
      { id: 1, nombre: "Estacionamiento" },
      { id: 2, nombre: "Baños" },
      { id: 4, nombre: "Vestuarios" },
    ],
    imagenes: [
      { id: 4, url_imagen: "/placeholder.svg?height=600&width=800", es_principal: true },
      { id: 5, url_imagen: "/placeholder.svg?height=600&width=800", es_principal: false },
    ],
  },
  "3": {
    id: 3,
    nombre: "Complejo de Tenis",
    descripcion: "Canchas profesionales de tenis con iluminación y servicio completo.",
    direccion: "Calle 163 #8-50, Bogotá",
    localidad: "Usaquén",
    capacidad: 1000,
    dimensiones: "23.77m x 10.97m",
    deporte: "Tenis",
    estado: "Activo",
    amenidades: [
      { id: 2, nombre: "Baños" },
      { id: 4, nombre: "Vestuarios" },
      { id: 5, nombre: "Iluminación nocturna" },
    ],
    imagenes: [
      { id: 6, url_imagen: "/placeholder.svg?height=600&width=800", es_principal: true },
      { id: 7, url_imagen: "/placeholder.svg?height=600&width=800", es_principal: false },
    ],
  },
  "4": {
    id: 4,
    nombre: "Piscina Olímpica",
    descripcion: "Piscina olímpica con carriles reglamentarios y área de calentamiento.",
    direccion: "Calle 63 #47-06, Bogotá",
    localidad: "Engativá",
    capacidad: 800,
    dimensiones: "50m x 25m",
    deporte: "Natación",
    estado: "Activo",
    amenidades: [
      { id: 2, nombre: "Baños" },
      { id: 4, nombre: "Vestuarios" },
      { id: 6, nombre: "Duchas" },
    ],
    imagenes: [{ id: 8, url_imagen: "/placeholder.svg?height=600&width=800", es_principal: true }],
  },
  "5": {
    id: 5,
    nombre: "Pista de Atletismo",
    descripcion: "Pista de atletismo con superficie reglamentaria y áreas para saltos y lanzamientos.",
    direccion: "Av. Boyacá #80-94, Bogotá",
    localidad: "Kennedy",
    capacidad: 1200,
    dimensiones: "400m de perímetro",
    deporte: "Atletismo",
    estado: "Activo",
    amenidades: [
      { id: 1, nombre: "Estacionamiento" },
      { id: 2, nombre: "Baños" },
      { id: 7, nombre: "Gradas" },
    ],
    imagenes: [
      { id: 9, url_imagen: "/placeholder.svg?height=600&width=800", es_principal: true },
      { id: 10, url_imagen: "/placeholder.svg?height=600&width=800", es_principal: false },
    ],
  },
  "6": {
    id: 6,
    nombre: "Cancha de Voleibol",
    descripcion: "Cancha de voleibol con superficie de madera y equipamiento completo.",
    direccion: "Calle 26 #25-71, Bogotá",
    localidad: "Chapinero",
    capacidad: 500,
    dimensiones: "18m x 9m",
    deporte: "Voleibol",
    estado: "Activo",
    amenidades: [
      { id: 2, nombre: "Baños" },
      { id: 4, nombre: "Vestuarios" },
    ],
    imagenes: [{ id: 11, url_imagen: "/placeholder.svg?height=600&width=800", es_principal: true }],
  },
  "7": {
    id: 7,
    nombre: "Cancha de Béisbol",
    descripcion: "Campo de béisbol con dimensiones reglamentarias y dugouts.",
    direccion: "Av. Calle 26 #55-41, Bogotá",
    localidad: "Suba",
    capacidad: 3000,
    dimensiones: "120m x 120m",
    deporte: "Béisbol",
    estado: "Activo",
    amenidades: [
      { id: 1, nombre: "Estacionamiento" },
      { id: 2, nombre: "Baños" },
      { id: 7, nombre: "Gradas" },
    ],
    imagenes: [
      { id: 12, url_imagen: "/placeholder.svg?height=600&width=800", es_principal: true },
      { id: 13, url_imagen: "/placeholder.svg?height=600&width=800", es_principal: false },
    ],
  },
  "8": {
    id: 8,
    nombre: "Gimnasio Municipal",
    descripcion: "Gimnasio con equipamiento completo para entrenamiento de fuerza y cardio.",
    direccion: "Calle 45 #14-30, Bogotá",
    localidad: "Barrios Unidos",
    capacidad: 200,
    dimensiones: "500m²",
    deporte: "Fitness",
    estado: "Activo",
    amenidades: [
      { id: 2, nombre: "Baños" },
      { id: 4, nombre: "Vestuarios" },
      { id: 6, nombre: "Duchas" },
      { id: 8, nombre: "Lockers" },
    ],
    imagenes: [{ id: 14, url_imagen: "/placeholder.svg?height=600&width=800", es_principal: true }],
  },
}

export default function EscenarioPage() {
  const params = useParams()
  const id = params?.id as string
  const { toast } = useToast()
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
        // Try to get from API first
        const response = await getEscenarioById(id)

        if (response.success) {
          setEscenario(response.data)
        } else {
          // If API fails, use mock data
          if (MOCK_ESCENARIOS[id]) {
            setEscenario(MOCK_ESCENARIOS[id])
          } else {
            setError("Escenario no encontrado")
          }
        }

        // Establecer la fecha actual como fecha seleccionada por defecto
        const hoy = new Date()
        setFechaSeleccionada(hoy.toISOString().split("T")[0])
      } catch (error) {
        console.error("Error al cargar el escenario:", error)

        // Use mock data as fallback
        if (MOCK_ESCENARIOS[id]) {
          setEscenario(MOCK_ESCENARIOS[id])
        } else {
          setError("Error de conexión. Por favor, intenta nuevamente.")
        }
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchEscenario()
    }
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
      const response = await getHorariosDisponibles(id, fechaSeleccionada)

      if (response.success) {
        setHorasDisponibles(response.data)
      } else {
        console.error("Error al obtener horarios:", response.message)
        toast({
          title: "Error",
          description: response.message || "Error al obtener horarios disponibles",
          variant: "destructive",
        })
        setHorasDisponibles([])
      }
    } catch (error) {
      console.error("Error al obtener horarios:", error)
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
      })
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
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-green border-t-transparent"></div>
      </div>
    )
  }

  if (error || !escenario) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-4 text-center">
        <h1 className="text-2xl font-bold text-primary-red">Error</h1>
        <p>{error || "No se pudo cargar el escenario"}</p>
        <Button asChild className="bg-primary-green hover:bg-primary-dark-green">
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
            <span className="text-2xl font-bold text-primary-green">PRED</span>
          </Link>
          <nav className="hidden space-x-4 md:flex">
            <Link href="/" className="text-sm font-medium hover:text-primary-green">
              Inicio
            </Link>
            <Link href="/escenarios" className="text-sm font-medium text-primary-green">
              Escenarios
            </Link>
            <Link href="/#como-funciona" className="text-sm font-medium hover:text-primary-green">
              Cómo Funciona
            </Link>
            <Link href="/#contacto" className="text-sm font-medium hover:text-primary-green">
              Contacto
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button
                variant="outline"
                className="border-primary-green text-primary-green hover:bg-primary-light-green"
              >
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register" className="hidden md:block">
              <Button className="bg-primary-green hover:bg-primary-dark-green">Registrarse</Button>
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
                      <MapPin className="h-5 w-5 text-primary-green" />
                      <div>
                        <p className="font-medium">Dirección</p>
                        <p className="text-sm text-muted-foreground">{escenario.direccion}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary-green" />
                      <div>
                        <p className="font-medium">Capacidad</p>
                        <p className="text-sm text-muted-foreground">{escenario.capacidad} personas</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary-green" />
                      <div>
                        <p className="font-medium">Deporte principal</p>
                        <p className="text-sm text-muted-foreground">{escenario.deporte}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary-green" />
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
                          <BadgeInfo className="h-4 w-4 text-primary-green" />
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
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-green border-t-transparent"></div>
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

