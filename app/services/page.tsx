"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const services = [
  {
    id: "bespoke-suits",
    title: "Bespoke Suits",
    badge: "Packages Available",
    description: "Our signature offering. Every suit begins with a full consultation, comprehensive body measurements, and a pattern drafted entirely from scratch for your unique proportions.",
    details: ["Full consultation session", "30+ precise measurements", "Hand-stitched detailing", "3 fitting sessions included", "Premium Italian & Australian fabrics"],
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "dress-shirts",
    title: "Made-to-Measure Shirts",
    badge: "Packages Available",
    description: "A perfectly fitted shirt is the foundation of any great wardrobe. Choose from our extensive collection of fine cottons, linens, and silks.",
    details: ["Collar, cuff & placket options", "Monogramming available", "Choice of lining fabrics", "2 week turnaround"],
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "indian-traditional",
    title: "Indian Traditional Attire",
    badge: "Packages Available",
    description: "Celebrate culture and elegance with our exquisite range of Indian traditional garments. From resplendent sherwanis for grand occasions to refined kurta pajamas and contemporary Indo-Western fusion pieces, each garment is crafted with the finest embroideries and fabrics.",
    details: ["Sherwani & Achkan", "Kurta Pajama & Pathani sets", "Indo-Western fusion designs", "Custom embroidery & zari work", "Premium silk, brocade & georgette fabrics"],
    image: "https://i.pinimg.com/236x/7b/1c/da/7b1cdaba40acdcd7c8246d3625a16fc2.jpg",
  },
  {
    id: "handcrafted-footwear",
    title: "Handcrafted Footwear",
    badge: "Packages Available",
    description: "Complete your bespoke ensemble with our hand-crafted footwear collection. Each pair is constructed by skilled cobblers using the finest leathers, ensuring exceptional comfort and enduring elegance.",
    details: ["Oxfords, Derby & Loafers", "Premium full-grain leather", "Custom last & sole options", "Personalised monogram embossing", "6–8 week crafting time"],
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "alterations",
    title: "Expert Alterations",
    badge: "Walk-Ins Welcome",
    description: "Breathe new life into your existing wardrobe. Our tailors can alter, restyle, and restore garments to bring them up to a perfect standard — no matter the brand or origin.",
    details: ["Jacket re-lining", "Trouser tapering", "Sleeve adjustment", "Garment restoration", "Same-week turnaround available"],
    image: "https://images.airtasker.com/v7/https://airtasker-seo-assets-prod.s3.amazonaws.com/en_AU/1633948974445_alterations.jpg?gravity=smart&w=1600&h=1200",
  },
];

export default function Services() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative h-64 bg-primary flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
        </div>
        <h1 className="relative z-10 font-display text-3xl sm:text-5xl text-white font-bold text-center px-4">Our Services</h1>
      </section>

      {/* Services List */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-12 items-center`}
            >
              <div className="md:w-1/2 rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
                <img src={service.image} alt={service.title} className="w-full h-full object-contain object-top bg-black/5 p-4 hover:scale-105 transition-transform duration-900" loading="lazy" />
              </div>
              <div className="md:w-1/2">
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-accent/20 border border-accent/40 px-3 py-1 rounded-full mb-4">
                  {service.badge}
                </span>
                <h2 className="font-display text-2xl sm:text-4xl text-primary mt-1 mb-4">{service.title}</h2>
                <div className="w-12 h-1 bg-accent mb-6" />
                <p className="text-muted-foreground mb-8 leading-relaxed text-lg">{service.description}</p>
                <ul className="space-y-3 mb-8">
                  {service.details.map((d, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                      <span className="text-foreground">{d}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/booking">
                  <Button className="uppercase tracking-wider">Book a Consultation</Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-display text-3xl sm:text-4xl text-white mb-6">Ready to Start Your Journey?</h2>
          <p className="text-white/80 mb-8 text-lg">Book a complimentary consultation at our Adelaide store or via a remote appointment.</p>
          <Link href="/booking">
            <Button size="lg" variant="accent" className="uppercase tracking-wider">Schedule Your Fitting</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
