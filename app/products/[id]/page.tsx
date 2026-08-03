"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Ruler, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PRODUCTS } from "@/data/products";
import {
  SIZE_LABELS, FIT_TYPES, SIZE_CHART, FIT_DESCRIPTIONS,
  SHOE_SIZES, MEASUREMENT_LABELS, MEASUREMENT_HOW_TO,
  type SizeLabel, type FitType, type ShoeSizeLabel,
} from "@/data/sizes";
import { useCart } from "@/hooks/useCart";

// ── Prices ────────────────────────────────────────────────────────────────────
const READY_MADE_SUIT_PRICE  = 450;
const BESPOKE_SUIT_FROM      = 699;
const FOOTWEAR_READY_PRICE   = 150;
const FOOTWEAR_CUSTOM_PRICE  = 200;
const WAISTCOAT_PRICE        = 150;

function readyMadePrice(category: string): number {
  if (category === "Footwear")   return FOOTWEAR_READY_PRICE;
  if (category === "Waistcoats") return WAISTCOAT_PRICE;
  return READY_MADE_SUIT_PRICE;
}

// ── Suit measurement chart ────────────────────────────────────────────────────

function SizeChart({
  fit, activeSize,
}: {
  fit: FitType;
  activeSize: SizeLabel | null;
}) {
  const chart = SIZE_CHART[fit];
  const keys = Object.keys(MEASUREMENT_LABELS) as (keyof typeof MEASUREMENT_LABELS)[];

  if (!activeSize) {
    return (
      <div className="mt-4 rounded-xl border border-dashed border-border p-6 text-center text-muted-foreground text-sm">
        Select a size above to see its measurements
      </div>
    );
  }

  const measurements = chart[activeSize];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${fit}-${activeSize}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22 }}
        className="mt-4 rounded-xl border border-border overflow-hidden"
      >
        <div className="bg-primary/5 px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-bold text-primary">
            {fit} Fit — Size {activeSize}
          </span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">in inches</span>
        </div>
        <div className="divide-y divide-border">
          {keys.map((k) => (
            <div key={k} className="flex items-start px-4 py-3 group hover:bg-muted/40 transition-colors">
              <div className="w-36 flex-shrink-0">
                <p className="text-sm font-medium text-foreground">{MEASUREMENT_LABELS[k]}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-primary tabular-nums">{measurements[k]}"</p>
                <p className="text-xs text-muted-foreground mt-0.5">{MEASUREMENT_HOW_TO[k]}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ProductPage() {
  const params = useParams();
  const id = (params?.id as string) ?? "";
  const router = useRouter();
  const { addItem } = useCart();

  const product = PRODUCTS.find(
    (p) => p.id.toLowerCase() === id.toLowerCase()
  );

  const isFootwear   = product?.category === "Footwear";
  const isWaistcoat  = product?.category === "Waistcoats";
  const isSuit       = !isFootwear && !isWaistcoat;

  // Suit state
  const [selectedFit,       setSelectedFit]       = useState<FitType>("Tailored");
  const [selectedSuitSize,  setSelectedSuitSize]  = useState<SizeLabel | null>(null);
  // Shoe state
  const [selectedShoeSize,  setSelectedShoeSize]  = useState<ShoeSizeLabel | null>(null);

  const [addState,       setAddState]       = useState<"idle" | "adding" | "added">("idle");
  const [showSizeError,  setShowSizeError]  = useState(false);
  const sizeRef = useRef<HTMLDivElement>(null);

  if (!product) {
    return (
      <main className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center px-4">
          <h1 className="font-display text-4xl text-primary mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">This product doesn&apos;t exist or has been removed.</p>
          <Link href="/products" className="rounded-full bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 transition">
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  const price = readyMadePrice(product.category);

  const handleAddToCart = () => {
    const sizeChosen = isFootwear ? selectedShoeSize : selectedSuitSize;
    if (!sizeChosen) {
      setShowSizeError(true);
      sizeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => setShowSizeError(false), 3000);
      return;
    }
    setShowSizeError(false);
    setAddState("adding");

    setTimeout(() => {
      addItem({
        productId:    product.id,
        productTitle: product.title,
        productImage: product.image,
        category:     product.category,
        fit:          isFootwear ? "Standard" : selectedFit,
        size:         sizeChosen,
        quantity:     1,
        unitPrice:    price,
      });
      setAddState("added");
    }, 500);

    setTimeout(() => {
      router.push("/cart");
    }, 1300);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      <div className="grid lg:grid-cols-2 gap-14 items-start">

        {/* ── Product image ─────────────────────────────────────────── */}
        <div className="overflow-hidden rounded-2xl border bg-white shadow-lg sticky top-28">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* ── Details panel ─────────────────────────────────────────── */}
        <div className="space-y-8">

          {/* Title & price */}
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
              {product.category} · {product.id}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl text-primary leading-tight">
              {product.title}
            </h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Two-price columns — shown for suits and footwear */}
            {(isSuit || isFootwear) ? (
              <div className="mt-5 grid grid-cols-2 gap-3">
                {/* Ready-made */}
                <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Ready-Made</p>
                  <p className="text-2xl font-bold text-primary">${price.toLocaleString()} AUD</p>
                  <p className="text-xs text-muted-foreground mt-1">In stock · ships fast</p>
                </div>
                {/* Custom / bespoke */}
                <div className="rounded-xl border-2 border-accent/40 bg-accent/5 p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                    {isSuit ? "Bespoke / Custom" : "Custom Made"}
                  </p>
                  <p className="text-2xl font-bold text-accent">
                    {isSuit
                      ? `From $${BESPOKE_SUIT_FROM.toLocaleString()} AUD`
                      : `$${FOOTWEAR_CUSTOM_PRICE.toLocaleString()} AUD`}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isSuit ? "Made-to-measure · book a fitting" : "Made-to-order · book a fitting"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-5 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">${price.toLocaleString()} AUD</span>
                <span className="text-sm text-green-700 font-medium bg-green-50 px-2 py-0.5 rounded-full">Ready to Ship</span>
              </div>
            )}

            {/* Three Piece Suit Option */}
{product.threePieceAvailable && isSuit && (
  <div className="mt-4 rounded-xl border-2 border-primary/20 bg-primary/5 p-4">
    <p className="text-sm font-bold text-primary">
      Three-Piece Suit Option +$150 AUD
    </p>

    <p className="mt-1 text-sm text-muted-foreground">
      Includes tailored vest with your suit.
    </p>
  </div>
)}
          </div>

          {/* ── SUIT: fit + size selector ─────────────────────────── */}
          {!isFootwear && (
            <>
              {/* Fit selector */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">Select Fit</h3>
                <div className="grid grid-cols-3 gap-3">
                  {FIT_TYPES.map((fit) => (
                    <button
                      key={fit}
                      onClick={() => { setSelectedFit(fit); setSelectedSuitSize(null); }}
                      className={cn(
                        "rounded-xl border-2 p-3 text-left transition-all",
                        selectedFit === fit
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40"
                      )}
                    >
                      <p className={cn("font-semibold text-sm", selectedFit === fit ? "text-primary" : "text-foreground")}>
                        {fit}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                        {fit === "Slim" ? "Close cut" : fit === "Tailored" ? "Structured" : "Relaxed"}
                      </p>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {FIT_DESCRIPTIONS[selectedFit]}
                </p>
              </div>

              {/* Suit size selector */}
              <div ref={sizeRef}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Select Size</h3>
                  <span className="flex items-center gap-1 text-xs text-primary font-medium">
                    <Ruler size={13} /> Measurements shown below
                  </span>
                </div>

                <AnimatePresence>
                  {showSizeError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="text-xs text-red-600 font-medium mb-2"
                    >
                      ↑ Please select a size before adding to cart
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="flex gap-2 flex-wrap">
                  {SIZE_LABELS.map((size) => (
                    <button
                      key={size}
                      onClick={() => { setSelectedSuitSize(size); setShowSizeError(false); }}
                      className={cn(
                        "w-14 h-14 rounded-xl border-2 font-bold text-sm transition-all",
                        selectedSuitSize === size
                          ? "border-primary bg-primary text-white shadow-md scale-105"
                          : "border-border hover:border-primary text-foreground hover:scale-105"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <SizeChart fit={selectedFit} activeSize={selectedSuitSize} />
              </div>
            </>
          )}

          {/* ── FOOTWEAR: shoe size selector ─────────────────────── */}
          {isFootwear && (
            <div ref={sizeRef}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Select Size</h3>
                <span className="text-xs text-muted-foreground">UK / US sizes</span>
              </div>

              <AnimatePresence>
                {showSizeError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-red-600 font-medium mb-2"
                  >
                    ↑ Please select a size before adding to cart
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-3 gap-2">
                {SHOE_SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => { setSelectedShoeSize(size); setShowSizeError(false); }}
                    className={cn(
                      "rounded-xl border-2 py-2.5 px-2 text-center transition-all",
                      selectedShoeSize === size
                        ? "border-primary bg-primary text-white shadow-md scale-[1.03]"
                        : "border-border hover:border-primary text-foreground hover:scale-[1.03]"
                    )}
                  >
                    <p className="text-xs font-bold leading-tight">{size.split(" / ")[0]}</p>
                    <p className={cn("text-[10px] leading-tight mt-0.5", selectedShoeSize === size ? "text-white/80" : "text-muted-foreground")}>
                      {size.split(" / ")[1]}
                    </p>
                  </button>
                ))}
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                Unsure of your size? Our shoes run true to size. If between sizes, size up.
              </p>
            </div>
          )}

          {/* ── Add to Cart ───────────────────────────────────────── */}
          <div className="space-y-3 pt-2">
            <motion.button
              onClick={handleAddToCart}
              disabled={addState !== "idle"}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "w-full h-14 rounded-full font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-3 transition-all duration-300",
                addState === "added"
                  ? "bg-green-600 text-white"
                  : addState === "adding"
                  ? "bg-primary/80 text-white cursor-wait"
                  : "bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl"
              )}
            >
              <AnimatePresence mode="wait">
                {addState === "idle" && (
                  <motion.span key="idle" className="flex items-center gap-2"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <ShoppingCart size={18} /> Add to Cart — ${price.toLocaleString()} AUD
                  </motion.span>
                )}
                {addState === "adding" && (
                  <motion.span key="adding" className="flex items-center gap-2"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding…
                  </motion.span>
                )}
                {addState === "added" && (
                  <motion.span key="added" className="flex items-center gap-2"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                    <Check size={20} strokeWidth={3} /> Added — Going to cart…
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <div className="flex gap-3">
              <Link href="/products" className="flex-1 h-12 rounded-full border-2 border-border flex items-center justify-center text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition">
                ← Back
              </Link>
              {isSuit && (
                <Link href="/booking" className="flex-1 h-12 rounded-full border-2 border-primary flex items-center justify-center text-sm font-semibold text-primary hover:bg-primary hover:text-white transition">
                  Book Bespoke
                </Link>
              )}
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
            {[
              { icon: "🚚", label: "Free delivery", sub: "Australia-wide" },
              { icon: isFootwear ? "👞" : "📏", label: isFootwear ? "True to size" : "True sizing", sub: isFootwear ? "Size up if between" : "Measured to spec" },
              { icon: "✉️", label: "Order confirmed", sub: "Email notification" },
            ].map((b) => (
              <div key={b.label} className="text-center p-3 rounded-xl bg-muted/40">
                <p className="text-xl mb-1">{b.icon}</p>
                <p className="text-xs font-semibold">{b.label}</p>
                <p className="text-xs text-muted-foreground">{b.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
