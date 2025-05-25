"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Calendar } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"

interface Localidad {
  id: number
  nombre: string
}

interface DeportePrincipal {
  id: number
  nombre: string
  icono: string
}

interface EscenarioCardProps {
  id: number
  nombre: string
  descripcion: string
  direccion: string
  capacidad: number
  estado: string
  imagen_principal: string | null
  localidad: Localidad | string
  deporte_principal: DeportePrincipal | string
}

// Función para renderizar de forma segura
function safeRender(value: any): string {
  if (value === null || value === undefined) {
    return ''
  }
  
  if (typeof value === 'string') {
    return value
  }
  
  if (typeof value === 'object' && value.nombre) {
    return value.nombre
  }
  
  return String(value)
}

export function EscenarioCard({
  id,
  nombre,
  descripcion,
  direccion,
  capacidad,
  estado,
  imagen_principal,
  localidad,
  deporte_principal,
}: EscenarioCardProps) {
  // Renderizar de forma segura los valores que pueden ser objetos
  const localidadNombre = safeRender(localidad)
  const deporteNombre = safeRender(deporte_principal)
  
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          {imagen_principal ? (
            <Image
              src={`/images/escenarios/${imagen_principal}`}
              alt={nombre}
              fill
              className="object-cover"
              onError={(e) => {
                // Si la imagen no se puede cargar, usar una imagen por defecto
                const target = e.target as HTMLImageElement
                target.src = '/images/placeholder-escenario.jpg'
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200">
              <Calendar className="h-12 w-12 text-gray-400" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge 
              variant={estado === 'disponible' ? 'default' : 'secondary'}
              className={estado === 'disponible' ? 'bg-green-500' : ''}
            >
              {estado === 'disponible' ? 'Disponible' : 'No disponible'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <h3 className="mb-2 text-lg font-semibold line-clamp-1">{nombre}</h3>
        <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
          {descripcion || 'Sin descripción disponible'}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary-green" />
            <span className="line-clamp-1">{localidadNombre}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-primary-green" />
            <span>{capacidad.toLocaleString()} personas</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-primary-green" />
            <span>{deporteNombre}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full bg-primary-green hover:bg-primary-dark-green">
          <Link href={`/escenarios/${id}`}>
            Ver detalles
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}