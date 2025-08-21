"use client";
//page de categorias
import { useAuthProtection } from "@/hooks/useAuthProtection";
import AdminLayout from '@/components/AdminLayout';
import React from 'react';
import CategoryList from "@/components/categorias/Category.List";

const CategoriasPage = () => {
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
        <CategoryList />
      </div>
    </AdminLayout>
  );
};

export default CategoriasPage;