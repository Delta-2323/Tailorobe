"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Users, Calendar, MessageSquare, LogOut, BarChart3, CheckCircle, Clock, Images } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { fetchAppointments, fetchContacts, updateAppointmentStatus, type Appointment, type ContactMessage } from "@/lib/db";

const ADMIN_PIN = "1234";

const GALLERY_IMAGES = [
  "gallery-01.jpg","gallery-03.jpg","gallery-04.jpg","gallery-05.jpg",
  "gallery-06.jpg","gallery-07.jpg","gallery-08.jpg","gallery-09.jpg",
  "gallery-10.jpg","gallery-11.jpg","gallery-12.jpg","gallery-13.jpg",
  "gallery-14.jpg","gallery-15.jpg","gallery-16.jpg","gallery-17.jpg","gallery-18.jpg",
];

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className={`rounded-xl p-6 text-white ${color}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="opacity-80">{label}</span>
        {icon}
      </div>
      <div className="text-4xl font-bold font-display">{value}</div>
    </div>
  );
}

const statusBadge = (status: string) => {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors[status] ?? "bg-gray-100 text-gray-700"}`}>{status}</span>;
};

export default function Admin() {
  const { toast } = useToast();
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  const loadData = async () => {
    setDataLoading(true);
    try {
      const [appts, msgs] = await Promise.all([fetchAppointments(), fetchContacts()]);
      setAppointments(appts);
      setContacts(msgs);
    } catch {
      toast({ title: "Error", description: "Failed to load data from database.", variant: "destructive" });
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) loadData();
  }, [authenticated]);

  const pendingCount = appointments.filter((a) => a.status === "pending").length;
  const upcomingAppointments = appointments.filter((a) => a.status === "pending" || a.status === "confirmed").slice(0, 5);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await updateAppointmentStatus(id, status);
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      toast({ title: "Updated", description: `Appointment marked as ${status}.` });
    } catch {
      toast({ title: "Error", description: "Failed to update appointment.", variant: "destructive" });
    }
  };

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (pin === ADMIN_PIN) {
      setAuthenticated(true);
    } else {
      toast({ title: "Invalid PIN", description: "The PIN you entered is incorrect.", variant: "destructive" });
      setPin("");
    }
  };

  if (!authenticated) {
    return (
      <div className="fixed inset-0 z-[100] bg-primary flex items-center justify-center px-4">
        <div className="bg-card rounded-2xl p-10 w-full max-w-md shadow-2xl border border-border">
          <div className="text-center mb-8">
            <Link href="/" className="font-display text-3xl font-bold text-primary block mb-2">TAILOROBE BESPOKE TAILORS</Link>
            <h2 className="font-display text-2xl text-foreground">Admin Access</h2>
            <p className="text-muted-foreground mt-1">Enter your access PIN to continue</p>
          </div>
          <form onSubmit={handleLogin}>
            <Input
              type="password"
              placeholder="Enter admin PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="mb-4"
              autoFocus
            />
            <Button type="submit" className="w-full uppercase tracking-wider">
              Access Dashboard
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/" className="text-muted-foreground hover:text-accent text-sm transition-colors">← Back to Website</Link>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "dashboard",    label: "Dashboard",    icon: <BarChart3 size={18} /> },
    { id: "appointments", label: "Appointments", icon: <Calendar size={18} /> },
    { id: "contact",      label: "Messages",     icon: <MessageSquare size={18} /> },
    { id: "gallery",      label: "Gallery",      icon: <Images size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-primary text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-display text-xl font-bold text-white hover:text-accent transition-colors">TAILOROBE BESPOKE TAILORS</Link>
          <span className="text-white/40">|</span>
          <span className="text-white/80 text-sm font-medium">Admin Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadData} className="text-white/70 hover:text-white transition-colors text-sm" disabled={dataLoading}>
            {dataLoading ? "Loading..." : "↻ Refresh"}
          </button>
          <button onClick={() => setAuthenticated(false)} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      <div className="md:hidden bg-card border-b border-border flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("flex flex-col items-center gap-1 px-4 py-3 text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all border-b-2", activeTab === tab.id ? "text-primary border-primary" : "text-muted-foreground border-transparent")}>
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-1 min-h-0">
        <aside className="w-56 border-r border-border bg-card hidden md:flex flex-col py-6 flex-shrink-0">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all text-left", activeTab === tab.id ? "text-primary bg-primary/10 border-r-2 border-primary" : "text-muted-foreground hover:text-foreground")}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </aside>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {activeTab === "dashboard" && (
            <div>
              <h2 className="font-display text-2xl text-primary mb-6">Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <StatCard icon={<Calendar size={20} />} label="Total Appointments" value={appointments.length} color="bg-primary" />
                <StatCard icon={<Clock size={20} />} label="Pending" value={pendingCount} color="bg-[#4e3a2d]" />
                <StatCard icon={<Users size={20} />} label="Messages" value={contacts.length} color="bg-[#2d3e4a]" />
              </div>
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="font-semibold mb-4 text-primary">Upcoming Appointments</h3>
                {upcomingAppointments.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No pending appointments.</p>
                ) : (
                  <div className="space-y-3">
                    {upcomingAppointments.map((a) => (
                      <div key={a.id} className="flex items-center justify-between text-sm">
                        <div>
                          <p className="font-medium">{a.customer_name}</p>
                          <p className="text-muted-foreground">{a.appointment_date} at {a.appointment_time}</p>
                        </div>
                        {statusBadge(a.status)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "appointments" && (
            <div>
              <h2 className="font-display text-2xl text-primary mb-6">Appointments</h2>
              {appointments.length === 0 ? (
                <div className="text-center py-24 text-muted-foreground">
                  <Calendar size={48} className="mx-auto mb-4 opacity-30" />
                  <p>No appointments booked yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((a) => (
                    <div key={a.id} className="bg-card rounded-xl border border-border p-5 flex items-start justify-between gap-4">
                      <div className="grid md:grid-cols-2 gap-x-8 gap-y-1 flex-1 text-sm">
                        <div><span className="text-muted-foreground">Name:</span> <strong>{a.customer_name}</strong></div>
                        <div><span className="text-muted-foreground">Phone:</span> {a.customer_phone}</div>
                        <div><span className="text-muted-foreground">Service:</span> {a.service_type}</div>
                        <div><span className="text-muted-foreground">Type:</span> {a.location_type === "store" ? "In Store" : "Remote"}</div>
                        <div><span className="text-muted-foreground">Date:</span> {a.appointment_date} at {a.appointment_time}</div>
                        {a.remote_location && <div><span className="text-muted-foreground">Location:</span> {a.remote_location}</div>}
                        {a.notes && <div className="md:col-span-2"><span className="text-muted-foreground">Notes:</span> {a.notes}</div>}
                        <div className="text-xs text-muted-foreground">{a.created_at ? new Date(a.created_at).toLocaleDateString() : ""}</div>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        {statusBadge(a.status)}
                        {a.status === "pending" && (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleUpdateStatus(a.id!, "confirmed")}>Confirm</Button>
                            <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(a.id!, "cancelled")}>Cancel</Button>
                          </div>
                        )}
                        {a.status === "confirmed" && (
                          <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(a.id!, "completed")}>
                            <CheckCircle size={14} className="mr-1" />Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "contact" && (
            <div>
              <h2 className="font-display text-2xl text-primary mb-6">Contact Messages</h2>
              {contacts.length === 0 ? (
                <div className="text-center py-24 text-muted-foreground">
                  <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
                  <p>No messages yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contacts.map((c) => (
                    <div key={c.id} className="bg-card rounded-xl border border-border p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{c.name}</h4>
                          <p className="text-sm text-muted-foreground">{c.email}{c.phone ? ` • ${c.phone}` : ""}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{c.created_at ? new Date(c.created_at).toLocaleDateString() : ""}</span>
                      </div>
                      <p className="text-sm font-medium mb-2">Subject: {c.subject}</p>
                      <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">{c.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "gallery" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl text-primary">Gallery</h2>
                <span className="text-sm text-muted-foreground">{GALLERY_IMAGES.length} images</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                To add or remove photos, place image files in the <code className="bg-muted px-1 py-0.5 rounded text-xs">public/gallery/</code> folder and update the list in <code className="bg-muted px-1 py-0.5 rounded text-xs">app/gallery/page.tsx</code>.
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {GALLERY_IMAGES.map((filename) => (
                  <div key={filename} className="aspect-square rounded-xl overflow-hidden border border-border bg-muted">
                    <img src={`/gallery/${filename}`} alt={filename} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
