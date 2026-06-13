"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Clock } from "lucide-react";

export default function About() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative h-64 bg-primary flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1800&auto=format&fit=crop"
            alt="About us hero"
            className="w-full h-full object-cover object-top opacity-30"
          />
        </div>
        <h1 className="relative z-10 font-display text-3xl sm:text-5xl text-white font-bold text-center px-4">About Us</h1>
      </section>

      {/* Our Story */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display text-4xl text-primary mb-6">Our Story</h2>
            <div className="w-16 h-1 bg-accent mb-8" />
            <p className="text-muted-foreground leading-relaxed mb-6">
              Tailorobe was founded on the belief that our customers don't need to spend a fortune on a custom wardrobe. Tailorobe is the first Indo-pacific men's clothing brands which is currently based in Adelaide with a vision to be present all-around Australia.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              By taking the premium made-to-measure experience direct to customer, we've created a superior alternative to off-the rack clothing, at ready-to-wear prices. In addition to being constructed from imported superior fabrics, Tailorobe clothing is built with top quality components and thoughts construction.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Customers step into the shoes of a designer to create his own wardrobe of custom suits, shirts, chinos, blazers and overcoats. They select from more than 500 varieties in material, colours and designs endless personalisation options, including lapels, pockets, buttons, linings and monograms.
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl overflow-hidden shadow-2xl aspect-[3/4]"
          >
            <img
              src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=1200&auto=format&fit=crop"
              alt="Suits displayed on shelves in our store"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Founder Section */}
<section className="py-24 bg-background">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">

    {/* Image */}
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="rounded-2xl overflow-hidden shadow-2xl aspect-[3/4]"
    >
      <img
        src="/gallery/girish.jpeg"
        alt="Founder of Tailorobe"
        className="w-full h-full object-cover"
      />
    </motion.div>

    {/* Content */}
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h2 className="font-display text-4xl text-primary mb-6">Meet the Founder</h2>
      <div className="w-16 h-1 bg-accent mb-8" />

      <p className="text-muted-foreground leading-relaxed mb-6">
        Tailorobe was founded by Girish Khanna, a passionate entrepreneur with a deep love for fashion and a strong eye for detail. 
       </p>
        <p className="text-muted-foreground leading-relaxed mb-6">
        At just 26, he identified a gap in the market where men struggled to find well-fitted, high-quality clothing without paying 
        premium prices. With a background in the corporate sector and a strong understanding of customer needs, he set out to create a 
        brand that delivers a made-to-measure experience at ready-to-wear prices.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-6">
        Under his leadership, Tailorobe has grown into a trusted name in Adelaide’s fashion scene, known for its personalized service, 
        extensive customization options, and commitment to craftsmanship. His vision is to expand Tailorobe across Australia, helping more men experience the confidence of wearing perfectly tailored clothing.
      </p>

      <div className="bg-card border border-border rounded-xl p-6">
        <p className="text-sm text-muted-foreground mb-2">Founder</p>
        <p className="text-xl font-display text-primary">Tailorobe Bespoke</p>
        <p className="text-sm text-muted-foreground mt-2">
          Adelaide, South Australia
        </p>
      </div>
    </motion.div>
  </div>
</section>

      {/* Values */}
      <section className="py-24 bg-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl text-primary mb-4">Our Values</h2>
            <div className="w-24 h-1 bg-accent mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Craftsmanship", desc: "We uphold the highest standards of tailoring, ensuring each garment is constructed to last and impress for a lifetime." },
              { title: "Integrity", desc: "From your first consultation to your final fitting, we provide honest advice and transparent service at every step." },
              { title: "Personalisation", desc: "No two clients are the same. We take the time to understand your lifestyle, preferences, and vision before crafting your garment." },
            ].map((v, i) => (
              <div key={i} className="bg-card p-8 rounded-xl border border-border shadow-sm">
                <div className="w-12 h-1 bg-accent mb-6" />
                <h3 className="font-display text-2xl text-primary mb-4">{v.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Store Address & Map */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl text-primary mb-4">Find Our Store</h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-8" />
            <div className="flex flex-wrap justify-center gap-10 text-muted-foreground">
              <div className="flex items-start gap-3">
                <MapPin className="text-accent mt-0.5 flex-shrink-0" size={20} />
                <div className="text-left">
                  <p className="font-semibold text-foreground mb-1">Address</p>
                  <p>Shop 3/196 Marion Road</p>
                  <p>West Richmond, Adelaide SA 5033</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="text-accent mt-0.5 flex-shrink-0" size={20} />
                <div className="text-left">
                  <p className="font-semibold text-foreground mb-1">Phone</p>
                  <a href="tel:0414053773" className="hover:text-accent transition-colors">0414 053 773</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="text-accent mt-0.5 flex-shrink-0" size={20} />
                <div className="text-left">
                  <p className="font-semibold text-foreground mb-1">Opening Hours</p>
                  <p>Mon – Fri: 12:00 PM – 7:00 PM</p>
                  <p>Weekends: 10:00 AM – 5:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-xl border border-border" style={{ height: 420 }}>
            <iframe
              title="Tailorobe Bespoke Tailors Location"
              src="https://maps.google.com/maps?q=-34.9332,138.5740&z=16&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
            />
          </div>
          <div className="flex justify-center mt-4 gap-6">
            <a href="https://maps.google.com/?q=196+Marion+Road,+West+Richmond+SA+5033,+Australia" target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline underline-offset-4 font-medium">
              Open in Google Maps →
            </a>
            <a href="https://maps.apple.com/?q=196+Marion+Road+West+Richmond+Adelaide+SA+5033" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-accent transition-colors hover:underline underline-offset-4 font-medium">
              Open in Apple Maps →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
