"use client";

import { useAuthListener } from "@/store/useAuthStore";

const AuthListener = () => {
  useAuthListener();
  return null;
};

export default AuthListener;