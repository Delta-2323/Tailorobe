import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";

import { Providers } from "./providers";
import { SiteLayout } from "@/components/site-layout";

export const metadata: Metadata = {
  title: "Tailorobe | Bespoke Tailors Adelaide",
  description:
    "Tailorobe offers premium bespoke tailoring in Adelaide. Custom suits, dresses, and made-to-measure garments crafted for your perfect fit.",

  keywords: [
    "tailor adelaide",
    "bespoke tailoring adelaide",
    "custom suits adelaide",
    "made to measure suits",
    "Tailorobe",
  ],

  authors: [{ name: "Tailorobe" }],
  creator: "Tailorobe",

  openGraph: {
    title: "Tailorobe | Bespoke Tailors Adelaide",
    description:
      "Premium bespoke tailoring in Adelaide. Custom suits and made-to-measure garments.",
    url: "https://www.tailorobe.com.au",
    siteName: "Tailorobe",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Tailorobe | Bespoke Tailors Adelaide",
    description:
      "Premium bespoke tailoring in Adelaide.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Tailorobe",
      url: "https://www.tailorobe.com.au",
      image: "https://www.tailorobe.com.au/logo.png",
      description:
        "Premium bespoke tailoring in Adelaide. Custom suits and made-to-measure garments.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Adelaide",
        addressCountry: "AU",
      },
      areaServed: "Adelaide",
      priceRange: "$$$",
    }),
  }}
/>
      </head>

      <body>
        <Providers>
          <SiteLayout>{children}</SiteLayout>
        </Providers>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}