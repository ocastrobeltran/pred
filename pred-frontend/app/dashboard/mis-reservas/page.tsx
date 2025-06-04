"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

// Definir la interfaz para las reservas
interface Reserva {
  id: number
  escenario: string
  fecha: string
  hora_inicio: string
  hora_fin: string
  estado: "confirmada" | "pendiente" | "cancelada"
}

export default function MisReservasPage() {
  const { user, token } = useAuth()
  const { toast } = useToast()
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReservas = async () => {
      if (!token) return

      try {
        // Aquí iría la llamada a la API para obtener las reservas
        // Por ahora usamos datos de ejemplo
        const mockReservas: Reserva[] = [
          {
            id: 1,
            escenario: "Estadio Jaime Morón",
            fecha: "2025-06-10",
            hora_inicio: "14:00",
            hora_fin: "16:00",
            estado: "confirmada",
          },
          {
            id: 2,
            escenario: "Cancha Sintética San Fernando",
            fecha: "2025-06-15",
            hora_inicio: "10:00",
            hora_fin: "12:00",
            estado: "pendiente",
          },
        ]

        setReservas(mockReservas)
      } catch (error) {
        console.error("Error al cargar reservas:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar tus reservas",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchReservas()
  }, [token, toast])

  const getEstadoBadge = (estado: Reserva["estado"]) => {
    switch (estado) {
      case "confirmada":
        return <Badge className="bg-green-500">Confirmada</Badge>
      case "pendiente":
        return <Badge className="bg-yellow-500">Pendiente</Badge>
      case "cancelada":
        return <Badge className="bg-red-500">Cancelada</Badge>
      default:
        return <Badge className="bg-gray-500">{estado}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-2xl font-bold">Mis Reservas</h1>

      {reservas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="mb-4 text-center text-muted-foreground">No tienes reservas activas</p>
            <Link href="/escenarios">
              <Button>Reservar un escenario</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reservas.map((reserva) => (
            <Card key={reserva.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{reserva.escenario}</span>
                  {getEstadoBadge(reserva.estado)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">
                  <strong>Fecha:</strong> {reserva.fecha}
                </p>
                <p className="mb-2">
                  <strong>Hora:</strong> {reserva.hora_inicio} - {reserva.hora_fin}
                </p>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button variant="outline">Ver detalles</Button>
                  {reserva.estado === "pendiente" && <Button variant="destructive">Cancelar</Button>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
