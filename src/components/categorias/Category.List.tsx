"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusIcon, PenIcon, Trash2Icon } from "lucide-react";
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
import { useCategory } from "@/hooks/useCategory";

const CategoryList = () => {
  const { data, isLoading, error } = useCategory();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleCreateClick = () => {
    router.push("/admin/categorias/new");
  };

  const handleEditClick = (category: Tables<"categorias">) => {
    router.push(`/admin/categorias/${category.id}`);
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categorias").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      toast.success(`Categoria eliminada correctamente.`);
    },
    onError: (error) => {
      toast.error(`Error al eliminar la categoria: ${error.message}`);
    },
  });

  const Categorys = data || [];

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
          Nueva Categoria
        </Button>
      </div>

      <div className="rounded-md border p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Categorys.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500">
                  No hay productos registrados.
                </TableCell>
              </TableRow>
            ) : (
              Categorys.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    {category.nombre}
                  </TableCell>
                  <TableCell className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                    {category.slug}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(category)}
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
                              permanentemente la categoria de tus registros.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate(category.id)}
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

export default CategoryList;
