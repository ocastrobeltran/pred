import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Ruler, Calendar } from "lucide-react"
import Link from "next/link"
import { OptimizedImage } from "@/components/ui/optimized-image"

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

interface EscenarioCardProps {
  escenario: Escenario
  viewMode?: "grid" | "list"
}

export function EscenarioCard({ escenario, viewMode = "grid" }: EscenarioCardProps) {
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "disponible":
        return "bg-green-100 text-green-800"
      case "mantenimiento":
        return "bg-yellow-100 text-yellow-800"
      case "reservado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case "disponible":
        return "Disponible"
      case "mantenimiento":
        return "En mantenimiento"
      case "reservado":
        return "Reservado"
      default:
        return estado
    }
  }

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {/* Imagen */}
            <div className="w-32 h-24 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
              <OptimizedImage
                src={escenario.imagen_principal}
                alt={escenario.nombre}
                size="thumbnail"
                width={128}
                height={96}
                objectFit="cover"
              />
            </div>

            {/* Contenido */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{escenario.nombre}</h3>
                <Badge className={getEstadoColor(escenario.estado)}>{getEstadoText(escenario.estado)}</Badge>
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{escenario.descripcion}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{escenario.localidad.nombre}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{escenario.capacidad.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Ruler className="h-4 w-4" />
                  <span>{escenario.dimensiones}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-blue-600 font-medium">{escenario.deporte_principal.nombre}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button asChild size="sm">
                  <Link href={`/escenarios/${escenario.id}`}>Ver detalles</Link>
                </Button>
                {/* {escenario.estado === "disponible" && (
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/escenarios/${escenario.id}/reservar`}>
                      <Calendar className="h-4 w-4 mr-1" />
                      Reservar
                    </Link>
                  </Button>
                )} */}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center overflow-hidden">
          <OptimizedImage src={escenario.imagen_principal} alt={escenario.nombre} size="card" fill priority />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{escenario.nombre}</h3>
          <Badge className={getEstadoColor(escenario.estado)}>{getEstadoText(escenario.estado)}</Badge>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{escenario.descripcion}</p>

        <div className="space-y-2 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{escenario.localidad.nombre}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Capacidad: {escenario.capacidad.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            <span>{escenario.dimensiones}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-600 font-medium">{escenario.deporte_principal.nombre}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button asChild size="sm" className="flex-1">
            <Link href={`/escenarios/${escenario.id}`}>Ver detalles</Link>
          </Button>
          {/* {escenario.estado === "disponible" && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/escenarios/${escenario.id}/reservar`}>
                <Calendar className="h-4 w-4" />
              </Link>
            </Button>
          )} */}
        </div>
      </CardContent>
    </Card>
  )
}
