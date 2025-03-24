import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Configuración de la aplicación

// URL de la API - Asegúrate de que NEXT_PUBLIC_API_URL esté configurada en tus variables de entorno
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

