"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { BerlinerState } from "@/actions/berliner-state";

const BerlinerStateContext = createContext<BerlinerState | null>(null);

export function BerlinerStateProvider({
  value,
  children,
}: {
  value: BerlinerState;
  children: ReactNode;
}) {
  return (
    <BerlinerStateContext.Provider value={value}>
      {children}
    </BerlinerStateContext.Provider>
  );
}

export function useBerlinerState(): BerlinerState {
  const value = useContext(BerlinerStateContext);
  if (!value) {
    throw new Error(
      "useBerlinerState must be used inside a BerlinerStateProvider"
    );
  }
  return value;
}
