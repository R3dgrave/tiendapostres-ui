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
        setRedirecting(false);
        router.push("/");
      }
    }
  }, [isAuthenticated, isHydrated, router]);

  return <PublicInterface />;
}
