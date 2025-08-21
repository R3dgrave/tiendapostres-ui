//src/components/MenuPage.tsx
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { ProductDetailView } from "./ProductDetailView";
import { Tables } from "@/types/supabase";
import Image from "next/image";

interface MenuPageProps {
  products: Tables<"productos">[];
  categories: Tables<"categorias">[];
  loading: boolean;
}

export const MenuPage = ({ products, categories, loading }: MenuPageProps) => {
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [hoveredProduct, setHoveredProduct] = useState<{
    id: string | null;
    index: number;
  }>({ id: null, index: 0 });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const filteredProducts = products.filter((product) => {
    if (selectedCategory === "todos") return true;
    const category = categories.find((cat) => cat.slug === selectedCategory);
    return category && product.categoria_id === category.id;
  });

  const featuredProducts = products.filter((product) => product.es_destacado);

  useEffect(() => {
    if (hoveredProduct.id) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      const product = products.find((p) => p.id === hoveredProduct.id);
      if (product && product.imagen_url && product.imagen_url.length > 1) {
        intervalRef.current = setInterval(() => {
          setHoveredProduct((prev) => ({
            ...prev,
            index: (prev.index + 1) % product.imagen_url.length,
          }));
        }, 1000);
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [hoveredProduct.id, products]);

  const handleMouseEnter = (productId: string) => {
    setHoveredProduct({ id: productId, index: 0 });
  };

  const handleMouseLeave = () => {
    setHoveredProduct({ id: null, index: 0 });
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
    <div className="p-4">
      <h1 className="text-4xl font-extrabold text-pink-800 text-center mb-8">
        Nuestro Menú
      </h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4 p-4 bg-white rounded-xl shadow-lg self-start md:sticky top-44">
          <h3 className="text-xl font-bold mb-4">Filtros</h3>
          <div className="flex flex-col gap-2 mb-8">
            {/* Opción para mostrar todos los productos */}
            <Button
              variant={selectedCategory === "todos" ? "default" : "outline"}
              onClick={() => setSelectedCategory("todos")}
            >
              Mostrar todos
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.slug ? "default" : "outline"
                }
                onClick={() => setSelectedCategory(category.slug)}
              >
                {category.nombre}
              </Button>
            ))}
          </div>

          <hr className="border-t border-gray-200 mb-6" />

          <h3 className="text-xl font-bold mb-4">⭐ Postres Destacados</h3>
          <div className="flex flex-col gap-4">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onClick={() => setSelectedProductId(product.id)}
              >
                <Image
                  src={
                    product.imagen_url && product.imagen_url[0]
                      ? product.imagen_url[0]
                      : "https://placehold.co/600x400/D4A373/FFFFFF?text=Sin+Imagen"
                  }
                  alt={product.nombre}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <span className="text-sm font-semibold">{product.nombre}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Catálogo de Productos */}
        <div className="md:w-3/4">
          <h2 className="text-3xl font-bold mb-6 text-center">
            🍩 Catálogo de Postres
          </h2>
          {loading ? (
            <div className="col-span-full text-center text-lg text-gray-500">
              Cargando productos...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden relative transition-transform duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => setSelectedProductId(product.id)}
                  onMouseEnter={() => handleMouseEnter(product.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  {product.es_destacado && (
                    <div className="absolute top-2 right-2 p-1 bg-pink-500 rounded-full text-white shadow-md">
                      <Sparkles size={16} />
                    </div>
                  )}
                  <Image
                    src={
                      product.imagen_url && product.id === hoveredProduct.id
                        ? product.imagen_url[hoveredProduct.index]
                        : product.imagen_url
                        ? product.imagen_url[0]
                        : "https://placehold.co/600x400/D4A373/FFFFFF?text=Sin+Imagen"
                    }
                    alt={product.nombre}
                    width={224}
                    height={224}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-5 text-center">
                    <h3 className="text-lg font-semibold truncate">
                      {product.nombre}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 h-10 overflow-hidden">
                      {product.descripcion_corta}
                    </p>
                    <p className="text-xl font-bold text-pink-600 mt-4">
                      ${product.precio.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full text-center text-lg text-gray-500">
                  No hay productos en esta categoría.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
