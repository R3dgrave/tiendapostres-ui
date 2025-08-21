"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tables } from "@/types/supabase";
import {
  formSchema,
  type ProductFormValues,
} from "@/lib/validations/product-form";
import { Loader2Icon, ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import DynamicServingsInput from "./dynamic-servings-input";
import DynamicIngredientsInput from "./dynamic-ingredients-input";

import { useCategory } from "@/hooks/useCategory";

import { useProductFormMutation } from "@/hooks/useProductFormMutation";
import FileUploader from "./multi-image-uploader";

interface ProductFormProps {
  initialData?: Tables<"productos"> | null;
}

/**
 * Componente principal del formulario para crear y editar productos.
 */
export const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {
  const router = useRouter();
  const [isInputFocused, setIsInputFocused] = useState(false);

  const { data: categorias, isLoading: isLoadingCategories } = useCategory();

  const { upsertMutation } = useProductFormMutation({ initialData });

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: initialData?.nombre || "",
      descripcion_corta: initialData?.descripcion_corta || "",
      descripcion_larga: initialData?.descripcion_larga || "",
      precio: initialData?.precio ?? 0,
      categoria_id: initialData?.categoria_id || "",
      es_destacado: initialData?.es_destacado || false,
      imagen: initialData?.imagen_url
        ? (initialData.imagen_url as string[])
        : [],
      ingredientes: initialData?.ingredientes
        ? (initialData.ingredientes as { value: string }[])
        : [{ value: "" }],
      porciones: initialData?.porciones
        ? (initialData.porciones as { size: string; servings: number }[])
        : [{ size: "", servings: 0 }],
    },
  });

  // Resetea los valores del formulario si initialData cambia (para la edición)
  useEffect(() => {
    form.reset({
      nombre: initialData?.nombre || "",
      descripcion_corta: initialData?.descripcion_corta || "",
      descripcion_larga: initialData?.descripcion_larga || "",
      precio: initialData?.precio ?? 0,
      categoria_id: initialData?.categoria_id || "",
      es_destacado: initialData?.es_destacado || false,
      imagen: initialData?.imagen_url
        ? (initialData.imagen_url as string[])
        : [],
      ingredientes: initialData?.ingredientes
        ? (initialData.ingredientes as string[]).map((ing) => ({ value: ing }))
        : [{ value: "" }],
      porciones: initialData?.porciones
        ? (initialData.porciones as { size: string; servings: number }[])
        : [{ size: "", servings: 0 }],
    });
  }, [initialData, form]);

  const formatPrice = (price: number): string => {
    if (isNaN(price)) return "$0";
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const onSubmit = (values: ProductFormValues) => {
    upsertMutation.mutate(values);
  };

  if (isLoadingCategories) {
    return <p>Cargando categorías...</p>;
  }

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
          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del producto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descripcion_corta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción Corta</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Descripción breve del producto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descripcion_larga"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción Larga</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción detallada del producto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex flex-col md:flex-row justify-start items-center gap-2">
              <FormField
                control={form.control}
                name="precio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="0"
                        min="0"
                        value={
                          isInputFocused
                            ? field.value
                            : formatPrice(Number(field.value))
                        }
                        onChange={(e) => {
                          const value =
                            e.target.value === ""
                              ? 0
                              : parseFloat(e.target.value);
                          field.onChange(value);
                        }}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoria_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categorias?.map((categoria) => (
                          <SelectItem key={categoria.id} value={categoria.id}>
                            {categoria.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="es_destacado"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 col-span-1 md:col-span-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Producto destacado</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="imagen"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imágenes del Producto</FormLabel>
                <FormControl>
                  <FileUploader value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DynamicIngredientsInput form={form} />
          <DynamicServingsInput form={form} />

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
