//src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuthListener, useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import PublicInterface from "@/components/PublicInterface";

export default function Home() {
  const [redirecting, setRedirecting] = useState(false);
  const { isAuthenticated, isHydrated } = useAuthStore();
  const router = useRouter();

  useAuthListener();

  useEffect(() => {
    if (isHydrated) {
      if (!isAuthenticated) {
        setRedirecting(true);
        router.push("/login");
      }
    }
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated || redirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p>Cargando...</p>
      </div>
    );
  }

  return <PublicInterface />;
}
