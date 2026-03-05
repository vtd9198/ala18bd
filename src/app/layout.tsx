"use client";

import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { usePathname } from "next/navigation";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

import { ConvexClientProvider } from "@/providers/ConvexClientProvider";
import { UploadDrawerProvider } from "@/providers/UploadDrawerProvider";
import UploadDrawer from "@/components/UploadDrawer";
import SyncUser from "@/components/SyncUser";
import { LenisProvider } from "@/providers/LenisProvider";
import { ReactNode } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const pathname = usePathname();
  const isInvitationPage = pathname === "/";

  return (
    <html lang="en">
      <head>
        <title>18th Birthday Memories</title>
        <meta name="description" content="Share your photos and videos from the party!" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-background`}
      >
        <div className="grain-overlay mix-blend-multiply opacity-[0.08] dark:opacity-[0.05]" />

        <LenisProvider>
          <ConvexClientProvider>
            <UploadDrawerProvider>
              <SyncUser />
              <div className={`mx-auto min-h-[100dvh] bg-background relative flex flex-col overflow-x-hidden ${isInvitationPage ? 'w-full max-w-none' : 'max-w-md shadow-2xl'}`}>
                <main className={`flex-1 ${!isInvitationPage ? 'pb-24' : ''}`}>
                  {children}
                </main>
                {!isInvitationPage && <BottomNav />}
                {!isInvitationPage && <UploadDrawer />}
              </div>
            </UploadDrawerProvider>
          </ConvexClientProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
