import next from "eslint-config-next/core-web-vitals";
import ts from "eslint-config-next/typescript";

export default [
  ...next,
  ...ts,
  { ignores: [".next/**", "out/**", "node_modules/**", "next-env.d.ts", "design/**", "public/**"] },
  // Static export: images are prepared with srcset by scripts/assets.mjs, so <img> is intended.
  { rules: { "@next/next/no-img-element": "off" } },
  {
    // The portrait morph drives a canvas imperatively and steps its own state from a timer.
    files: ["src/components/Hero.tsx"],
    rules: { "react-hooks/immutability": "off", "react-hooks/set-state-in-effect": "off" },
  },
];
