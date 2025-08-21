"use client";
//src/hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Tables } from "@/types/supabase";

type ProductWithCategory = Tables<"productos"> & {
  categorias: {
    nombre: string;
  };
};

/**
 * Custom hook ara obtener productos mediante TanStack Query.
 * Gestiona automáticamente la carga, los datos y los estados de error.
 */
export const useProducts = () => {
  return useQuery<ProductWithCategory[]>({
    queryKey: ["productos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("productos").select(`
          *,
          categorias (
            nombre
          )
        `);

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("No products found.");
      }
      return data as ProductWithCategory[];
    },
  });
};
