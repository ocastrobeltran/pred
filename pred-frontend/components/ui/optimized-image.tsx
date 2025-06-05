"use client"

import Image from "next/image"
import { useState } from "react"
import { getImageUrl, IMAGE_CONFIG } from "@/lib/image-config"
import { cn } from "@/lib/utils"

interface OptimizedImageProps {
  src: string | null
  alt: string
  category?: "escenarios" | "usuarios" | "logos"
  size?: "thumbnail" | "card" | "hero" | "original"
  className?: string
  fill?: boolean
  width?: number
  height?: number
  priority?: boolean
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down"
}

export function OptimizedImage({
  src,
  alt,
  category = "escenarios",
  size = "card",
  className,
  fill = false,
  width,
  height,
  priority = false,
  objectFit = "cover",
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const imageUrl = imageError ? IMAGE_CONFIG.fallback : getImageUrl(src, category, size)
  const sizeConfig = IMAGE_CONFIG.sizes[size]

  const handleError = () => {
    console.warn(`Error loading image: ${imageUrl}`)
    setImageError(true)
    setIsLoading(false)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  // Determinar el estilo de objeto según el objectFit prop
  const objectFitClass = `object-${objectFit}`

  return (
    <div className={cn("relative", className, fill ? "h-full w-full" : "")}>
      {isLoading && (
        <div
          className={cn(
            "absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center",
            fill ? "h-full w-full" : "h-full w-full",
          )}
        >
          <div className="text-gray-400 text-sm">Cargando...</div>
        </div>
      )}

      <Image
        src={imageUrl || "/placeholder.svg"}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width || sizeConfig.width}
        height={fill ? undefined : height || sizeConfig.height}
        className={cn(
          objectFitClass,
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          !fill ? "h-full w-full" : "",
        )}
        onError={handleError}
        onLoad={handleLoad}
        priority={priority}
        sizes={fill ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" : undefined}
        unoptimized={true}
      />
    </div>
  )
}
