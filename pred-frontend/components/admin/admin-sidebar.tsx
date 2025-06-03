"use client"

import { Calendar, Home, Users, Building, FileText, BarChart3, LogOut } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

// Menú de navegación para administradores
const adminNavItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Usuarios",
    url: "/admin/usuarios",
    icon: Users,
  },
  {
    title: "Escenarios",
    url: "/admin/escenarios",
    icon: Building,
  },
  {
    title: "Solicitudes",
    url: "/admin/solicitudes",
    icon: FileText,
  },
  {
    title: "Reportes",
    url: "/admin/reportes",
    icon: BarChart3,
  },
]

export function AdminSidebar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!user) return null

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Calendar className="h-4 w-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">PRED</span>
            <span className="truncate text-xs">Administrador</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administración</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-1.5">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>
                  {user.nombre?.[0]?.toUpperCase()}
                  {user.apellido?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user.nombre} {user.apellido}
                </span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start">
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
