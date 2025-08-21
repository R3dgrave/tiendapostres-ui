//src/components/HomePage.tsx
"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import Image from "next/image";
import { Tables } from "@/types/supabase";
import Link from "next/link";
import { ProductDetailView } from "./ProductDetailView";

interface FAQ {
  id: string;
  pregunta: string;
  respuesta: string;
}

interface Testimonial {
  id: number;
  name: string;
  text: string;
  rating: number;
}

interface HomePageProps {
  onNavigate: (page: string, sectionId?: string | null) => void;
  faqs: FAQ[];
  testimonials: Testimonial[];
  categories: Tables<"categorias">[] | undefined;
  products: Tables<"productos">[];
}

export const HomePage = ({
  onNavigate,
  faqs,
  testimonials,
  categories,
  products,
}: HomePageProps) => {
  const [openFAQId, setOpenFAQId] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  categories = categories || [];
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  const handleFAQClick = (id: string) => {
    setOpenFAQId(openFAQId === id ? null : id);
  };

  const heroSlides = [
    {
      imageSrc: "/chessecake_banner.webp",
      title: "Cheesecakes Inolvidables",
      description:
        "Experimenta la cremosidad y el sabor de nuestros cheesecakes artesanales. ¡Simplemente irresistibles!",
      buttonText: "Comprar Ahora",
    },
    {
      imageSrc: "/crema_volteada.webp",
      title: "Deliciosos Postres Caseros",
      description:
        "Nuestros postres están hechos con amor, perfectos para cualquier momento especial o antojo dulce.",
      buttonText: "Comprar Ahora",
    },
    {
      imageSrc: "/pastel_chocolate.webp",
      title: "Queques y Pasteles Frescos",
      description:
        "Desde un clásico pastel de chocolate hasta un queque de vainilla, tenemos el postre perfecto para ti.",
      buttonText: "Comprar Ahora",
    },
  ];

  const tresPostres = [
    {
      id: 1,
      imageSrc: "/sub-banner-1.jpg",
      title: (
        <div>
          Chessecakes <span className="block">Inolvidables</span>
        </div>
      ),
    },
    {
      id: 2,
      imageSrc: "/sub-banner-2.jpg",
      title: (
        <div>
          Postres <span className="block">Caseros</span>
        </div>
      ),
    },
    {
      id: 3,
      imageSrc: "/sub-banner-3.jpg",
      title: (
        <div>
          Queques <span className="block">Frescos</span>
        </div>
      ),
    },
  ];

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === heroSlides.length - 1 ? 0 : prevSlide + 1
    );
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? heroSlides.length - 1 : prevSlide - 1
    );
  };

  const featuredProducts = products.filter((product) => product.es_destacado);

  const handleNextProduct = () => {
    const itemsPerView = 4;
    const maxIndex =
      featuredProducts.length > itemsPerView
        ? featuredProducts.length - itemsPerView
        : 0;
    setCurrentProductIndex((prevIndex) => {
      if (prevIndex >= maxIndex) {
        return 0;
      }
      return prevIndex + 1;
    });
  };

  const handlePrevProduct = () => {
    const itemsPerView = 4;
    const maxIndex =
      featuredProducts.length > itemsPerView
        ? featuredProducts.length - itemsPerView
        : 0;
    setCurrentProductIndex((prevIndex) => {
      if (prevIndex === 0) {
        return Math.max(0, maxIndex);
      }
      return prevIndex - 1;
    });
  };

  if (selectedProductId) {
    const product = products.find((p) => p.id === selectedProductId);
    return (
      <ProductDetailView
        categories={categories}
        product={product ?? null}
        onBack={() => setSelectedProductId(null)}
      />
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-[500px] text-white overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 transform mx-8 rounded-lg ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${slide.imageSrc})` }}
          >
            {/* Capa de superposición oscura */}
            <div className="absolute inset-0 bg-black opacity-30 rounded-lg"></div>
            {/* Contenido del carrusel */}
            <div className="relative z-10 flex flex-col justify-center items-start h-full px-8 md:px-24 cursor-pointer">
              <div className="max-w-xl text-left">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in-up">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl font-semibold mb-6">
                  {slide.description}
                </p>
                <Button
                  size="lg"
                  className="shadow-lg animate-pulse-once p-6 bg-pink-600 text-white hover:bg-pink-700 cursor-pointer"
                  onClick={() => onNavigate("menu")}
                >
                  {slide.buttonText}
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Botones de navegación del carrusel */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-opacity-30 rounded-full text-white hover:bg-opacity-50 transition-opacity duration-300 z-20"
          onClick={handlePrevSlide}
          aria-label="Diapositiva anterior"
        >
          <ChevronLeft size={36} />
        </button>
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-opacity-30 rounded-full text-white hover:bg-opacity-50 transition-opacity duration-300 z-20"
          onClick={handleNextSlide}
          aria-label="Siguiente diapositiva"
        >
          <ChevronRight size={36} />
        </button>
      </section>

      <section className="p-6">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 uppercase">
          {tresPostres.map((postres) => (
            <Link
              key={postres.id}
              href="#"
              className="relative group rounded-xl overflow-hidden shadow-xl border border-white/80"
            >
              <Image
                src={postres.imageSrc}
                alt={`Categoría`}
                className=" w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-105"
                width={600}
                height={400}
              />
              <div className="absolute flex flex-col justify-center items-start gap-y-6 top-10 left-5 p-4 z-10">
                <span className=" text-black text-2xl font-bold pb-6 leading-tight">
                  {postres.title}
                </span>
                <div className="cursor-pointer text-pink-500 border-b-1 border-pink-500 font-semibold">
                  Comprar
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-6 py-12 mx-auto relative">
        <h3 className="text-2xl font-bold mb-4 text-start py-4">
          Postres Destacados
        </h3>
        <div className="flex gap-4 overflow-hidden relative">
          <button
            onClick={handlePrevProduct}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md z-10"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNextProduct}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md z-10"
          >
            <ChevronRight size={24} />
          </button>
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentProductIndex * (100 / 4)}%)`,
              width: `${featuredProducts.length * 25}%`,
            }}
          >
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-1/4 flex flex-col items-center gap-2 bg-gray-50 rounded-lg cursor-pointer p-2 transition-transform duration-300 hover:scale-105"
                onClick={() => setSelectedProductId(product.id)}
              >
                <Image
                  src={
                    product.imagen_url && product.imagen_url[0]
                      ? product.imagen_url[0]
                      : "https://placehold.co/600x400/D4A373/FFFFFF?text=Sin+Imagen"
                  }
                  alt={product.nombre}
                  width={400}
                  height={600}
                  className="w-full h-[400px] object-cover rounded-lg"
                  unoptimized
                />
                <span className="w-full text-start text-md font-semibold">
                  {product.nombre}
                </span>
                <span className="w-full text-start text-sm font-bold text-pink-600">
                  $ {product.precio}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Productos Destacados */}
      <section className="px-4 xl:px-0 my-10 md:my-0">
        <div className="flex flex-col gap-y-6 md:gap-y-2 items-center text-center px-4 lg:px-0 mx-auto">
          <div className="max-w-2xl">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-pink-600 mb-4 flex items-center justify-center gap-2">
              Descubre Nuestros Exquisitos Postres Caseros
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Ofrecemos una variedad de postres caseros que deleitarán tu
              paladar. Desde tartas hasta galletas, cada bocado es una
              experiencia única.
            </p>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 px-10 uppercase">
            {categories.map((category) => (
              <Link
                key={category.id}
                href="/admin/productos"
                className="relative group rounded-xl overflow-hidden shadow-xl border border-white/80"
              >
                <Image
                  src="/chessecake_banner.webp"
                  alt={`Categoría`}
                  className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-110"
                  width={600}
                  height={400}
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/60 transition duration-300" />
                <div className="absolute bottom-0 left-0 p-4 z-10">
                  <span className="text-white text-xl font-bold">
                    {category.nombre}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Testimonios */}
      <section id="testimonios" className="p-12">
        <div className="hidden lg:block border-b border-gray-200 my-10"></div>
        <h2 className="text-3xl font-bold mb-6 text-center">
          Lo que dicen nuestros clientes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="flex items-center mb-2">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-700 italic mb-4">{testimonial.text}</p>
              <p className="font-semibold text-gray-900">
                - {testimonial.name}
              </p>
            </div>
          ))}
        </div>
        <div className="hidden lg:block border-b border-gray-200 my-10"></div>
      </section>

      {/* Sección de Preguntas Frecuentes */}
      <section
        id="preguntas-frecuentes"
        className="p-12 mb-16 rounded-3xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-pink-800">
          Preguntas Frecuentes
        </h2>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq) => (
            <div key={faq.id} className="border-b border-gray-300 py-4">
              <button
                onClick={() => handleFAQClick(faq.id)}
                className="flex justify-between items-center w-full text-left text-lg font-semibold text-gray-800 hover:text-pink-600 transition-colors duration-200"
              >
                <span>{faq.pregunta}</span>
                <ChevronDown
                  className={`transform transition-transform duration-300 ${
                    openFAQId === faq.id ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFAQId === faq.id && (
                <p className="mt-2 text-gray-600 animate-fade-in">
                  {faq.respuesta}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative w-full h-[500px] bg-pink-100 overflow-hidden">
        <Image
          src="/chessecake_banner.webp"
          alt="Postres caseros"
          className="absolute inset-0 w-full h-full object-cover brightness-75"
          width={200}
          height={100}
        />

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
            ¡Haz tu pedido hoy mismo!
          </h2>
          <p className="mt-4 text-lg md:text-xl text-white max-w-2xl">
            Descubre nuestros deliciosos postres caseros y disfruta de un sabor
            único en cada bocado.
          </p>

          <div className="mt-8">
            <a
              href="#contacto"
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded shadow-lg transition duration-300"
            >
              Contactar
            </a>
          </div>
        </div>
      </section>
    </>
  );
};
