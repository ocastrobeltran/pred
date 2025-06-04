"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { getEscenarioById, deleteEscenario } from "@/services/escenario-service"
import { ArrowLeft, Edit, Trash2, MapPin, Users, Calendar, Clock, BadgeInfo } from "lucide-react"
import Link from "next/link"

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
  amenidades?: Array<{
    id: number
    nombre: string
    icono: string
  }>
  created_at: string
  updated_at: string
}

export default function EscenarioDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [escenario, setEscenario] = useState<Escenario | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const id = params?.id as string

  useEffect(() => {
    if (id) {
      fetchEscenario()
    }
  }, [id])

  const fetchEscenario = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("🔄 Fetching escenario with ID:", id)
      const response = await getEscenarioById(id)
      console.log("📥 Escenario response:", response)

      if (response.success && response.data) {
        let escenarioData = response.data

        // Handle different response structures
        if (response.data.data) {
          escenarioData = response.data.data
        }

        console.log("✅ Setting escenario:", escenarioData)
        setEscenario(escenarioData)
      } else {
        // Mock data for development
        console.log("❌ API failed, using mock data")
        const mockEscenario = {
          id: Number.parseInt(id),
          nombre: `Escenario ${id}`,
          descripcion: "Descripción de ejemplo para este escenario deportivo.",
          direccion: "Dirección de ejemplo, Cartagena",
          capacidad: 1000,
          dimensiones: "100m x 50m",
          estado: "disponible",
          imagen_principal: null,
          localidad: { id: 1, nombre: "Centro" },
          deporte_principal: { id: 1, nombre: "Fútbol", icono: "fa-futbol" },
          amenidades: [
            { id: 1, nombre: "Vestuarios", icono: "fa-tshirt" },
            { id: 2, nombre: "Iluminación", icono: "fa-lightbulb" },
          ],
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        }
        setEscenario(mockEscenario)
      }
    } catch (error) {
      console.error("💥 Error fetching escenario:", error)
      setError("Error al cargar la información del escenario")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!escenario) return

    if (window.confirm(`¿Estás seguro de que deseas eliminar el escenario ${escenario.nombre}?`)) {
      try {
        const response = await deleteEscenario(escenario.id)
        if (response.success) {
          toast({
            title: "Escenario eliminado",
            description: "El escenario ha sido eliminado exitosamente",
          })
          router.push("/admin/escenarios")
        } else {
          toast({
            title: "Error",
            description: response.message || "No se pudo eliminar el escenario",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error al eliminar escenario:", error)
        toast({
          title: "Error",
          description: "Error de conexión",
          variant: "destructive",
        })
      }
    }
  }

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case "disponible":
      case "activo":
        return "bg-green-100 text-green-800"
      case "inactivo":
        return "bg-gray-100 text-gray-800"
      case "mantenimiento":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-green border-t-transparent"></div>
      </div>
    )
  }

  if (error || !escenario) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/escenarios">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
            <p className="text-muted-foreground">{error || "Escenario no encontrado"}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/escenarios">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{escenario.nombre}</h1>
            <p className="text-muted-foreground">Detalles del escenario</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/escenarios/${escenario.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>

      {/* Información básica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Información General
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Dirección</p>
              <p className="text-sm text-muted-foreground">{escenario.direccion}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Capacidad</p>
              <p className="text-sm text-muted-foreground">{escenario.capacidad.toLocaleString()} personas</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Deporte principal</p>
              <p className="text-sm text-muted-foreground">
                {escenario.deporte_principal?.nombre || "No especificado"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Dimensiones</p>
              <p className="text-sm text-muted-foreground">{escenario.dimensiones || "No especificado"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BadgeInfo className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Localidad</p>
              <p className="text-sm text-muted-foreground">{escenario.localidad?.nombre || "No especificada"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BadgeInfo className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Estado</p>
              <Badge className={getEstadoBadgeColor(escenario.estado)}>
                {escenario.estado.charAt(0).toUpperCase() + escenario.estado.slice(1)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Descripción */}
      <Card>
        <CardHeader>
          <CardTitle>Descripción</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {escenario.descripcion || "No hay descripción disponible para este escenario."}
          </p>
        </CardContent>
      </Card>

      {/* Amenidades */}
      <Card>
        <CardHeader>
          <CardTitle>Servicios y Amenidades</CardTitle>
        </CardHeader>
        <CardContent>
          {!escenario.amenidades || escenario.amenidades.length === 0 ? (
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

      {/* Información del sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Información del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium">Fecha de creación</p>
            <p className="text-sm text-muted-foreground">
              {new Date(escenario.created_at).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Última actualización</p>
            <p className="text-sm text-muted-foreground">
              {new Date(escenario.updated_at).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
