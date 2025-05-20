import { MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface EscenarioCardProps {
  id: number
  nombre: string
  descripcion?: string
  direccion?: string
  localidad?: string
  localidad_nombre?: string
  capacidad?: number
  deporte?: string
  deporte_nombre?: string
  imagen_principal?: string | null
  // Support both imagen and imagen_principal
  imagen?: string | null
}

export function EscenarioCard({
  id,
  nombre,
  descripcion,
  direccion,
  localidad,
  localidad_nombre,
  capacidad,
  deporte,
  deporte_nombre,
  imagen_principal,
  imagen,
}: EscenarioCardProps) {
  // Use imagen_principal if available, otherwise use imagen
  const imagenUrl = imagen_principal || imagen || null
  // Use localidad_nombre if available, otherwise use localidad
  const localidadDisplay = localidad_nombre || localidad
  // Use deporte_nombre if available, otherwise use deporte
  const deporteDisplay = deporte_nombre || deporte

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden venue-card">
      <div className="h-48 bg-gray-200 relative">
        {imagenUrl ? (
          <img src={imagenUrl || "/placeholder.svg"} alt={nombre} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200">
            <MapPin className="h-12 w-12 text-gray-400" />
          </div>
        )}
        {deporteDisplay && (
          <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded text-sm">{deporteDisplay}</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{nombre}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{descripcion || "Sin descripción disponible"}</p>
        <div className="flex flex-col gap-2 mb-4">
          {direccion && (
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="truncate">{direccion}</span>
            </div>
          )}
          {capacidad && (
            <div className="flex items-center text-sm text-gray-500">
              <Users className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>Capacidad: {capacidad} personas</span>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center">
          {localidadDisplay && <div className="text-sm text-gray-500">{localidadDisplay}</div>}
          <Button className="bg-primary hover:bg-primary/90" asChild>
            <Link href={`/escenarios/${id}`}>Ver Detalles</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

