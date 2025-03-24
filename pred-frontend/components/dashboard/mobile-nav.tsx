"use client"

import type React from "react"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/context/auth-context"
import { Menu } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface MobileNavProps {
  links: {
    title: string
    href: string
    icon: React.ReactNode
    roles?: number[]
  }[]
}

export function MobileNav({ links }: MobileNavProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  // Filtrar enlaces según el rol del usuario
  const filteredLinks = links.filter((link) => !link.roles || link.roles.includes(user?.rol_id || 0))

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="px-7">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="text-primary text-xl">PRED</span>
          </Link>
        </div>
        <div className="mt-8 px-7">
          <nav className="grid gap-2">
            {filteredLinks.map((link) => (
              <Button
                key={link.href}
                variant={pathname === link.href ? "secondary" : "ghost"}
                className={cn("justify-start gap-2", pathname === link.href ? "bg-secondary" : "hover:bg-secondary/50")}
                asChild
                onClick={() => setOpen(false)}
              >
                <Link href={link.href}>
                  {link.icon}
                  {link.title}
                </Link>
              </Button>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}

