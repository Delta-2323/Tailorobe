"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, CheckCircle, ArrowRight, Truck, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCart, MAX_QTY, type CartItem } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

type FulfillmentMethod = "delivery" | "pickup";

// ── Cart item row ─────────────────────────────────────────────────────────────

function CartRow({ item, onRemove, onQty }: {
  item: CartItem;
  onRemove: () => void;
  onQty: (q: number) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.28 }}
      className="flex gap-4 p-4 bg-card rounded-2xl border border-border shadow-sm"
    >
      {/* Image */}
      <div className="w-24 h-28 flex-shrink-0 rounded-xl overflow-hidden border border-border bg-muted">
        <img src={item.productImage} alt={item.productTitle} className="w-full h-full object-cover object-top" />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-display text-base font-semibold text-primary leading-snug line-clamp-2">
              {item.productTitle}
            </p>
            <div className="flex gap-2 mt-1.5 flex-wrap">
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{item.fit} Fit</span>
              <span className="text-xs bg-accent/20 text-primary px-2 py-0.5 rounded-full font-medium">Size {item.size}</span>
              <span className="text-xs text-muted-foreground">{item.category}</span>
            </div>
          </div>
          <button onClick={onRemove} className="text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0 p-1" aria-label="Remove item">
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Qty controls */}
          <div className="flex items-center gap-1 border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => onQty(item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40"
              disabled={item.quantity <= 1}
            >
              <Minus size={14} />
            </button>
            <span className="w-10 text-center text-sm font-semibold tabular-nums">{item.quantity}</span>
            <button
              onClick={() => onQty(item.quantity + 1)}
              disabled={item.quantity >= MAX_QTY}
              className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40"
            >
              <Plus size={14} />
            </button>
          </div>
          {/* Price */}
          <div className="text-right">
            <p className="font-bold text-primary text-base">
              ${(item.unitPrice * item.quantity).toLocaleString()}
            </p>
            {item.quantity > 1 && (
              <p className="text-xs text-muted-foreground">${item.unitPrice.toLocaleString()} each</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Order success ─────────────────────────────────────────────────────────────

function OrderSuccess({ name }: { name: string }) {
  return (
    <div className="max-w-lg mx-auto text-center py-24 px-4">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
        <CheckCircle size={72} className="text-green-600 mx-auto mb-6" />
      </motion.div>
      <h1 className="font-display text-4xl text-primary mb-4">Order Confirmed!</h1>
      <p className="text-muted-foreground text-lg leading-relaxed mb-8">
        Thank you, {name}. Your order has been received by the Tailorobe team.
        You&apos;ll receive a confirmation email shortly, and we&apos;ll be in touch to arrange delivery or pickup.
      </p>
      <div className="flex gap-4 justify-center flex-wrap">
        <Link href="/products">
          <Button variant="outline" size="lg">Continue Shopping</Button>
        </Link>
        <Link href="/">
          <Button size="lg">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}

// ── Main cart page ────────────────────────────────────────────────────────────

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const { toast } = useToast();

  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [errors, setErrors] = useState({ name: "", email: "", phone: "", notes: ""});
  const [fulfillment, setFulfillment] = useState<FulfillmentMethod>("delivery");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successName, setSuccessName] = useState("");

  const shippingEstimate = fulfillment === "pickup" ? 0 : totalPrice >= 500 ? 0 : 15;
  const grandTotal = totalPrice + shippingEstimate;

  const validateForm = () => {
  const newErrors = {
    name: "",
    email: "",
    phone: "",
    notes: ""
  };

  // Full name
  if (!form.name.trim()) {
    newErrors.name = "Full name is required";
  } else if (form.name.trim().split(" ").length < 2) {
    newErrors.name = "Please enter your first and last name";
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!form.email.trim()) {
    newErrors.email = "Email address is required";
  } else if (!emailRegex.test(form.email)) {
    newErrors.email = "Please enter a valid email address";
  }

  // Australian mobile
  const phoneRegex = /^(?:\+61|0)4\d{8}$/;
  const cleanPhone = form.phone.replace(/\s+/g, "");

  if (!form.phone.trim()) {
    newErrors.phone = "Phone number is required";
  } else if (!phoneRegex.test(cleanPhone)) {
    newErrors.phone =
      "Enter a valid Australian mobile number (04xx xxx xxx)";
  }

  // Address required only for delivery
  if (fulfillment === "delivery") {
    if (!form.notes.trim()) {
      newErrors.notes = "Delivery address is required";
    } else if (form.notes.length < 10) {
      newErrors.notes = "Please enter your complete address";
    }
  }

  setErrors(newErrors);

  return Object.values(newErrors).every(
    (error) => error === ""
  );
};

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
  toast({
    title: "Please check your details",
    description: "Some information is missing or invalid.",
    variant: "destructive",
  });
  return;
}
    setLoading(true);
    try {
      const res = await fetch("/api/send-cart-order-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          fulfillment,
          items: items.map((i) => ({
            productId:    i.productId,
            productTitle: i.productTitle,
            fit:          i.fit,
            size:         i.size,
            quantity:     i.quantity,
          })),
          shippingEstimate,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        toast({
          title: "Order failed",
          description: body.error ?? "Something went wrong. Please try again or call us on 0414 053 773.",
          variant: "destructive",
        });
        return;
      }

      clearCart();
      setSuccessName(form.name);
      setSuccess(true);
    } catch {
      toast({
        title: "Could not reach the server",
        description: "Please check your connection and try again, or call us on 0414 053 773.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) return <OrderSuccess name={successName} />;

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-32 px-4">
        <ShoppingBag size={64} className="text-muted-foreground/30 mx-auto mb-6" />
        <h1 className="font-display text-3xl text-primary mb-3">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Add a piece from our collection to get started.</p>
        <Link href="/products">
          <Button size="lg" className="gap-2">
            Browse Collection <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-primary h-40 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl sm:text-4xl text-white font-bold">Your Cart</h1>
          <p className="text-white/60 text-sm mt-1">{totalItems} item{totalItems !== 1 ? "s" : ""}</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* ── Left: items list ──────────────────────────────────── */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display text-2xl text-primary">Items</h2>
              <button
                onClick={() => { clearCart(); }}
                className="text-xs text-muted-foreground hover:text-red-500 transition-colors underline underline-offset-2"
              >
                Clear all
              </button>
            </div>

            <AnimatePresence>
              {items.map((item) => (
                <CartRow
                  key={item.key}
                  item={item}
                  onRemove={() => removeItem(item.key)}
                  onQty={(q) => updateQuantity(item.key, q)}
                />
              ))}
            </AnimatePresence>

            {/* Continue shopping */}
            <div className="pt-2">
              <Link href="/products" className="text-sm text-primary underline underline-offset-4 hover:text-primary/70 transition-colors">
                ← Continue shopping
              </Link>
            </div>
          </div>

          {/* ── Right: order summary + checkout form ─────────────── */}
          <div className="w-full lg:w-[400px] flex-shrink-0 space-y-5 lg:sticky lg:top-28">

            {/* Order summary */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-display text-xl text-primary mb-5">Order Summary</h3>
              <div className="space-y-3 text-sm">
                {items.map((item) => (
                  <div key={item.key} className="flex justify-between">
                    <span className="text-muted-foreground truncate max-w-[200px]">
                      {item.productTitle} <span className="text-xs">({item.fit} / {item.size})</span> ×{item.quantity}
                    </span>
                    <span className="font-medium tabular-nums">${(item.unitPrice * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{shippingEstimate === 0 ? <span className="text-green-600 font-medium">Free</span> : `$${shippingEstimate}`}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-primary pt-2 border-t border-border">
                  <span>Total</span>
                  <span>${grandTotal.toLocaleString()} AUD</span>
                </div>
              </div>
              {fulfillment === "delivery" && shippingEstimate > 0 && (
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Free shipping on orders over $500
                </p>
              )}
            </div>

            {/* Fulfillment selector */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-display text-xl text-primary mb-4">How would you like to receive your order?</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFulfillment("delivery")}
                  className={cn(
                    "rounded-xl border-2 p-4 text-left transition-all",
                    fulfillment === "delivery"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  <Truck size={20} className={fulfillment === "delivery" ? "text-primary mb-2" : "text-muted-foreground mb-2"} />
                  <p className={cn("font-semibold text-sm", fulfillment === "delivery" ? "text-primary" : "text-foreground")}>Delivery</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {totalPrice >= 500 ? "Free · Australia-wide" : "$15 · Australia-wide"}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setFulfillment("pickup")}
                  className={cn(
                    "rounded-xl border-2 p-4 text-left transition-all",
                    fulfillment === "pickup"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  <Store size={20} className={fulfillment === "pickup" ? "text-primary mb-2" : "text-muted-foreground mb-2"} />
                  <p className={cn("font-semibold text-sm", fulfillment === "pickup" ? "text-primary" : "text-foreground")}>Pick Up In Store</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Free · Shop 3/196 Marion Rd</p>
                </button>
              </div>
              {fulfillment === "pickup" && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-xs text-primary bg-primary/5 rounded-lg px-3 py-2"
                >
                  📍 Shop 3/196 Marion Road, West Richmond SA 5033 · We&apos;ll contact you to arrange a pickup time.
                </motion.p>
              )}
            </div>

            {/* Checkout form */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-display text-xl text-primary mb-5">Your Details</h3>
              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <Label htmlFor="c-name">Full Name *</Label>
                  <Input 
id="c-name"
value={form.name}
onChange={(e) => setForm({ ...form, name: e.target.value })}
placeholder="John Smith"
/>

{errors.name && (
  <p className="text-xs text-red-500 mt-1">
    {errors.name}
  </p>
)}
                </div>
                <div>
                  <Label htmlFor="c-email">Email Address *</Label>
                  <Input id="c-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="mt-1.5" />
                  {errors.email && (
  <p className="text-xs text-red-500 mt-1">
    {errors.email}
  </p>
)}
                </div>
                <div>
                  <Label htmlFor="c-phone">Phone Number</Label>
                  <Input id="c-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0400 000 000" className="mt-1.5" />
                  {errors.phone && (
  <p className="text-xs text-red-500 mt-1">
    {errors.phone}
  </p>
)}
                </div>
                <div>
                  <Label htmlFor="c-notes">
                    {fulfillment === "delivery" ? "Delivery Address" : "Notes"}
                  </Label>
                  <Input
                    id="c-notes"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder={fulfillment === "delivery" ? "Street address, suburb, postcode…" : "Any special instructions…"}
                    className="mt-1.5"
                  />
                  {errors.notes && (
  <p className="text-xs text-red-500 mt-1">
    {errors.notes}
  </p>
)}
                </div>
                <Button type="submit" size="lg" className="w-full gap-2 mt-2 uppercase tracking-wider" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Placing order…
                    </>
                  ) : (
                    <>Place Order <ArrowRight size={16} /></>
                  )}
                </Button>
              </form>
              <p className="text-xs text-muted-foreground text-center mt-4 leading-relaxed">
                {fulfillment === "delivery"
                  ? "The Tailorobe team will contact you to confirm payment and arrange delivery."
                  : "The Tailorobe team will contact you to confirm payment and arrange your pickup time."}
              </p>
            </div>

            {/* Secure / trust */}
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span>🔒 Secure checkout</span>
              <span>·</span>
              <span>📧 Email confirmation</span>
              <span>·</span>
              <span>🇦🇺 Adelaide-based</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
