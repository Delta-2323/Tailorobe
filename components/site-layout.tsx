"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, MapPin, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

function IconInstagram({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4.5"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function IconFacebook({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

function IconTikTok({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
    </svg>
  );
}

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/builder", label: "Suit Builder" },
    { href: "/gallery", label: "Gallery" },
    { href: "/booking", label: "Book Fitting" },
    { href: "/contact", label: "Contact" },
  ];

  const payments = [
    { label: "Visa", bg: "#1A1F71", text: "#fff", icon: "VISA" },
    { label: "Mastercard", bg: "#252525", text: "#fff", icon: "MC" },
    { label: "Amex", bg: "#007BC1", text: "#fff", icon: "AMEX" },
    { label: "Afterpay", bg: "#B2FCE4", text: "#000", icon: "AP" },
    { label: "Apple Pay", bg: "#fff", text: "#000", icon: "⌘" },
    { label: "Bank Transfer", bg: "#2d4a3e", text: "#D4AF37", icon: "⇄" },
  ];

  return (
    <div className="min-h-screen flex flex-col selection:bg-accent selection:text-primary">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground text-xs py-2 px-4 hidden md:flex justify-between items-center z-50 relative">
        <div className="flex gap-6 max-w-7xl mx-auto w-full">
          <span className="flex items-center gap-2"><MapPin size={14} /> Shop 3/196 Marion Road, West Richmond, Adelaide SA 5033</span>
          <a href="tel:0414053773" className="flex items-center gap-2 hover:text-accent transition-colors"><Phone size={14} /> 0414 053 773</a>
          <a href="mailto:info@tailorobe.com.au" className="flex items-center gap-2 ml-auto hover:text-accent transition-colors"><Mail size={14} /> info@tailorobe.com.au</a>
        </div>
      </div>

      {/* Navigation */}
      <header className={cn(
        "sticky top-0 z-40 transition-all duration-300 w-full",
        isScrolled ? "glass-nav shadow-sm" : "bg-background/95 border-b border-transparent"
      )}>
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-32">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <span className="font-display text-2xl font-bold tracking-wider text-primary">TAILOROBE BESPOKE TAILORS</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium uppercase tracking-widest hover:text-accent transition-colors relative group",
                    pathname === link.href ? "text-accent" : "text-foreground"
                  )}
                >
                  {link.label}
                  <span className={cn(
                    "absolute -bottom-2 left-0 w-full h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left",
                    pathname === link.href && "scale-x-100"
                  )} />
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-background border-b shadow-lg py-4 px-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-lg font-display py-2 border-b border-border/50",
                  pathname === link.href ? "text-accent" : "text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <span className="font-display text-3xl font-bold tracking-wider text-white">TAILOROBE</span>
            </Link>
            <p className="text-primary-foreground/80 max-w-sm mb-6 leading-relaxed">
              Adelaide's premier destination for bespoke tailoring. Crafting elegant, made-to-measure garments that reflect your personal style and uncompromising standards.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/tailorobe" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram" className="w-10 h-10 rounded-full border border-primary-foreground/20 flex items-center justify-center text-primary-foreground/70 hover:text-accent hover:border-accent transition-colors">
                <IconInstagram size={18} />
              </a>
              <a href="https://www.facebook.com/tailorobe" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook" className="w-10 h-10 rounded-full border border-primary-foreground/20 flex items-center justify-center text-primary-foreground/70 hover:text-accent hover:border-accent transition-colors">
                <IconFacebook size={18} />
              </a>
              <a href="https://www.tiktok.com/@tailorobe" target="_blank" rel="noopener noreferrer" aria-label="Follow us on TikTok" className="w-10 h-10 rounded-full border border-primary-foreground/20 flex items-center justify-center text-primary-foreground/70 hover:text-accent hover:border-accent transition-colors">
                <IconTikTok size={18} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-display text-xl mb-6 text-accent">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/services" className="hover:text-accent transition-colors">Services</Link></li>
              <li><Link href="/builder" className="hover:text-accent transition-colors">Suit Builder</Link></li>
              <li><Link href="/booking" className="hover:text-accent transition-colors">Book a Fitting</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-xl mb-6 text-accent">Visit Our Store</h4>
            <ul className="space-y-3 text-primary-foreground/80">
              <li>Shop 3/196 Marion Road</li>
              <li>West Richmond, Adelaide SA 5033</li>
              <li className="pt-2"><a href="tel:0414053773" className="hover:text-accent transition-colors">0414 053 773</a></li>
              <li><a href="mailto:info@tailorobe.com.au" className="hover:text-accent transition-colors">info@tailorobe.com.au</a></li>
              <li className="pt-2">Mon – Fri: 12:00 PM – 7:00 PM</li>
              <li>Weekends: 10:00 AM – 5:00 PM</li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-primary-foreground/20">
          <p className="text-primary-foreground/50 text-xs uppercase tracking-widest mb-5 text-center">We Accept</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {payments.map((p) => (
              <div key={p.label} className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide shadow-sm" style={{ backgroundColor: p.bg, color: p.text }}>
                <span className="text-base font-bold">{p.icon}</span>
                <span>{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-primary-foreground/10 text-center text-primary-foreground/50 text-sm flex flex-col md:flex-row justify-between items-center gap-3">
          <p>© {new Date().getFullYear()} Tailorobe Bespoke. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/admin" className="opacity-0 select-none pointer-events-none text-[0px]" aria-hidden="true" tabIndex={-1}>Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
