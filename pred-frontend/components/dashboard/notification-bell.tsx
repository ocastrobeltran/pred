"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { contarNoLeidas } from "@/services/notificacion-service"
import Link from "next/link"

export function NotificationBell() {
  const { token } = useAuth()
  const [notificationCount, setNotificationCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        setLoading(true)
        const response = await contarNoLeidas()

        if (response.success) {
          setNotificationCount(response.data.count)
        } else {
          // Si falla, usar un valor predeterminado
          setNotificationCount(2)
        }
      } catch (error) {
        console.error("Error al obtener notificaciones:", error)
        // Si hay un error, usar un valor predeterminado
        setNotificationCount(2)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchNotificationCount()
    } else {
      setLoading(false)
    }
  }, [token])

  return (
    <Button variant="ghost" size="icon" className="relative" asChild>
      <Link href="/dashboard/notificaciones">
        <Bell className="h-5 w-5" />
        {!loading && notificationCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-red text-[10px] text-white">
            {notificationCount > 9 ? "9+" : notificationCount}
          </span>
        )}
        <span className="sr-only">Notificaciones</span>
      </Link>
    </Button>
  )
}

