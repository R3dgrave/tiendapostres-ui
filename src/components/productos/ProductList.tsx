"use client";

import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusIcon, PenIcon, Trash2Icon, CheckIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import React from "react";
import { useRouter } from "next/navigation";
import { Tables } from "@/types/supabase";
import Image from "next/image";

export const ProductList = () => {
  const { data, isLoading, error } = useProducts();
  const queryClient = useQueryClient();
  const router = useRouter();

  const priceFormatter = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("productos").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      toast.success(`Producto eliminado correctamente.`);
    },
    onError: (error) => {
      toast.error(`Error al eliminar el producto: ${error.message}`);
    },
  });

  const handleCreateClick = () => {
    router.push("/admin/productos/new");
  };

  const handleEditClick = (product: Tables<"productos">) => {
    router.push(`/admin/productos/${product.id}`);
  };

  const products = data || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Productos</h2>
        <Button onClick={handleCreateClick}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      <div className="rounded-md border p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Imagen</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Destacado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500">
                  No hay productos registrados.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.imagen_url && product.imagen_url.length > 0 ? (
                      <Image
                        src={product.imagen_url[0]}
                        alt={`Imagen de ${product.nombre}`}
                        className="rounded-md object-cover"
                        width={100}
                        height={100}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center text-xs text-gray-500 text-center p-1">
                        Sin imagen
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {product.nombre}
                  </TableCell>
                  <TableCell className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                    {product.descripcion_corta}
                  </TableCell>
                  <TableCell>{product.categorias?.nombre}</TableCell>
                  <TableCell>{priceFormatter.format(product.precio)}</TableCell>
                  <TableCell>
                    {product.es_destacado ? (
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(product)}
                      >
                        <PenIcon className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2Icon className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Esto eliminará
                              permanentemente el producto de tus registros.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate(product.id)}
                            >
                              Continuar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
