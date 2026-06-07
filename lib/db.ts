import { supabase } from "./supabase";

export type Appointment = {
  id?: number;
  customer_name: string;
  customer_phone: string;
  service_type: string;
  location_type: string;
  remote_location?: string;
  appointment_date: string;
  appointment_time: string;
  notes?: string;
  status: string;
  created_at?: string;
};

export type ContactMessage = {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  created_at?: string;
};

export type Order = {
  id?: number;
  customer_name: string;
  product_type: string;
  fabric_name: string;
  color: string;
  lapel_style: string;
  button_style: string;
  pocket_style: string;
  lining_color: string;
  monogram?: string | null;
  design_notes?: string;
  created_at?: string;
};

export async function insertAppointment(data: Omit<Appointment, "id" | "created_at">) {
  const { error } = await supabase.from("appointments").insert([data]);
  if (error) throw error;
}

export async function fetchAppointments(): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchBookedSlots(date: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("appointments")
    .select("appointment_time")
    .eq("appointment_date", date)
    .neq("status", "cancelled");
  if (error) return [];
  return (data ?? []).map((r: { appointment_time: string }) => r.appointment_time);
}

export async function updateAppointmentStatus(id: number, status: string) {
  const { error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

export async function insertContact(data: Omit<ContactMessage, "id" | "created_at">) {
  const { error } = await supabase.from("contact_messages").insert([data]);
  if (error) throw error;
}

export async function fetchContacts(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function insertOrder(data: Omit<Order, "id" | "created_at">) {
  const { data: result, error } = await supabase
    .from("orders")
    .insert([data])
    .select()
    .single();
  if (error) throw error;
  return result;
}
