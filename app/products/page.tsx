import type { Metadata } from "next";
import ProductCatalogue from "@/components/product-catalogue";

export const metadata: Metadata = {
  title: "Products | Tailorobe",
  description:
    "Explore Tailorobe bespoke suits, formalwear, waistcoats and handcrafted footwear.",
};

export default function ProductsPage() {
  return <ProductCatalogue />;
}
