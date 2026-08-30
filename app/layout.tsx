import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";

import "./globals.css";

import { Providers } from "./providers";
import { SiteLayout } from "@/components/site-layout";

const SITE_URL = "https://www.tailorobe.com.au";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Tailorobe | Bespoke Tailors Adelaide",
    template: "%s | Tailorobe Bespoke Tailors",
  },

  description:
    "Tailorobe Bespoke Tailors offers custom suits, wedding suits and made-to-measure tailoring in Adelaide. Visit our West Richmond or Walkerville showroom for expert fitting and personalised service.",

  keywords: [
    "tailor Adelaide",
    "bespoke tailor Adelaide",
    "bespoke tailoring Adelaide",
    "custom tailor Adelaide",
    "custom suits Adelaide",
    "bespoke suits Adelaide",
    "made to measure suits Adelaide",
    "made to measure tailor Adelaide",
    "wedding suits Adelaide",
    "wedding suit tailor Adelaide",
    "custom wedding suits Adelaide",
    "men's suits Adelaide",
    "men's tailor Adelaide",
    "suit tailor Adelaide",
    "suit alterations Adelaide",
    "custom shirts Adelaide",
    "bespoke shirts Adelaide",
    "formal suits Adelaide",
    "groom suits Adelaide",
    "groomsmen suits Adelaide",
    "tailor West Richmond",
    "tailor Walkerville",
    "Walkerville tailor",
    "Tailorobe",
  ],

  authors: [
    {
      name: "Tailorobe Bespoke Tailors",
      url: SITE_URL,
    },
  ],

  creator: "Tailorobe Bespoke Tailors",
  publisher: "Tailorobe Bespoke Tailors",

  applicationName: "Tailorobe Bespoke Tailors",

  category: "fashion",

  alternates: {
    canonical: SITE_URL,
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_AU",
    url: SITE_URL,
    siteName: "Tailorobe Bespoke Tailors",

    title: "Tailorobe | Bespoke Tailors Adelaide",

    description:
      "Custom suits, wedding suits and made-to-measure tailoring in Adelaide. Visit Tailorobe in West Richmond or Walkerville for a personalised fitting.",

    // No OG image intentionally.
  },

  twitter: {
    card: "summary",
    title: "Tailorobe | Bespoke Tailors Adelaide",
    description:
      "Custom suits, wedding suits and made-to-measure tailoring in Adelaide.",
  },

  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU">
      <head>
        {/* Google Tag Manager */}
<Script id="gtm" strategy="afterInteractive">
  {`
    (function(w,d,s,l,i){
      w[l]=w[l]||[];
      w[l].push({
        'gtm.start': new Date().getTime(),
        event:'gtm.js'
      });

      var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),
          dl=l!='dataLayer'?'&l='+l:'';

      j.async=true;
      j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
      f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-KTDT7TC5');
  `}
