"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EscenarioGallery } from "@/components/escenarios/escenario-gallery"
import { DisponibilidadSelector } from "@/components/escenarios/disponibilidad-selector"
import { getEscenarioById, getHorariosDisponibles, getDiasDisponibles, getHorasDisponibles } from "@/services/escenario-service"
import { MapPin, Users, Calendar, Clock, BadgeInfo } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useParams } from "next/navigation"
import { SiteHeader } from "@/components/layout/site-header"

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

// Mock data for escenarios since the backend isn't working correctly
const MOCK_ESCENARIOS: Record<string, Escenario> = {
  "1": {
    id: 1,
    nombre: "Estadio Jaime Morón",
    descripcion:
      "El Estadio Jaime Morón León es el principal escenario deportivo para la práctica del fútbol en la ciudad de Cartagena. Cuenta con una capacidad para 16.000 espectadores, césped natural y graderías techadas.",
    direccion: "Barrio Olaya Herrera, Cartagena",
    localidad: "Olaya Herrera",
    capacidad: 16000,
    dimensiones: "105m x 68m",
    deporte: "Fútbol",
    estado: "disponible",
    amenidades: [],
    imagenes: [
      { id: 1, url_imagen: "estadio_jaime_moron_1.jpg", es_principal: true },
      { id: 2, url_imagen: "estadio_jaime_moron_2.jpg", es_principal: false },
      { id: 3, url_imagen: "estadio_jaime_moron_3.jpg", es_principal: false },
    ],
  },
  "2": {
    id: 2,
    nombre: "Estadio de Béisbol Once de Noviembre",
    descripcion:
      "Estadio de béisbol con capacidad para 12.000 espectadores, iluminación nocturna y palcos VIP.",
    direccion: "Centro, Cartagena",
    localidad: "Centro",
    capacidad: 12000,
    dimensiones: "120m x 120m",
    deporte: "Béisbol",
    estado: "disponible",
    amenidades: [],
    imagenes: [
      { id: 4, url_imagen: "estadio_beisbol_1.jpg", es_principal: true },
      { id: 5, url_imagen: "estadio_beisbol_2.jpg", es_principal: false },
      { id: 6, url_imagen: "estadio_beisbol_3.jpg", es_principal: false },
    ],
  },
  "3": {
    id: 3,
    nombre: "Complejo Acuático Jaime González Johnson",
    descripcion:
      "Complejo con piscina olímpica de 50 metros, piscina de clavados y áreas de entrenamiento.",
    direccion: "Centro, Cartagena",
    localidad: "Centro",
    capacidad: 1000,
    dimensiones: "50m x 25m",
    deporte: "Natación",
    estado: "disponible",
    amenidades: [],
    imagenes: [
      { id: 7, url_imagen: "complejo_acuatico_1.jpg", es_principal: true },
      { id: 8, url_imagen: "complejo_acuatico_2.jpg", es_principal: false },
      { id: 9, url_imagen: "complejo_acuatico_3.jpg", es_principal: false },
    ],
  },
  "4": {
    id: 4,
    nombre: "Pista de Atletismo Campo Elías Gutiérrez",
    descripcion:
      "Pista de atletismo con superficie sintética, 8 carriles y áreas para saltos y lanzamientos.",
    direccion: "Centro, Cartagena",
    localidad: "Centro",
    capacidad: 3000,
    dimensiones: "400m",
    deporte: "Atletismo",
    estado: "disponible",
    amenidades: [],
    imagenes: [
      { id: 10, url_imagen: "pista_atletismo_1.jpg", es_principal: true },
      { id: 11, url_imagen: "pista_atletismo_2.jpg", es_principal: false },
      { id: 12, url_imagen: "pista_atletismo_3.jpg", es_principal: false },
    ],
  },
  "5": {
    id: 5,
    nombre: "Coliseo de Combate y Gimnasia",
    descripcion:
      "Coliseo especializado para deportes de combate y gimnasia con áreas de entrenamiento.",
    direccion: "Centro, Cartagena",
    localidad: "Centro",
    capacidad: 2000,
    dimensiones: "40m x 30m",
    deporte: "Levantamiento de pesas",
    estado: "disponible",
    amenidades: [],
    imagenes: [
      { id: 13, url_imagen: "coliseo_combate_1.jpg", es_principal: true },
      { id: 14, url_imagen: "coliseo_combate_2.jpg", es_principal: false },
      { id: 15, url_imagen: "coliseo_combate_3.jpg", es_principal: false },
    ],
  },
  "6": {
    id: 6,
    nombre: "Estadio de Softbol de Chiquinquirá",
    descripcion:
      "Campo de softbol con gradas, iluminación y servicios complementarios para eventos deportivos.",
    direccion: "Chiquinquirá, Cartagena",
    localidad: "Chiquinquirá",
    capacidad: 3000,
    dimensiones: "80m x 80m",
    deporte: "Softbol",
    estado: "disponible",
    amenidades: [],
    imagenes: [
      { id: 16, url_imagen: "estadio_softbol_1.jpg", es_principal: true },
      { id: 17, url_imagen: "estadio_softbol_2.jpg", es_principal: false },
      { id: 18, url_imagen: "estadio_softbol_3.jpg", es_principal: false },
    ],
  },
  "7": {
    id: 7,
    nombre: "Patinódromo de El Campestre",
    descripcion:
      "Pista de patinaje de velocidad con superficie especializada y graderías para espectadores.",
    direccion: "El Campestre, Cartagena",
    localidad: "El Campestre",
    capacidad: 1500,
    dimensiones: "200m",
    deporte: "Patinaje",
    estado: "disponible",
    amenidades: [],
    imagenes: [
      { id: 19, url_imagen: "patinodromo_1.jpg", es_principal: true },
      { id: 20, url_imagen: "patinodromo_2.jpg", es_principal: false },
      { id: 21, url_imagen: "patinodromo_3.jpg", es_principal: false },
    ],
  },
  "8": {
    id: 8,
    nombre: "Coliseo Norton Madrid",
    descripcion:
      "Coliseo multiusos con cancha de baloncesto, voleibol y eventos culturales.",
    direccion: "Centro, Cartagena",
    localidad: "Centro",
    capacidad: 4000,
    dimensiones: "40m x 30m",
    deporte: "Baloncesto",
    estado: "disponible",
    amenidades: [],
    imagenes: [
      { id: 22, url_imagen: "coliseo_norton_1.jpg", es_principal: true },
      { id: 23, url_imagen: "coliseo_norton_2.jpg", es_principal: false },
      { id: 24, url_imagen: "coliseo_norton_3.jpg", es_principal: false },
    ],
  },
};

