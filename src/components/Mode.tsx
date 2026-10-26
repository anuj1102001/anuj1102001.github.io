"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";

export type Mode = "glass" | "liquid" | "pixel";
const Ctx = createContext<{ mode: Mode; setMode: (m: Mode) => void; toggle: () => void }>({ mode: "glass", setMode: () => {}, toggle: () => {} });

// The mode lives on <html data-mode> (set before paint by an inline script); React subscribes to it.
const EVT = "modechange";
const read = (): Mode => {
  const m = document.documentElement.dataset.mode;
  return m === "pixel" || m === "liquid" ? m : "glass";
};
const subscribe = (cb: () => void) => {
  addEventListener(EVT, cb);
  return () => removeEventListener(EVT, cb);
};

/** Glass or Pixel: stored per visitor, applied as <html data-mode>, which the CSS tokens read. */
export function ModeProvider({ children }: { children: React.ReactNode }) {
  const mode = useSyncExternalStore(subscribe, read, () => "glass" as Mode);
  const setMode = useCallback((m: Mode) => {
    document.documentElement.dataset.mode = m;
    try {
      localStorage.setItem("mode", m);
    } catch {}
    dispatchEvent(new Event(EVT));
  }, []);
  const toggle = useCallback(() => setMode(({ glass: "liquid", liquid: "pixel", pixel: "glass" } as const)[read()]), [setMode]);
  return <Ctx.Provider value={{ mode, setMode, toggle }}>{children}</Ctx.Provider>;
}

export const useMode = () => useContext(Ctx);
