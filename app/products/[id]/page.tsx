import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/data/products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = PRODUCTS.find(
    (p) => p.id.toLowerCase() === id.toLowerCase()
  );

  if (!product) {
    notFound();
  }

  const price =
    product.category === "Footwear"
      ? "$200 AUD"
      : product.category === "Waistcoats"
      ? "$150 AUD"
      : "From $699 AUD";

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid lg:grid-cols-2 gap-14 items-start">
        {/* Product Image */}
        <div className="overflow-hidden rounded-2xl border bg-white shadow-lg">
          <Image
            src={product.image}
            alt={product.title}
            width={900}
            height={1200}
            className="w-full h-auto object-cover hover:scale-110 transition-transform duration-500 cursor-zoom-in"
            priority
          />
        </div>

        {/* Product Details */}
        <div>
          <p className="uppercase tracking-[0.3em] text-sm text-gray-500">
            {product.id}
          </p>

          <h1 className="mt-3 text-4xl font-bold text-[#173f35]">
            {product.title}
          </h1>

          <p className="mt-6 text-gray-600 leading-8">
            {product.description}
          </p>

          <div className="mt-8">
            <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              Made to Order
            </span>
          </div>

          <div className="mt-8">
            <p className="text-3xl font-bold text-[#173f35]">
              {price}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Final price may vary depending on fabric and customisations.
            </p>
          </div>

          <div className="mt-10 flex gap-4">
            <Link
              href="/booking"
              className="rounded-full bg-[#173f35] px-8 py-4 text-white font-semibold hover:bg-[#215646] transition"
            >
              Book Appointment
            </Link>

            <Link
              href="/products"
              className="rounded-full border border-[#173f35] px-8 py-4 font-semibold text-[#173f35] hover:bg-[#173f35] hover:text-white transition"
            >
              Back to Products
            </Link>
          </div>

          <div className="mt-10 border-t pt-8">
            <h3 className="text-lg font-semibold text-[#173f35]">
              Product Details
            </h3>

            <ul className="mt-4 space-y-2 text-gray-600">
              <li>• Category: {product.category}</li>
              <li>• Made to Order</li>
              <li>• Bespoke Tailoring</li>
              <li>• Crafted in Adelaide</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}