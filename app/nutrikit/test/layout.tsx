import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ff0000",
};

export const metadata: Metadata = {
  title: "Theme Color Test",
  other: {
    "theme-color": "#ff0000",
  },
};

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
