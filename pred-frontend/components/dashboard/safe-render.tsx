// Componente helper para renderizar datos de forma segura
interface SafeRenderProps {
  data: any
  fallback?: string
}

export function SafeRender({ data, fallback = "N/A" }: SafeRenderProps) {
  if (data === null || data === undefined) {
    return <span>{fallback}</span>
  }
  
  if (typeof data === 'object') {
    return <span>{data.nombre || data.name || JSON.stringify(data)}</span>
  }
  
  return <span>{String(data)}</span>
}

// Hook para manejar datos de forma segura
export function useSafeData<T>(data: T): T | null {
  if (data === null || data === undefined) {
    return null
  }
  return data
}