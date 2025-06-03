"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface Escenario {
  id?: number
  nombre: string
  direccion: string
  localidad: string
  capacidad: number
  tipo: string
  estado: string
  descripcion?: string
  precio_hora?: number
  horario_apertura?: string
  horario_cierre?: string
}

interface EscenarioFormProps {
  escenario: Escenario | null
  tiposEscenario: { id: string; nombre: string }[]
  onClose: (refresh?: boolean) => void
}

export function EscenarioForm({ escenario, tiposEscenario, onClose }: EscenarioFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<Partial<Escenario>>(
    escenario || {
      nombre: "",
      direccion: "",
      localidad: "",
      capacidad: 0,
      tipo: "",
      estado: "activo",
      descripcion: "",
      precio_hora: 0,
      horario_apertura: "06:00",
      horario_cierre: "22:00",
    },
  )
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Localidades de Cartagena
  const localidades = [
    "Centro",
    "Bocagrande",
    "Castillogrande",
    "El Laguito",
    "San Diego",
    "Getsemaní",
    "La Matuna",
    "Pie de la Popa",
    "Manga",
    "Crespo",
    "Olaya Herrera",
    "Torices",
    "Espinal",
    "San Francisco",
    "Chiquinquirá",
    "Daniel Lemaitre",
    "La Quinta",
    "Pie del Cerro",
    "Ternera",
    "Canapote",
    "Bayunca",
    "Pasacaballos",
    "Ararca",
    "Pontezuela",
    "Membrillal",
    "Turbaco",
    "Turbana",
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre?.trim()) {
      newErrors.nombre = "El nombre es requerido"
    }

    if (!formData.direccion?.trim()) {
      newErrors.direccion = "La dirección es requerida"
    }

    if (!formData.localidad?.trim()) {
      newErrors.localidad = "La localidad es requerida"
    }

    if (!formData.tipo?.trim()) {
      newErrors.tipo = "El tipo de escenario es requerido"
    }

    if (!formData.capacidad || formData.capacidad <= 0) {
      newErrors.capacidad = "La capacidad debe ser mayor a 0"
    }

    if (formData.precio_hora && formData.precio_hora < 0) {
      newErrors.precio_hora = "El precio no puede ser negativo"
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
      // Simulamos la llamada a la API
      setTimeout(() => {
        toast({
          title: escenario ? "Escenario actualizado" : "Escenario creado",
          description: escenario
            ? "El escenario ha sido actualizado exitosamente"
            : "El escenario ha sido creado exitosamente",
        })
        setLoading(false)
        onClose(true)
      }, 1000)
    } catch (error) {
      console.error("Error al guardar escenario:", error)
      toast({
        title: "Error",
        description: "Error de conexión",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof Escenario, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre del Escenario *</Label>
        <Input
          id="nombre"
          value={formData.nombre || ""}
          onChange={(e) => handleInputChange("nombre", e.target.value)}
          placeholder="Ej: Estadio Jaime Morón"
          className={errors.nombre ? "border-red-500" : ""}
        />
        {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="direccion">Dirección *</Label>
        <Input
          id="direccion"
          value={formData.direccion || ""}
          onChange={(e) => handleInputChange("direccion", e.target.value)}
          placeholder="Ej: Calle 30 #45-67"
          className={errors.direccion ? "border-red-500" : ""}
        />
        {errors.direccion && <p className="text-sm text-red-500">{errors.direccion}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="localidad">Localidad *</Label>
          <Select value={formData.localidad || ""} onValueChange={(value) => handleInputChange("localidad", value)}>
            <SelectTrigger className={errors.localidad ? "border-red-500" : ""}>
              <SelectValue placeholder="Seleccionar localidad" />
            </SelectTrigger>
            <SelectContent>
              {localidades.map((localidad) => (
                <SelectItem key={localidad} value={localidad}>
                  {localidad}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.localidad && <p className="text-sm text-red-500">{errors.localidad}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo de Escenario *</Label>
          <Select value={formData.tipo || ""} onValueChange={(value) => handleInputChange("tipo", value)}>
            <SelectTrigger className={errors.tipo ? "border-red-500" : ""}>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              {tiposEscenario.map((tipo) => (
                <SelectItem key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.tipo && <p className="text-sm text-red-500">{errors.tipo}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="capacidad">Capacidad *</Label>
          <Input
            id="capacidad"
            type="number"
            min="1"
            value={formData.capacidad || ""}
            onChange={(e) => handleInputChange("capacidad", Number(e.target.value))}
            placeholder="Ej: 1000"
            className={errors.capacidad ? "border-red-500" : ""}
          />
          {errors.capacidad && <p className="text-sm text-red-500">{errors.capacidad}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="precio_hora">Precio por Hora (COP)</Label>
          <Input
            id="precio_hora"
            type="number"
            min="0"
            step="1000"
            value={formData.precio_hora || ""}
            onChange={(e) => handleInputChange("precio_hora", Number(e.target.value))}
            placeholder="Ej: 50000"
            className={errors.precio_hora ? "border-red-500" : ""}
          />
          {errors.precio_hora && <p className="text-sm text-red-500">{errors.precio_hora}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="horario_apertura">Horario de Apertura</Label>
          <Input
            id="horario_apertura"
            type="time"
            value={formData.horario_apertura || ""}
            onChange={(e) => handleInputChange("horario_apertura", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="horario_cierre">Horario de Cierre</Label>
          <Input
            id="horario_cierre"
            type="time"
            value={formData.horario_cierre || ""}
            onChange={(e) => handleInputChange("horario_cierre", e.target.value)}
          />
        </div>
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
            <SelectItem value="mantenimiento">En mantenimiento</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          value={formData.descripcion || ""}
          onChange={(e) => handleInputChange("descripcion", e.target.value)}
          placeholder="Descripción del escenario, amenidades, etc."
          rows={3}
        />
      </div>

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
          ) : escenario ? (
            "Actualizar"
          ) : (
            "Crear"
          )}
        </Button>
      </div>
    </form>
  )
}
