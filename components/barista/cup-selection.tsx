"use client";

import { createContext, useContext, useState } from "react";

export const freeCups = ["wisdom", "gossip", "fuel"] as const;
export type FreeCupType = (typeof freeCups)[number];

interface CupSelectionContextValue {
  selectedCup: FreeCupType;
  setSelectedCup: (cup: FreeCupType) => void;
}

const CupSelectionContext = createContext<CupSelectionContextValue | null>(null);

export function CupSelectionProvider({ children }: { children: React.ReactNode }) {
  const [selectedCup, setSelectedCup] = useState<FreeCupType>("wisdom");
  return (
    <CupSelectionContext.Provider value={{ selectedCup, setSelectedCup }}>
      {children}
    </CupSelectionContext.Provider>
  );
}

export function useCupSelection() {
  const ctx = useContext(CupSelectionContext);
  if (!ctx) {
    throw new Error("useCupSelection must be used within CupSelectionProvider");
  }
  return ctx;
}
