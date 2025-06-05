"use client"

import { useState } from "react"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Imagen {
  id: number
  url: string
  es_principal: boolean
  orden?: number
}

interface EscenarioGalleryProps {
  imagenes: Imagen[]
  nombre: string
  imagenPrincipal?: string
}

export function EscenarioGallery({ imagenes, nombre, imagenPrincipal }: EscenarioGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number>(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Combinar imagen principal con galería
  const allImages = [
    ...(imagenPrincipal ? [{ id: 0, url: imagenPrincipal, es_principal: true }] : []),
    ...imagenes.filter((img) => !img.es_principal),
  ]

  // Si no hay imágenes, mostrar placeholder
  if (allImages.length === 0) {
    allImages.push({ id: 0, url: "", es_principal: true })
  }

  // Ordenar imágenes por orden si existe
  const sortedImages = [...allImages].sort((a, b) => {
    if (a.orden !== undefined && b.orden !== undefined) {
      return a.orden - b.orden
    }
    return 0
  })

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % sortedImages.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + sortedImages.length) % sortedImages.length)
  }

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
        <OptimizedImage
          src={sortedImages[selectedImage]?.url}
          alt={`${nombre} - Imagen ${selectedImage + 1}`}
          size="hero"
          fill
          priority
          className="cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        />

        {sortedImages.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={(e) => {
                e.stopPropagation()
                prevImage()
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {sortedImages.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {selectedImage + 1} / {sortedImages.length}
          </div>
        )}
      </div>

      {/* Miniaturas */}
      {sortedImages.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {sortedImages.map((imagen, index) => (
            <button
              key={imagen.id}
              onClick={() => setSelectedImage(index)}
              className={cn(
                "relative aspect-video rounded overflow-hidden border-2 transition-all h-20 w-full",
                selectedImage === index
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-gray-200 hover:border-gray-300",
              )}
            >
              <OptimizedImage
                src={imagen.url}
                alt={`${nombre} - Miniatura ${index + 1}`}
                size="thumbnail"
                width={120}
                height={80}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Modal de imagen completa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full">
            <Button
              variant="outline"
              size="icon"
              className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 text-white border-white/20"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="relative w-full max-w-4xl max-h-[80vh] aspect-video">
              <OptimizedImage
                src={sortedImages[selectedImage]?.url}
                alt={`${nombre} - Imagen completa`}
                size="original"
                objectFit="contain"
                fill
              />
            </div>

            {sortedImages.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white border-white/20"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white border-white/20"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