</Script>

        {/* =========================================================
            TAILOROBE BUSINESS STRUCTURED DATA
           ========================================================= */}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",

              "@type": "ClothingStore",

              "@id": `${SITE_URL}/#business`,

              name: "Tailorobe Bespoke Tailors",

              url: SITE_URL,

              description:
                "Tailorobe Bespoke Tailors is an Adelaide tailoring business specialising in bespoke suits, custom suits, wedding suits and made-to-measure garments.",

              telephone: "+61414053773",

              priceRange: "$$$",

              currenciesAccepted: "AUD",

              paymentAccepted:
                "Cash, Credit Card, Debit Card, Electronic Funds Transfer",

              areaServed: [
                {
                  "@type": "City",
                  name: "Adelaide",
                },
                {
                  "@type": "AdministrativeArea",
                  name: "South Australia",
                },
              ],

              sameAs: [
                "https://www.instagram.com/tailorobe",
                "https://www.facebook.com/bespoke.tailorobe",
                "https://www.tiktok.com/@tailorobe",
              ],

              hasMap: [
                "https://www.google.com/maps/search/?api=1&query=Shop+3%2F196+Marion+Road+West+Richmond+Adelaide+SA+5033",
                "https://www.google.com/maps/search/?api=1&query=2%2F117+Walkerville+Terrace+Walkerville+SA+5081",
              ],

              makesOffer: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Bespoke Suits",
                    description:
                      "Custom-designed bespoke suits made to the client's measurements and preferences.",
                    areaServed: {
                      "@type": "City",
                      name: "Adelaide",
                    },
                  },
                },

                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Custom Suits",
                    description:
                      "Personalised custom suits with individual fabric, style and fitting options.",
                    areaServed: {
                      "@type": "City",
                      name: "Adelaide",
                    },
                  },
                },

                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Wedding Suits",
                    description:
                      "Custom wedding suits and formalwear for grooms and wedding parties.",
                    areaServed: {
                      "@type": "City",
                      name: "Adelaide",
                    },
                  },
                },

                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Made-to-Measure Tailoring",
                    description:
                      "Made-to-measure garments professionally fitted and tailored to individual measurements.",
                    areaServed: {
                      "@type": "City",
                      name: "Adelaide",
                    },
                  },
                },

                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Custom Shirts",
                    description:
                      "Personalised made-to-measure shirts tailored to individual preferences and measurements.",
                    areaServed: {
                      "@type": "City",
                      name: "Adelaide",
                    },
                  },
                },

                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Suit Alterations",
                    description:
                      "Professional suit and garment alterations for improved fit and comfort.",
                    areaServed: {
                      "@type": "City",
                      name: "Adelaide",
                    },
                  },
                },
              ],

              location: [
                {
                  "@type": "ClothingStore",

                  "@id": `${SITE_URL}/#west-richmond`,

                  name: "Tailorobe Bespoke Tailors - West Richmond",

                  url: SITE_URL,

                  telephone: "+61414053773",

                  address: {
                    "@type": "PostalAddress",

                    streetAddress: "Shop 3/196 Marion Road",

                    addressLocality: "West Richmond",

                    addressRegion: "SA",

                    postalCode: "5033",

                    addressCountry: "AU",
                  },

                  areaServed: [
                    {
                      "@type": "Place",
                      name: "West Richmond",
                    },
                    {
                      "@type": "Place",
                      name: "Richmond",
                    },
                    {
                      "@type": "Place",
                      name: "Adelaide",
                    },
                  ],

                  openingHoursSpecification: [
                    {
                      "@type": "OpeningHoursSpecification",

                      dayOfWeek: [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                      ],

                      opens: "12:00",

                      closes: "19:00",
                    },

                    {
                      "@type": "OpeningHoursSpecification",

                      dayOfWeek: ["Saturday", "Sunday"],

                      opens: "10:00",

                      closes: "17:00",
                    },
                  ],

                  hasMap:
                    "https://www.google.com/maps/search/?api=1&query=Shop+3%2F196+Marion+Road+West+Richmond+Adelaide+SA+5033",
                },

                {
                  "@type": "ClothingStore",

                  "@id": `${SITE_URL}/#walkerville`,

                  name: "Tailorobe Bespoke Tailors - Walkerville",

                  url: SITE_URL,

                  telephone: "+61414053773",

                  address: {
                    "@type": "PostalAddress",

                    streetAddress: "2/117 Walkerville Terrace",

                    addressLocality: "Walkerville",

                    addressRegion: "SA",

                    postalCode: "5081",

                    addressCountry: "AU",
                  },

                  areaServed: [
                    {
                      "@type": "Place",
                      name: "Walkerville",
                    },
                    {
                      "@type": "Place",
                      name: "North Adelaide",
                    },
                    {
                      "@type": "Place",
                      name: "Adelaide",
                    },
                  ],

                  openingHoursSpecification: [
                    {
                      "@type": "OpeningHoursSpecification",

                      dayOfWeek: [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                      ],

                      opens: "12:00",

                      closes: "19:00",
                    },

                    {
                      "@type": "OpeningHoursSpecification",

                      dayOfWeek: ["Saturday", "Sunday"],

                      opens: "10:00",

                      closes: "17:00",
                    },
                  ],

                  hasMap:
                    "https://www.google.com/maps/search/?api=1&query=2%2F117+Walkerville+Terrace+Walkerville+SA+5081",
                },
              ],
            }),
          }}
        />

        {/* =========================================================
            WEBSITE STRUCTURED DATA
           ========================================================= */}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",

              "@type": "WebSite",

              "@id": `${SITE_URL}/#website`,

              url: SITE_URL,

              name: "Tailorobe Bespoke Tailors",

              description:
                "Bespoke tailoring, custom suits and wedding suits in Adelaide.",

              publisher: {
                "@id": `${SITE_URL}/#business`,
              },

              inLanguage: "en-AU",
            }),
          }}
        />
      </head>

      <body>
        {/* Google Tag Manager - noscript */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KTDT7TC5"
            height="0"
            width="0"
            style={{
              display: "none",
              visibility: "hidden",
            }}
          />
        </noscript>

        {/* Website */}
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