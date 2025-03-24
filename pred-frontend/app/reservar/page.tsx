"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { SolicitudForm } from "@/components/forms/solicitud-form"
import { API_URL } from "@/lib/config"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Clock } from "lucide-react"
import Link from "next/link"

interface Escenario {
  id: number
  nombre: string
  descripcion: string
  direccion: string
  localidad: string
  capacidad: number
  imagen: string | null
}

export default function ReservarPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, loading } = useAuth()

  const escenarioId = searchParams.get("escenario_id") || ""
  const fecha = searchParams.get("fecha") || ""
  const hora = searchParams.get("hora") || ""

  const [escenario, setEscenario] = useState<Escenario | null>(null)
  const [loadingEscenario, setLoadingEscenario] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
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
        const response = await fetch(`${API_URL}/escenarios/${escenarioId}`)
        const data = await response.json()

        if (data.success) {
          setEscenario(data.data)
        } else {
          setError(data.message || "Error al cargar el escenario")
        }
      } catch (error) {
        console.error("Error al cargar el escenario:", error)
        setError("Error de conexión. Por favor, intenta nuevamente.")
      } finally {
        setLoadingEscenario(false)
      }
    }

    fetchEscenario()
  }, [escenarioId, fecha, hora, user, loading, router])

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
                        {escenario.direccion}, {escenario.localidad}
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
                  <SolicitudForm
                    escenarioId={escenarioId}
                    fecha={fecha}
                    hora={hora}
                    escenarioNombre={escenario.nombre}
                    escenarioCapacidad={escenario.capacidad}
                  />
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

