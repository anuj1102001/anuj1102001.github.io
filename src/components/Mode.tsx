"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Mode = "glass" | "pixel";
const Ctx = createContext<{ mode: Mode; setMode: (m: Mode) => void; toggle: () => void }>({ mode: "glass", setMode: () => {}, toggle: () => {} });

/** Glass or Pixel: stored per visitor, applied as <html data-mode>, which the CSS tokens read. */
export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>("glass");
  useEffect(() => {
    // The inline script in <head> may already have applied Pixel before hydration.
    if (document.documentElement.dataset.mode === "pixel") setModeState("pixel");
  }, []);
  const setMode = useCallback((m: Mode) => {
    setModeState(m);
    document.documentElement.dataset.mode = m;
    try {
      localStorage.setItem("mode", m);
    } catch {}
  }, []);
  const toggle = useCallback(() => setMode(document.documentElement.dataset.mode === "pixel" ? "glass" : "pixel"), [setMode]);
  return <Ctx.Provider value={{ mode, setMode, toggle }}>{children}</Ctx.Provider>;
}

export const useMode = () => useContext(Ctx);
