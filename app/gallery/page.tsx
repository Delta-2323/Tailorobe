"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

const CUSTOMER_IMAGES = [
  "gallery-09.jpg",
  "gallery-146.jpeg",
  "gallery-01.jpg",
  "gallery-33.jpeg",
  "gallery-154.jpeg",
  "gallery-17.jpg",
  "gallery-42.jpeg",
  "gallery-06.jpg",
  "gallery-160.jpeg",
  "gallery-55.jpeg",
  "gallery-24.jpeg",
  "gallery-11.jpg",
  "gallery-163.jpeg",
  "gallery-63.jpeg",
  "gallery-38.jpeg",
  "gallery-14.jpg",
  "gallery-150.jpeg",
  "gallery-50.jpeg",
  "gallery-20.jpeg",
  "gallery-04.jpg",
  "gallery-157.jpeg",
  "gallery-46.jpeg",
  "gallery-29.jpeg",
  "gallery-18.jpg",
  "gallery-60.jpeg",
  "gallery-12.jpg",
  "gallery-165.jpeg",
  "gallery-35.jpeg",
  "gallery-08.jpg",
  "gallery-53.jpeg",
  "gallery-26.jpeg",
  "gallery-151.jpeg",
  "gallery-41.jpeg",
  "gallery-15.jpg",
  "gallery-31.jpeg",
  "gallery-22.jpeg",
  "gallery-67.jpeg",
  "gallery-147.jpeg",
  "gallery-10.jpg",
  "gallery-58.jpeg",
  "gallery-44.jpeg",
  "gallery-16.jpg",
  "gallery-155.jpeg",
  "gallery-39.jpeg",
  "gallery-27.jpeg",
  "gallery-62.jpeg",
  "gallery-13.jpg",
  "gallery-47.jpeg",
  "gallery-34.jpeg",
  "gallery-161.jpeg",
  "gallery-21.jpeg",
  "gallery-57.jpeg",
  "gallery-07.jpg",
  "gallery-30.jpeg",
  "gallery-149.jpeg",
  "gallery-52.jpeg",
  "gallery-25.jpeg",
  "gallery-64.jpeg",
  "gallery-40.jpeg",
  "gallery-19.jpeg",
  "gallery-158.jpeg",
  "gallery-48.jpeg",
  "gallery-23.jpeg",
  "gallery-61.jpeg",
  "gallery-36.jpeg",
  "gallery-153.jpeg",
  "gallery-54.jpeg",
  "gallery-28.jpeg",
  "gallery-43.jpeg",
  "gallery-65.jpeg",
  "gallery-32.jpeg",
  "gallery-164.jpeg",
  "gallery-49.jpeg",
  "gallery-37.jpeg",
  "gallery-56.jpeg",
  "gallery-45.jpeg",
  "gallery-152.jpeg",
  "gallery-66.jpeg",
  "gallery-51.jpeg",
  "gallery-59.jpeg",
  "gallery-148.jpeg",
  "gallery-156.jpeg",
  "gallery-159.jpeg",
  "gallery-162.jpeg"
];

const DESIGN_IMAGES: string[] = [
  "gallery-109.jpeg",
  "gallery-68.jpeg",
  "gallery-132.jpeg",
  "gallery-75.jpeg",
  "gallery-121.jpeg",
  "gallery-84.jpeg",
  "gallery-140.jpeg",
  "gallery-97.jpeg",
  "gallery-70.jpeg",
  "gallery-145.jpeg",
  "gallery-116.jpeg",
  "gallery-79.jpeg",
  "gallery-136.jpeg",
  "gallery-88.jpeg",
  "gallery-73.jpeg",
  "gallery-127.jpeg",
  "gallery-94.jpeg",
  "gallery-81.jpeg",
  "gallery-142.jpeg",
  "gallery-71.jpeg",
  "gallery-113.jpeg",
  "gallery-86.jpeg",
  "gallery-134.jpeg",
  "gallery-99.jpeg",
  "gallery-124.jpeg",
  "gallery-77.jpeg",
  "gallery-118.jpeg",
  "gallery-90.jpeg",
  "gallery-143.jpeg",
  "gallery-69.jpeg",
  "gallery-130.jpeg",
  "gallery-103.jpeg",
  "gallery-82.jpeg",
  "gallery-166.jpeg",
  "gallery-120.jpeg",
  "gallery-95.jpeg",
  "gallery-138.jpeg",
  "gallery-74.jpeg",
  "gallery-126.jpeg",
  "gallery-91.jpeg",
  "gallery-110.jpeg",
  "gallery-141.jpeg",
  "gallery-78.jpeg",
  "gallery-101.jpeg",
  "gallery-133.jpeg",
  "gallery-87.jpeg",
  "gallery-144.jpeg",
  "gallery-114.jpeg",
  "gallery-80.jpeg",
  "gallery-129.jpeg",
  "gallery-92.jpeg",
  "gallery-137.jpeg",
  "gallery-104.jpeg",
  "gallery-123.jpeg",
  "gallery-85.jpeg",
  "gallery-131.jpeg",
  "gallery-96.jpeg",
  "gallery-112.jpeg",
  "gallery-76.jpeg",
  "gallery-139.jpeg",
  "gallery-100.jpeg",
  "gallery-125.jpeg",
  "gallery-89.jpeg",
  "gallery-135.jpeg",
  "gallery-102.jpeg",
  "gallery-117.jpeg",
  "gallery-83.jpeg",
  "gallery-128.jpeg",
  "gallery-93.jpeg",
  "gallery-111.jpeg",
  "gallery-72.jpeg",
  "gallery-122.jpeg",
  "gallery-98.jpeg",
  "gallery-115.jpeg",
  "gallery-105.jpeg",
  "gallery-119.jpeg",
  "gallery-106.jpeg",
  "gallery-108.jpeg",
  "gallery-107.jpeg"
];

