"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import Link from "next/link"
import { UserNav } from "@/components/dashboard/user-nav"
import { NotificationBell } from "@/components/dashboard/notification-bell"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import { ADMIN_NAV } from "@/lib/config"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading } = useAuth()

  // Redirección basada en rol
  useEffect(() => {
    if (!loading) {
      if (!user) {
        // No autenticado, redirigir a login
        router.push("/login")
      } else if (user.rol_id !== 1) {
        // Si NO es admin (rol_id: 1), redirigir al dashboard de usuario
        router.push("/dashboard")
      }
      // Si es admin (rol_id: 1), permitir acceso
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-green border-t-transparent"></div>
      </div>
    )
  }

  // Solo mostrar el dashboard si es administrador (rol_id: 1)
  if (!user || user.rol_id !== 1) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Barra superior */}
      <div className="bg-primary-red text-white">
        <div className="container mx-auto flex h-10 items-center justify-between px-4">
          <div>
            <span className="text-sm font-medium">Panel de Administración - PRED</span>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <Link href="/dashboard" className="hover:underline">
              Vista Usuario
            </Link>
            <span>|</span>
            <Link href="#" className="hover:underline">
              Ayuda
            </Link>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-20 border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 md:gap-6">
            <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
              <span className="text-xl text-primary-green">PRED</span>
              <span className="text-sm text-muted-foreground">Admin</span>
            </Link>
            <nav className="hidden md:flex">
              <div className="flex space-x-4">
                {ADMIN_NAV.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary-green",
                      pathname === link.href ? "text-primary-green" : "text-muted-foreground",
                    )}
                  >
                    {link.icon}
                    {link.title}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <UserNav />
          </div>
        </div>
      </header>

      <main className="flex-1 bg-muted/40 py-6">
        <div className="container mx-auto px-4">{children}</div>
      </main>
      <Toaster />
    </div>
  )
}
