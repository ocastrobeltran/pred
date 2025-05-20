"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { API_URL } from "@/lib/config"
import { get, post, put, del } from "@/services/api"

export function ApiTester() {
  const [endpoint, setEndpoint] = useState("/escenarios")
  const [method, setMethod] = useState("GET")
  const [requestBody, setRequestBody] = useState("")
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      let result

      switch (method) {
        case "GET":
          result = await get(endpoint)
          break
        case "POST":
          result = await post(endpoint, JSON.parse(requestBody || "{}"))
          break
        case "PUT":
          result = await put(endpoint, JSON.parse(requestBody || "{}"))
          break
        case "DELETE":
          result = await del(endpoint)
          break
        default:
          throw new Error("Método no soportado")
      }

      setResponse(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>API Tester</CardTitle>
        <CardDescription>Prueba las conexiones con la API</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 text-sm font-medium text-muted-foreground">{API_URL}</div>
            <Input
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="/escenarios"
              className="flex-1"
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="w-full sm:w-1/3">
              <label className="mb-2 block text-sm font-medium">Método</label>
              <div className="flex gap-2">
                {["GET", "POST", "PUT", "DELETE"].map((m) => (
                  <Button
                    key={m}
                    type="button"
                    variant={method === m ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMethod(m)}
                  >
                    {m}
                  </Button>
                ))}
              </div>
            </div>

            {(method === "POST" || method === "PUT") && (
              <div className="w-full sm:w-2/3">
                <label className="mb-2 block text-sm font-medium">Cuerpo de la petición (JSON)</label>
                <Textarea
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  placeholder='{"key": "value"}'
                  rows={4}
                />
              </div>
            )}
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar petición"}
          </Button>
        </form>

        {error && (
          <div className="mt-4 rounded-md bg-destructive/10 p-4 text-destructive">
            <p className="font-medium">Error:</p>
            <p className="font-mono text-sm">{error}</p>
          </div>
        )}

        {response && (
          <div className="mt-4">
            <h3 className="mb-2 text-lg font-medium">Respuesta:</h3>
            <Tabs defaultValue="formatted">
              <TabsList>
                <TabsTrigger value="formatted">Formateado</TabsTrigger>
                <TabsTrigger value="raw">Raw</TabsTrigger>
              </TabsList>
              <TabsContent value="formatted" className="mt-2">
                <div className="rounded-md bg-muted p-4">
                  <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(response, null, 2)}</pre>
                </div>
              </TabsContent>
              <TabsContent value="raw" className="mt-2">
                <div className="rounded-md bg-muted p-4">
                  <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(response)}</pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          API URL: <code className="rounded bg-muted px-1 py-0.5">{API_URL}</code>
        </div>
      </CardFooter>
    </Card>
  )
}

