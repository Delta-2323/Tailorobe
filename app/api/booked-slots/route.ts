import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  if (!date) return NextResponse.json({ slots: [] });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("appointments")
    .select("appointment_time")
    .eq("appointment_date", date)
    .not("status", "eq", "cancelled");

  if (error) return NextResponse.json({ slots: [] });

  const slots = (data ?? []).map((r: { appointment_time: string }) => r.appointment_time);
  return NextResponse.json({ slots });
}
