import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
  ],
};

export const metadata: Metadata = {
  title: "pxlshpr - Pixel Shipper",
  description: "UX Engineer crafting delightful iOS apps",
  openGraph: {
    title: "pxlshpr - Pixel Shipper",
    description: "UX Engineer crafting delightful iOS apps",
    url: "https://pxlshpr.vercel.app",
    siteName: "pxlshpr",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "pxlshpr - Pixel Shipper",
    description: "UX Engineer crafting delightful iOS apps",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
