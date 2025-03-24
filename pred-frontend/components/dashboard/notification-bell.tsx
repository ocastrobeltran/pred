"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { API_URL } from "@/lib/config"
import Link from "next/link"

export function NotificationBell() {
  const { token } = useAuth()
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    if (token) {
      // Obtener conteo de notificaciones no leídas
      fetch(`${API_URL}/notificaciones/contar-no-leidas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setNotificationCount(data.data.count)
          }
        })
        .catch((error) => {
          console.error("Error al obtener notificaciones:", error)
        })
    }
  }, [token])

  return (
    <Button variant="ghost" size="icon" className="relative" asChild>
      <Link href="/dashboard/notificaciones">
        <Bell className="h-5 w-5" />
        {notificationCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
            {notificationCount > 9 ? "9+" : notificationCount}
          </span>
        )}
        <span className="sr-only">Notificaciones</span>
      </Link>
    </Button>
  )
}

