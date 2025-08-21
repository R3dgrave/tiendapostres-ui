//src/components/PublicInterface.tsx
import {
  Facebook,
  Instagram,
  Menu,
  MessageCircle,
  Music,
  Search,
  X,
} from "lucide-react";
import { HomePage } from "./HomePage";
import { useCategory } from "@/hooks/useCategory";
import { useProducts } from "@/hooks/useProducts";
import { MenuPage } from "./MenuPage";
import { useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

const getWhatsAppLink = (productName: string) => {
  const phoneNumber = "1234567890"; // Reemplaza con tu número de teléfono
  const message = `¡Hola! Me gustaría pedir el postre: ${productName}.`;
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
};

const mockTestimonials = [
  {
    id: 1,
    name: "María G.",
    text: "¡El Suspiro a la Limeña es el mejor que he probado! Cremoso y con el dulzor perfecto. ¡Totalmente recomendado!",
    rating: 5,
  },
  {
    id: 2,
    name: "Juan P.",
    text: "Los Picarones estaban deliciosos y el pedido por WhatsApp fue muy fácil y rápido. ¡Excelente servicio!",
    rating: 5,
  },
  {
    id: 3,
    name: "Sofía M.",
    text: "La Torta Helada es una maravilla. El equilibrio entre la fresa y la crema es ideal. ¡Volveré a pedir sin duda!",
    rating: 5,
  },
];

const mockFAQs = [
  {
    id: "faq1",
    pregunta: "¿Cómo hago un pedido?",
    respuesta:
      "Hacer un pedido es fácil. Simplemente contáctanos por WhatsApp con los postres que deseas. Te confirmaremos la disponibilidad y coordinaremos el pago y la entrega en minutos.",
  },
  {
    id: "faq2",
    pregunta: "¿Puedo personalizar un postre?",
    respuesta:
      "¡Claro! Ofrecemos opciones de personalización para cumpleaños, eventos y más. Escríbenos con tus ideas y te ayudamos a hacerlas realidad.",
  },
  {
    id: "faq3",
    pregunta: "¿Hacen entregas a domicilio?",
    respuesta:
      "Sí, hacemos entregas en zonas seleccionadas. Contáctanos por WhatsApp para consultar la disponibilidad y los costos de envío para tu dirección.",
  },
];

export default function PublicInterface() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const {
    data: products,
    isLoading: isLoadingProducts,
    error: errorProducts,
  } = useProducts();
  const {
    data: categories,
    isLoading: isLoadingCategory,
    error: errorCategory,
  } = useCategory();
  const Categories = categories || [];

  const handleNavigate = (page: string, sectionId: string | null = null) => {
    setCurrentPage(page);
    if (sectionId) {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  if (isLoadingProducts || isLoadingCategory) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl text-gray-700">
        Cargando... ⏳
      </div>
    );
  }

  if (errorProducts || errorCategory) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl text-red-500">
        Error al cargar los datos. Por favor, inténtelo de nuevo más tarde. 😞
      </div>
    );
  }
  //
  return (
    // Contenedor principal con el patrón de fondo y el color base
    <div className="bg-white bg-[url('/pattern-postres.jpg')] bg-cover font-sans text-gray-900">
      {/* WhatsApp Flotante */}
      <a
        href={getWhatsAppLink("mi pedido")}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-transform duration-300 transform hover:scale-110"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle size={28} />
      </a>

      {/* Contenedor central para el contenido de la web */}
      <div className="relative max-w-[1400px] mx-auto bg-white shadow-xl">
        <header className="relative">
          <div className="bg-white bg-[url('/top-pattern.png')] bg-cover h-2 w-full"></div>
          <div className="flex flex-col lg:flex-col justify-start lg:justify-between items-center px-8 md:py-0 md:pb-4">
            <div className="w-full flex justify-between items-start lg:py-2 px-8 lg:px-0">
              <p className="py-2 text-sm text-gray-400 w-full text-start">
                Bienvenido! Agenda tu pedido por WhatsApp de lunes a viernes
              </p>
              <p className="py-2 text-sm text-gray-400 w-full text-end">
                <a
                  href="tel:+1234567890"
                  className="text-sm text-pink-600 font-bold hover:underline"
                >
                  Llámanos al: +1 234 567 890
                </a>
              </p>
            </div>
            <div className="hidden lg:block border-b border-gray-200 w-full"></div>
            <div className="w-full flex flex-row justify-start lg:justify-between items-center py-6 lg:py-4 px-8 lg:px-0">
              <button
                className="lg:hidden text-gray-600 hover:text-pink-600 focus:outline-none pr-4"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>

              <a
                href="#"
                onClick={() => handleNavigate("home")}
                aria-label="Ir a la página de inicio"
              >
                <Image src="/logo.png" alt="logo" width={250} height={100} />
              </a>

              <div className="hidden lg:flex items-center">
                <input
                  className="w-md p-2 border-1 border-gray-200 rounded-l-md"
                  type="search"
                  placeholder="Buscar"
                  aria-label="Buscar"
                />
                <div className="bg-pink-500 p-2 rounded-r-md text-white hover:bg-pink-600 cursor-pointer">
                  <Search size={24} />
                </div>
              </div>

              <Button className="hidden lg:flex bg-green-600 text-white hover:bg-green-700 cursor-pointer p-6">
                Agenda por WhatsApp
              </Button>
            </div>
            <div className="hidden lg:block border-b border-gray-200 w-full"></div>
            {/* Menú de navegación de escritorio */}
            <nav className="hidden lg:w-full lg:flex">
              <div className="lg:w-full lg:flex lg:justify-start items-center space-x-16 py-2">
                <Link
                  href="/"
                  className="text-gray-500 hover:bg-pink-600 hover:text-white font-semibold text-md px-6 py-2 rounded-md"
                  onClick={() => handleNavigate("home")}
                >
                  Inicio
                </Link>
                <Link
                  href="/"
                  className="text-gray-500 hover:bg-pink-600 hover:text-white font-semibold text-md px-6 py-2 rounded-md"
                  onClick={() => handleNavigate("menu")}
                >
                  Menu
                </Link>
                <Link
                  href="/"
                  className="text-gray-500 hover:bg-pink-600 hover:text-white font-semibold text-md px-6 py-2 rounded-md"
                  onClick={() => handleNavigate("contacto")}
                >
                  Contacto
                </Link>
              </div>
              <div className="hidden lg:flex flex-row gap-2 items-center space-x-4">
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-pink-600"
                  aria-label="Facebook"
                >
                  <Facebook size={25} />
                </a>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-pink-600"
                  aria-label="Instagram"
                >
                  <Instagram size={25} />
                </a>
                <a
                  href="https://www.tiktok.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-pink-600"
                  aria-label="TikTok"
                >
                  <Music size={25} />
                </a>
              </div>
            </nav>
            <div className="hidden lg:block border-b border-gray-200 w-full"></div>
          </div>

          {/* Menú de navegación móvil */}
          {isMenuOpen && (
            <nav
              id="mobile-menu"
              className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg rounded-b-lg py-4 z-40"
            >
              <div className="flex flex-col justify-center items-start space-y-4">
                <a
                  href="#catalogo"
                  className="text-gray-600 hover:bg-pink-600 hover:text-white font-semibold text-lg w-full p-4"
                  onClick={() => handleNavigate("menu")}
                >
                  Menú
                </a>
                <a
                  href="#nosotros"
                  className="text-gray-600 hover:bg-pink-600 hover:text-white font-semibold text-lg w-full p-4"
                  onClick={() => handleNavigate("home", "nosotros")}
                >
                  Nosotros
                </a>
                <a
                  href="#testimonios"
                  className="text-gray-600 hover:bg-pink-600 hover:text-white font-semibold text-lg w-full p-4"
                  onClick={() => handleNavigate("home", "testimonios")}
                >
                  Reseñas
                </a>
                <a
                  href="#preguntas-frecuentes"
                  className="text-gray-600 hover:bg-pink-600 hover:text-white font-semibold text-lg w-full p-4"
                  onClick={() => handleNavigate("home", "preguntas-frecuentes")}
                >
                  FAQ
                </a>
                {/* Íconos de redes sociales para el menú móvil */}
                <div className="flex space-x-6 mt-4">
                  <a
                    href="https://www.facebook.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-pink-600 px-4 py-2"
                    aria-label="Facebook"
                  >
                    <Facebook size={24} />
                  </a>
                  <a
                    href="https://www.instagram.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-pink-600 px-4 py-2"
                    aria-label="Instagram"
                  >
                    <Instagram size={24} />
                  </a>
                  <a
                    href="https://www.tiktok.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-pink-600 px-4 py-2"
                    aria-label="TikTok"
                  >
                    <Music size={24} />
                  </a>
                </div>
              </div>
            </nav>
          )}
        </header>

        {/* Contenido principal basado en la navegación */}
        {currentPage === "home" && (
          <HomePage
            onNavigate={handleNavigate}
            faqs={mockFAQs}
            testimonials={mockTestimonials}
            categories={categories}
            products={products ?? []}
          />
        )}
        {currentPage === "menu" && (
          <MenuPage
            products={products ?? []}
            categories={Categories}
            loading={isLoadingProducts}
          />
        )}

        {/* Footer */}
        <footer className="bg-gray-800 text-white p-8">
          <div className="text-center">
            <div className="mb-4">
              <h3 className="text-xl font-bold">Bettys Cakes</h3>
              <p className="text-gray-400">Postres que alegran tu día.</p>
            </div>
            <div className="flex justify-center space-x-6 mb-6">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://www.tiktok.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <Music size={24} />
              </a>
            </div>
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Bettys Cakes. Todos los derechos
              reservados.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
