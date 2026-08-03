import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

// ── Supabase client (server-side only) ───────────────────────────────────────

function getSupabase() {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key  = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("[tailorobe] SUPABASE_SERVICE_ROLE_KEY not set — using anon key. Add it to .env.local for full security.");
  }
  return createClient(url, key);
}

// ── Server-side catalogue ─────────────────────────────────────────────────────

const MAX_QTY = 10;

type Category = "Suits" | "Footwear" | "Waistcoats";
interface CatalogueEntry { title: string; category: Category; price: number; }

// Prices: Suits $450 · Footwear $150 · Waistcoats $150
// Add more product IDs here as your catalogue grows.
const SUIT_IDS = [
  "SA1111","SA1112","SA1113","SA1114","SA1115","SA1116","SA1117","SA1118","SA1119","SA1120",
  "SA1121","SA1122","SA1123","SA1124","SA1125","SA1126","SA1127","SA1128","SA1129","SA1130",
  "CN0111","CN0112","CN0113","CN0114","CN0115","CN0116","CN0117","CN0118","CN0119","CN0120",
];
const FOOTWEAR_IDS = [
  "FW2001","FW2002","FW2003","FW2004","FW2005","FW2006","FW2007","FW2008","FW2009","FW2010",
  "SAFW1","SAFW2","SAFW3","SAFW4","SAFW5","SAFW6","SAFW7","SAFW8","SAFW9","SAFW10",
  "SAFW11","SAFW12","SAFW13","SAFW14","SAFW15","SAFW16","SAFW17","SAFW18","SAFW19","SAFW20",
  "SAFW21","SAFW22","SAFW23","SAFW24","SAFW25","SAFW26","SAFW27","SAFW28","SAFW29","SAFW30",
  "SAFW31","SAFW32","SAFW33","SAFW34","SAFW35","SAFW36","SAFW37","SAFW38","SAFW39","SAFW40",
  "SAFW41","SAFW42","SAFW43","SAFW44","SAFW45","SAFW46","SAFW47","SAFW48","SAFW49","SAFW50",
  "SAFW51","SAFW52","SAFW53","SAFW54","SAFW55",
];
const WAISTCOAT_IDS = ["WC3001","WC3002","WC3003","WC3004","WC3005"];

function lookupProduct(id: string): CatalogueEntry | null {
  const upper = id.toUpperCase();
  if (SUIT_IDS.includes(upper))      return { title: upper, category: "Suits",      price: 450 };
  if (FOOTWEAR_IDS.includes(upper))  return { title: upper, category: "Footwear",   price: 150 };
  if (WAISTCOAT_IDS.includes(upper)) return { title: upper, category: "Waistcoats", price: 150 };
  return null;
}

// ── Email helpers ─────────────────────────────────────────────────────────────

function esc(s: string): string {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:6px 10px 6px 0;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top;">${label}</td>
    <td style="padding:6px 0;font-size:13px;color:#111827;">${value}</td>
  </tr>`;
}

function wrapEmail(title: string, body: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
  <body style="margin:0;padding:0;background:#f9fafb;font-family:Georgia,serif;">
    <table width="100%" style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
      <tr><td style="background:#2c3e2d;padding:28px 32px;">
        <h1 style="margin:0;color:#fff;font-size:22px;letter-spacing:0.05em;">Tailorobe</h1>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.6);font-size:12px;letter-spacing:0.15em;text-transform:uppercase;">Bespoke Tailors · Adelaide</p>
      </td></tr>
      <tr><td style="padding:32px;">
        <h2 style="margin:0 0 20px;color:#1a1a1a;font-size:18px;">${title}</h2>
        ${body}
      </td></tr>
      <tr><td style="background:#f9fafb;padding:20px 32px;text-align:center;">
        <p style="margin:0;font-size:12px;color:#9ca3af;">Shop 3/196 Marion Road, West Richmond SA 5033 · 0414 053 773 · info@tailorobe.com.au</p>
      </td></tr>
    </table>
  </body></html>`;
}

