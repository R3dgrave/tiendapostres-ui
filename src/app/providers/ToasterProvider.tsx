"use client";

import { Toaster } from "@/components/ui/sonner";
import React from "react";

/**
 * Proveedor global de notificaciones de Sonner.
 * Debe ser incluido una sola vez en el layout raíz.
 */
export const ToasterProvider = () => {
  return <Toaster position="bottom-right" />;
};
