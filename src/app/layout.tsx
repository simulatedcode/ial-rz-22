import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
  if (args[0]?.toString().includes("THREE.Clock")) return;
  originalWarn(...args);
};
import SmoothScroll from "@/components/SmoothScroll";
import CanvasRoot from "@/components/webgl/CanvasRoot";
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
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="relative w-full min-h-screen bg-black">

        {/* 🎥 WebGL Layer (BACKGROUND) */}
        <div className="fixed inset-0 z-0">
          <CanvasRoot />
        </div>

        {/* 🧠 UI Layer */}
        <div className="relative z-10">
          <SmoothScroll>{children}</SmoothScroll>
        </div>

        {/* 📺 CRT Overlay */}
        <div className="crt-overlay" />

      </body>
    </html>
  );
}
