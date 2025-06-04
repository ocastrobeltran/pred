"use client"

import { useState, useEffect, type ReactNode } from "react"

export function HydrationBoundary({ children }: { children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false)

  // Efecto que se ejecuta solo en el cliente
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Durante la hidratación, muestra un spinner o nada
  if (!isHydrated) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // Una vez hidratado, muestra el contenido
  return <>{children}</>
}
