import * as z from "zod";

export const formSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre es obligatorio." }),
  slug: z.string().min(1, { message: "El slug es obligatorio" }),
});

export type CategoryFormValues = z.infer<typeof formSchema>;