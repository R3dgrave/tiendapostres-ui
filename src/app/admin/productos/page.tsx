"use client";
//page de productos/tabla
import { ProductList } from "@/components/productos/ProductList";
import { useAuthProtection } from "@/hooks/useAuthProtection";
import AdminLayout from '@/components/AdminLayout';
import React from 'react';

const ProductosPage = () => {
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
        <ProductList />
      </div>
    </AdminLayout>
  );
};

export default ProductosPage;