"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { getPropositos, createSolicitud } from "@/services/solicitud-service"
import type { Proposito } from "@/lib/types"

interface SolicitudFormProps {
  escenarioId: string
  fecha: string
  hora: string
  escenarioNombre: string
  escenarioCapacidad: number
}

export function SolicitudForm({ escenarioId, fecha, hora, escenarioNombre, escenarioCapacidad }: SolicitudFormProps) {
  const { token } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [propositos, setPropositos] = useState<Proposito[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  // Formulario
  const [numParticipantes, setNumParticipantes] = useState<string>("10")
  const [propositoId, setPropositoId] = useState<string>("")
  const [notas, setNotas] = useState<string>("")

  useEffect(() => {
    // Cargar propósitos
    const fetchPropositos = async () => {
      try {
        const response = await getPropositos()

        if (response.success) {
          setPropositos(response.data)
          if (response.data.length > 0) {
            setPropositoId(response.data[0].id.toString())
          }
        }
      } catch (error) {
        console.error("Error al cargar propósitos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPropositos()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!propositoId || !numParticipantes) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      // Calcular hora fin (2 horas después de la hora inicio)
      const horaInicio = hora
      const horaInicioDate = new Date(`2000-01-01T${horaInicio}`)
      horaInicioDate.setHours(horaInicioDate.getHours() + 2)
      const horaFin = horaInicioDate.toTimeString().substring(0, 8)

      const response = await createSolicitud({
        escenario_id: escenarioId,
        fecha_reserva: fecha,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        proposito_id: propositoId,
        num_participantes: Number.parseInt(numParticipantes),
        notas: notas,
      })

      if (response.success) {
        setSuccess(true)
        toast({
          title: "Solicitud enviada",
          description: "Tu solicitud de reserva ha sido enviada correctamente",
        })
        // Redirigir al usuario a la página de sus reservas
        setTimeout(() => {
          router.push("/dashboard/mis-reservas")
        }, 2000)
      } else {
        toast({
          title: "Error",
          description: response.message || "Error al enviar la solicitud",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error)
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-green border-t-transparent"></div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-light-green text-primary-green">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-semibold">¡Solicitud Enviada!</h3>
        <p className="mb-4 text-muted-foreground">
          Tu solicitud de reserva ha sido enviada correctamente. Serás redirigido a tus reservas en unos segundos.
        </p>
        <Button
          onClick={() => router.push("/dashboard/mis-reservas")}
          className="bg-primary-green hover:bg-primary-dark-green"
        >
          Ver mis reservas
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Propósito de la Reserva</label>
        <Select value={propositoId} onValueChange={setPropositoId} required>
          <SelectTrigger className="border-gray-300">
            <SelectValue placeholder="Selecciona un propósito" />
          </SelectTrigger>
          <SelectContent>
            {propositos.map((proposito) => (
              <SelectItem key={proposito.id} value={proposito.id.toString()}>
                {proposito.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Número de Participantes</label>
        <Input
          type="number"
          min="1"
          max={escenarioCapacidad}
          value={numParticipantes}
          onChange={(e) => setNumParticipantes(e.target.value)}
          required
          className="border-gray-300"
        />
        <p className="text-xs text-gray-500">Capacidad máxima: {escenarioCapacidad} personas</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Notas Adicionales (Opcional)</label>
        <Textarea
          placeholder="Incluye cualquier información adicional relevante para tu reserva"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          rows={4}
          className="border-gray-300"
        />
      </div>

      <Button type="submit" className="w-full bg-primary-green hover:bg-primary-dark-green" disabled={submitting}>
        {submitting ? "Enviando..." : "Enviar Solicitud"}
      </Button>
    </form>
  )
}

