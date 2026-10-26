"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { PROJECTS, srcset } from "@/lib/projects";
import { useMode } from "./Mode";

gsap.registerPlugin(useGSAP);

// Lens outlines in the 2000×2000 portrait (measured on the photo), for the reflections.
const LENS_L = "662,640 855,612 864,650 860,730 800,788 700,792 660,752 655,660";
const LENS_R = "978,592 1195,566 1206,600 1200,690 1150,742 1020,752 978,712 970,620";
const SHOTS = PROJECTS.slice(0, 4).map((p) => `${p.cover}-800.webp`);

// Where the six project tiles land around the portrait when the hero zooms out (desktop, % of viewport).
const TILES = [
  { x: -33, y: -21, w: 23, r: -4 },
  { x: 33, y: -23, w: 22, r: 3 },
  { x: -37, y: 19, w: 20, r: 3 },
  { x: 35, y: 20, w: 21, r: -3 },
  { x: -20, y: -35, w: 12, r: -2 },
  { x: 20, y: -34, w: 12, r: 2 },
];

/** Steps the portrait between the photo and its pixel-art version through a pixelation, on a canvas. */
function usePixelMorph(mode: string, photo: React.RefObject<HTMLImageElement | null>, canvas: React.RefObject<HTMLCanvasElement | null>) {
  const [shown, setShown] = useState<"photo" | "pixel" | "morph">(mode === "pixel" ? "pixel" : "photo");
  const first = useRef(true);
  useEffect(() => {
    const target = mode === "pixel" ? "pixel" : "photo";
    if (first.current) {
      first.current = false;
      setShown(target);
      return;
    }
    const img = photo.current;
    const c = canvas.current;
    if (!img || !c || !img.complete || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(target);
      return;
    }
    const W = (c.width = 600);
    const H = (c.height = 600);
    const g = c.getContext("2d")!;
    const tmp = document.createElement("canvas");
    const tg = tmp.getContext("2d")!;
    const steps = [1, 2, 3, 4, 6, 8, 10, 12, 14];
    const seq = target === "pixel" ? steps : [...steps].reverse();
    setShown("morph");
    let i = 0;
    const draw = () => {
      const block = seq[i];
      const w = Math.max(1, Math.round(W / block));
      tmp.width = w;
      tmp.height = w;
      tg.clearRect(0, 0, w, w);
      tg.drawImage(img, 0, 0, w, w);
      g.clearRect(0, 0, W, H);
      g.imageSmoothingEnabled = false;
      g.drawImage(tmp, 0, 0, W, H);
      i++;
      if (i < seq.length) id = window.setTimeout(draw, 45);
      else id = window.setTimeout(() => setShown(target), 60);
    };
    let id = window.setTimeout(draw, 0);
    return () => clearTimeout(id);
  }, [mode, photo, canvas]);
  return shown;
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const photo = useRef<HTMLImageElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const lens = useRef<SVGGElement>(null);
  const { mode } = useMode();
  const shown = usePixelMorph(mode, photo, canvas);
  const [shot, setShot] = useState(0);

  // The lenses reflect the work, one project after another.
  useEffect(() => {
    const id = setInterval(() => setShot((s) => (s + 1) % SHOTS.length), 2600);
    return () => clearInterval(id);
  }, []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Entrance.
      const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
      intro
        .from(q(".h-word"), { yPercent: 40, opacity: 0, duration: 1.6, stagger: 0.06 })
        .from(q(".h-portrait"), { y: 80, opacity: 0, duration: 1.6 }, 0.1)
        .from(q(".h-fade"), { y: 24, opacity: 0, duration: 1.1, stagger: 0.07 }, 0.5);

      // Cursor: the portrait leans a little and the reflections slide inside the lenses.
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / innerWidth - 0.5;
        const ny = e.clientY / innerHeight - 0.5;
        gsap.to(q(".h-portrait-inner"), { x: nx * 18, y: ny * 10, rotate: nx * 1.2, duration: 1.2, ease: "power3.out" });
        gsap.to(q(".h-word-wrap"), { x: nx * -30, duration: 1.4, ease: "power3.out" });
        if (lens.current) gsap.to(lens.current, { x: nx * -60, y: ny * -30, duration: 1, ease: "power3.out" });
      };
      if (!reduce) addEventListener("pointermove", onMove);

      if (reduce) return () => removeEventListener("pointermove", onMove);

      // Scroll: the hero zooms out and the work gathers around the portrait.
      const mm = gsap.matchMedia();
      mm.add({ desktop: "(min-width: 768px)", mobile: "(max-width: 767px)" }, (ctx) => {
        const desktop = ctx.conditions?.desktop;
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=150%", scrub: 0.8, pin: true, anticipatePin: 1 },
          defaults: { ease: "none" },
        });
        tl.to(q(".h-fade-out"), { opacity: 0, y: -40, duration: 0.3 }, 0)
          .to(q(".h-word-wrap"), { scale: 1.25, opacity: 0.12, duration: 1 }, 0)
          .to(q(".h-portrait"), { scale: desktop ? 0.44 : 0.62, yPercent: desktop ? -14 : -22, duration: 1 }, 0)
          .to(q(".h-glow"), { scale: 0.6, opacity: 0.7, duration: 1 }, 0);
        q(".h-tile").forEach((el, i) => {
          const t = TILES[i];
          const k = desktop ? 1 : 0.92;
          gsap.set(el, { width: `${t.w * (desktop ? 1 : 1.55)}vw` });
          tl.fromTo(
            el,
            { xPercent: -50, yPercent: -50, x: `${t.x * 2.4}vw`, y: `${t.y * 2.6}vh`, rotate: t.r * 6, opacity: 0, scale: 0.7 },
            { x: `${t.x * k}vw`, y: `${t.y * (desktop ? 1 : 0.9)}vh`, rotate: t.r, opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" },
            0.15 + i * 0.03,
          );
        });
        tl.from(q(".h-caption"), { opacity: 0, y: 30, duration: 0.3 }, 0.7);
      });

      return () => {
        removeEventListener("pointermove", onMove);
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <section id="top" ref={root} className="relative h-[100svh] min-h-[640px] overflow-hidden" aria-label="Introduction">
      {/* Ember glow behind the portrait */}
      <div className="h-glow pointer-events-none absolute left-1/2 top-[58%] h-[110vmin] w-[110vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-90 blur-[90px] [background:radial-gradient(circle_at_50%_45%,#ff6a1f_0%,#e4520c_28%,rgba(120,30,8,.6)_52%,transparent_70%)] [:root[data-mode=pixel]_&]:blur-0 [:root[data-mode=pixel]_&]:[background:repeating-conic-gradient(#ff6a1f_0_25%,#e4520c_0_50%)_0_0/24px_24px] [:root[data-mode=pixel]_&]:opacity-25" />
      <div className="dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      {/* The name, behind the portrait */}
      <div className="h-word-wrap pointer-events-none absolute inset-x-0 top-[13%] flex justify-center md:top-[9%]" aria-hidden>
        <p className="display flex select-none text-[38vw] font-semibold leading-[0.8] tracking-[-0.075em] text-paper md:text-[30vw]">
          {"ANUJ".split("").map((ch, i) => (
            <span key={i} className="h-word inline-block">
              {ch}
            </span>
          ))}
        </p>
      </div>

      {/* Portrait: photo, pixel art, and the morph between them */}
      <div className="h-portrait absolute bottom-[14svh] left-1/2 aspect-square h-[62svh] max-w-none -translate-x-1/2 md:bottom-0 md:h-[92svh]">
        <div className="h-portrait-inner relative h-full w-full [mask-image:linear-gradient(to_bottom,black_82%,transparent)] md:[mask-image:none]">
          <img
            ref={photo}
            src="/img/me/sunglasses-cut-1200.webp"
            srcSet={srcset("/img/me/sunglasses-cut", [700, 1200, 1800])}
            sizes="(min-width: 768px) 92vh, 78vh"
            alt="Anuj M in sunglasses"
            fetchPriority="high"
            className={`absolute inset-0 h-full w-full select-none object-contain transition-opacity duration-150 ${shown === "photo" ? "opacity-100" : "opacity-0"}`}
            draggable={false}
          />
          <img
            src="/img/me/sunglasses-pixel-1200.png"
            alt=""
            aria-hidden
            className={`absolute inset-0 h-full w-full select-none object-contain [image-rendering:pixelated] ${shown === "pixel" ? "opacity-100" : "opacity-0"}`}
            draggable={false}
          />
          <canvas ref={canvas} aria-hidden className={`absolute inset-0 h-full w-full [image-rendering:pixelated] ${shown === "morph" ? "opacity-100" : "opacity-0"}`} />
          {/* The work, reflected in the lenses */}
          <svg viewBox="0 0 2000 2000" className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${shown === "photo" ? "opacity-100" : "opacity-0"}`} aria-hidden>
            <defs>
              <clipPath id="lensL">
                <polygon points={LENS_L} />
              </clipPath>
              <clipPath id="lensR">
                <polygon points={LENS_R} />
              </clipPath>
              <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#fff" stopOpacity=".55" />
                <stop offset=".45" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[
              ["lensL", 640, 600],
              ["lensR", 955, 555],
            ].map(([id, x, y]) => (
              <g key={id as string} clipPath={`url(#${id})`} style={{ mixBlendMode: "screen" }}>
                <g ref={id === "lensL" ? lens : undefined}>
                  {SHOTS.map((s, i) => (
                    <image
                      key={s}
                      href={s}
                      x={(x as number) - 40}
                      y={(y as number) - 10}
                      width={330}
                      height={210}
                      preserveAspectRatio="xMidYMid slice"
                      opacity={i === shot ? 0.34 : 0}
                      style={{ transition: "opacity .7s ease", transform: "skewY(-7deg)", transformBox: "fill-box", transformOrigin: "center" }}
                    />
                  ))}
                </g>
                <rect x={x as number} y={y as number} width={260} height={220} fill="url(#sheen)" opacity=".18" />
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Work tiles that gather around the portrait on scroll */}
      {PROJECTS.map((p, i) => (
        <a key={p.slug} href={`#work-${p.slug}`} className="h-tile glass pointer-events-auto absolute left-1/2 top-1/2 overflow-hidden p-1.5 opacity-0" style={{ borderRadius: "var(--radius)" }} tabIndex={-1} aria-hidden>
          <img src={`${p.cover}-800.webp`} alt="" className="aspect-[16/10] w-full object-cover object-top" style={{ borderRadius: "calc(var(--radius) - 6px)" }} loading="lazy" />
          <span className="mono flex items-center justify-between px-1.5 pt-1.5 text-[10px] uppercase tracking-[0.14em] text-ink-300">
            {p.name}
            <span style={{ color: p.accent }}>{String(i + 1).padStart(2, "0")}</span>
          </span>
        </a>
      ))}
      <div className="h-caption pointer-events-none absolute inset-x-0 bottom-[7%] text-center">
        <p className="mono text-[11px] uppercase tracking-[0.2em] text-ink-400">Selected work · 2025–26</p>
        <p className="display mt-2 text-[clamp(28px,4vw,56px)] font-semibold tracking-[-0.04em]">Six products, one habit: show the evidence.</p>
      </div>

      {/* Foreground copy */}
      <div className="h-fade-out absolute inset-x-0 bottom-0 flex flex-col gap-6 bg-gradient-to-t from-ink-950 via-ink-950/85 to-transparent px-5 pb-8 pt-20 sm:px-8 md:flex-row md:items-end md:justify-between md:bg-none md:pb-10 md:pt-0">
        <div className="max-w-[520px]">
          <p className="h-fade mono mb-4 text-[11px] uppercase tracking-[0.2em] text-ember-300">Product Designer · AI products · Bengaluru</p>
          <h1 className="h-fade display text-[clamp(30px,3.6vw,52px)] font-medium leading-[1.02] tracking-[-0.035em] [text-shadow:0_2px_30px_rgba(0,0,0,.6)]">
            I design AI products people can <em className="font-serif font-normal italic text-ember-300 [:root[data-mode=pixel]_&]:font-pixel [:root[data-mode=pixel]_&]:not-italic">check</em>, <em className="font-serif font-normal italic text-ember-300 [:root[data-mode=pixel]_&]:font-pixel [:root[data-mode=pixel]_&]:not-italic">trust</em> and actually use.
          </h1>
          <div className="h-fade mt-6 flex flex-wrap gap-2.5">
            <a href="#work" className="rounded-full bg-paper px-5 py-3 text-[14px] font-semibold text-ink-950 transition hover:bg-ember-300 [:root[data-mode=pixel]_&]:rounded-none [:root[data-mode=pixel]_&]:shadow-[4px_4px_0_#ff6a1f]">
              See the work
            </a>
            <a href="/Anuj_M_Resume.pdf" className="glass px-5 py-3 text-[14px] font-medium" style={{ borderRadius: "999px" }}>
              Résumé
            </a>
          </div>
        </div>
        <aside className="h-fade glass hidden w-[300px] p-5 text-[13px] lg:block" aria-label="At a glance">
          <p className="mono mb-3 text-[10px] uppercase tracking-[0.18em] text-ink-500">At a glance</p>
          <dl className="space-y-3">
            <div>
              <dt className="text-ink-500">Now</dt>
              <dd>Data Analyst, Togle Labs</dd>
            </div>
            <div>
              <dt className="text-ink-500">Before</dt>
              <dd>LLM evaluation, Keywords Studios; led a team on an Amazon AGI Lab project</dd>
            </div>
            <div>
              <dt className="text-ink-500">Shipped</dt>
              <dd>Four products and two brand concepts, all live</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
