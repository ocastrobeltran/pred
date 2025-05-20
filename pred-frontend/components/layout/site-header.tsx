"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"

export function SiteHeader() {
  const { user, loading } = useAuth()

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary-green">PRED</span>
        </Link>
        <nav className="hidden space-x-4 md:flex">
          <Link href="/" className="text-sm font-medium hover:text-primary-green">
            Inicio
          </Link>
          <Link href="/escenarios" className="text-sm font-medium hover:text-primary-green">
            Escenarios
          </Link>
          <Link href="/#como-funciona" className="text-sm font-medium hover:text-primary-green">
            Cómo Funciona
          </Link>
          <Link href="/#contacto" className="text-sm font-medium hover:text-primary-green">
            Contacto
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-green border-t-transparent"></div>
          ) : user ? (
            <>
              <Button asChild className="bg-primary-green hover:bg-primary-dark-green">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-primary-green text-primary-green hover:bg-primary-light-green"
                >
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/register" className="hidden md:block">
                <Button className="bg-primary-green hover:bg-primary-dark-green">Registrarse</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

