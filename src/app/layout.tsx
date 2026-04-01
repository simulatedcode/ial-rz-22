import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";
import SmoothScroll from "@/components/SmoothScroll";
import { GlobalCRTOverlay } from "@/components/ui/GlobalCRTOverlay";
import "./globals.css";
import { GridLayout } from "@/components/ui/GridLayout";
import { HUDBorder } from "@/components/ui/HUDBorder/HUDBorder";

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
      <body className="relative w-full min-h-screen bg-black overflow-hidden">
        <HUDBorder>
          <GlobalCRTOverlay>
            <GridLayout>
              <div className="relative z-10">
                <SmoothScroll>{children}</SmoothScroll>
              </div>
            </GridLayout>
          </GlobalCRTOverlay>
        </HUDBorder>
      </body>
    </html>
  );
}
