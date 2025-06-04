"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { getUsuarioById, deleteUsuario } from "@/services/usuario-service"
import { ArrowLeft, Edit, Trash2, User, Mail, Phone, CreditCard, MapPin, Calendar } from "lucide-react"
import Link from "next/link"

interface Usuario {
  id: number
  nombre: string
  apellido: string
  email: string
  cedula: string
  telefono: string
  direccion?: string
  rol_id: number
  rol: {
    id: number
    nombre: string
  }
  estado: string
  created_at: string
  updated_at: string
}

export default function UsuarioDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const id = params?.id as string

  useEffect(() => {
    if (id) {
      fetchUsuario()
    }
  }, [id])

  const fetchUsuario = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("🔄 Fetching usuario with ID:", id)
      const response = await getUsuarioById(id)
      console.log("📥 Usuario response:", response)

      if (response.success && response.data) {
        let usuarioData = response.data

        // Handle different response structures
        if (response.data.data) {
          usuarioData = response.data.data
        }

        console.log("✅ Setting usuario:", usuarioData)
        setUsuario(usuarioData)
      } else {
        // Mock data for development
        console.log("❌ API failed, using mock data")
        const mockUsuario = {
          id: Number.parseInt(id),
          nombre: "Usuario",
          apellido: "Ejemplo",
          email: `usuario${id}@pred.com`,
          cedula: `123456789${id}`,
          telefono: `300123456${id}`,
          direccion: "Dirección de ejemplo",
          rol_id: 3,
          rol: { id: 3, nombre: "Usuario" },
          estado: "activo",
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        }
        setUsuario(mockUsuario)
      }
    } catch (error) {
      console.error("💥 Error fetching usuario:", error)
      setError("Error al cargar la información del usuario")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!usuario) return

    if (window.confirm(`¿Estás seguro de que deseas eliminar al usuario ${usuario.nombre} ${usuario.apellido}?`)) {
      try {
        const response = await deleteUsuario(usuario.id)
        if (response.success) {
          toast({
            title: "Usuario eliminado",
            description: "El usuario ha sido eliminado exitosamente",
          })
          router.push("/admin/usuarios")
        } else {
          toast({
            title: "Error",
            description: response.message || "No se pudo eliminar el usuario",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error al eliminar usuario:", error)
        toast({
          title: "Error",
          description: "Error de conexión",
          variant: "destructive",
        })
      }
    }
  }

  const getRolBadgeColor = (rolId: number) => {
    switch (rolId) {
      case 1:
        return "bg-red-100 text-red-800"
      case 2:
        return "bg-blue-100 text-blue-800"
      case 3:
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case "activo":
        return "bg-green-100 text-green-800"
      case "inactivo":
        return "bg-gray-100 text-gray-800"
      case "suspendido":
        return "bg-red-100 text-red-800"
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

  if (error || !usuario) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/usuarios">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
            <p className="text-muted-foreground">{error || "Usuario no encontrado"}</p>
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
            <Link href="/admin/usuarios">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {usuario.nombre} {usuario.apellido}
            </h1>
            <p className="text-muted-foreground">Detalles del usuario</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/usuarios/${usuario.id}/edit`}>
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
            <User className="h-5 w-5" />
            Información Personal
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Nombre completo</p>
              <p className="text-sm text-muted-foreground">
                {usuario.nombre} {usuario.apellido}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{usuario.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Cédula</p>
              <p className="text-sm text-muted-foreground">{usuario.cedula}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Teléfono</p>
              <p className="text-sm text-muted-foreground">{usuario.telefono}</p>
            </div>
          </div>
          {usuario.direccion && (
            <div className="flex items-center gap-3 md:col-span-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Dirección</p>
                <p className="text-sm text-muted-foreground">{usuario.direccion}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estado y rol */}
      <Card>
        <CardHeader>
          <CardTitle>Estado y Permisos</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium mb-2">Rol</p>
            <Badge className={getRolBadgeColor(usuario.rol_id)}>{usuario.rol?.nombre || "Sin rol"}</Badge>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Estado</p>
            <Badge className={getEstadoBadgeColor(usuario.estado)}>
              {usuario.estado.charAt(0).toUpperCase() + usuario.estado.slice(1)}
            </Badge>
          </div>
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
            <p className="text-sm font-medium">Fecha de registro</p>
            <p className="text-sm text-muted-foreground">
              {new Date(usuario.created_at).toLocaleDateString("es-ES", {
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
              {new Date(usuario.updated_at).toLocaleDateString("es-ES", {
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
