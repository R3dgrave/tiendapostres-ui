import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

/**
 * Custom hook para obtener las categorías mediante TanStack Query.
 * Gestiona automáticamente la carga, los datos y los estados de error.
 */
export const useCategory = () => {
  return useQuery({
    queryKey: ["categorias"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categorias").select("*");
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};
