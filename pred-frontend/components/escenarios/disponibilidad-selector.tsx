"use client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"

interface DisponibilidadSelectorProps {
  escenarioId: string
  fecha: string
  horasDisponibles: string[]
  onFechaChange: (fecha: string) => void
}

export function DisponibilidadSelector({
  escenarioId,
  fecha,
  horasDisponibles,
  onFechaChange,
}: DisponibilidadSelectorProps) {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Generar fechas para los próximos 7 días
  const proximasFechas = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return {
      value: date.toISOString().split("T")[0],
      label: date.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" }),
    }
  })

  const handleReservar = (hora: string) => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para reservar un escenario",
        variant: "destructive",
      })
      router.push(`/login?redirect=/escenarios/${escenarioId}`)
      return
    }

    // Redirigir a la página de reserva con los parámetros
    router.push(`/reservar?escenario_id=${escenarioId}&fecha=${fecha}&hora=${hora}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium mb-2 block">Selecciona una fecha</label>
        <div className="grid grid-cols-7 gap-1">
          {proximasFechas.map((fechaItem) => (
            <Button
              key={fechaItem.value}
              variant={fecha === fechaItem.value ? "default" : "outline"}
              className={`h-auto py-2 px-1 flex flex-col ${
                fecha === fechaItem.value ? "bg-primary hover:bg-primary/90" : ""
              }`}
              onClick={() => onFechaChange(fechaItem.value)}
            >
              <span className="text-xs">{fechaItem.label.split(" ")[0]}</span>
              <span className="text-lg font-bold">{fechaItem.label.split(" ")[1]}</span>
            </Button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Selecciona una hora</label>
        {horasDisponibles.length === 0 ? (
          <div className="text-center py-6 border rounded-md bg-gray-50">
            <p className="text-gray-500">No hay horarios disponibles para esta fecha</p>
            <p className="text-sm text-gray-400 mt-1">Intenta seleccionar otra fecha</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {horasDisponibles.map((hora) => (
              <Button
                key={hora}
                variant="outline"
                className="text-center hover:bg-primary hover:text-white"
                onClick={() => handleReservar(hora)}
              >
                {hora.substring(0, 5)}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

