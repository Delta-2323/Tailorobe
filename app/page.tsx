"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import { Scissors, Ruler, Sparkles, ArrowRight } from "lucide-react";
import Script from "next/script";

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

function ScrollMorphHero() {
  const { scrollY } = useScroll();

  const scrollYProgress = useTransform(scrollY, [0, 700], [0, 1], {
    clamp: true,
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.4,
  });

  const imageScale = useTransform(smoothProgress, [0, 1], [1.08, 1.28]);
  const imageSkew = useTransform(smoothProgress, [0, 1], [0, -2]);
  const imageY = useTransform(smoothProgress, [0, 1], ["0%", "12%"]);
  const imageSaturate = useTransform(smoothProgress, [0, 1], [0.55, 1.1]);
  const imageBrightness = useTransform(smoothProgress, [0, 1], [0.72, 1]);

  const imageFilter = useTransform(
    [imageSaturate, imageBrightness] as [
      MotionValue<number>,
      MotionValue<number>
    ],
    ([s, b]) => `saturate(${s}) brightness(${b})`
  );

  const overlayOpacity = useTransform(
    smoothProgress,
    [0, 0.6, 1],
    [0.55, 0.35, 0.08]
  );

  const headlineY = useTransform(smoothProgress, [0, 1], ["0%", "-28%"]);
  const headlineOpacity = useTransform(smoothProgress, [0, 0.85], [1, 0]);

  const tapeWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  const tapeRotate = useTransform(smoothProgress, [0, 1], [0, 1.2]);

  return (
    <section className="relative min-h-[620px] h-[88svh] sm:h-[85vh] flex items-center justify-center overflow-hidden px-4">
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          scale: imageScale,
          skewY: imageSkew,
          y: imageY,
          filter: imageFilter,
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=2000&auto=format&fit=crop"
          alt="Bespoke Tailoring"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-primary/95 via-primary/75 to-primary/45 mix-blend-multiply" />
      </motion.div>

      <motion.div
        className="absolute inset-0 bg-black/30 z-[1] pointer-events-none"
        style={{ opacity: overlayOpacity }}
      />

      <motion.div
        className="hidden sm:block absolute left-0 top-1/2 z-[2] h-[2px] bg-accent/70 origin-left pointer-events-none"
        style={{ width: tapeWidth, rotate: tapeRotate }}
      />

      <motion.div
        className="relative z-10 text-center max-w-4xl mx-auto pt-20 sm:pt-16"
        style={{ y: headlineY, opacity: headlineOpacity }}
      >
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-accent text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] mb-4"
        >
          Bespoke Tailoring Adelaide
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-display text-4xl min-[380px]:text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-5 sm:mb-6 leading-[1.05]"
        >
          The Art of <br />
          <span className="text-gold-gradient italic">
            Perfect Proportion
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-10 max-w-2xl mx-auto font-light leading-relaxed"
        >
          Bespoke tailoring in the heart of Adelaide. Experience garments
          crafted with meticulous precision for your unique silhouette.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto"
        >
          <Link href="/builder" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="accent"
              className="w-full sm:w-auto font-semibold uppercase tracking-wider"
            >
              Create Your Suit
            </Button>
          </Link>

          <Link href="/booking" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 font-semibold uppercase tracking-wider"
            >
              Book a Fitting
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/70"
        style={{ opacity: headlineOpacity }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-white/50"
        />
      </motion.div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="relative w-full overflow-x-hidden">
      <ScrollMorphHero />

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-accent text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] mb-3">
              Why Tailorobe
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-primary mb-4">
              The Tailorobe Difference
            </h2>
            <div className="w-20 sm:w-24 h-1 bg-accent mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-12">
            <motion.div
              whileHover={{ y: -8 }}
              className="text-center p-6 sm:p-8 bg-card rounded-2xl shadow-xl shadow-primary/5 border border-border/50"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 text-primary">
                <Scissors size={30} />
              </div>
              <h3 className="font-display text-xl sm:text-2xl mb-3 sm:mb-4">
                Master Craftsmanship
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Every stitch is placed with intention by our master tailors. We
                combine traditional techniques with modern aesthetics.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -8 }}
              className="text-center p-6 sm:p-8 bg-primary rounded-2xl shadow-xl shadow-primary/20 text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles size={110} />
              </div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 text-accent relative z-10">
                <Ruler size={30} />
              </div>
              <h3 className="font-display text-xl sm:text-2xl mb-3 sm:mb-4 relative z-10">
                True Bespoke Fit
              </h3>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed relative z-10">
                Over 30 precise measurements are taken to construct a pattern
                that is uniquely yours, guaranteeing a flawless silhouette.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -8 }}
              className="text-center p-6 sm:p-8 bg-card rounded-2xl shadow-xl shadow-primary/5 border border-border/50"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 text-primary">
                <Sparkles size={30} />
              </div>
              <h3 className="font-display text-xl sm:text-2xl mb-3 sm:mb-4">
                Infinite Personalization
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                From premium Italian fabrics to monogramming and custom linings,
                every detail is selected by you.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-16 sm:py-20 lg:py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-accent text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] mb-3">
              Our Work
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-primary mb-4">
              From the Store
            </h2>
            <div className="w-20 sm:w-24 h-1 bg-accent mx-auto" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {PREVIEW_IMAGES.map((filename, idx) => (
              <motion.div
                key={filename}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className="group relative overflow-hidden rounded-xl sm:rounded-2xl aspect-square bg-muted border border-border/30 shadow-sm"
              >
                <Link href="/gallery">
                  <img
                    src={`/gallery/${filename}`}
                    alt="Tailorobe gallery preview"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition-colors duration-300" />
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 sm:mt-10 text-center">
            <Link href="/gallery">
              <Button
                size="lg"
                className="group w-full sm:w-auto font-semibold uppercase tracking-wider"
              >
                View Full Gallery
                <ArrowRight
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                  size={18}
                />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Google Reviews */}
      <section className="py-16 sm:py-20 lg:py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <p className="text-accent text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] mb-3">
              Client Experiences
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white mb-5 sm:mb-6 leading-tight">
              Trusted by Gentlemen Across Adelaide
            </h2>
            <div className="w-20 sm:w-24 h-1 bg-accent mx-auto mt-5 sm:mt-6" />
          </div>

          <div className="relative w-full min-h-[280px] sm:min-h-[360px] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-2.5 sm:p-4">
            <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-accent/20 to-transparent" />

            <div className="relative z-10 w-full h-full">
              <div className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 bg-white shadow-2xl p-2 sm:p-4">
                <div
                  className="w-full max-w-full overflow-hidden [&_iframe]:!w-full [&_iframe]:!max-w-full"
                  data-google-widget=""
                  data-embed-id="6faadd15b11d336c"
                />

                <Script
                  id="socialmediafeeds-google-widget"
                  src="https://socialmediafeeds.com/embed/widget.js"
                  strategy="afterInteractive"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Suit Builder CTA */}
      <section className="py-16 sm:py-20 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-10 sm:gap-14 lg:gap-16">
          <div className="w-full md:w-1/2 text-center md:text-left">
            <p className="text-accent text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] mb-3">
              Suit Builder
            </p>

            <h2 className="font-display text-3xl sm:text-4xl text-primary mb-5 sm:mb-6">
              Design Your Masterpiece
            </h2>

            <p className="text-base sm:text-lg text-foreground/80 mb-6 sm:mb-8 leading-relaxed">
              Use our interactive Suit Builder to customise every aspect of your
              garment. Select your fabric, cut, lapels, buttons, and finishing
              touches online before you even step foot in our store.
            </p>

            <ul className="space-y-3 sm:space-y-4 mb-7 sm:mb-8 max-w-md mx-auto md:mx-0">
              {[
                "Over 500 premium fabrics",
                "Endless styling combinations",
                "Real-time design specifications",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-left text-sm sm:text-base text-foreground font-medium"
                >
                  <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <Link href="/builder">
              <Button size="lg" className="group w-full sm:w-auto">
                Start Designing
                <ArrowRight
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                  size={18}
                />
              </Button>
            </Link>
          </div>

          <div className="w-full md:w-1/2 relative">
            <div className="aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/gallery/design.jpg"
                alt="Elegant suit tailoring guide"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-5 md:mt-0 md:absolute md:-bottom-8 md:-left-8 bg-card p-5 sm:p-6 rounded-xl shadow-xl border border-border/50 max-w-sm mx-auto md:mx-0">
              <p className="font-display text-lg sm:text-xl text-primary italic">
                "The details are not the details. They make the design."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}