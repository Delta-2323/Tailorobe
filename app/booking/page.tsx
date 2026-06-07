"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Store, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { insertAppointment, fetchBookedSlots } from "@/lib/db";

const SERVICES = [
  "Bespoke Suit Consultation",
  "Made-to-Measure Shirt",
  "Wedding Suit",
  "Indian Traditional Attire",
  "Handcrafted Footwear",
  "Expert Alterations",
  "Full Bespoke Wardrobe",
  "General Enquiry",
];

const WEEKDAY_SLOTS = [
  "12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM",
  "3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM","6:00 PM","6:30 PM"
];

const WEEKEND_SLOTS = [
  "10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","12:30 PM",
  "1:00 PM","1:30 PM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM"
];

function isWeekend(dateStr: string): boolean {
  if (!dateStr) return false;
  const day = new Date(dateStr + "T00:00:00").getDay();
  return day === 0 || day === 6;
}

type FormState = {
  customerName: string;
  customerPhone: string;
  serviceType: string;
  locationType: string;
  remoteLocation: string;
  appointmentDate: string;
  appointmentTime: string;
  notes: string;
};

const emptyForm: FormState = {
  customerName: "",
  customerPhone: "",
  serviceType: "",
  locationType: "store",
  remoteLocation: "",
  appointmentDate: "",
  appointmentTime: "",
  notes: "",
};

