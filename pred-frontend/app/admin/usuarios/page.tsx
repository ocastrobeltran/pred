"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { getUsuarios, getRoles, deleteUsuario } from "@/services/usuario-service"
import { Search, Edit, Trash2, UserPlus, Filter } from "lucide-react"
import { UsuarioForm } from "@/components/admin/usuario-form"

interface Usuario {
  id: number
  nombre: string
  apellido: string
  email: string
  cedula: string
  telefono: string
  rol_id: number
  rol: {
    nombre: string
  }
  estado: string
  created_at: string
}

interface Rol {
  id: number
  nombre: string
}

export default function UsuariosPage() {
  const { toast } = useToast()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [roles, setRoles] = useState<Rol[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [rolFilter, setRolFilter] = useState("all")
  const [estadoFilter, setEstadoFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null)

  useEffect(() => {
    fetchUsuarios()
    fetchRoles()
  }, [currentPage])

  const fetchUsuarios = async () => {
    try {
      setLoading(true)
      const filters = {
        search: searchTerm || undefined,
        rol_id: rolFilter !== "all" ? Number(rolFilter) : undefined,
        estado: estadoFilter !== "all" ? estadoFilter : undefined,
      }

      const response = await getUsuarios(currentPage, filters)
      if (response.success) {
        setUsuarios(response.data.data)
        setTotalPages(response.data.pagination?.last_page || 1)
      } else {
        // Mock data para desarrollo
        setUsuarios([
          {
            id: 1,
            nombre: "Admin",
            apellido: "Sistema",
            email: "admin@pred.com",
            cedula: "1234567890",
            telefono: "3001234567",
            rol_id: 1,
            rol: { nombre: "Administrador" },
            estado: "activo",
            created_at: "2023-01-01T00:00:00Z",
          },
          {
            id: 2,
            nombre: "Supervisor",
            apellido: "Deportes",
            email: "supervisor@pred.com",
            cedula: "0987654321",
            telefono: "3007654321",
            rol_id: 2,
            rol: { nombre: "Supervisor" },
            estado: "activo",
            created_at: "2023-01-02T00:00:00Z",
          },
          {
            id: 3,
            nombre: "Usuario",
            apellido: "Regular",
            email: "usuario@pred.com",
            cedula: "5678901234",
            telefono: "3005678901",
            rol_id: 3,
            rol: { nombre: "Usuario" },
            estado: "activo",
            created_at: "2023-01-03T00:00:00Z",
          },
        ])
        setTotalPages(1)
      }
    } catch (error) {
      console.error("Error al cargar usuarios:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      const response = await getRoles()
      if (response.success) {
        setRoles(response.data)
      } else {
        // Mock data para desarrollo
        setRoles([
          { id: 1, nombre: "Administrador" },
          { id: 2, nombre: "Supervisor" },
          { id: 3, nombre: "Usuario" },
        ])
      }
    } catch (error) {
      console.error("Error al cargar roles:", error)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchUsuarios()
  }

  const handleFilterChange = () => {
    setCurrentPage(1)
    fetchUsuarios()
  }

  const handleDeleteUsuario = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        const response = await deleteUsuario(id)
        if (response.success) {
          toast({
            title: "Usuario eliminado",
            description: "El usuario ha sido eliminado exitosamente",
          })
          fetchUsuarios()
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

  const handleEditUsuario = (usuario: Usuario) => {
    setSelectedUsuario(usuario)
    setIsDialogOpen(true)
  }

  const handleCreateUsuario = () => {
    setSelectedUsuario(null)
    setIsDialogOpen(true)
  }

  const handleDialogClose = (refresh = false) => {
    setIsDialogOpen(false)
    if (refresh) {
      fetchUsuarios()
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

  if (loading && usuarios.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-green border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">Administra los usuarios del sistema</p>
        </div>
        <Button onClick={handleCreateUsuario} className="bg-primary-green hover:bg-primary-dark-green">
          <UserPlus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, email o cédula..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select
                value={rolFilter}
                onValueChange={(value) => {
                  setRolFilter(value)
                  handleFilterChange()
                }}
              >
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  {roles.map((rol) => (
                    <SelectItem key={rol.id} value={rol.id.toString()}>
                      {rol.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={estadoFilter}
                onValueChange={(value) => {
                  setEstadoFilter(value)
                  handleFilterChange()
                }}
              >
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="suspendido">Suspendido</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleSearch}>
                Buscar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium">Nombre</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Cédula</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Rol</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm">
                      {usuario.nombre} {usuario.apellido}
                    </td>
                    <td className="px-4 py-3 text-sm">{usuario.email}</td>
                    <td className="px-4 py-3 text-sm">{usuario.cedula}</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge className={getRolBadgeColor(usuario.rol_id)}>
                        {usuario.rol?.nombre ||
                          (usuario.rol_id === 1
                            ? "Administrador"
                            : usuario.rol_id === 2
                              ? "Supervisor"
                              : usuario.rol_id === 3
                                ? "Usuario"
                                : "Desconocido")}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Badge className={getEstadoBadgeColor(usuario.estado)}>
                        {usuario.estado.charAt(0).toUpperCase() + usuario.estado.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditUsuario(usuario)} title="Editar">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUsuario(usuario.id)}
                          title="Eliminar"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <div className="flex items-center px-2">
                  <span className="text-sm">
                    Página {currentPage} de {totalPages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo para crear/editar usuario */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedUsuario ? "Editar Usuario" : "Crear Usuario"}</DialogTitle>
          </DialogHeader>
          <UsuarioForm usuario={selectedUsuario} roles={roles} onClose={handleDialogClose} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