const customerPhotos = CUSTOMER_IMAGES.map((filename) => ({ src: `/gallery/${filename}`, alt: filename }));
const designPhotos = DESIGN_IMAGES.map((filename) => ({ src: `/gallery/${filename}`, alt: filename }));

export default function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [activeFolder, setActiveFolder] = useState<"customers" | "designs">("customers");
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});

  const photos = activeFolder === "customers" ? customerPhotos : designPhotos;

  const openLightbox = (idx: number) => setLightbox(idx);
  const closeLightbox = () => setLightbox(null);

  const prev = useCallback(() => {
    if (lightbox === null) return;
    setLightbox((lightbox - 1 + photos.length) % photos.length);
  }, [lightbox, photos.length]);

  const next = useCallback(() => {
    if (lightbox === null) return;
    setLightbox((lightbox + 1) % photos.length);
  }, [lightbox, photos.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, prev, next]);

  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  return (
    <div className="w-full">
      <section className="relative h-56 bg-primary overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: "url(/gallery/gallery-01.jpg)" }} />
        <div className="relative z-10 text-center px-4">
          <p className="text-accent/90 text-sm font-semibold uppercase tracking-[0.25em] mb-3">Our Work</p>
          <h1 className="font-display text-3xl sm:text-5xl text-white font-bold">Gallery</h1>
          <p className="text-white/75 mt-3 text-base">Real garments. Real clients. Real craftsmanship.</p>
        </div>
      </section>

      {/* Folder Buttons */}
      <section className="flex justify-center gap-4 py-8 flex-wrap">
        <button
          onClick={() => setActiveFolder("customers")}
          className={cn("px-6 py-3 rounded-xl text-sm font-semibold border transition-all", activeFolder === "customers" ? "bg-primary text-white border-primary" : "bg-card border-border hover:bg-muted")}
        >
          Customers
        </button>
        <button
          onClick={() => setActiveFolder("designs")}
          className={cn("px-6 py-3 rounded-xl text-sm font-semibold border transition-all", activeFolder === "designs" ? "bg-primary text-white border-primary" : "bg-card border-border hover:bg-muted")}
        >
          Designs
        </button>
      </section>

      <section className="bg-card border-b border-border py-6">
        <p className="text-center text-muted-foreground text-sm max-w-2xl mx-auto px-4">
          Every piece in our gallery was crafted by hand at our store in West Richmond, Adelaide. From heritage bespoke suits to vibrant Indian traditional attire and each garment tells a unique story.
        </p>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {photos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No images added yet.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-0">
            {photos.map((photo, idx) => (
              <motion.div
                key={photo.src}
                className="break-inside-avoid mb-4 group relative overflow-hidden rounded-2xl shadow-md cursor-pointer border border-border/30 bg-muted"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: loaded[idx] ? 1 : 0, y: loaded[idx] ? 0 : 20 }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
                onClick={() => openLightbox(idx)}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
                  onLoad={() => setLoaded((p) => ({ ...p, [idx]: true }))}
                  onError={() => setLoaded((p) => ({ ...p, [idx]: true }))}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
                  <div className="bg-accent/90 rounded-full p-1.5">
                    <ZoomIn size={14} className="text-primary" />
                  </div>
                </div>
                <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  {idx + 1} / {photos.length}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-14 text-center">
          <div className="inline-block bg-card border border-border rounded-2xl px-10 py-8 shadow-sm max-w-lg">
            <p className="font-display text-2xl text-primary mb-2">Like what you see?</p>
            <p className="text-muted-foreground text-sm mb-5">Every garment is crafted to your exact measurements. Come in for a consultation at our West Richmond store.</p>
            <a href="/booking" className="inline-block bg-primary text-white px-7 py-3 rounded-lg text-sm font-semibold uppercase tracking-widest hover:bg-primary/90 transition-colors">
              Book a Fitting
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && photos[lightbox] && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/92 backdrop-blur-sm" onClick={closeLightbox} />
            <div className="relative z-10 flex items-center gap-4 w-full max-w-5xl px-4">
              <button onClick={(e) => { e.stopPropagation(); prev(); }} className="flex-shrink-0 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/20">
                <ChevronLeft size={22} />
              </button>
              <motion.div key={lightbox} className="flex-1 flex flex-col items-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <div className="relative max-h-[80vh] flex items-center justify-center">
                  <img src={photos[lightbox].src} alt={photos[lightbox].alt} className="max-h-[82vh] max-w-full object-contain rounded-xl shadow-2xl" />
                </div>
                <p className="text-white/40 text-xs mt-3">{lightbox + 1} of {photos.length}</p>
              </motion.div>
              <button onClick={(e) => { e.stopPropagation(); next(); }} className="flex-shrink-0 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/20">
                <ChevronRight size={22} />
              </button>
            </div>
            <button onClick={closeLightbox} className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/20">
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
