import { MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface EscenarioCardProps {
  id: number
  nombre: string
  descripcion?: string
  direccion?: string
  localidad?: string
  capacidad?: number
  deporte?: string
  imagen?: string | null
}

export function EscenarioCard({
  id,
  nombre,
  descripcion = "Sin descripción disponible",
  direccion = "Dirección no disponible",
  localidad = "Localidad no especificada",
  capacidad = 0,
  deporte = "Deporte no especificado",
  imagen = null,
}: EscenarioCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden venue-card">
      <div className="h-48 bg-gray-200 relative">
        {imagen ? (
          <img src={imagen || "/placeholder.svg"} alt={nombre} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200">
            <MapPin className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded text-sm">{deporte}</div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{nombre}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{descripcion}</p>
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="truncate">{direccion}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>Capacidad: {capacidad} personas</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">{localidad}</div>
          <Button className="bg-primary hover:bg-primary/90" asChild>
            <Link href={`/escenarios/${id}`}>Ver Detalles</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

