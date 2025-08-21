import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { type ProductFormValues } from "@/lib/validations/product-form";
import { Tables } from "@/types/supabase";

interface UseProductFormMutationProps {
  initialData?: Tables<"productos"> | null;
}

/**
 * Custom hook para manejar la lógica de mutación (crear/actualizar) de productos.
 *
 * @param {UseProductFormMutationProps} initialData Datos iniciales del producto para el modo de edición.
 * @returns {object} Un objeto con la mutación y el estado de carga.
 */
export const useProductFormMutation = ({
  initialData,
}: UseProductFormMutationProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const upsertMutation = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      // 1. Separar URLs existentes de los nuevos archivos a subir
      const imageUrls: string[] = (values.imagen as (string | File)[]).filter(
        (url): url is string => typeof url === "string"
      );
      const filesToUpload: File[] = (values.imagen as (string | File)[]).filter(
        (file): file is File => file instanceof File
      ); // 2. Subir nuevas imágenes al bucket de Supabase

      if (filesToUpload.length > 0) {
        const uploadPromises = filesToUpload.map(async (file) => {
          const fileExtension = file.name.split(".").pop();
          const fileName = `${uuidv4()}.${fileExtension}`;
          const {
            data: { user },
          } = await supabase.auth.getUser();
          const userUuid = user?.id || "anon";
          const filePath = `${userUuid}/${fileName}`;

          const { data: uploadData, error: uploadError } =
            await supabase.storage
              .from("product_images")
              .upload(filePath, file);

          if (uploadError) {
            throw new Error(`Error al subir la imagen: ${uploadError.message}`);
          }

          const { data: publicUrlData } = supabase.storage
            .from("product_images")
            .getPublicUrl(uploadData.path);

          return publicUrlData.publicUrl;
        });

        const newUrls = await Promise.all(uploadPromises);
        imageUrls.push(...newUrls);
      } // 3. Validar si hay al menos una imagen

      if (imageUrls.length === 0) {
        throw new Error("Se requiere al menos una imagen.");
      } // 4. Preparar los datos para la base de datos

      const { imagen, ...productDataToSave } = values;
      console.log(imagen); 
      const finalProductData = {
        ...productDataToSave,
        imagen_url: imageUrls,
        ingredientes: values.ingredientes.map((item) => item.value),
        porciones: values.porciones,
        descripcion_larga: values.descripcion_larga || "",
        es_destacado: values.es_destacado ?? false,
      }; // 5. Insertar o actualizar los datos

      if (initialData) {
        // Lógica de actualización
        const { error } = await supabase
          .from("productos")
          .update(finalProductData)
          .eq("id", initialData.id);
        if (error) throw new Error(error.message);
      } else {
        // Lógica de creación
        const { error } = await supabase
          .from("productos")
          .insert(finalProductData);
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: () => {
      // Invalida la caché de productos para que se actualice la vista
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      toast.success(
        `Producto ${initialData ? "actualizado" : "creado"} correctamente.`
      ); // Redirige al usuario
      router.push("/admin/productos");
    },
    onError: (error) => {
      // Muestra un mensaje de error
      toast.error(
        `Error al ${initialData ? "actualizar" : "crear"} el producto: ${
          error.message
        }`
      );
    },
  });

  return { upsertMutation };
};
