"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Not needed for the first paint: loaded as separate chunks once the page is idle.
const CommandMenu = dynamic(() => import("./CommandMenu"), { ssr: false });
const Transition = dynamic(() => import("./Transition"), { ssr: false });
const Launch = dynamic(() => import("./Launch"), { ssr: false });

/** The ⌘K menu, page transition and live-demo launch, mounted after first paint. */
export default function Extras() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const go = () => setOn(true);
    const id = typeof requestIdleCallback === "function" ? requestIdleCallback(go, { timeout: 2000 }) : setTimeout(go, 800);
    return () => {
      if (typeof cancelIdleCallback === "function") cancelIdleCallback(id as number);
      else clearTimeout(id as number);
    };
  }, []);
  if (!on) return null;
  return (
    <>
      <CommandMenu />
      <Transition />
      <Launch />
    </>
  );
}
