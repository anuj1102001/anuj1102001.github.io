export default function Footer() {
  return (
    <footer className="mono border-t border-[var(--line)] px-5 py-8 text-[11px] uppercase tracking-[0.14em] text-ink-500 sm:px-8">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 Anuj M · Designed and built by me with Claude Code</span>
        <span>
          Next.js · GSAP · Lenis · <a href="/analytics/" className="hover:text-paper">Analytics portfolio ↗</a>
        </span>
      </div>
    </footer>
  );
}
