import { NextRequest, NextResponse } from "next/server";
import { sendBookingEmails } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await sendBookingEmails(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Order email error:", error);
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }
}
