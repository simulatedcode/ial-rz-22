import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";

import SmoothScroll from "@/components/SmoothScroll";
import { GlobalCRTOverlay } from "@/components/ui/GlobalCRTOverlay";
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
  title: "PRZOJECT: IAL-RZ-22",
  description: "Speculative Future Memories",
};

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
      <body className="relative w-full min-h-screen bg-background overflow-hidden" suppressHydrationWarning>

        {/* 🔥 WebGL Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <CanvasWrapper />
        </div>

        {/* 🧠 UI Layer */}
        <main className="relative z-10 w-full min-h-screen">
          <Header />
          <SmoothScroll>{children}</SmoothScroll>

          {/* 🎨 CRT Overlay */}
          <GlobalCRTOverlay />
        </main>
      </body>
    </html>
  );
}
