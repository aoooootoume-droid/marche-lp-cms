"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useSiteContent, type UseSiteContentReturn } from "@/hooks/useSiteContent";

const SiteContentContext = createContext<UseSiteContentReturn | null>(null);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const value = useSiteContent();
  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContentContext(): UseSiteContentReturn {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    throw new Error("useSiteContentContext は SiteContentProvider の内側で使用してください。");
  }
  return ctx;
}
