"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { User, Settings, LogOut } from "lucide-react"

export function UserNav() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const getInitials = (nombre: string, apellido: string) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
  }

  const getRoleName = (rolId: number) => {
    switch (rolId) {
      case 1:
        return "Administrador"
      case 2:
        return "Supervisor"
      case 3:
        return "Usuario"
      default:
        return "Usuario"
    }
  }

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar || ""} alt={`${user.nombre} ${user.apellido}`} />
            <AvatarFallback>{getInitials(user.nombre, user.apellido)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.nombre} {user.apellido}
            </p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            {/* <div className="flex items-center gap-1 mt-1">
              <Shield className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">{getRoleName(user.rol_id)}</p>
            </div> */}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/dashboard/perfil")}>
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/dashboard/configuracion")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configuración</span>
          </DropdownMenuItem>
          {/* {(user.rol_id === 1 || user.rol_id === 2) && (
            <DropdownMenuItem onClick={() => router.push("/admin/dashboard")}>
              <Shield className="mr-2 h-4 w-4" />
              <span>Panel Admin</span>
            </DropdownMenuItem>
          )} */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
