# Anuj M · Product Designer for AI products

My portfolio: **[anuj1102001.github.io](https://anuj1102001.github.io)**

I design and build AI products people can check, trust and actually use. The site has two display modes (Glass and **Pixel**, switch in the top bar), case studies where every claim opens its evidence, and an interactive career story.

- **Work:** Shortlist, Margin, FITFLOW AI, Creators Store, plus COMET 2.0 and Solune & Afterdark in the lab
- **Design system:** [Figma file](https://www.figma.com/design/QsLBb2Yx1R6BEPdDG282xE), mirrored by the tokens in `src/app/globals.css`
- **Analytics portfolio (previous site):** [/analytics](https://anuj1102001.github.io/analytics/)

## Stack

Next.js 16 (static export) · React 19 · TypeScript · Tailwind CSS 4 · GSAP (ScrollTrigger) · Lenis. Deployed to GitHub Pages by `.github/workflows/pages.yml` on every push to `main`.

```bash
npm install
npm run dev        # http://localhost:3800
npm run build      # static site in out/
node scripts/assets.mjs   # rebuild images in public/img from design/ and the project repos
```

## How it was made

Designed and directed by me, built with an AI coding agent (Claude Code): I chose the concept, the content and the design, and reviewed every screen. Case-study facts come only from each project's README and evaluation results. Portrait backgrounds were removed on my machine; nothing was uploaded.

The previous data-analytics site is kept on the `archive/analytics-portfolio` branch and served at `/analytics`.
