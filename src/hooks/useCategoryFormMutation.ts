import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { type CategoryFormValues } from "@/lib/validations/category-form";
import { Tables } from "@/types/supabase";

interface UseCategoryFormMutationProps {
  initialData?: Tables<"categorias"> | null;
}

/**
 * Custom hook para manejar la lógica de mutación (crear/actualizar) de categorias.
 *
 * @param {UseCategoryFormMutationProps} initialData Datos iniciales del producto para el modo de edición.
 * @returns {object} Un objeto con la mutación y el estado de carga.
 */
export const useCategoryFormMutation = ({
  initialData,
}: UseCategoryFormMutationProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const upsertMutation = useMutation({
    mutationFn: async (values: CategoryFormValues) => {
      const { ...categoryDataToSave } = values;

      const finalProductData = {
        ...categoryDataToSave,
        nombre: values.nombre,
        slug: values.slug,
      };

      if (initialData) {
        const { error } = await supabase
          .from("categorias")
          .update(finalProductData)
          .eq("id", initialData.id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase
          .from("categorias")
          .insert(finalProductData);
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      toast.success(
        `Categoria ${initialData ? "actualizada" : "creada"} correctamente.`
      );
      router.push("/admin/categorias");
    },
    onError: (error) => {
      toast.error(
        `Error al ${initialData ? "actualizar" : "crear"} la categoria: ${
          error.message
        }`
      );
    },
  });
  return { upsertMutation };
};
