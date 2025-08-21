"use client";
//src/app/admin/productos/new/page.tsx
import { useAuthProtection } from "@/hooks/useAuthProtection";
import AdminLayout from '@/components/AdminLayout';
import React from 'react';
import { CategoryForm } from "@/components/categorias/category-form";

const NewCategoryPage = () => {
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
        <CategoryForm />
      </div>
    </AdminLayout>
  );
};

export default NewCategoryPage;