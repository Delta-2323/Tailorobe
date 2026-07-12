import Link from "next/link";

export const metadata = {
  title: "Legal Information | Tailorobe Bespoke",
  description: "Returns, shipping, privacy and terms of use for Tailorobe Bespoke.",
};

export default function LegalPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <p className="text-sm uppercase tracking-[0.3em] text-accent mb-4">
          Tailorobe Bespoke
        </p>

        <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mb-6">
          Legal Information
        </h1>

        <p className="text-muted-foreground max-w-3xl leading-relaxed mb-12">
          This page explains our general policies for returns, shipping, orders,
          privacy and website use. Nothing on this page limits your rights under
          Australian Consumer Law.
        </p>

        <div className="space-y-10">
          <section className="border border-border rounded-2xl p-6 bg-card shadow-sm">
            <h2 className="font-display text-2xl text-primary mb-4">
              Returns & Alterations
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Because many Tailorobe garments are custom-made or altered to your
              measurements, we generally cannot accept returns for change of mind.
              However, if there is an issue with workmanship, fit, or quality,
              please contact us and we will assess the item. Depending on the
              situation, we may offer alterations, repair, replacement, or another
              suitable remedy.
            </p>
          </section>

          <section className="border border-border rounded-2xl p-6 bg-card shadow-sm">
            <h2 className="font-display text-2xl text-primary mb-4">
              Shipping & Delivery
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Shipping or delivery options may vary depending on the order type,
              garment, location and agreed timeline. For custom garments, delivery
              time may depend on fabric availability, fittings, alterations and
              production schedule. We will provide estimated timing during the
              ordering process where possible.
            </p>
          </section>

          <section className="border border-border rounded-2xl p-6 bg-card shadow-sm">
            <h2 className="font-display text-2xl text-primary mb-4">
              Orders & Payments
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Orders may require a deposit or full payment before work begins.
              Prices, timelines and final garment details should be confirmed
              before production starts. Once a custom order has started, changes
              may not always be possible or may involve extra costs.
            </p>
          </section>

          <section className="border border-border rounded-2xl p-6 bg-card shadow-sm">
            <h2 className="font-display text-2xl text-primary mb-4">
              Website Use
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The content on this website is provided for general information
              about Tailorobe Bespoke, our services and our products. You must not
              misuse the website, copy our content without permission, or use the
              site in a way that may damage, disrupt or interfere with our
              services.
            </p>
          </section>

          <section className="border border-border rounded-2xl p-6 bg-card shadow-sm">
            <h2 className="font-display text-2xl text-primary mb-4">
              Privacy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              When you submit a booking, contact form or order request, we may
              collect details such as your name, phone number, email address,
              measurements, appointment details and order preferences. We use this
              information to manage bookings, respond to enquiries and complete
              customer orders.
            </p>
          </section>

          <section className="border border-border rounded-2xl p-6 bg-card shadow-sm">
            <h2 className="font-display text-2xl text-primary mb-4">
              Contact
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about returns, shipping, orders or privacy, please
              contact us at{" "}
              <a
                href="mailto:info@tailorobe.com.au"
                className="text-accent hover:underline"
              >
                info@tailorobe.com.au
              </a>{" "}
              or call{" "}
              <a
                href="tel:0414053773"
                className="text-accent hover:underline"
              >
                0414 053 773
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-primary px-6 py-3 text-sm uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}