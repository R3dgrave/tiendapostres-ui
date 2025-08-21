"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

/**
  * CustomHook personalizado para proteger una ruta, garantizando que el usuario esté autenticado.
  * Si el usuario no está autenticado, se le redirige a la página de inicio de sesión.
 */
export const useAuthProtection = () => {
  const { isAuthenticated, isHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isHydrated, router]);

  return { isAuthenticated, isHydrated };
};
