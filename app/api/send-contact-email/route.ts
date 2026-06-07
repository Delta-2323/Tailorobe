import { NextRequest, NextResponse } from "next/server";
import { sendContactEmails } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await sendContactEmails(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact email error:", error);
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }
}