// ── POST handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      customer?: { name?: unknown; email?: unknown; phone?: unknown; notes?: unknown };
      fulfillment?: unknown;
      items?: unknown[];
      shippingEstimate?: unknown;
    };

    const name        = typeof body?.customer?.name  === "string" ? body.customer.name.trim()  : "";
    const email       = typeof body?.customer?.email === "string" ? body.customer.email.trim() : "";
    const phone       = typeof body?.customer?.phone === "string" ? body.customer.phone.trim() : "";
    const notes       = typeof body?.customer?.notes === "string" ? body.customer.notes.trim() : "";
    const fulfillment = body?.fulfillment === "pickup" ? "pickup" : "delivery";

    if (!name || !email) {
      return NextResponse.json({ error: "name and email are required" }, { status: 400 });
    }
    if (!Array.isArray(body?.items) || body.items.length === 0) {
      return NextResponse.json({ error: "items are required" }, { status: 400 });
    }

    // ── Validate + price items server-side ────────────────────────────────────

    type ValidatedItem = {
      productId: string; title: string; category: string;
      fit: string; size: string; quantity: number; unitPrice: number; lineTotal: number;
    };

    const validatedItems: ValidatedItem[] = [];

    for (const raw of body.items) {
      const item      = raw as Record<string, unknown>;
      const productId = typeof item.productId === "string" ? item.productId.trim() : "";
      const title     = typeof item.productTitle === "string" ? item.productTitle.trim() : productId;
      const fit       = typeof item.fit      === "string" ? item.fit.trim()  : "";
      const size      = typeof item.size     === "string" ? item.size.trim() : "";
      const quantity  = typeof item.quantity === "number" ? Math.max(1, Math.min(MAX_QTY, Math.floor(item.quantity))) : 1;

      if (!productId) continue;
      const entry = lookupProduct(productId);
      // If product isn't in our server catalogue, accept it at $450 default so no order is lost
      const price = entry?.price ?? 450;
      const category = entry?.category ?? "Suits";

      validatedItems.push({
        productId, title: title || entry?.title || productId,
        category, fit, size, quantity, unitPrice: price, lineTotal: price * quantity,
      });
    }

    if (validatedItems.length === 0) {
      return NextResponse.json({ error: "no valid items" }, { status: 422 });
    }

    const subtotal   = validatedItems.reduce((s, i) => s + i.lineTotal, 0);
    const shipping   = fulfillment === "pickup" ? 0 : subtotal >= 500 ? 0 : 15;
    const grandTotal = subtotal + shipping;

    // ── Save order to Supabase ────────────────────────────────────────────────

    const supabase = getSupabase();
    if (supabase) {
      const productTypes = [...new Set(validatedItems.map((i) => i.category))].join(", ");

const { error: dbErr } = await supabase.from("orders").insert({
  customer_name: name,

  // matches your existing database records
  product_type: "Online Cart Order",

  fabric_name: email,
  color: phone,

  lapel_style: "N/A",
  button_style: "N/A",
  pocket_style: "N/A",
  lining_color: "N/A",
  monogram: "",

  design_notes: JSON.stringify({
  notes,
  items: validatedItems,
  totalPrice: subtotal,
  shipping,
  grandTotal,
}),

  status: "Pending",
});
      if (dbErr) {
        console.error("[tailorobe] Supabase insert error:", dbErr.message);
      }
    } else {
      console.warn("[tailorobe] Supabase not configured — order not saved to database.");
    }

    // ── Build email HTML ──────────────────────────────────────────────────────

    const fulfillmentLabel = fulfillment === "pickup"
      ? "🏪 Pick Up In Store — Shop 3/196 Marion Rd, West Richmond SA 5033 (Free)"
      : `🚚 Delivery — ${shipping === 0 ? "Free" : `$${shipping} AUD`}`;

    const itemRowsHtml = validatedItems.map((i) => `
      <tr style="border-bottom:1px solid #f3f4f6;">
        <td style="padding:10px 8px;font-size:13px;">${esc(i.title)}</td>
        <td style="padding:10px 8px;font-size:13px;color:#6b7280;">${esc(i.fit)} / ${esc(i.size)}</td>
        <td style="padding:10px 8px;font-size:13px;text-align:center;">${i.quantity}</td>
        <td style="padding:10px 8px;font-size:13px;text-align:right;font-weight:600;">$${i.lineTotal.toLocaleString()}</td>
      </tr>`).join("");

    const totalsHtml = `
      <table style="width:100%;border-collapse:collapse;margin-top:8px;">
        <tr><td style="padding:4px 0;color:#6b7280;font-size:13px;">Subtotal</td><td style="text-align:right;font-size:13px;">$${subtotal.toLocaleString()}</td></tr>
        <tr><td style="padding:4px 0;color:#6b7280;font-size:13px;">Shipping</td><td style="text-align:right;font-size:13px;">${shipping === 0 ? "Free" : `$${shipping}`}</td></tr>
        <tr style="border-top:2px solid #e5e7eb;">
          <td style="padding:8px 0 0;font-weight:700;font-size:15px;">Total</td>
          <td style="padding:8px 0 0;text-align:right;font-weight:700;font-size:15px;">$${grandTotal.toLocaleString()} AUD</td>
        </tr>
      </table>`;

    const itemsTable = `
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead><tr style="background:#f9fafb;">
          <th style="padding:8px;text-align:left;">Product</th>
          <th style="padding:8px;text-align:left;">Fit / Size</th>
          <th style="padding:8px;text-align:center;">Qty</th>
          <th style="padding:8px;text-align:right;">Total</th>
        </tr></thead>
        <tbody>${itemRowsHtml}</tbody>
      </table>`;

    const customerDetailsHtml = `
      <table style="width:100%;border-collapse:collapse;">
        ${row("Name",  esc(name))}
        ${row("Email", esc(email))}
        ${row("Phone", phone ? esc(phone) : "—")}
        ${row("Fulfilment", fulfillmentLabel)}
        ${notes ? row(fulfillment === "delivery" ? "Delivery Address" : "Notes", esc(notes)) : ""}
      </table>`;

    const adminHtml = wrapEmail("🛒 New Online Order", `
      <div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:12px 16px;border-radius:6px;margin-bottom:20px;">
        <strong style="color:#15803d;">Total: $${grandTotal.toLocaleString()} AUD</strong>
        <span style="color:#6b7280;font-size:13px;"> · ${validatedItems.length} item${validatedItems.length !== 1 ? "s" : ""}</span>
      </div>
      <h3 style="font-size:14px;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;margin:0 0 10px;">Customer</h3>
      ${customerDetailsHtml}
      <h3 style="font-size:14px;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;margin:20px 0 10px;">Items Ordered</h3>
      ${itemsTable}
      <div style="margin-top:16px;padding-top:16px;border-top:1px solid #e5e7eb;">${totalsHtml}</div>`);

    const customerHtml = wrapEmail("Order Confirmed — Thank You!", `
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">
        Thank you for your order with Tailorobe Bespoke Tailors.<br>
        <strong>Your order is now placed and we will contact you soon</strong> to confirm payment and ${fulfillment === "pickup" ? "arrange your pickup time" : "arrange delivery"}.
      </p>
      <div style="background:${fulfillment === "pickup" ? "#f0fdf4" : "#f9fafb"};border-radius:10px;padding:14px 18px;margin:0 0 20px;border-left:4px solid ${fulfillment === "pickup" ? "#16a34a" : "#2c3e2d"};">
        <p style="margin:0;font-size:13px;font-weight:600;color:#374151;">${fulfillment === "pickup" ? "🏪 Pick Up In Store" : "🚚 Delivery"}</p>
        <p style="margin:4px 0 0;font-size:13px;color:#6b7280;">${fulfillment === "pickup" ? "Shop 3/196 Marion Road, West Richmond SA 5033 — <strong>Free</strong>" : shipping === 0 ? "Australia-wide — <strong>Free</strong>" : `Australia-wide — <strong>$${shipping} AUD</strong>`}</p>
      </div>
      <p style="color:#374151;font-size:14px;line-height:1.7;margin:0 0 20px;">
        We'll reach out to you at <strong>${esc(email)}</strong>${phone ? ` or <strong>${esc(phone)}</strong>` : ""}.
      </p>
      <h3 style="font-size:14px;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;margin:0 0 10px;">Your Order</h3>
      ${itemsTable}
      <div style="margin-top:16px;padding-top:16px;border-top:1px solid #e5e7eb;">${totalsHtml}</div>
      <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;text-align:center;">
        Questions? Call <a href="tel:0414053773" style="color:#2c3e2d;">0414 053 773</a> or email <a href="mailto:info@tailorobe.com.au" style="color:#2c3e2d;">info@tailorobe.com.au</a>
      </p>`);

    // ── Send emails ───────────────────────────────────────────────────────────

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailPass) {
      console.error("[tailorobe] GMAIL_USER or GMAIL_APP_PASSWORD not set in .env.local");
      return NextResponse.json({ error: "Email service not configured" }, { status: 503 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    });

    await Promise.all([
      transporter.sendMail({
        from:    `"Tailorobe Orders" <${gmailUser}>`,
        to:      gmailUser,
        subject: `New Order — $${grandTotal.toLocaleString()} AUD — ${name}`,
        html:    adminHtml,
      }),
      transporter.sendMail({
        from:    `"Tailorobe Bespoke" <${gmailUser}>`,
        to:      email,
        subject: "Your Tailorobe Order is Confirmed",
        html:    customerHtml,
      }),
    ]);

    return NextResponse.json({ success: true, grandTotal });

  } catch (err) {
    console.error("[tailorobe] send-cart-order-email error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
