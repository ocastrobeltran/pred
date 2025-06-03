"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { getEscenarioById } from "@/services/escenario-service"
import { getPropositos, createSolicitud } from "@/services/solicitud-service"
import { useToast } from "@/hooks/use-toast"

// ✅ CORRECCIÓN: Tipo con índice de string
interface MockEscenario {
  id: number
  nombre: string
  descripcion: string
  direccion: string
  localidad: string
  capacidad: number
  dimensiones: string
  deporte: string
  estado: string
  imagenes: Array<{
    id: number
    url_imagen: string
    es_principal: boolean
  }>
}

// ✅ CORRECCIÓN: Objeto con índice de string
const MOCK_ESCENARIOS: { [key: string]: MockEscenario } = {
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
    imagenes: [
      { id: 1, url_imagen: "estadio_jaime_moron.jpg", es_principal: true },
      { id: 2, url_imagen: "estadio_jaime_moron_2.jpg", es_principal: false },
      { id: 3, url_imagen: "estadio_jaime_moron_3.jpg", es_principal: false },
    ],
  },
  "2": {
    id: 2,
    nombre: "Estadio de Béisbol Once de Noviembre",
    descripcion: "Estadio de béisbol con capacidad para 12.000 espectadores, iluminación nocturna y palcos VIP.",
    direccion: "Centro, Cartagena",
    localidad: "Centro",
    capacidad: 12000,
    dimensiones: "120m x 120m",
    deporte: "Béisbol",
    estado: "disponible",
    imagenes: [
      { id: 4, url_imagen: "estadio_beisbol.jpg", es_principal: true },
      { id: 5, url_imagen: "estadio_beisbol_2.jpg", es_principal: false },
      { id: 6, url_imagen: "estadio_beisbol_3.jpg", es_principal: false },
    ],
  },
  "3": {
    id: 3,
    nombre: "Complejo Acuático Jaime González Johnson",
    descripcion: "Complejo con piscina olímpica de 50 metros, piscina de clavados y áreas de entrenamiento.",
    direccion: "Centro, Cartagena",
    localidad: "Centro",
    capacidad: 1000,
    dimensiones: "50m x 25m",
    deporte: "Natación",
    estado: "disponible",
    imagenes: [
      { id: 7, url_imagen: "complejo_acuatico.jpg", es_principal: true },
      { id: 8, url_imagen: "complejo_acuatico_2.jpg", es_principal: false },
      { id: 9, url_imagen: "complejo_acuatico_3.jpg", es_principal: false },
    ],
  },
  "4": {
    id: 4,
    nombre: "Pista de Atletismo Campo Elías Gutiérrez",
    descripcion: "Pista de atletismo con superficie sintética, 8 carriles y áreas para saltos y lanzamientos.",
    direccion: "Centro, Cartagena",
    localidad: "Centro",
    capacidad: 3000,
    dimensiones: "400m",
    deporte: "Atletismo",
    estado: "disponible",
    imagenes: [
      { id: 10, url_imagen: "pista_atletismo.jpg", es_principal: true },
      { id: 11, url_imagen: "pista_atletismo_2.jpg", es_principal: false },
      { id: 12, url_imagen: "pista_atletismo_3.jpg", es_principal: false },
    ],
  },
  "5": {
    id: 5,
    nombre: "Coliseo de Combate y Gimnasia",
    descripcion: "Coliseo especializado para deportes de combate y gimnasia con áreas de entrenamiento.",
    direccion: "Centro, Cartagena",
    localidad: "Centro",
    capacidad: 2000,
    dimensiones: "40m x 30m",
    deporte: "Levantamiento de pesas",
    estado: "disponible",
    imagenes: [
      { id: 13, url_imagen: "coliseo_combate.jpg", es_principal: true },
      { id: 14, url_imagen: "coliseo_combate_2.jpg", es_principal: false },
      { id: 15, url_imagen: "coliseo_combate_3.jpg", es_principal: false },
    ],
  },
  "6": {
    id: 6,
    nombre: "Estadio de Softbol de Chiquinquirá",
    descripcion: "Campo de softbol con gradas, iluminación y servicios complementarios para eventos deportivos.",
    direccion: "Chiquinquirá, Cartagena",
    localidad: "Chiquinquirá",
    capacidad: 3000,
    dimensiones: "80m x 80m",
    deporte: "Softbol",
    estado: "disponible",
    imagenes: [
      { id: 16, url_imagen: "estadio_softbol.jpg", es_principal: true },
      { id: 17, url_imagen: "estadio_softbol_2.jpg", es_principal: false },
      { id: 18, url_imagen: "estadio_softbol_3.jpg", es_principal: false },
    ],
  },
  "7": {
    id: 7,
    nombre: "Patinódromo de El Campestre",
    descripcion: "Pista de patinaje de velocidad con superficie especializada y graderías para espectadores.",
    direccion: "El Campestre, Cartagena",
    localidad: "El Campestre",
    capacidad: 1500,
    dimensiones: "200m",
    deporte: "Patinaje",
    estado: "disponible",
    imagenes: [
      { id: 19, url_imagen: "patinodromo.jpg", es_principal: true },
      { id: 20, url_imagen: "patinodromo_2.jpg", es_principal: false },
      { id: 21, url_imagen: "patinodromo_3.jpg", es_principal: false },
    ],
  },
  "8": {
    id: 8,
    nombre: "Coliseo Norton Madrid",
    descripcion: "Coliseo multiusos con cancha de baloncesto, voleibol y eventos culturales.",
    direccion: "Centro, Cartagena",
    localidad: "Centro",
    capacidad: 4000,
    dimensiones: "40m x 30m",
    deporte: "Baloncesto",
    estado: "disponible",
    imagenes: [
      { id: 22, url_imagen: "coliseo_norton.jpg", es_principal: true },
      { id: 23, url_imagen: "coliseo_norton_2.jpg", es_principal: false },
      { id: 24, url_imagen: "coliseo_norton_3.jpg", es_principal: false },
    ],
  },
}

