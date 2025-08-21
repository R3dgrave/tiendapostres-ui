"use client";

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Crea una instancia de QueryClient fuera del componente
const queryClient = new QueryClient();

// Este componente envuelve a los hijos con los proveedores de contexto necesarios.
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
