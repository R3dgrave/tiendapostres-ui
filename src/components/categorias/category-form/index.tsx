"use client";

import { Tables } from "@/types/supabase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formSchema,
  type CategoryFormValues,
} from "@/lib/validations/category-form";
import { useRouter } from "next/navigation";
import { useCategoryFormMutation } from "@/hooks/useCategoryFormMutation";
import { useEffect } from "react";
import { ArrowLeftIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface CategoryFormProps {
  initialData?: Tables<"categorias"> | null;
}

/**
 * Componente principal del formulario para crear y editar categorias.
 */
export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData }) => {
  const router = useRouter();
  const { upsertMutation } = useCategoryFormMutation({ initialData });

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: initialData?.nombre || "",
      slug: initialData?.slug || "",
    },
  });

  // Resetea los valores del formulario si initialData cambia (para la edición)
  useEffect(() => {
    form.reset({
      nombre: initialData?.nombre || "",
      slug: initialData?.slug || "",
    });
  }, [initialData, form]);

  const onSubmit = (values: CategoryFormValues) => {
    upsertMutation.mutate(values);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto mb-8">
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/admin/productos")}
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-bold">
          {initialData ? "Editar Producto" : "Crear Nuevo Producto"}
        </h2>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre de la categoria" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Slug de la categoria"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <Button
            type="submit"
            disabled={upsertMutation.isPending}
            className="w-full mt-6"
          >
            {upsertMutation.isPending ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />{" "}
                Guardando...
              </>
            ) : (
              "Guardar Producto"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
