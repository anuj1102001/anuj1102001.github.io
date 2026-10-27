/** Asks the page transition (Transition.tsx) to play; if it hasn't loaded yet, just navigates. */
export type WipeDetail = { href: string; rect?: DOMRect; color?: string; label?: string };

export function wipeTo(detail: WipeDetail) {
  if ((window as unknown as { __wipeReady?: boolean }).__wipeReady) dispatchEvent(new CustomEvent<WipeDetail>("page-wipe", { detail }));
  else window.location.assign(detail.href);
}
