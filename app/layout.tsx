import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import TopBar from "./_components/TopBar";
import BottomNav from "./_components/BottomNav";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cal Eats",
  description: "UC Berkeley dining menus — fast and clean",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="bg-gray-50 min-h-full">
        {/* Mobile-first shell: constrained to phone width, centered on desktop */}
        <div className="relative mx-auto w-full max-w-md min-h-screen bg-white shadow-sm">
          <TopBar />
          {/* Content area — padded top (header) and bottom (nav) */}
          <main className="pt-14 pb-20 min-h-screen">
            {children}
          </main>
          {/* Suspense required: BottomNav uses usePathname() (dynamic data) */}
          <Suspense fallback={
            <nav className="fixed bottom-0 left-0 right-0 z-50 h-20 bg-white border-t border-gray-200" />
          }>
            <BottomNav />
          </Suspense>
        </div>
      </body>
    </html>
  );
}
