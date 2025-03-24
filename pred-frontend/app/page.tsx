import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navegación */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">PRED</span>
          </div>
          <nav className="hidden space-x-4 md:flex">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Inicio
            </Link>
            <Link href="/escenarios" className="text-sm font-medium hover:text-primary">
              Escenarios
            </Link>
            <Link href="/#como-funciona" className="text-sm font-medium hover:text-primary">
              Cómo Funciona
            </Link>
            <Link href="/#contacto" className="text-sm font-medium hover:text-primary">
              Contacto
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Iniciar Sesión</Button>
            </Link>
            <Link href="/register" className="hidden md:block">
              <Button>Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="relative bg-gradient-to-r from-primary to-primary/80 py-20 text-white">
        <div className="container mx-auto grid gap-8 px-4 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">Reserva Escenarios Deportivos en Cartagena</h1>
            <p className="text-lg md:text-xl">
              Encuentra y reserva fácilmente escenarios deportivos en toda la ciudad, para cualquier deporte y cuando lo
              necesites.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                <Link href="/escenarios">Buscar Escenarios</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/register">Crear Cuenta</Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src="/placeholder.svg?height=400&width=600"
              alt="Escenarios deportivos"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Cómo Funciona</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">1. Busca y Selecciona</h3>
              <p className="text-muted-foreground">
                Explora nuestra amplia variedad de escenarios deportivos filtrados por deporte, ubicación o fecha.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M8 12h8" />
                  <path d="M12 8v8" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">2. Reserva</h3>
              <p className="text-muted-foreground">
                Elige el horario disponible y completa el formulario de reserva con los detalles de tu actividad.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8"
                >
                  <path d="M6 9H4.5a2.5 2.5 0 0 0 0 5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 1 0 5H18" />
                  <path d="M8 9h8" />
                  <path d="M8 15h8" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">3. Disfruta</h3>
              <p className="text-muted-foreground">
                Recibe una confirmación y disfruta de tu actividad deportiva en el escenario reservado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Escenarios destacados */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-center text-3xl font-bold">Escenarios Destacados</h2>
          <p className="mb-12 text-center text-muted-foreground">
            Descubre los escenarios deportivos más populares en nuestra plataforma
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Escenario Ejemplo 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                <img
                  src="/placeholder.svg?height=300&width=400"
                  alt="Escenario deportivo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded text-sm">Fútbol</div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">Estadio El Campín</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  Estadio principal de la ciudad con capacidad para eventos deportivos de gran escala.
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">Teusaquillo</div>
                  <Button className="bg-primary hover:bg-primary/90" asChild>
                    <Link href="/escenarios/1">Ver Detalles</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Escenario Ejemplo 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                <img
                  src="/placeholder.svg?height=300&width=400"
                  alt="Escenario deportivo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded text-sm">Baloncesto</div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">Coliseo El Salitre</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  Coliseo cubierto ideal para prácticas de baloncesto y competencias.
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">Fontibón</div>
                  <Button className="bg-primary hover:bg-primary/90" asChild>
                    <Link href="/escenarios/2">Ver Detalles</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Escenario Ejemplo 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                <img
                  src="/placeholder.svg?height=300&width=400"
                  alt="Escenario deportivo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded text-sm">Tenis</div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">Complejo de Tenis</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  Canchas profesionales de tenis con iluminación y servicio completo.
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">Usaquén</div>
                  <Button className="bg-primary hover:bg-primary/90" asChild>
                    <Link href="/escenarios/3">Ver Detalles</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link href="/escenarios">Ver Todos los Escenarios</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Contacto</h2>
          <div className="mx-auto max-w-3xl rounded-lg border bg-card p-8 shadow">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-xl font-semibold">Información de Contacto</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-primary"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span>(+57) 601 123 4567</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-primary"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <span>contacto@pred.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-primary"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>Calle 123 # 45-67, Caratgena, Colombia</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="mb-4 text-xl font-semibold">Horario de Atención</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Lunes a Viernes:</span> 8:00 AM - 6:00 PM
                  </p>
                  <p>
                    <span className="font-medium">Sábados:</span> 9:00 AM - 2:00 PM
                  </p>
                  <p>
                    <span className="font-medium">Domingos:</span> Cerrado
                  </p>
                </div>
                <div className="mt-6">
                  <h4 className="mb-2 font-medium">Síguenos en redes sociales</h4>
                  <div className="flex space-x-4">
                    <a href="#" className="text-primary hover:text-primary/80">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </a>
                    <a href="#" className="text-primary hover:text-primary/80">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                      </svg>
                    </a>
                    <a href="#" className="text-primary hover:text-primary/80">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-bold">PRED</h3>
              <p className="text-gray-400">
                Plataforma de Reserva de Escenarios Deportivos en Cartagena. Tu solución fácil para encontrar y reservar
                espacios deportivos.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold">Enlaces Rápidos</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/escenarios" className="hover:text-white">
                    Escenarios
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white">
                    Iniciar Sesión
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white">
                    Registrarse
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold">Recursos</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Preguntas Frecuentes
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Términos y Condiciones
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Política de Privacidad
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold">Suscríbete</h3>
              <p className="mb-4 text-gray-400">Recibe noticias y actualizaciones de nuestra plataforma</p>
              <div className="flex">
                <input type="email" placeholder="Tu email" className="flex-1 rounded-l-md px-3 py-2 text-gray-900" />
                <Button className="rounded-l-none">Enviar</Button>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} PRED. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

