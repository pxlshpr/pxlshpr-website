import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
    { media: "(prefers-color-scheme: light)", color: "#faf9f7" },
  ],
};

export const metadata: Metadata = {
  title: "Chunes - Organize Your Music, Your Way",
  description:
    "The ultimate iOS app for music lovers who want control. AI-powered tagging, smart mixes, instant replay markers, and seamless Apple Music integration.",
  keywords: [
    "music app",
    "iOS",
    "Apple Music",
    "music organization",
    "tagging",
    "playlist",
    "smart mixes",
    "markers",
  ],
  authors: [{ name: "Chunes" }],
  openGraph: {
    title: "Chunes - Organize Your Music, Your Way",
    description:
      "The ultimate iOS app for music lovers who want control. AI-powered tagging, smart mixes, instant replay markers, and seamless Apple Music integration.",
    url: "https://getchunes.app",
    siteName: "Chunes",
    images: [
      {
        url: "/chunes/og-image.png",
        width: 1200,
        height: 630,
        alt: "Chunes App",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chunes - Organize Your Music, Your Way",
    description:
      "The ultimate iOS app for music lovers who want control.",
    images: ["/chunes/og-image.png"],
  },
};

export default function ChunesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
