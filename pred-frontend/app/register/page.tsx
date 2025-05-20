import { RegisterForm } from "@/components/forms/register-form"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="m-auto flex w-full flex-col justify-center space-y-6 px-4 sm:w-[500px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            <Link href="/" className="text-primary hover:underline">
              PRED
            </Link>
          </h1>
          <p className="text-sm text-muted-foreground">Plataforma de Reserva de Escenarios Deportivos</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}

