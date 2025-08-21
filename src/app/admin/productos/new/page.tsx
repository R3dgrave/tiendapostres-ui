"use client";
//src/app/admin/productos/new/page.tsx
import { useAuthProtection } from "@/hooks/useAuthProtection";
import AdminLayout from '@/components/AdminLayout';
import { ProductForm } from "@/components/productos/product-form";
import React from 'react';

const NewProductPage = () => {
  const { isAuthenticated, isHydrated } = useAuthProtection();

  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto">
        <ProductForm />
      </div>
    </AdminLayout>
  );
};

export default NewProductPage;
