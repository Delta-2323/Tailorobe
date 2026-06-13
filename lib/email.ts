import nodemailer from "nodemailer";

const STORE_EMAIL = "info@tailorobe.com.au";

/* =========================
   TRANSPORTER
========================= */
function createTransport() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

/* =========================
   ROW UI
========================= */
function row(label: string, value?: string | null) {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:10px 12px;color:#6b7280;font-weight:500;border-bottom:1px solid #f3f4f6;">
        ${label}
      </td>
      <td style="padding:10px 12px;color:#111827;border-bottom:1px solid #f3f4f6;">
        ${value}
      </td>
    </tr>`;
}

/* =========================
   EMAIL TEMPLATE
========================= */
function emailShell(title: string, badge: string, badgeColor: string, rows: string) {
  return `
  <!DOCTYPE html>
  <html>
  <body style="margin:0;background:#f9fafb;font-family:Arial, sans-serif;">

    <div style="max-width:600px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.08);">

      <div style="background:#2c3e2d;padding:25px;">
        <p style="margin:0;color:#d4af37;font-size:12px;letter-spacing:2px;text-transform:uppercase;">
          Tailorobe Bespoke Tailors
        </p>
        <h2 style="color:#fff;margin:8px 0 0;">${title}</h2>
      </div>

      <div style="padding:15px 25px;">
        <span style="background:${badgeColor};color:#fff;padding:5px 12px;border-radius:20px;font-size:12px;font-weight:bold;">
          ${badge}
        </span>
      </div>

      <table style="width:100%;border-collapse:collapse;padding:20px;">
        ${rows}
      </table>

    </div>

  </body>
  </html>`;
}

/* =========================================================
   📩 CONTACT EMAIL
========================================================= */
export async function sendContactEmail(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const transporter = createTransport();

  const adminRows =
    row("Name", data.name) +
    row("Email", data.email) +
    row("Phone", data.phone) +
    row("Subject", data.subject) +
    row("Message", data.message);

  const adminEmail = transporter.sendMail({
    from: `"Tailorobe Website" <${process.env.GMAIL_USER}>`,
    to: STORE_EMAIL,
    subject: `New Contact Message — ${data.subject}`,
    html: emailShell("New Contact Message", "CONTACT", "#2c3e2d", adminRows),
  });

  const customerEmail = data.email
    ? transporter.sendMail({
        from: `"Tailorobe" <${process.env.GMAIL_USER}>`,
        to: data.email,
        subject: "We received your message - Tailorobe",
        html: emailShell("Message Received ✔", "CONTACT", "#16a34a", adminRows),
      })
    : null;

  await Promise.all([adminEmail, customerEmail].filter(Boolean));
}

/* =========================================================
   📅 BOOKING EMAIL
========================================================= */
export async function sendBookingEmails(data: any) {
  const transporter = createTransport();

  const locationText =
    data.locationType === "store"
      ? "In Store — Shop 3/196 Marion Road, West Richmond SA 5033"
      : `Remote — ${data.remoteLocation}`;

  const adminRows =
    row("Customer Name", data.customerName) +
    row("Phone", data.customerPhone) +
    row("Email", data.customerEmail) +
    row("Service", data.serviceType) +
    row("Date", data.appointmentDate) +
    row("Time", data.appointmentTime) +
    row("Type", data.locationType) +
    row("Location", locationText) +
    row("Notes", data.notes) +
    row("Status", data.status ?? "Pending");

  const customerRows =
    row("Name", data.customerName) +
    row("Phone", data.customerPhone) +
    row("Email", data.customerEmail) +
    row("Service", data.serviceType) +
    row("Date", data.appointmentDate) +
    row("Time", data.appointmentTime) +
    row("Location", locationText);

  const adminEmail = transporter.sendMail({
    from: `"Tailorobe Bookings" <${process.env.GMAIL_USER}>`,
    to: STORE_EMAIL,
    subject: `New Appointment — ${data.customerName}`,
    html: emailShell("New Appointment Booked", "APPOINTMENT", "#2c3e2d", adminRows),
  });

  const customerEmail = data.customerEmail
    ? transporter.sendMail({
        from: `"Tailorobe" <${process.env.GMAIL_USER}>`,
        to: data.customerEmail,
        subject: "Your Appointment is Confirmed - Tailorobe",
        html: emailShell("Booking Confirmed 🎉", "CONFIRMED", "#16a34a", customerRows),
      })
    : null;

  await Promise.all([adminEmail, customerEmail].filter(Boolean));
}

/* =========================================================
   🧥 ORDER EMAIL (SUIT BUILDER)
========================================================= */
export async function sendOrderEmails(data: any) {
  const transporter = createTransport();

  const design =
    `
Fabric: ${data.fabric}
Grade: ${data.grade}
Colour: ${data.colour}
Cut: ${data.cut}
Lapel: ${data.lapel}
Buttons: ${data.buttons}
Pockets: ${data.pockets}
Vent: ${data.vent}
Trouser: ${data.trouser}
Lining: ${data.lining}
Monogram: ${data.monogram}
`.replace(/\n/g, "<br/>");

  const adminRows =
    row("Customer Name", data.name) +
    row("Email", data.email) +
    row("Phone", data.phone) +
    row("Full Suit Design", design);

  const customerRows =
    row("Name", data.name) +
    row("Email", data.email) +
    row("Phone", data.phone) +
    row("Your Suit Design", design);

  const adminEmail = transporter.sendMail({
    from: `"Tailorobe Orders" <${process.env.GMAIL_USER}>`,
    to: STORE_EMAIL,
    subject: `New Suit Order — ${data.name}`,
    html: emailShell("New Suit Order Received 🧥", "ORDER", "#1f2937", adminRows),
  });

  const customerEmail = data.email
    ? transporter.sendMail({
        from: `"Tailorobe" <${process.env.GMAIL_USER}>`,
        to: data.email,
        subject: "Your Suit Order Confirmation - Tailorobe",
        html: emailShell("Order Confirmed ✔", "ORDER", "#16a34a", customerRows),
      })
    : null;

  await Promise.all([adminEmail, customerEmail].filter(Boolean));
}