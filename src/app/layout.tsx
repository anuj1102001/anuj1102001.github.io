import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Pixelify_Sans } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { ModeProvider } from "@/components/Mode";
import CommandMenu from "@/components/CommandMenu";
import Transition from "@/components/Transition";
import Ambient from "@/components/Ambient";
import Launch from "@/components/Launch";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument", display: "swap" });
// Only Pixel mode uses this face, so it is not preloaded.
const pixelify = Pixelify_Sans({ subsets: ["latin"], variable: "--font-pixelify", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL("https://anuj1102001.github.io"),
  title: { default: "Anuj M · Product Designer for AI products", template: "%s · Anuj M" },
  description: "Anuj M designs and builds AI products people can check, trust and actually use. Product design, UX, design systems and interaction design, from the first sketch to what ships.",
  openGraph: { type: "website", title: "Anuj M · Product Designer for AI products", description: "AI products people can check, trust and actually use.", images: ["/img/og.jpg"] },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#08080a", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="glass" className={`${geist.variable} ${geistMono.variable} ${instrument.variable} ${pixelify.variable}`} suppressHydrationWarning>
      <head>
        {/* Restore the visitor's mode before paint, so Pixel mode does not flash Glass. */}
        <script dangerouslySetInnerHTML={{ __html: `try{var m=localStorage.getItem('mode');if(m==='pixel')document.documentElement.dataset.mode='pixel';var q=new URLSearchParams(location.search).get('mode');if(q==='glass'||q==='pixel'){document.documentElement.dataset.mode=q;localStorage.setItem('mode',q)}}catch(e){}` }} />
      </head>
      <body>
        <ModeProvider>
          <SmoothScroll />
          <Ambient />
          {children}
          <CommandMenu />
          <Transition />
          <Launch />
        </ModeProvider>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
