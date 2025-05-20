"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { uploadArchivo } from "@/services/archivo-service"
import { Upload, X, FileText } from "lucide-react"

interface ArchivoUploadProps {
  onUploadComplete?: (fileUrl: string) => void
  allowedTypes?: string[]
  maxSize?: number // en MB
}

export function ArchivoUpload({
  onUploadComplete,
  allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"],
  maxSize = 5, // 5MB por defecto
}: ArchivoUploadProps) {
  const { token } = useAuth()
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      // Validar tipo de archivo
      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: "Tipo de archivo no permitido",
          description: `Solo se permiten archivos de tipo: ${allowedTypes.join(", ")}`,
          variant: "destructive",
        })
        return
      }

      // Validar tamaño de archivo
      if (selectedFile.size > maxSize * 1024 * 1024) {
        toast({
          title: "Archivo demasiado grande",
          description: `El tamaño máximo permitido es de ${maxSize}MB`,
          variant: "destructive",
        })
        return
      }

      setFile(selectedFile)

      // Crear preview para imágenes
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setPreview(e.target?.result as string)
        }
        reader.readAsDataURL(selectedFile)
      } else {
        setPreview(null)
      }
    }
  }

  const handleUpload = async () => {
    if (!file || !token) return

    setUploading(true)

    try {
      const response = await uploadArchivo(file, token)

      if (response.success) {
        toast({
          title: "Archivo subido",
          description: "El archivo se ha subido correctamente",
        })

        // Notificar al componente padre
        if (onUploadComplete) {
          onUploadComplete(response.data.url)
        }

        // Limpiar el formulario
        setFile(null)
        setPreview(null)
      } else {
        toast({
          title: "Error",
          description: response.message || "Error al subir el archivo",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al subir archivo:", error)
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setPreview(null)
  }

  return (
    <div className="space-y-4">
      {!file ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-primary-green">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
            accept={allowedTypes.join(",")}
          />
          <label htmlFor="file-upload" className="flex cursor-pointer flex-col items-center justify-center gap-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <p className="text-sm font-medium">Haz clic para seleccionar un archivo</p>
            <p className="text-xs text-gray-500">
              o arrastra y suelta aquí
              <br />
              Máximo {maxSize}MB
            </p>
          </label>
        </div>
      ) : (
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {preview ? (
                <img src={preview || "/placeholder.svg"} alt="Preview" className="h-12 w-12 rounded object-cover" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-100">
                  <FileText className="h-6 w-6 text-gray-500" />
                </div>
              )}
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleRemoveFile} disabled={uploading}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="mt-4">
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full bg-primary-green hover:bg-primary-dark-green"
            >
              {uploading ? "Subiendo..." : "Subir archivo"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

