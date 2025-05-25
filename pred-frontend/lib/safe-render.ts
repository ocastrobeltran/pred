// Función para renderizar objetos de forma segura
export function safeRender(value: any): string {
  if (value === null || value === undefined) {
    return ''
  }
  
  if (typeof value === 'string') {
    return value
  }
  
  if (typeof value === 'number') {
    return value.toString()
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Sí' : 'No'
  }
  
  if (typeof value === 'object') {
    // Si es un objeto con propiedades 'nombre' o 'name', usar esa
    if (value.nombre) return value.nombre
    if (value.name) return value.name
    
    // Si es un array, unir con comas
    if (Array.isArray(value)) {
      return value.map(item => safeRender(item)).join(', ')
    }
    
    // Para otros objetos, convertir a JSON como último recurso
    return JSON.stringify(value)
  }
  
  return String(value)
}

// Función específica para renderizar estados
export function renderEstado(estado: any): string {
  if (typeof estado === 'string') {
    return estado.charAt(0).toUpperCase() + estado.slice(1)
  }
  
  if (typeof estado === 'object' && estado?.nombre) {
    return estado.nombre.charAt(0).toUpperCase() + estado.nombre.slice(1)
  }
  
  return 'Sin estado'
}

// Función específica para renderizar localidades
export function renderLocalidad(localidad: any): string {
  if (typeof localidad === 'string') {
    return localidad
  }
  
  if (typeof localidad === 'object' && localidad?.nombre) {
    return localidad.nombre
  }
  
  return 'Sin localidad'
}

// Función específica para renderizar deportes
export function renderDeporte(deporte: any): string {
  if (typeof deporte === 'string') {
    return deporte
  }
  
  if (typeof deporte === 'object' && deporte?.nombre) {
    return deporte.nombre
  }
  
  return 'Sin deporte'
}