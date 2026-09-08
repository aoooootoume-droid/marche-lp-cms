"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

interface ReservationContextValue {
  isOpen: boolean;
  presetMenuItemId: string | null;
  openReservation: (presetMenuItemId?: string) => void;
  closeReservation: () => void;
}

const ReservationContext = createContext<ReservationContextValue | null>(null);

export function ReservationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [presetMenuItemId, setPresetMenuItemId] = useState<string | null>(null);

  const value = useMemo<ReservationContextValue>(
    () => ({
      isOpen,
      presetMenuItemId,
      openReservation: (id) => {
        setPresetMenuItemId(id ?? null);
        setIsOpen(true);
      },
      closeReservation: () => setIsOpen(false),
    }),
    [isOpen, presetMenuItemId]
  );

  return <ReservationContext.Provider value={value}>{children}</ReservationContext.Provider>;
}

export function useReservationContext(): ReservationContextValue {
  const ctx = useContext(ReservationContext);
  if (!ctx) {
    throw new Error("useReservationContext は ReservationProvider の内側で使用してください。");
  }
  return ctx;
}
