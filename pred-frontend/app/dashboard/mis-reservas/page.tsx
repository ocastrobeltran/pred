"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function MisReservasPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-green border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mis Reservas</h1>
        <Button asChild className="bg-primary-green hover:bg-primary-dark-green">
          <Link href="/escenarios">Nueva Reserva</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reservas Recientes</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <div className="mb-4 rounded-full bg-primary-light-green p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary-green"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-medium">¡Tu reserva ha sido registrada!</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Tu solicitud de reserva ha sido enviada correctamente y está pendiente de aprobación.
          </p>
          <Button asChild className="bg-primary-green hover:bg-primary-dark-green">
            <Link href="/escenarios">Explorar más escenarios</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

