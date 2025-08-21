"use client";
//src/components/productos/product-form/dynamic-ingredients-input.tsx
import React from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon, MinusIcon } from "lucide-react";
import { ProductFormValues } from "@/lib/validations/product-form";

interface DynamicServingsInputProps {
  form: UseFormReturn<ProductFormValues>;
}

const DynamicServingsInput = ({ form }: DynamicServingsInputProps) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "porciones",
  });

  return (
    <FormItem>
      <FormLabel>Porciones</FormLabel>
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col sm:flex-row gap-2 items-center"
          >
            <FormControl className="w-full">
              <Input
                placeholder="Tamaño del postre"
                {...form.register(`porciones.${index}.size`)}
              />
            </FormControl>
            <FormControl className="w-full">
              <Input
                type="number"
                placeholder="Cantidad de porciones"
                {...form.register(`porciones.${index}.servings`, {
                  valueAsNumber: true,
                })}
              />
            </FormControl>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              <MinusIcon className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <FormMessage />
      <Button
        type="button"
        variant="outline"
        className="mt-2"
        onClick={() => append({ size: "", servings: 0 })}
      >
        <PlusIcon className="mr-2 h-4 w-4" /> Agregar Porción
      </Button>
    </FormItem>
  );
};

export default DynamicServingsInput;
