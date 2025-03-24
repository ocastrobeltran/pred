"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, MapPin } from "lucide-react"

interface EscenarioFilterProps {
  localidades: { id: number; nombre: string }[]
  deportes: { id: number; nombre: string }[]
  onFilter: (search: string, localidad: string, deporte: string) => void
}

export function EscenarioFilter({ localidades, deportes, onFilter }: EscenarioFilterProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [localidadFilter, setLocalidadFilter] = useState("")
  const [deporteFilter, setDeporteFilter] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilter(searchTerm, localidadFilter, deporteFilter)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar por nombre o dirección..."
            className="pl-10 border-gray-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="w-full md:w-48">
        <Select value={localidadFilter} onValueChange={(value) => setLocalidadFilter(value)}>
          <SelectTrigger className="border-gray-300">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <SelectValue placeholder="Localidad" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las localidades</SelectItem>
            {localidades.map((localidad) => (
              <SelectItem key={localidad.id} value={localidad.id.toString()}>
                {localidad.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-full md:w-48">
        <Select value={deporteFilter} onValueChange={(value) => setDeporteFilter(value)}>
          <SelectTrigger className="border-gray-300">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <SelectValue placeholder="Deporte" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los deportes</SelectItem>
            {deportes.map((deporte) => (
              <SelectItem key={deporte.id} value={deporte.id.toString()}>
                {deporte.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="bg-primary hover:bg-primary/90">
        Buscar
      </Button>
    </form>
  )
}

