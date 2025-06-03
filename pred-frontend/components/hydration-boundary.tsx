"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface HydrationBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function HydrationBoundary({ children, fallback }: HydrationBoundaryProps) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return (
      fallback || (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-green border-t-transparent"></div>
        </div>
      )
    )
  }

  return <>{children}</>
}
