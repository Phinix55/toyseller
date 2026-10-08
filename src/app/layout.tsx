import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gaming Console",
  description: "Dive into the story. Every toy holds a memory.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* CRITICAL LCP PRELOADS ONLY */}
        <link rel="preload" as="image" href="/assets/desktop/Khilonewala.avif" type="image/avif" />
        <link rel="preload" as="image" href="/assets/desktop/videogame.avif" type="image/avif" />
        
        {/* Desktop LCP */}
        <link rel="preload" as="image" href="/assets/desktop/bg1.avif" type="image/avif" media="(min-width: 768px)" crossOrigin="anonymous" />
        
        {/* Mobile LCP */}
        <link rel="preload" as="image" href="/assets/mobile/mobbg1.avif" type="image/avif" media="(max-width: 767px)" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
        <style>{`
          .font-pixel { font-family: 'Press Start 2P', cursive; }
        `}</style>
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
