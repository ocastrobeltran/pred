import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/context/auth-context"
import { HydrationBoundary } from "@/components/hydration-boundary"

export const metadata: Metadata = {
  title: "PRED - Plataforma de Reserva de Escenarios Deportivos",
  description: "Sistema de reservas para escenarios deportivos del Instituto Distrital de Deporte y Recreación",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <HydrationBoundary>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
              {children}
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </HydrationBoundary>
      </body>
    </html>
  )
}
