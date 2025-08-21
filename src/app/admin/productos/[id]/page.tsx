"use client";
//src/app/admin/productos/[id]/page.tsx
import { useAuthProtection } from "@/hooks/useAuthProtection";
import AdminLayout from '@/components/AdminLayout';
import { ProductForm } from "@/components/productos/product-form/index";
import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { useParams } from 'next/navigation';
import React from 'react';

const EditProductPage = () => {
  const { isAuthenticated, isHydrated } = useAuthProtection();
  const params = useParams();
  const productId = params.id as string;

  // Obtener los datos del producto a editar
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['producto', productId],
    queryFn: async () => {
      const { data, error } = await supabase.from('productos').select('*').eq('id', productId).single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    enabled: !!productId,
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
        <p>Cargando datos del producto...</p>
      </AdminLayout>
    );
  }

  if (error || !product) {
    return (
      <AdminLayout>
        <p className="text-red-500">Error: No se pudo cargar el producto.</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto">
        <ProductForm initialData={product} />
      </div>
    </AdminLayout>
  );
};

export default EditProductPage;
