"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Check } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface NotificacionCardProps {
  id: number
  titulo: string
  mensaje: string
  tipo: string
  url: string
  leida: boolean
  created_at: string
  onMarcarLeida: (id: number) => void
}

export function NotificacionCard({
  id,
  titulo,
  mensaje,
  tipo,
  url,
  leida,
  created_at,
  onMarcarLeida,
}: NotificacionCardProps) {
  const tipoClases = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    warning: "bg-yellow-50 border-yellow-200",
    info: "bg-blue-50 border-blue-200",
  }

  const tipoIconClases = {
    success: "text-green-500",
    error: "text-red-500",
    warning: "text-yellow-500",
    info: "text-blue-500",
  }

  const tipoClass = tipoClases[tipo as keyof typeof tipoClases] || tipoClases.info
  const tipoIconClass = tipoIconClases[tipo as keyof typeof tipoIconClases] || tipoIconClases.info

  const timeAgo = formatDistanceToNow(new Date(created_at), { locale: es, addSuffix: true })

  return (
    <Card className={`${tipoClass} ${!leida ? "border-l-4" : ""} mb-4`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`mt-1 ${tipoIconClass}`}>
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium">{titulo}</h4>
              <p className="text-sm text-gray-600 mt-1">{mensaje}</p>
              <p className="text-xs text-gray-500 mt-2">{timeAgo}</p>
            </div>
          </div>
          {!leida && (
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
              onClick={() => onMarcarLeida(id)}
            >
              <Check className="h-4 w-4 mr-1" />
              <span className="text-xs">Marcar como leída</span>
            </Button>
          )}
        </div>
        {url && (
          <div className="mt-3 pl-8">
            <Button variant="outline" size="sm" asChild>
              <Link href={url}>Ver detalles</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

