"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"

interface EscenarioGalleryProps {
  imagenes: { id: number; url_imagen: string; es_principal: boolean }[]
  nombre: string
}

export function EscenarioGallery({ imagenes, nombre }: EscenarioGalleryProps) {
  const [imagenActiva, setImagenActiva] = useState<string | null>(imagenes.length > 0 ? imagenes[0].url_imagen : null)

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4">
        {imagenActiva ? (
          <img src={imagenActiva || "/placeholder.svg"} alt={nombre} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200">
            <MapPin className="h-16 w-16 text-gray-400" />
          </div>
        )}
      </div>

      {imagenes.length > 0 && (
        <div className="grid grid-cols-5 gap-2">
          {imagenes.map((imagen) => (
            <div
              key={imagen.id}
              className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${
                imagenActiva === imagen.url_imagen ? "border-primary" : "border-transparent"
              }`}
              onClick={() => setImagenActiva(imagen.url_imagen)}
            >
              <img
                src={imagen.url_imagen || "/placeholder.svg"}
                alt={`${nombre} - imagen ${imagen.id}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

