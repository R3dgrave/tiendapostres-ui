import * as z from "zod";

export const formSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre es obligatorio." }),
  descripcion_corta: z.string().min(1, { message: "La descripción corta es obligatoria." }),
  descripcion_larga: z.string().optional(),
  precio: z.number()
    .positive({ message: "El precio debe ser un número positivo." })
    .min(0, { message: "El precio no puede ser negativo." }),
  categoria_id: z.string().min(1, { message: "La categoría es obligatoria." }),
  imagen: z.array(z.any()).nonempty("Debes subir al menos una imagen"),
  ingredientes: z.array(z.object({
    value: z.string().min(1, { message: "El ingrediente no puede estar vacío." }),
  })),
  porciones: z.array(z.object({
    size: z.string().min(1, { message: "El tamaño de la porción es obligatorio." }),
    servings: z.number()
      .positive({ message: "La cantidad de porciones debe ser un número positivo." })
      .refine((val) => val !== null && !isNaN(val), {
        message: "La cantidad de porciones es obligatoria.",
      }),
  })),
  es_destacado: z.boolean().optional(),
});

export type ProductFormValues = z.infer<typeof formSchema>;