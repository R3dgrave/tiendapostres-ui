"use client";
//src/app/admin/productos/[id]/page.tsx
import { useAuthProtection } from "@/hooks/useAuthProtection";
import AdminLayout from '@/components/AdminLayout';
import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { useParams } from 'next/navigation';
import React from 'react';
import { CategoryForm } from "@/components/categorias/category-form";

const EditCategoryPage = () => {
  const { isAuthenticated, isHydrated } = useAuthProtection();
  const params = useParams();
  const categoryId = params.id as string;

  const { data: category, isLoading, error } = useQuery({
    queryKey: ['categorias', categoryId],
    queryFn: async () => {
      const { data, error } = await supabase.from('categorias').select('*').eq('id', categoryId).single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    enabled: !!categoryId,
  });

  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p>Cargando...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <p>Cargando datos de la categoria...</p>
      </AdminLayout>
    );
  }

  if (error || !category) {
    return (
      <AdminLayout>
        <p className="text-red-500">Error: No se pudo cargar los datos de la categoria.</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto">
        <CategoryForm initialData={category} />
      </div>
    </AdminLayout>
  );
};

export default EditCategoryPage;
