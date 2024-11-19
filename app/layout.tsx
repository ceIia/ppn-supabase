import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Analytics } from "@vercel/analytics/react";
import { IOSZoomPrevention } from "~/components/ios-zoom-prevention";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "supabase launch week paris | dec 4th @ papernest",
  description:
    "join us dec 4th in paris for supabase launch week world tour. free tech talks @ papernest hq (157 bvd macdonald). looking for speakers!",
  openGraph: {
    title: "supabase launch week paris | dec 4th @ papernest",
    description:
      "join us dec 4th in paris for supabase launch week world tour. free tech talks @ papernest hq (157 bvd macdonald). looking for speakers!",
    url: "https://events.papernest.com",
    siteName: "supabase x papernest",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "supabase launch week paris | dec 4th @ papernest",
    description:
      "join us dec 4th in paris for supabase launch week world tour. free tech talks @ papernest hq (157 bvd macdonald). looking for speakers!",
  },
  keywords: [
    "supabase",
    "launch week",
    "paris",
    "papernest",
    "tech talks",
    "dev events",
  ],
  authors: [{ name: "papernest" }],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <IOSZoomPrevention />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
