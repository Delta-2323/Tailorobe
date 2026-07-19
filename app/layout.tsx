import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";

import "./globals.css";

import { Providers } from "./providers";
import { SiteLayout } from "@/components/site-layout";

export const metadata: Metadata = {
  title: "Tailorobe | Bespoke Tailors Adelaide",
  description:
    "Tailorobe offers premium bespoke tailoring in Adelaide. Custom suits, wedding suits and made-to-measure garments crafted for your perfect fit.",

  keywords: [
    "tailor adelaide",
    "bespoke tailoring adelaide",
    "custom suits adelaide",
    "made to measure suits",
    "wedding suits adelaide",
    "bespoke suits",
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

export const viewport: Viewport = {
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
        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PTFS5HX9');
          `}
        </Script>

        {/* Local Business SEO */}
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
              telephone: "+61414053773",
              priceRange: "$$$",
              areaServed: "Adelaide",
              address: {
                "@type": "PostalAddress",
                streetAddress": "Shop 3/196 Marion Road",
                addressLocality: "West Richmond",
                addressRegion: "SA",
                postalCode: "5033",
                addressCountry: "AU",
              },
            }),
          }}
        />
      </head>

      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PTFS5HX9"
            height="0"
            width="0"
            style={{
              display: "none",
              visibility: "hidden",
            }}
          />
        </noscript>

        <Providers>
          <SiteLayout>{children}</SiteLayout>
        </Providers>

        {/* Vercel Analytics */}
        <Analytics />
        <SpeedInsights />

        {/* Google Analytics 4 */}
        <GoogleAnalytics gaId="G-CFZLFYJK2S" />
      </body>
    </html>
  );
}