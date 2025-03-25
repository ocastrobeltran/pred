"use client"

import { ApiTester } from "@/components/debug/api-tester"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Herramientas de Diagnóstico</h1>
          <Button asChild variant="outline">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>

        <div className="grid gap-8">
          <div>
            <h2 className="mb-4 text-xl font-semibold">Prueba de API</h2>
            <ApiTester />
          </div>
        </div>
      </div>
    </div>
  )
}

