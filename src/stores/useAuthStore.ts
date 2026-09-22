"use client";

import { AuthSession, AuthStore } from "@/types/oauth/auth";
import { useEffect } from "react";
import { create } from "zustand";

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
  clearSession: () => set({ session: null }),
}));

export function AuthInitializer({ session }: { session: AuthSession | null }) {
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    if (session) setSession(session);
    else clearSession();
  }, [session, setSession, clearSession]);

  return null;
}
