"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft, ChevronRight } from "lucide-react"

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
  const [currentMonth, setCurrentMonth] = useState<number>(0) // 0 = current month, 1 = next month

  // Generar fechas para los próximos 2 meses
  const generateDates = (monthOffset: number) => {
    const today = new Date()
    const currentDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
    const month = currentDate.getMonth()
    const year = currentDate.getFullYear()

    // Get days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    // Generate array of dates
    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(year, month, i + 1)
      return {
        value: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" }),
        isToday: date.toDateString() === today.toDateString(),
        isPast: date < today && date.toDateString() !== today.toDateString(),
      }
    })
  }

  const currentMonthDates = generateDates(currentMonth)
  const currentMonthName = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + currentMonth,
    1,
  ).toLocaleDateString("es-ES", { month: "long", year: "numeric" })

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
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Selecciona una fecha</label>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentMonth((prev) => Math.max(0, prev - 1))}
              disabled={currentMonth === 0}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Mes anterior</span>
            </Button>
            <span className="text-sm font-medium">{currentMonthName}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentMonth((prev) => Math.min(2, prev + 1))}
              disabled={currentMonth >= 2}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Mes siguiente</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {/* Add empty cells for the first day of the month */}
          {Array.from({ length: new Date(currentMonthDates[0].value).getDay() || 7 }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10"></div>
          ))}

          {currentMonthDates.map((dateItem) => (
            <Button
              key={dateItem.value}
              variant={fecha === dateItem.value ? "default" : "outline"}
              className={`h-10 p-0 ${
                fecha === dateItem.value ? "bg-primary-green hover:bg-primary-dark-green" : ""
              } ${dateItem.isPast ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => !dateItem.isPast && onFechaChange(dateItem.value)}
              disabled={dateItem.isPast}
            >
              <span className="text-sm">{dateItem.label.split(" ")[1]}</span>
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
                className="text-center hover:bg-primary-green hover:text-white"
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

