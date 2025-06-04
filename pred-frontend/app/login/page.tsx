import { Suspense } from "react"
import { LoginForm } from "@/components/forms/login-form"
import Link from "next/link"

function LoginFormWrapper() {
  return <LoginForm />
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Barra superior - similar a la del IDER */}
      <div className="absolute top-0 left-0 right-0 bg-primary-red text-white">
        <div className="container mx-auto flex h-10 items-center justify-between px-4">
          <div>
            <span className="text-sm font-medium">Instituto Distrital de Deporte y Recreación</span>
          </div>
        </div>
      </div>

      <div className="m-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] mt-16">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            <Link href="/" className="text-primary-green hover:underline">
              PRED
            </Link>
          </h1>
          <p className="text-sm text-muted-foreground">Plataforma de Reserva de Escenarios Deportivos</p>
        </div>
        <Suspense fallback={<div className="p-4 text-center">Cargando formulario...</div>}>
          <LoginFormWrapper />
        </Suspense>
      </div>
    </div>
  )
}
