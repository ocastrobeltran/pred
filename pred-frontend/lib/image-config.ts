// Configuración de imágenes usando GitHub Pages + jsDelivr CDN
export const IMAGE_CONFIG = {
  // URL base usando jsDelivr CDN para GitHub
  baseUrl: process.env.NEXT_PUBLIC_IMAGES_URL || "https://cdn.jsdelivr.net/gh/ocastrobeltran/pred-imagenes@main",

  // Estructura de carpetas
  paths: {
    escenarios: "/escenarios",
    usuarios: "/usuarios",
    logos: "/logos",
  },

  // Tamaños disponibles
  sizes: {
    thumbnail: { width: 300, height: 200, suffix: "_thumb" },
    card: { width: 400, height: 300, suffix: "_card" },
    hero: { width: 800, height: 600, suffix: "_hero" },
    original: { width: 1200, height: 800, suffix: "" },
  },

  // Imagen por defecto
  fallback: "/images/placeholder-venue.jpg",
}

// Función para construir URLs de imágenes
export function getImageUrl(
  filename: string | null,
  category: "escenarios" | "usuarios" | "logos" = "escenarios",
  size: "thumbnail" | "card" | "hero" | "original" = "card",
): string {
  if (!filename) {
    return IMAGE_CONFIG.fallback
  }

  // Si ya es una URL completa, devolverla
  if (filename.startsWith("http")) {
    return filename
  }

  const { baseUrl, paths } = IMAGE_CONFIG
  const path = paths[category]

  // No modificamos el nombre del archivo, usamos exactamente lo que viene de la API
  return `${baseUrl}${path}/${filename}`
}
