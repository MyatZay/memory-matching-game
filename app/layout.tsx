import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Memory Matching Game",
  description: "Match all ten number pairs before your lives run out.",
  icons: {
    icon: `${basePath}/favicon.svg`,
    shortcut: `${basePath}/favicon.svg`,
  },
  openGraph: {
    title: "Memory Matching Game",
    description: "Find all 10 number pairs before your lives run out.",
    images: [{ url: `${basePath}/og.png`, width: 1200, height: 630, alt: "Memory Matching number card game" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Memory Matching Game",
    description: "Find all 10 number pairs before your lives run out.",
    images: [`${basePath}/og.png`],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
