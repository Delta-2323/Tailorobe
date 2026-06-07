"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Scissors, Ruler, Sparkles, ArrowRight } from "lucide-react";

const PREVIEW_IMAGES = [
  "gallery-01.jpg",
  "gallery-04.jpg",
  "gallery-06.jpg",
  "gallery-07.jpg",
  "gallery-08.jpg",
  "gallery-09.jpg",
  "gallery-10.jpg",
  "gallery-11.jpg",
];

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=2000&auto=format&fit=crop"
            alt="Bespoke Tailoring"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            The Art of <br />
            <span className="text-gold-gradient italic">Perfect Proportion</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light"
          >
            Bespoke tailoring in the heart of Adelaide. Experience garments crafted with meticulous precision for your unique silhouette.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/builder">
              <Button size="lg" variant="accent" className="w-full sm:w-auto font-semibold uppercase tracking-wider">
                Create Your Suit
              </Button>
            </Link>
            <Link href="/booking">
              <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 font-semibold uppercase tracking-wider">
                Book a Fitting
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl text-primary mb-4">The Tailorobe Difference</h2>
            <div className="w-24 h-1 bg-accent mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              whileHover={{ y: -10 }}
              className="text-center p-8 bg-card rounded-2xl shadow-xl shadow-primary/5 border border-border/50"
            >
              <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                <Scissors size={32} />
              </div>
              <h3 className="font-display text-2xl mb-4">Master Craftsmanship</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every stitch is placed with intention by our master tailors. We combine traditional techniques with modern aesthetics.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="text-center p-8 bg-primary rounded-2xl shadow-xl shadow-primary/20 text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles size={120} />
              </div>
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-accent relative z-10">
                <Ruler size={32} />
              </div>
              <h3 className="font-display text-2xl mb-4 relative z-10">True Bespoke Fit</h3>
              <p className="text-white/80 leading-relaxed relative z-10">
                Over 30 precise measurements are taken to construct a pattern that is uniquely yours, guaranteeing a flawless silhouette.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="text-center p-8 bg-card rounded-2xl shadow-xl shadow-primary/5 border border-border/50"
            >
              <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                <Sparkles size={32} />
              </div>
              <h3 className="font-display text-2xl mb-4">Infinite Personalization</h3>
              <p className="text-muted-foreground leading-relaxed">
                From premium Italian fabrics to monogramming and custom linings, every detail is selected by you.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-accent text-sm font-semibold uppercase tracking-[0.25em] mb-3">Our Work</p>
            <h2 className="font-display text-4xl text-primary mb-4">From the Store</h2>
            <div className="w-24 h-1 bg-accent mx-auto" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {PREVIEW_IMAGES.map((filename, idx) => (
              <motion.div
                key={filename}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group relative overflow-hidden rounded-xl aspect-square bg-muted border border-border/30 shadow-sm"
              >
                <Link href="/gallery">
                  <img
                    src={`/gallery/${filename}`}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition-colors duration-300" />
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/gallery">
              <Button size="lg" className="group font-semibold uppercase tracking-wider">
                View Full Gallery
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Google Reviews */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-semibold uppercase tracking-[0.25em] mb-3">Client Experiences</p>
            <h2 className="font-display text-4xl md:text-5xl text-white mb-6">Trusted by Gentlemen Across Adelaide</h2>
            <div className="w-24 h-1 bg-accent mx-auto mt-6" />
          </div>
          <div className="relative w-full min-h-[400px] rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-4">
            <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-accent/20 to-transparent" />
            <div className="relative z-10 w-full h-full">
              <div className="elfsight-app-6de8529b-2822-41b5-935f-cf2712163f6e" data-elfsight-app-lazy />
            </div>
          </div>
        </div>
      </section>

      {/* Suit Builder CTA */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <h2 className="font-display text-4xl text-primary mb-6">Design Your Masterpiece</h2>
            <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
              Use our interactive Suit Builder to customise every aspect of your garment. Select your fabric, cut, lapels, buttons, and finishing touches online before you even step foot in our store.
            </p>
            <ul className="space-y-4 mb-8">
              {["Over 500 premium fabrics", "Endless styling combinations", "Real-time design specifications"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground font-medium">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/builder">
              <Button size="lg" className="group">
                Start Designing
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </Button>
            </Link>
          </div>

          <div className="md:w-1/2 relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <img src="/gallery/design.jpg" alt="Elegant suit tailoring guide" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-card p-6 rounded-xl shadow-xl border border-border/50 max-w-xs hidden md:block">
              <p className="font-display text-xl text-primary italic">
                "The details are not the details. They make the design."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
