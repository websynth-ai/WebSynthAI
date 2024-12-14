import { SessionProvider } from "next-auth/react";
import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { TooltipProvider } from "@/components/ui";
import { Toaster } from "@/components/ui/sonner";
import AuthModal from "@/components/auth-modal";
import MAINTENANCE from "./maintenance/page";

const geist = Geist({
  subsets: ["latin"],
  preload: true,
  fallback: ["sans-serif"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "black",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: "v0.diy - UI Component Generator",
  description:
    "Generate beautiful UI components using shadcn, NextUI, and Tailwind CSS. Build modern web interfaces quickly and efficiently.",
  keywords: [
    "UI generator",
    "shadcn",
    "NextUI",
    "Tailwind CSS",
    "component generator",
    "web development",
    "React components",
  ],
  authors: [{ name: "v0.diy" }],
  openGraph: {
    title: "v0.diy - UI Component Generator",
    description:
      "Generate beautiful UI components using shadcn, NextUI, and Tailwind CSS",
    type: "website",
    locale: "en_US",
    siteName: "v0.diy",
  },
  twitter: {
    card: "summary_large_image",
    title: "v0.diy - UI Component Generator",
    description:
      "Generate beautiful UI components using shadcn, NextUI, and Tailwind CSS",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <TooltipProvider>
        <html lang="en">
          <head>
            {/* //TODO remove scripts after fixing the bug in iframe */}
            <Script
              type="module"
              src={
                "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"
              }
              strategy="afterInteractive"
            />
            <Script
              noModule
              src={"https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"}
              strategy="afterInteractive"
            />
          </head>
          <body className={geist.className}>
            <Toaster richColors expand />
            {process.env.MAINTENANCE === "MAINTENANCE" ? (
              <MAINTENANCE />
            ) : (
              <>
                {children}
                <AuthModal />
              </>
            )}
          </body>
        </html>
      </TooltipProvider>
    </SessionProvider>
  );
}
