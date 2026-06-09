import nodemailer from "nodemailer";

const STORE_EMAIL = "infotailorobe@gmail.com";

function createTransport() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

function row(label: string, value?: string | null) {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:10px 12px;color:#6b7280;font-weight:500;white-space:nowrap;vertical-align:top;border-bottom:1px solid #f3f4f6;">${label}</td>
      <td style="padding:10px 12px;color:#111827;vertical-align:top;border-bottom:1px solid #f3f4f6;">${value}</td>
    </tr>`;
}

function emailShell(title: string, badge: string, badgeColor: string, tableRows: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08);">

    <div style="background:#2c3e2d;padding:28px 32px;">
      <p style="margin:0;color:#d4af37;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Tailorobe Bespoke Tailors</p>
      <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:700;">${title}</h1>
    </div>

    <div style="padding:16px 32px 0;">
      <span style="display:inline-block;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:600;background:${badgeColor};color:#fff;">${badge}</span>
    </div>

    <div style="padding:16px 32px 32px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:12px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        ${tableRows}
      </table>
    </div>

    <div style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb;text-align:center;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">
        This is an automated notification from your website · 
        <a href="mailto:infotailorobe@gmail.com" style="color:#9ca3af;">infotailorobe@gmail.com</a>
      </p>
    </div>

  </div>
</body>
</html>`;
}

/* =========================
   TIME CONVERTER (for calendar)
========================= */
function to24Hour(time: string) {
  const [t, modifier] = time.split(" ");
  let [hours, minutes] = t.split(":");

  if (modifier === "PM" && hours !== "12") {
    hours = String(Number(hours) + 12);
  }
  if (modifier === "AM" && hours === "12") {
    hours = "00";
  }

  return `${hours.padStart(2, "0")}:${minutes}`;
}

/* ─── APPOINTMENT ─────────────────────────────────────────── */
export async function sendBookingEmails(data: {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceType: string;
  locationType: string;
  remoteLocation?: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
  status?: string;
}) {
  const transporter = createTransport();

  const locationText =
    data.locationType === "store"
      ? "In Store — Shop 3/196 Marion Road, West Richmond SA 5033"
      : `Remote — ${data.remoteLocation}`;

  /* =========================
     GOOGLE CALENDAR LINK
  ========================= */
  const startDate = `${data.appointmentDate}T${to24Hour(data.appointmentTime)}`;

  const googleCalendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    "Tailorobe Appointment"
  )}&dates=${startDate.replace(/[-:]/g, "")}/${startDate.replace(/[-:]/g, "")}&details=${encodeURIComponent(
    `Service: ${data.serviceType}\nLocation: ${locationText}`
  )}`;

  /* =========================
     ADMIN EMAIL TABLE
  ========================= */
  const adminTableRows =
    row("Customer Name", data.customerName) +
    row("Phone Number", data.customerPhone) +
    row("Email Address", data.customerEmail) +
    row("Service", data.serviceType) +
    row("Date", data.appointmentDate) +
    row("Time", data.appointmentTime) +
    row("Appointment Type", data.locationType === "store" ? "In Store" : "Remote Appointment") +
    row("Location", locationText) +
    row("Notes", data.notes) +
    row("Status", data.status ?? "Pending");

  /* =========================
     CUSTOMER EMAIL TABLE
  ========================= */
  const customerTableRows =
    row("Name", data.customerName) +
    row("Phone", data.customerPhone) +
    row("Email", data.customerEmail) +
    row("Service", data.serviceType) +
    row("Notes", data.notes) +
    row("Date", data.appointmentDate) +
    row("Time", data.appointmentTime) +
    row("Location", locationText);

  const customerCalendarButton = `
    <div style="margin-top:20px;text-align:center;">
      <a href="${googleCalendarLink}" target="_blank"
        style="display:inline-block;padding:12px px;background:#16a34a;color:#fff;
        text-decoration:none;border-radius:6px;font-weight:600;">
        ➕ Add to Google Calendar
      </a>
    </div>
  `;

  /* =========================
     SEND EMAILS
  ========================= */
  const adminEmail = transporter.sendMail({
    from: `"Tailorobe Bookings" <${process.env.GMAIL_USER}>`,
    to: STORE_EMAIL,
    subject: `New Appointment — ${data.customerName} | ${data.serviceType} on ${data.appointmentDate}`,
    html: emailShell("New Appointment Booked", "APPOINTMENT", "#2c3e2d", adminTableRows),
  });

  const customerEmail = data.customerEmail
    ? transporter.sendMail({
        from: `"Tailorobe" <${process.env.GMAIL_USER}>`,
        to: data.customerEmail,
        subject: `Your Appointment is Confirmed - Tailorobe`,
        html: emailShell(
          "Booking Confirmed 🎉",
          "CONFIRMED",
          "#16a34a",
          customerTableRows + customerCalendarButton
        ),
      })
    : null;

  await Promise.all([adminEmail, customerEmail].filter(Boolean));
}