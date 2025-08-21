"use client";
//src/components/productos/product-form/dynamic-servings-input.tsx
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

interface DynamicIngredientsInputProps {
  form: UseFormReturn<ProductFormValues>;
}

const DynamicIngredientsInput = ({ form }: DynamicIngredientsInputProps) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ingredientes",
  });

  return (
    <FormItem>
      <FormLabel>Ingredientes</FormLabel>
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-center">
            <FormControl>
              <Input
                placeholder={`Ingrediente ${index + 1}`}
                {...form.register(`ingredientes.${index}.value`)}
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
        onClick={() => append({ value: "" })}
      >
        <PlusIcon className="mr-2 h-4 w-4" /> Agregar Ingrediente
      </Button>
    </FormItem>
  );
};

export default DynamicIngredientsInput;
