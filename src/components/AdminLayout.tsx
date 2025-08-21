"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/lib/supabaseClient";
import {
  LogOutIcon,
  Package2Icon,
  Cake,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { logout } = useAuthStore();

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const sidebarWidthClass = isSidebarExpanded ? "w-64" : "w-20";

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      logout();
      router.push("/login");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar de Navegación */}
      <aside
        className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 transition-all duration-300 ease-in-out flex flex-col justify-between ${sidebarWidthClass}`}
      >
        <div>
          <div className="flex items-center justify-between mb-8">
            {isSidebarExpanded && (
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Panel Admin
              </h1>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            >
              {isSidebarExpanded ? (
                <ChevronLeftIcon className="h-5 w-5" />
              ) : (
                <ChevronRightIcon className="h-5 w-5" />
              )}
            </Button>
          </div>
          <nav className="flex flex-col space-y-2">
            <Link href="/admin/productos" passHref>
              <Button
                variant="ghost"
                className={`w-full ${
                  isSidebarExpanded ? "justify-start" : "justify-center"
                }`}
              >
                <Cake
                  className={isSidebarExpanded ? "mr-2 h-4 w-4" : "h-6 w-6"}
                />
                {isSidebarExpanded && "Productos"}
              </Button>
            </Link>
            <Link href="/admin/categorias" passHref>
              <Button
                variant="ghost"
                className={`w-full ${
                  isSidebarExpanded ? "justify-start" : "justify-center"
                }`}
              >
                <Package2Icon
                  className={isSidebarExpanded ? "mr-2 h-4 w-4" : "h-6 w-6"}
                />
                {isSidebarExpanded && "Categorias"}
              </Button>
            </Link>
          </nav>
        </div>
        <div>
          <Button
            variant="ghost"
            className={`w-full text-red-500 ${
              isSidebarExpanded ? "justify-start" : "justify-center"
            }`}
            onClick={handleLogout}
          >
            <LogOutIcon
              className={isSidebarExpanded ? "mr-2 h-4 w-4" : "h-6 w-6"}
            />
            {isSidebarExpanded && "Cerrar Sesión"}
          </Button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
