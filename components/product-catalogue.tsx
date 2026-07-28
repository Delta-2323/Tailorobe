"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PRODUCTS, type Product } from "@/data/products";
import { HeartButton } from "@/components/HeartButton";
import { useLikedProducts } from "@/hooks/useLikedProducts";

type FilterCategory = "All" | Product["category"];
type SortOption = "featured" | "name";

const CATEGORIES: FilterCategory[] = ["All", "Suits", "Footwear", "Waistcoats"];

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;

function getStartingPrice(category: Product["category"]) {
  switch (category) {
    case "Footwear":   return 200;
    case "Waistcoats": return 150;
    default:           return 699;
  }
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({
  product,
  onZoom,
  liked,
  onToggle,
}: {
  product: Product;
  onZoom: (product: Product) => void;
  liked: boolean;
  onToggle: (productId: string, productName: string) => void;
}) {
  const router = useRouter();
  const [imageFailed, setImageFailed] = useState(false);
  const startingPrice = getStartingPrice(product.category);
  const href = `/products/${product.id}`;
  const bookingHref = `/booking?product=${encodeURIComponent(product.title)}&code=${encodeURIComponent(product.id)}`;

  const navigateToProduct = useCallback(() => router.push(href), [router, href]);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={navigateToProduct}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigateToProduct(); }
      }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      {/* ── Image area ── */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#eeeae3]">

        {!imageFailed ? (
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-[1.035]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center">
            <p className="font-display text-3xl text-primary">Tailorobe</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Image unavailable
            </p>
          </div>
        )}

        {/* Category badge — top left, pointer-events-none so zoom overlay handles clicks */}
        <div className="pointer-events-none absolute left-4 top-4 z-20">
          <span className="rounded-full bg-primary/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white shadow-sm">
            {product.category}
          </span>
        </div>

        {/* Heart button — top right, above zoom overlay */}
        <div className="absolute right-3 top-3 z-20">
          <HeartButton
            productId={product.id}
            liked={liked}
            onToggle={(id) => onToggle(id, product.title)}
          />
        </div>

        {/* Transparent zoom overlay — z-10 so heart (z-20) stays clickable */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onZoom(product); }}
          aria-label={`View larger image of ${product.title}`}
          className="absolute inset-0 z-10 cursor-zoom-in"
        />

        {!imageFailed && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-center justify-center bg-gradient-to-t from-black/70 via-black/20 to-transparent px-4 pb-4 pt-16 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/35 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md">
              <span aria-hidden="true">⌕</span>
              View image
            </span>
          </div>
        )}
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {product.id}
          </p>
          <span className="text-xs font-semibold text-primary">Made to order</span>
        </div>

        <h2 className="font-display text-xl leading-snug text-primary">{product.title}</h2>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-auto pt-6">
          <div className="mb-5 rounded-xl border border-primary/10 bg-primary/[0.04] px-4 py-3">
            <p className="text-sm font-semibold text-primary">Custom quotation</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Starting at ${startingPrice.toFixed(2)}
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Final details depend on your fabric, fit, measurements and personal design choices.
            </p>
          </div>

          <Link
            href={bookingHref}
            onClick={(e) => e.stopPropagation()}
            className="flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Book a Fitting
          </Link>
        </div>
      </div>
    </article>
  );
}

// ─── Image Viewer ─────────────────────────────────────────────────────────────