export default function EscenarioPage() {
  const params = useParams()
  const id = params?.id as string
  const { toast } = useToast()
  const [escenario, setEscenario] = useState<Escenario | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>("")
  const [diasDisponibles, setDiasDisponibles] = useState<string[]>([])
  const [horasDisponibles, setHorasDisponibles] = useState<string[]>([])
  const [cargandoHorarios, setCargandoHorarios] = useState<boolean>(false)
  const [cargandoDias, setCargandoDias] = useState<boolean>(false)

  // Cargar escenario y días disponibles
  useEffect(() => {
    const fetchEscenario = async () => {
      setLoading(true)
      try {
        const response = await getEscenarioById(id)
        if (response.success) {
          setEscenario(response.data)
        } else {
          if (MOCK_ESCENARIOS[id]) {
            setEscenario(MOCK_ESCENARIOS[id])
          } else {
            setError("Escenario no encontrado")
          }
        }
        // Establecer la fecha actual como seleccionada por defecto
        const hoy = new Date()
        setFechaSeleccionada(hoy.toISOString().split("T")[0])
      } catch (error) {
        if (MOCK_ESCENARIOS[id]) {
          setEscenario(MOCK_ESCENARIOS[id])
        } else {
          setError("Error de conexión. Por favor, intenta nuevamente.")
        }
      } finally {
        setLoading(false)
      }
    }

    const fetchDias = async () => {
      setCargandoDias(true)
      try {
        // Rango de fechas: hoy a 30 días después
        const hoy = new Date()
        const fechaInicio = hoy.toISOString().split("T")[0]
        const fechaFin = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 30).toISOString().split("T")[0]
        const response = await getDiasDisponibles(Number(id), fechaInicio, fechaFin)
        if (response.success) {
          setDiasDisponibles(response.data)
        } else {
          setDiasDisponibles([])
        }
      } catch (error) {
        setDiasDisponibles([])
      } finally {
        setCargandoDias(false)
      }
    }

    if (id) {
      fetchEscenario()
      fetchDias()
    }
  }, [id])

  // Cargar horas disponibles cuando cambia la fecha seleccionada
  useEffect(() => {
    if (fechaSeleccionada) {
      fetchHoras()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fechaSeleccionada])

  const fetchHoras = async () => {
    setCargandoHorarios(true)
    try {
      const response = await getHorasDisponibles(Number(id), fechaSeleccionada)
      if (response.success) {
        setHorasDisponibles(response.data)
      } else {
        toast({
          title: "Error",
          description: response.message || "Error al obtener horarios disponibles",
          variant: "destructive",
        })
        setHorasDisponibles([])
      }
    } catch (error) {
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
      <SiteHeader />

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
                        <p className="text-sm text-muted-foreground">{escenario.deporte || escenario.deporte_principal?.nombre}</p>
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

                {cargandoDias || cargandoHorarios ? (
                  <div className="flex justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-green border-t-transparent"></div>
                  </div>
                ) : (
                  <DisponibilidadSelector
                    escenarioId={id}
                    fecha={fechaSeleccionada}
                    horasDisponibles={horasDisponibles}
                    onFechaChange={handleFechaChange}
                    diasDisponibles={diasDisponibles}
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