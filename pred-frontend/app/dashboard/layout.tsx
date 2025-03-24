"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { UserNav } from "@/components/dashboard/user-nav"
import { NotificationBell } from "@/components/dashboard/notification-bell"
import { MAIN_NAV } from "@/lib/config"
import { useAuth } from "@/context/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user, loading } = useAuth()

  // Si está cargando, mostrar pantalla de carga
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // Si no hay usuario autenticado, redirigir a login
  if (!user) {
    // Usar window.location para asegurar el redireccionamiento
    if (typeof window !== "undefined") {
      window.location.href = `/login?redirect=${pathname}`
    }
    return null
  }

  // Filtrar enlaces según el rol del usuario
  const filteredLinks = MAIN_NAV.filter((link) => !link.roles || link.roles.includes(user?.rol_id || 0))

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 md:gap-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <span className="text-xl text-primary">PRED</span>
            </Link>
            <nav className="hidden md:flex">
              <div className="flex space-x-4">
                {filteredLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary",
                      pathname === link.href ? "text-primary" : "text-muted-foreground",
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
            <MobileNav links={filteredLinks} />
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