function ImageViewer({ product, onClose }: { product: Product; onClose: () => void }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ pointerX: 0, pointerY: 0, imageX: 0, imageY: 0 });

  const [zoom, setZoom]         = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const zoomRef = useRef(zoom);
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);

  const resetView = useCallback(() => {
    setZoom(1); setPosition({ x: 0, y: 0 }); setIsDragging(false);
  }, []);

  const changeZoom = useCallback((nextZoom: number) => {
    const limited = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoom));
    setZoom(limited);
    if (limited === MIN_ZOOM) setPosition({ x: 0, y: 0 });
  }, []);

  const zoomIn  = useCallback(() => changeZoom(zoomRef.current + ZOOM_STEP), [changeZoom]);
  const zoomOut = useCallback(() => changeZoom(zoomRef.current - ZOOM_STEP), [changeZoom]);

  useEffect(() => { resetView(); }, [product.id, resetView]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "+" || e.key === "=") { e.preventDefault(); setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP)); return; }
      if (e.key === "-") {
        e.preventDefault();
        setZoom((z) => { const n = Math.max(MIN_ZOOM, z - ZOOM_STEP); if (n === MIN_ZOOM) setPosition({ x: 0, y: 0 }); return n; });
        return;
      }
      if (e.key === "0") { e.preventDefault(); resetView(); }
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [onClose, resetView]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      changeZoom(zoomRef.current + (e.deltaY > 0 ? -1 : 1) * ZOOM_STEP);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [changeZoom]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (zoom <= MIN_ZOOM) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartRef.current = { pointerX: e.clientX, pointerY: e.clientY, imageX: position.x, imageY: position.y };
    setIsDragging(true);
  };
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || zoom <= MIN_ZOOM) return;
    setPosition({
      x: dragStartRef.current.imageX + (e.clientX - dragStartRef.current.pointerX),
      y: dragStartRef.current.imageY + (e.clientY - dragStartRef.current.pointerY),
    });
  };
  const stopDragging = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
  };

  return (
    <div role="dialog" aria-modal="true" aria-label={`Large image of ${product.title}`}
      className="fixed inset-0 z-[100] bg-black/80 p-0 backdrop-blur-md sm:p-5"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="relative mx-auto flex h-full w-full max-w-7xl flex-col overflow-hidden bg-[#101010] shadow-2xl sm:rounded-3xl sm:border sm:border-white/10">

        <div className="absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-4 bg-gradient-to-b from-black/85 via-black/45 to-transparent px-4 pb-10 pt-4 sm:px-6 sm:pt-5">
          <div className="min-w-0 pr-4">
            <p className="truncate text-sm font-semibold text-white sm:text-base">{product.title}</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
              {product.id} · {product.category}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close image viewer"
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/35 text-2xl leading-none text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-white/15 active:scale-95">
            ×
          </button>
        </div>

        <div ref={viewportRef}
          onDoubleClick={() => zoom === MIN_ZOOM ? changeZoom(2) : resetView()}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          className={[
            "relative flex flex-1 touch-none select-none items-center justify-center overflow-hidden",
            "bg-[radial-gradient(circle_at_center,_#262626_0%,_#111_60%,_#090909_100%)]",
            zoom > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in",
          ].join(" ")}>
          <img src={product.image} alt={product.title} draggable={false}
            style={{
              transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${zoom})`,
              transformOrigin: "center",
              transition: isDragging ? "none" : "transform 150ms ease-out",
            }}
            className="max-h-[80vh] max-w-full object-contain sm:max-h-[84vh]" />
          <p className="pointer-events-none absolute bottom-20 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-center text-[11px] font-medium text-white/70 backdrop-blur-md sm:hidden">
            Double-tap or pinch to zoom · Drag to pan
          </p>
          <p className="pointer-events-none absolute bottom-20 left-1/2 hidden -translate-x-1/2 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-center text-[11px] font-medium text-white/70 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 sm:block">
            Scroll to zoom · Drag to pan
          </p>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-30 flex justify-center px-3 pb-4 sm:pb-5">
          <div className="flex items-center gap-1 rounded-full border border-white/15 bg-black/60 p-1.5 shadow-2xl backdrop-blur-xl">
            <button type="button" onClick={zoomOut} disabled={zoom <= MIN_ZOOM} aria-label="Zoom out"
              className="flex h-11 w-11 items-center justify-center rounded-full text-xl font-medium text-white transition hover:bg-white/15 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30">−</button>
            <button type="button" onClick={resetView} aria-label="Reset zoom"
              className="min-w-[78px] rounded-full px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15 active:scale-95">
              {Math.round(zoom * 100)}%
            </button>
            <button type="button" onClick={zoomIn} disabled={zoom >= MAX_ZOOM} aria-label="Zoom in"
              className="flex h-11 w-11 items-center justify-center rounded-full text-xl font-medium text-white transition hover:bg-white/15 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30">+</button>
            <div className="mx-1 h-6 w-px bg-white/15" aria-hidden="true" />
            <button type="button" onClick={() => zoom === MIN_ZOOM ? changeZoom(2) : resetView()}
              className="rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/15 active:scale-95">
              {zoom === MIN_ZOOM ? "Zoom" : "Reset"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductCatalogue() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort]   = useState<SortOption>("featured");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { isLiked, toggle, likedCount } = useLikedProducts();

  const counts = useMemo(() => {
    const result: Record<FilterCategory, number> = { All: PRODUCTS.length, Suits: 0, Footwear: 0, Waistcoats: 0 };
    for (const p of PRODUCTS) result[p.category] += 1;
    return result;
  }, []);

  const filteredProducts = useMemo(() => {
    const search = query.trim().toLowerCase();
    const result = PRODUCTS.filter((p) => {
      const catMatch = activeCategory === "All" || p.category === activeCategory;
      const srcMatch = search.length === 0 ||
        p.title.toLowerCase().includes(search) ||
        p.id.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search);
      return catMatch && srcMatch;
    });
    return sort === "name" ? [...result].sort((a, b) => a.title.localeCompare(b.title)) : result;
  }, [activeCategory, query, sort]);

  return (
    <main className="w-full">
      {/* Hero */}
      <section className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-primary px-4 py-16 text-center">
        <div className="relative z-10 max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#d6b76a] sm:text-sm">
            The Tailorobe Collection
          </p>
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl md:text-6xl">Products</h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
            Explore bespoke suits, statement formalwear and handcrafted footwear. Click any product image to view it in detail.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-0 z-20 border-b border-border bg-background/95 py-5 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {CATEGORIES.map((category) => (
              <button key={category} type="button" onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
                className={[
                  "rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  activeCategory === category
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-card text-foreground hover:border-primary",
                ].join(" ")}>
                {category} <span className="opacity-60">({counts[category]})</span>
              </button>
            ))}
            {likedCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
                ❤️ {likedCount} saved
              </span>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
            <label className="sr-only" htmlFor="product-search">Search products</label>
            <input id="product-search" type="search" value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by product name or code…"
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" />
            <label className="sr-only" htmlFor="product-sort">Sort products</label>
            <select id="product-sort" value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15">
              <option value="featured">Featured</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-7">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            Showing <strong className="text-foreground">{filteredProducts.length}</strong>{" "}
            {filteredProducts.length === 1 ? "design" : "designs"}
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card px-6 py-20 text-center">
            <h2 className="font-display text-2xl text-primary">No designs found</h2>
            <p className="mt-2 text-sm text-muted-foreground">Try a different search term or select another category.</p>
            <button type="button" onClick={() => { setQuery(""); setActiveCategory("All"); }}
              className="mt-6 rounded-full border border-primary px-5 py-2.5 text-xs font-bold uppercase tracking-[0.15em] text-primary transition hover:bg-primary hover:text-white">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onZoom={setSelectedProduct}
                liked={isLiked(product.id)}
                onToggle={toggle}
              />
            ))}
          </div>
        )}

        <div className="mx-auto mt-16 max-w-2xl rounded-2xl border border-border bg-card px-6 py-10 text-center shadow-sm sm:px-10">
          <h2 className="font-display text-3xl text-primary">Looking for something unique?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Book a fitting and discuss your preferred fabric, fit, detailing and occasion with Tailorobe.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/builder"
              className="rounded-full border border-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] text-primary transition hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
              Suit Builder
            </Link>
            <Link href="/booking"
              className="rounded-full bg-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
              Book a Fitting
            </Link>
          </div>
        </div>
      </section>

      {selectedProduct && (
        <ImageViewer product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </main>
  );
}
