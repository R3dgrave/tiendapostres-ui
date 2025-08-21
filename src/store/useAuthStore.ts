// src/store/authStore.ts
"use client";

import { create } from "zustand";
import { type User } from "@supabase/supabase-js";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  isHydrated: boolean;
  setIsHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isHydrated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  setIsHydrated: (hydrated) => set({ isHydrated: hydrated }),
}));

export const useAuthListener = () => {
  const { login, logout, setIsHydrated } = useAuthStore();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          login(session.user);
        } else {
          logout();
        }
        setIsHydrated(true);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [login, logout, setIsHydrated]);
};
