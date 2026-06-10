import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { SiteLayout } from "@/components/site-layout";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Tailorobe Bespoke Tailors | Adelaide",
  description:
    "Adelaide's premier destination for bespoke tailoring. Crafting elegant, made-to-measure garments for your unique silhouette.",
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
          src="https://static.elfsight.com/platform/platform.js"
          async
        />
      </head>
      <body>
        <Providers>
          <SiteLayout>{children}</SiteLayout>
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
