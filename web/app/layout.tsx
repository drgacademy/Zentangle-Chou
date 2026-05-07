import type { Metadata } from "next";
import { Crimson_Pro, Noto_Serif_TC, JetBrains_Mono, Caveat_Brush } from "next/font/google";
import PaperBackground from "@/components/atmosphere/PaperBackground";
import BreathingDriver from "@/components/atmosphere/BreathingDriver";
import "./globals.css";

const masthead = Crimson_Pro({
  variable: "--font-masthead-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const body = Noto_Serif_TC({
  variable: "--font-body-serif",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-stack",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const script = Caveat_Brush({
  variable: "--font-display-script",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zentangle Chou",
  description: "One stroke. One breath. — A Zentangle artist portfolio.",
  metadataBase: new URL("https://zentangle-chou.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="zh-Hant"
      className={`${masthead.variable} ${body.variable} ${mono.variable} ${script.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="relative min-h-screen">
        <PaperBackground />
        <BreathingDriver />
        {children}
      </body>
    </html>
  );
}
