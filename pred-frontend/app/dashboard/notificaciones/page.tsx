import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NotificacionList } from "@/components/dashboard/notificaciones/notificacion-list"

export default function NotificacionesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Notificaciones</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas las Notificaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <NotificacionList />
        </CardContent>
      </Card>
    </div>
  )
}

