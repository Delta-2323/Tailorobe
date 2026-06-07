# Tailorobe Bespoke Tailors — Next.js App

## Quick Start (VS Code)

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Create a `.env.local` file in the root folder with:
```
NEXT_PUBLIC_SUPABASE_URL=https://jdfwtuvxswxuxfvngbpr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_y2SPUzU3HAa0vnZb_norwA_Qm6oR5lr
GMAIL_USER=jaasveer10@gmail.com
GMAIL_APP_PASSWORD=rrkm uhwr rmxw tuen
```

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Features
- **Home** — Hero, gallery preview, reviews
- **Booking** — Appointment form with live slot availability (booked slots are disabled)
- **Suit Builder** — Interactive 3D suit configurator
- **Gallery** — Customer photos and designs
- **Services / About / Contact** — Info pages with contact form
- **Admin Dashboard** — PIN-protected (`1234`) at `/admin`
  - View all appointments, messages, and manage status

## Email Notifications
Every new appointment, contact message, and suit design order sends a full-detail email to `infotailorobe@gmail.com` via Gmail.

## Database
Uses **Supabase** (same credentials as above). Schema is in `supabase_schema.sql`.

## Build for Production
```bash
npm run build
npm run start
```
