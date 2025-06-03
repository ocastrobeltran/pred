"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { BarChart, PieChart, LineChart, Download, FileText, Calendar } from "lucide-react"

export default function ReportesPage() {
  const { toast } = useToast()
  const [tipoReporte, setTipoReporte] = useState("solicitudes")
  const [periodo, setPeriodo] = useState("mes")
  const [fechaInicio, setFechaInicio] = useState<Date | undefined>(
    new Date(new Date().setMonth(new Date().getMonth() - 1)),
  )
  const [fechaFin, setFechaFin] = useState<Date | undefined>(new Date())
  const [loading, setLoading] = useState(false)

  const handleGenerarReporte = () => {
    setLoading(true)

    // Simulamos la generación del reporte
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Reporte generado",
        description: "El reporte ha sido generado exitosamente",
      })
    }, 1500)
  }

  const handleDescargarReporte = (formato: string) => {
    toast({
      title: "Descargando reporte",
      description: `El reporte se está descargando en formato ${formato.toUpperCase()}`,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reportes y Estadísticas</h1>
        <p className="text-muted-foreground">Genera informes y visualiza estadísticas del sistema</p>
      </div>

      {/* Filtros de reportes */}
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Tipo de Reporte</label>
              <Select value={tipoReporte} onValueChange={setTipoReporte}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solicitudes">Solicitudes</SelectItem>
                  <SelectItem value="usuarios">Usuarios</SelectItem>
                  <SelectItem value="escenarios">Escenarios</SelectItem>
                  <SelectItem value="ocupacion">Ocupación</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Periodo</label>
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar periodo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semana">Última semana</SelectItem>
                  <SelectItem value="mes">Último mes</SelectItem>
                  <SelectItem value="trimestre">Último trimestre</SelectItem>
                  <SelectItem value="anio">Último año</SelectItem>
                  <SelectItem value="personalizado">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Fecha Inicio</label>
              <DatePicker date={fechaInicio} setDate={setFechaInicio} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Fecha Fin</label>
              <DatePicker date={fechaFin} setDate={setFechaFin} />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              onClick={handleGenerarReporte}
              disabled={loading}
              className="bg-primary-green hover:bg-primary-dark-green"
            >
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Generando...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generar Reporte
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Visualización de reportes */}
      <Tabs defaultValue="graficos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="graficos">Gráficos</TabsTrigger>
          <TabsTrigger value="datos">Datos</TabsTrigger>
        </TabsList>

        <TabsContent value="graficos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Solicitudes por Estado
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="aspect-[4/3] bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Gráfico de barras - Solicitudes por estado</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Distribución de Escenarios
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="aspect-[4/3] bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Gráfico circular - Distribución de escenarios</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Tendencia de Solicitudes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="aspect-[4/3] bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Gráfico de líneas - Tendencia de solicitudes</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Ocupación por Día
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="aspect-[4/3] bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Gráfico de calor - Ocupación por día</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="datos" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Datos del Reporte</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleDescargarReporte("excel")}>
                    <Download className="mr-2 h-4 w-4" />
                    Excel
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDescargarReporte("pdf")}>
                    <Download className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium">Fecha</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Total Solicitudes</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Aprobadas</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Rechazadas</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Pendientes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(10)].map((_, i) => {
                      const date = new Date()
                      date.setDate(date.getDate() - i)
                      const total = Math.floor(Math.random() * 20) + 5
                      const aprobadas = Math.floor(Math.random() * total)
                      const rechazadas = Math.floor(Math.random() * (total - aprobadas))
                      const pendientes = total - aprobadas - rechazadas

                      return (
                        <tr key={i} className="border-b hover:bg-muted/50">
                          <td className="px-4 py-3 text-sm">{date.toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-sm">{total}</td>
                          <td className="px-4 py-3 text-sm text-green-600">{aprobadas}</td>
                          <td className="px-4 py-3 text-sm text-red-600">{rechazadas}</td>
                          <td className="px-4 py-3 text-sm text-yellow-600">{pendientes}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
