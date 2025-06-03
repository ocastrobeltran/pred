"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { createUsuario, updateUsuario } from "@/services/usuario-service"
import { Eye, EyeOff } from "lucide-react"

interface Usuario {
  id?: number
  nombre: string
  apellido: string
  email: string
  cedula: string
  telefono: string
  direccion?: string
  rol_id: number
  estado?: string
}

interface UsuarioFormProps {
  usuario: Usuario | null
  roles: { id: number; nombre: string }[]
  onClose: (refresh?: boolean) => void
}

export function UsuarioForm({ usuario, roles, onClose }: UsuarioFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<Partial<Usuario>>(
    usuario || {
      nombre: "",
      apellido: "",
      email: "",
      cedula: "",
      telefono: "",
      direccion: "",
      rol_id: 3, // Default: Usuario regular
      estado: "activo",
    },
  )
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre?.trim()) {
      newErrors.nombre = "El nombre es requerido"
    }

    if (!formData.apellido?.trim()) {
      newErrors.apellido = "El apellido es requerido"
    }

    if (!formData.email?.trim()) {
      newErrors.email = "El email es requerido"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email no es válido"
    }

    if (!formData.cedula?.trim()) {
      newErrors.cedula = "La cédula es requerida"
    }

    if (!formData.telefono?.trim()) {
      newErrors.telefono = "El teléfono es requerido"
    }

    if (!usuario) {
      // Solo validar password para usuarios nuevos
      if (!password.trim()) {
        newErrors.password = "La contraseña es requerida"
      } else if (password.length < 6) {
        newErrors.password = "La contraseña debe tener al menos 6 caracteres"
      }

      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const userData = {
        ...formData,
        ...(password && { password }),
      } as Usuario

      let response
      if (usuario) {
        response = await updateUsuario(usuario.id!, userData)
      } else {
        response = await createUsuario(userData)
      }

      if (response.success) {
        toast({
          title: usuario ? "Usuario actualizado" : "Usuario creado",
          description: usuario
            ? "El usuario ha sido actualizado exitosamente"
            : "El usuario ha sido creado exitosamente",
        })
        onClose(true)
      } else {
        toast({
          title: "Error",
          description: response.message || "No se pudo guardar el usuario",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al guardar usuario:", error)
      toast({
        title: "Error",
        description: "Error de conexión",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof Usuario, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre *</Label>
          <Input
            id="nombre"
            value={formData.nombre || ""}
            onChange={(e) => handleInputChange("nombre", e.target.value)}
            placeholder="Ingrese el nombre"
            className={errors.nombre ? "border-red-500" : ""}
          />
          {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="apellido">Apellido *</Label>
          <Input
            id="apellido"
            value={formData.apellido || ""}
            onChange={(e) => handleInputChange("apellido", e.target.value)}
            placeholder="Ingrese el apellido"
            className={errors.apellido ? "border-red-500" : ""}
          />
          {errors.apellido && <p className="text-sm text-red-500">{errors.apellido}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email || ""}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="Ingrese el email"
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cedula">Cédula *</Label>
          <Input
            id="cedula"
            value={formData.cedula || ""}
            onChange={(e) => handleInputChange("cedula", e.target.value)}
            placeholder="Ingrese la cédula"
            className={errors.cedula ? "border-red-500" : ""}
          />
          {errors.cedula && <p className="text-sm text-red-500">{errors.cedula}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono *</Label>
          <Input
            id="telefono"
            value={formData.telefono || ""}
            onChange={(e) => handleInputChange("telefono", e.target.value)}
            placeholder="Ingrese el teléfono"
            className={errors.telefono ? "border-red-500" : ""}
          />
          {errors.telefono && <p className="text-sm text-red-500">{errors.telefono}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="direccion">Dirección</Label>
        <Textarea
          id="direccion"
          value={formData.direccion || ""}
          onChange={(e) => handleInputChange("direccion", e.target.value)}
          placeholder="Ingrese la dirección"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rol">Rol *</Label>
          <Select
            value={formData.rol_id?.toString() || ""}
            onValueChange={(value) => handleInputChange("rol_id", Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar rol" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((rol) => (
                <SelectItem key={rol.id} value={rol.id.toString()}>
                  {rol.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="estado">Estado</Label>
          <Select value={formData.estado || "activo"} onValueChange={(value) => handleInputChange("estado", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
              <SelectItem value="suspendido">Suspendido</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {!usuario && (
        <>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese la contraseña"
                className={errors.password ? "border-red-500" : ""}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme la contraseña"
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
          </div>
        </>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={() => onClose()} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="bg-primary-green hover:bg-primary-dark-green">
          {loading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Guardando...
            </>
          ) : usuario ? (
            "Actualizar"
          ) : (
            "Crear"
          )}
        </Button>
      </div>
    </form>
  )
}
