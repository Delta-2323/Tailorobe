"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { insertContact } from "@/lib/db";

export default function Contact() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast({ title: "Missing Fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      // 1. Save to database
      await insertContact({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        subject: form.subject,
        message: form.message,
      });

      // 2. Send emails — notify store + auto-reply to customer
      fetch("/api/send-contact-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          subject: form.subject,
          message: form.message,
        }),
      }).catch((err) => console.warn("Email notification failed (non-blocking):", err));

      toast({ title: "Message Sent", description: "Thank you for reaching out. We will be in touch within 24 hours." });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <section className="relative h-64 bg-primary flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1800&auto=format&fit=crop" alt="Contact hero" className="w-full h-full object-cover opacity-25" />
        </div>
        <h1 className="relative z-10 font-display text-3xl sm:text-5xl text-white font-bold text-center px-4">Contact Us</h1>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="font-display text-3xl text-primary mb-8">Get In Touch</h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary"><MapPin size={20} /></div>
                <div>
                  <h4 className="font-semibold mb-1">Visit Our Store</h4>
                  <p className="text-muted-foreground">Shop 3/196 Marion Road<br />West Richmond, Adelaide SA 5033</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary"><Phone size={20} /></div>
                <div>
                  <h4 className="font-semibold mb-1">Call Us</h4>
                  <a href="tel:0414053773" className="text-muted-foreground hover:text-accent transition-colors">0414 053 773</a>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary"><Mail size={20} /></div>
                <div>
                  <h4 className="font-semibold mb-1">Email Us</h4>
                  <a href="mailto:info@tailorobe.com.au" className="text-muted-foreground hover:text-accent transition-colors">info@tailorobe.com.au</a>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary"><Clock size={20} /></div>
                <div>
                  <h4 className="font-semibold mb-1">Opening Hours</h4>
                  <p className="text-muted-foreground">Monday – Friday: 12:00 PM – 7:00 PM<br />Weekends: 10:00 AM – 5:00 PM</p>
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-2xl overflow-hidden shadow-lg border border-border h-64">
              <iframe title="Tailorobe Bespoke Tailors Location" src="https://maps.google.com/maps?q=-34.9332,138.5740&z=16&output=embed" width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen />
            </div>
            <p className="mt-2 text-xs text-muted-foreground text-right">
              <a href="https://maps.google.com/?q=196+Marion+Road,+West+Richmond+SA+5033,+Australia" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors underline underline-offset-4">Open in Google Maps →</a>
            </p>
          </div>

          <div className="bg-card rounded-2xl p-5 sm:p-8 border border-border shadow-sm">
            <h3 className="font-display text-2xl text-primary mb-6">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Smith" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="mt-2" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0400 000 000" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input id="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Bespoke suit enquiry" className="mt-2" />
                </div>
              </div>
              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea id="message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your tailoring needs..." className="mt-2" />
              </div>
              <Button type="submit" className="w-full uppercase tracking-wider" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