export default function Booking() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const timeSlots = useMemo(
    () => (isWeekend(form.appointmentDate) ? WEEKEND_SLOTS : WEEKDAY_SLOTS),
    [form.appointmentDate]
  );

  useEffect(() => {
    if (!form.appointmentDate) {
      setBookedSlots([]);
      return;
    }
    setSlotsLoading(true);
    fetchBookedSlots(form.appointmentDate)
      .then(setBookedSlots)
      .catch(() => setBookedSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [form.appointmentDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName || !form.customerPhone) {
      toast({ title: "Missing Details", description: "Please fill in your name and phone number.", variant: "destructive" });
      return;
    }
    if (!form.serviceType) {
      toast({ title: "Select a Service", description: "Please choose the type of service you need.", variant: "destructive" });
      return;
    }
    if (!form.appointmentDate || !form.appointmentTime) {
      toast({ title: "Select Date & Time", description: "Please choose your preferred appointment date and time.", variant: "destructive" });
      return;
    }
    if (form.locationType === "remote" && !form.remoteLocation.trim()) {
      toast({ title: "Location Required", description: "Please enter your preferred location for the remote appointment.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await insertAppointment({
        customer_name: form.customerName,
        customer_phone: form.customerPhone,
        service_type: form.serviceType,
        location_type: form.locationType,
        remote_location: form.remoteLocation || undefined,
        appointment_date: form.appointmentDate,
        appointment_time: form.appointmentTime,
        notes: form.notes || undefined,
        status: "pending",
      });

      fetch("/api/send-booking-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          serviceType: form.serviceType,
          locationType: form.locationType,
          remoteLocation: form.remoteLocation || undefined,
          appointmentDate: form.appointmentDate,
          appointmentTime: form.appointmentTime,
          notes: form.notes || undefined,
        }),
      }).catch((err) => console.warn("Email notification failed (non-blocking):", err));

      setSubmitted(true);
    } catch {
      toast({ title: "Error", description: "Failed to book appointment. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="w-full">
        <section className="relative h-48 bg-primary flex items-center justify-center">
          <h1 className="font-display text-3xl sm:text-5xl text-white font-bold relative z-10">Book a Fitting</h1>
        </section>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary">
            <CheckCircle size={44} />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-primary mb-4">Appointment Confirmed!</h2>
          <p className="text-muted-foreground text-lg mb-4 max-w-md mx-auto">
            Thank you, <strong>{form.customerName}</strong>. Your <strong>{form.serviceType}</strong> appointment has been booked for{" "}
            <strong>{form.appointmentDate}</strong> at <strong>{form.appointmentTime}</strong>.
          </p>
          <p className="text-muted-foreground mb-2">
            We'll confirm this shortly — if you have any questions, call us on{" "}
            <a href="tel:0414053773" className="text-accent font-medium">0414 053 773</a>.
          </p>
          <p className="text-muted-foreground mb-10 text-sm">
            {form.locationType === "store"
              ? "We look forward to seeing you at Shop 3/196 Marion Road, West Richmond."
              : `We'll visit you at: ${form.remoteLocation}`}
          </p>
          <Button onClick={() => { setSubmitted(false); setForm(emptyForm); }} className="uppercase tracking-wider">
            Book Another Appointment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <section className="relative h-48 bg-primary flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=1800&auto=format&fit=crop" alt="Booking hero" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="relative z-10 text-center">
          <h1 className="font-display text-3xl sm:text-5xl text-white font-bold">Book a Fitting</h1>
          <p className="text-white/80 mt-2">Your bespoke journey begins here</p>
        </div>
      </section>

      <section className="py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-card rounded-2xl border border-border p-5 sm:p-8">
            <h2 className="font-display text-2xl text-primary mb-6">Your Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} placeholder="John Smith" className="mt-2" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} placeholder="0400 000 000" className="mt-2" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-5 sm:p-8">
            <h2 className="font-display text-2xl text-primary mb-2">Service Required *</h2>
            <p className="text-muted-foreground text-sm mb-5">Select the service that best suits your needs</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SERVICES.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setForm({ ...form, serviceType: s })}
                  className={cn(
                    "px-4 py-3 rounded-xl border-2 text-left text-sm font-medium transition-all",
                    form.serviceType === s ? "border-primary bg-primary/5 text-primary" : "border-border bg-background hover:border-primary/50 text-foreground"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-5 sm:p-8">
            <h2 className="font-display text-2xl text-primary mb-2">Appointment Type *</h2>
            <p className="text-muted-foreground text-sm mb-5">Visit us in store or we can come to you</p>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <button
                type="button"
                onClick={() => setForm({ ...form, locationType: "store", remoteLocation: "" })}
                className={cn("flex items-center gap-3 p-5 rounded-xl border-2 transition-all", form.locationType === "store" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}
              >
                <Store className="text-primary flex-shrink-0" size={22} />
                <div className="text-left">
                  <div className="font-semibold text-sm">In Store</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Marion Road, West Richmond</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, locationType: "remote" })}
                className={cn("flex items-center gap-3 p-5 rounded-xl border-2 transition-all", form.locationType === "remote" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}
              >
                <Truck className="text-primary flex-shrink-0" size={22} />
                <div className="text-left">
                  <div className="font-semibold text-sm">Remote Appointment</div>
                  <div className="text-xs text-muted-foreground mt-0.5">We come to you</div>
                </div>
              </button>
            </div>
            {form.locationType === "remote" && (
              <div>
                <Label htmlFor="remoteLocation">Your Preferred Location *</Label>
                <Input id="remoteLocation" value={form.remoteLocation} onChange={(e) => setForm({ ...form, remoteLocation: e.target.value })} placeholder="e.g. 42 Example Street, Norwood SA 5067" className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1.5">Please provide a full address where you'd like us to visit.</p>
              </div>
            )}
          </div>

          <div className="bg-card rounded-2xl border border-border p-5 sm:p-8">
            <h2 className="font-display text-2xl text-primary mb-2">Preferred Date & Time *</h2>
            <p className="text-muted-foreground text-sm mb-5">Store hours: Mon – Fri 12:00 PM – 7:00 PM &nbsp;|&nbsp; Weekends 10:00 AM – 5:00 PM</p>
            <div className="mb-6">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" min={new Date().toISOString().split("T")[0]} value={form.appointmentDate} onChange={(e) => setForm({ ...form, appointmentDate: e.target.value, appointmentTime: "" })} className="mt-2 max-w-xs" />
            </div>
            {form.appointmentDate && (
              <div>
                <Label>Available Time Slots</Label>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  {isWeekend(form.appointmentDate) ? "Weekend hours: 10:00 AM – 5:00 PM" : "Weekday hours: 12:00 PM – 7:00 PM"}
                </p>
                {slotsLoading ? (
                  <p className="text-sm text-muted-foreground">Checking availability…</p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {timeSlots.map((t) => {
                      const isBooked = bookedSlots.includes(t);
                      const isSelected = form.appointmentTime === t;
                      return (
                        <button
                          type="button"
                          key={t}
                          disabled={isBooked}
                          onClick={() => !isBooked && setForm({ ...form, appointmentTime: t })}
                          className={cn(
                            "py-2.5 px-3 rounded-lg border text-sm font-medium transition-all",
                            isBooked
                              ? "bg-muted border-border text-muted-foreground cursor-not-allowed opacity-50 line-through"
                              : isSelected
                              ? "bg-primary text-white border-primary"
                              : "bg-background border-border hover:border-primary text-foreground"
                          )}
                          title={isBooked ? "Already booked" : t}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-card rounded-2xl border border-border p-5 sm:p-8">
            <h2 className="font-display text-2xl text-primary mb-2">Additional Details</h2>
            <p className="text-muted-foreground text-sm mb-5">Tell us anything that will help us prepare for your appointment</p>
            <Textarea rows={4} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="e.g. Occasion, style preferences, fabric ideas, special requirements..." />
          </div>

          {(form.serviceType || form.appointmentDate) && (
            <div className="bg-muted/50 rounded-xl p-6 border border-border">
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">Booking Summary</h4>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                {form.customerName && <><span className="text-muted-foreground">Name:</span><span className="font-medium">{form.customerName}</span></>}
                {form.customerPhone && <><span className="text-muted-foreground">Phone:</span><span className="font-medium">{form.customerPhone}</span></>}
                {form.serviceType && <><span className="text-muted-foreground">Service:</span><span className="font-medium">{form.serviceType}</span></>}
                {form.locationType && <><span className="text-muted-foreground">Type:</span><span className="font-medium">{form.locationType === "store" ? "In Store" : "Remote"}</span></>}
                {form.locationType === "remote" && form.remoteLocation && <><span className="text-muted-foreground">Location:</span><span className="font-medium">{form.remoteLocation}</span></>}
                {form.appointmentDate && <><span className="text-muted-foreground">Date:</span><span className="font-medium">{form.appointmentDate}</span></>}
                {form.appointmentTime && <><span className="text-muted-foreground">Time:</span><span className="font-medium">{form.appointmentTime}</span></>}
              </div>
            </div>
          )}

          <Button type="submit" size="lg" className="w-full uppercase tracking-wider" disabled={loading}>
            {loading ? "Confirming your appointment..." : "Confirm Appointment"}
          </Button>
        </form>
      </section>
    </div>
  );
}
