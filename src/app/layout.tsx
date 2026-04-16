import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";

import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/ui/Header";
import CanvasWrapper from "@/components/ui/CanvasWrapper";

import "./globals.css";

const ibmSans = IBM_Plex_Sans({
  variable: "--font-ibm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmMono = IBM_Plex_Mono({
  variable: "--font-ibm-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const pixelFont = localFont({
  src: "./fonts/Web437_Portfolio_6x8.woff",
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: "PRZOJECT: IAL-PMEM-RZ84",
  description: "Speculative Future Memories",
};

import CRTOverlay from "@/components/ui/CRTOverlay";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${ibmSans.variable} ${ibmMono.variable} ${pixelFont.variable}`}
    >
      <body className="relative w-full min-h-screen bg-background overflow-x-hidden" suppressHydrationWarning>
        {/* 🔥 WebGL Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <CanvasWrapper />
        </div>

        {/* 🧠 UI Layer */}
        <main className="relative z-10 w-full min-h-screen">
          <Header />
          <SmoothScroll>{children}</SmoothScroll>
        </main>

        {/* 📺 Screen Layer (Covers both WebGL and UI) */}
        <CRTOverlay />
        
        <Analytics />
      </body>
    </html>
  );
}