interface Escenario {
  id: number
  nombre: string
  descripcion: string
  direccion: string
  capacidad: number
  dimensiones: string
  estado: string
  imagen_principal?: string | null
  localidad: string | { id: number; nombre: string }
  deporte?: string | { id: number; nombre: string; icono?: string }
}

interface Proposito {
  id: number
  nombre: string
}

export default function ReservarPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, loading } = useAuth()
  const { toast } = useToast()

  const escenarioId = searchParams.get("escenario_id") || ""
  const fecha = searchParams.get("fecha") || ""
  const hora = searchParams.get("hora") || ""

  const [escenario, setEscenario] = useState<Escenario | null>(null)
  const [loadingEscenario, setLoadingEscenario] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [propositos, setPropositos] = useState<Proposito[]>([])
  const [loadingPropositos, setLoadingPropositos] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [form, setForm] = useState({
    proposito_id: "",
    num_participantes: "",
    notas: "",
  })
  const [enviando, setEnviando] = useState(false)

  // Manejar hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Verificar que se tienen todos los parámetros necesarios
    if (!escenarioId || !fecha || !hora) {
      setError("Faltan parámetros requeridos para la reserva.")
      setLoadingEscenario(false)
      return
    }

    // Si el usuario no está autenticado, redirigir al login
    if (!loading && !user) {
      router.push(`/login?redirect=/reservar?escenario_id=${escenarioId}&fecha=${fecha}&hora=${hora}`)
      return
    }

    // Cargar datos del escenario
    const fetchEscenario = async () => {
      setLoadingEscenario(true)
      try {
        console.log("Cargando escenario ID:", escenarioId)

        // Primero intentar con datos mock para asegurar que funcione
        if (MOCK_ESCENARIOS[escenarioId]) {
          console.log("Usando datos mock para escenario:", escenarioId)
          setEscenario(MOCK_ESCENARIOS[escenarioId])
        } else {
          // Intentar con API
          const response = await getEscenarioById(escenarioId)
          console.log("Respuesta API escenario:", response)

          if (response.success && response.data) {
            setEscenario(response.data)
          } else {
            setError("No se pudo encontrar el escenario solicitado.")
          }
        }
      } catch (error) {
        console.error("Error cargando escenario:", error)
        // Fallback a mock data
        if (MOCK_ESCENARIOS[escenarioId]) {
          setEscenario(MOCK_ESCENARIOS[escenarioId])
        } else {
          setError("Error de conexión. Por favor, intenta nuevamente.")
        }
      } finally {
        setLoadingEscenario(false)
      }
    }

    // Cargar propósitos
    const fetchPropositos = async () => {
      setLoadingPropositos(true)
      try {
        console.log("Cargando propósitos...")
        const response = await getPropositos()
        console.log("Respuesta completa de propósitos:", response)
        console.log("Tipo de response.data:", typeof response.data)
        console.log("Es array response.data:", Array.isArray(response.data))
        console.log("Contenido de response.data:", response.data)

        if (response.success && response.data) {
          let data: Proposito[] = []

          // Verificar si response.data es un array directamente
          if (Array.isArray(response.data)) {
            console.log("response.data es array directo, usando:", response.data)
            data = response.data
          } else if (response.data.data && Array.isArray(response.data.data)) {
            console.log("response.data.data es array, usando:", response.data.data)
            data = response.data.data
          } else {
            console.log("Estructura no reconocida, usando datos mock")
            data = [
              { id: 1, nombre: "Evento deportivo" },
              { id: 2, nombre: "Entrenamiento" },
              { id: 3, nombre: "Competencia" },
              { id: 4, nombre: "Recreación" },
              { id: 5, nombre: "Clase" },
            ]
          }

          setPropositos(data)
        } else {
          console.log("API falló, usando datos mock")
          setPropositos([
            { id: 1, nombre: "Evento deportivo" },
            { id: 2, nombre: "Entrenamiento" },
            { id: 3, nombre: "Competencia" },
            { id: 4, nombre: "Recreación" },
            { id: 5, nombre: "Clase" },
          ])
        }
      } catch (error) {
        console.error("Error cargando propósitos:", error)
        // Usar datos mock en caso de error
        setPropositos([
          { id: 1, nombre: "Evento deportivo" },
          { id: 2, nombre: "Entrenamiento" },
          { id: 3, nombre: "Competencia" },
          { id: 4, nombre: "Recreación" },
          { id: 5, nombre: "Clase" },
        ])
      } finally {
        setLoadingPropositos(false)
      }
    }

    fetchEscenario()
    fetchPropositos()
  }, [mounted, escenarioId, fecha, hora, user, loading, router])

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleReserva = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.proposito_id || !form.num_participantes) {
      toast({
        title: "Faltan datos",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive",
      })
      return
    }
    setEnviando(true)
    try {
      // Formato correcto: HH:MM
      const hora_inicio = hora.slice(0, 5)
      const [h, m] = hora_inicio.split(":").map(Number)
      const hora_fin = `${String(h + 2).padStart(2, "0")}:${String(m).padStart(2, "0")}`

      const solicitud = {
        escenario_id: Number(escenarioId),
        fecha_reserva: fecha,
        hora_inicio,
        hora_fin,
        proposito_id: Number(form.proposito_id),
        num_participantes: Number(form.num_participantes),
        notas: form.notas,
      }

      const data = await createSolicitud(solicitud)

      if (data.success) {
        toast({
          title: "Reserva realizada",
          description: "Tu solicitud de reserva fue enviada correctamente.",
        })
        setForm({
          proposito_id: "",
          num_participantes: "",
          notas: "",
        })
        router.push("/dashboard/solicitudes")
      } else {
        toast({
          title: "Error",
          description: data.message || "No se pudo realizar la reserva.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "No se pudo realizar la reserva.",
        variant: "destructive",
      })
    } finally {
      setEnviando(false)
    }
  }

  // No renderizar nada hasta que esté montado (evita hidratación)
  if (!mounted) {
    return null
  }

  if (loading || loadingEscenario) {
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
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()}>
              Volver
            </Button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto py-8 px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-3xl font-bold">Reservar Escenario</h1>

          <div className="grid gap-6 md:grid-cols-5">
            {/* Información del escenario y la reserva */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Resumen de la Reserva</CardTitle>
                  <CardDescription>Detalles del escenario y horario</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">{escenario.nombre}</h3>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      <span>
                        {typeof escenario.localidad === "string" ? escenario.localidad : escenario.localidad?.nombre},{" "}
                        {escenario.direccion}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-md bg-muted p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-semibold">Fecha:</span>
                      <span>
                        {new Date(fecha).toLocaleDateString("es-ES", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-semibold">Hora:</span>
                      <span>{hora} - 2 horas</span>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p>* La reserva tiene una duración de 2 horas.</p>
                    <p>* Tu solicitud será revisada por un administrador.</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Formulario de solicitud */}
            <div className="md:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Detalles de la Solicitud</CardTitle>
                  <CardDescription>Completa la información para tu reserva</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={handleReserva}>
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="proposito_id">
                        Propósito de la reserva <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="proposito_id"
                        name="proposito_id"
                        className="w-full rounded border px-3 py-2"
                        value={form.proposito_id}
                        onChange={handleFormChange}
                        required
                        disabled={enviando || loadingPropositos}
                      >
                        <option value="">{loadingPropositos ? "Cargando..." : "Selecciona un propósito"}</option>
                        {Array.isArray(propositos) &&
                          propositos.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.nombre}
                            </option>
                          ))}
                      </select>
                      {propositos.length > 0 && (
                        <p className="text-xs text-green-600 mt-1">{propositos.length} propósitos cargados</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="num_participantes">
                        Número de participantes <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min={1}
                        id="num_participantes"
                        name="num_participantes"
                        className="w-full rounded border px-3 py-2"
                        value={form.num_participantes}
                        onChange={handleFormChange}
                        required
                        disabled={enviando}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="notas">
                        Notas adicionales
                      </label>
                      <textarea
                        id="notas"
                        name="notas"
                        className="w-full rounded border px-3 py-2"
                        value={form.notas}
                        onChange={handleFormChange}
                        rows={2}
                        disabled={enviando}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={enviando || loadingPropositos || !form.proposito_id || !form.num_participantes}
                    >
                      {enviando ? "Enviando..." : "Reservar"}
                    </Button>

                    {/* Debug info */}
                    <div className="text-xs text-gray-500 mt-2">
                      <p>Escenario: {escenario ? "✓ Cargado" : "✗ No cargado"}</p>
                      <p>Propósitos: {propositos.length > 0 ? `✓ ${propositos.length} cargados` : "✗ No cargados"}</p>
                      <p>Formulario válido: {form.proposito_id && form.num_participantes ? "✓" : "✗"}</p>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="border-t px-6 py-4 text-xs text-muted-foreground">
                  Al enviar este formulario, aceptas los términos y condiciones de la plataforma PRED.
                </CardFooter>
              </Card>
            </div>
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
