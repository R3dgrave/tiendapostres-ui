"use client";

import { ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Tables } from "@/types/supabase";
import Image from "next/image";

interface ProductDetailViewProps {
  product: Tables<"productos"> | null;
  onBack: () => void;
  categories: Tables<"categorias">[];
}

const getWhatsAppLink = (productName: string) => {
  const phoneNumber = "1234567890";
  const message = `¡Hola! Me gustaría pedir el postre: ${productName}.`;
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
};

export const ProductDetailView = ({
  product,
  onBack,
}: ProductDetailViewProps) => {
  const [selectedImage, setSelectedImage] = useState(
    product?.imagen_url?.[0] ??
      "https://placehold.co/600x400/D4A373/FFFFFF?text=Sin+Imagen"
  );

  // Encuentra la categoría del producto usando el ID y muestra su nombre.
  //const category = categories.find((cat) => cat.id === product?.categoria_id);
  //const categoryName = category?.slug || "Categoría no encontrada";

  if (!product) {
    return (
      <div className="p-4">
        <p className="text-center text-red-500">Producto no encontrado.</p>
        <Button onClick={onBack} className="mt-4 mx-auto block">
          Regresar
        </Button>
      </div>
    );
  }

  const ingredientes = (product.ingredientes || []) as string[];

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-8">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft size={24} />
        </Button>
      </div>
      <div className="flex flex-col md:flex-row gap-8 bg-white rounded-xl shadow-lg p-6">
        <div className="md:w-1/2">
          {/* Imagen principal */}
          <Image
            src={selectedImage}
            alt={product.nombre}
            width={600}
            height={400}
            className="w-full h-auto object-cover rounded-xl shadow-md mb-4"
          />
          {/* Galería de miniaturas */}
          {product.imagen_url.length > 1 && (
            <div className="flex gap-2 justify-center mt-2">
              {product.imagen_url.map((url: string, index: number) => (
                <Image
                  width={100}
                  height={100}
                  key={index}
                  src={url}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer transition-transform duration-200 hover:scale-105 ${
                    selectedImage === url
                      ? "border-2 border-pink-500"
                      : "border-2 border-transparent"
                  }`}
                  onClick={() => setSelectedImage(url)}
                />
              ))}
            </div>
          )}
        </div>
        <div className="md:w-1/2 flex flex-col">
          <h1 className="text-2xl font-extrabold text-gray-900">
            {product.nombre}
          </h1>
          <p className="text-lg text-gray-700 mb-4">
            {product.descripcion_larga}
          </p>

          <p className="text-4xl font-bold text-pink-600 mb-4">
            ${product.precio.toFixed(2)}
          </p>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Ingredientes:
            </h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {/* Se itera sobre el array de ingredientes */}
              {ingredientes.map((ingrediente, index) => (
                <span
                  key={index}
                  className="bg-pink-100 text-pink-800 text-sm font-medium px-2.5 py-0.5 rounded-full"
                >
                  {ingrediente}
                </span>
              ))}
            </div>
          </div>

          <Button
            onClick={() =>
              window.open(getWhatsAppLink(product.nombre), "_blank")
            }
          >
            Comprar por WhatsApp
            <MessageCircle className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
