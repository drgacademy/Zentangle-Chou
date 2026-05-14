import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Noto_Serif_TC, Noto_Sans_TC, EB_Garamond } from "next/font/google";
import "./globals.css";

const serifTC = Noto_Serif_TC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-serif-zh-loaded",
  display: "swap",
});

const sansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans-zh-loaded",
  display: "swap",
});

const garamond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif-en-loaded",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Zentangle Zhou — 禪繞畫的安靜時刻",
    template: "%s · Zentangle Zhou",
  },
  description:
    "Zentangle Zhou — 一個獻給禪繞畫的個人網站：歷史、名家、畫法、心法，與作畫的安靜時刻。",
  metadataBase: new URL("https://zentangle-zhou.example"),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="zh-Hant"
      suppressHydrationWarning
      className={`${serifTC.variable} ${sansTC.variable} ${garamond.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
