import type { Metadata, Viewport } from "next";
import "./globals.css";
import SessionProvider from "@/components/nutrikit/providers/SessionProvider";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#F8F7F4" },
  ],
};

export const metadata: Metadata = {
  title: "NutriKit - Track Nutrition Without the Friction",
  description: "The fastest way to log what you eat. Scan labels instantly, speak your meals naturally, and let intelligent goals adapt to your body.",
  openGraph: {
    title: "NutriKit - Track Nutrition Without the Friction",
    description: "The fastest way to log what you eat. Scan labels instantly, speak your meals naturally, and let intelligent goals adapt to your body.",
    url: "https://getnutrikit.app",
    siteName: "NutriKit",
    images: [
      {
        url: "/nutrikit/og-image.png",
        width: 1200,
        height: 630,
        alt: "NutriKit App",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NutriKit - Track Nutrition Without the Friction",
    description: "The fastest way to log what you eat. Scan labels instantly, speak your meals naturally, and let intelligent goals adapt to your body.",
    images: ["/nutrikit/og-image.png"],
  },
};

export default function NutrikitLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
