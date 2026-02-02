import Link from "next/link";

const projectRates = [
  {
    title: "Basic / Landing Page (1–3 pages)",
    price: "₦150,000 – ₦350,000",
    usd: "$94 – $219",
  },
  {
    title: "Small Business / Corporate (5–15 pages, CMS)",
    price: "₦300,000 – ₦750,000",
    usd: "$188 – $469",
  },
  {
    title: "E‑commerce (up to 100 products)",
    price: "₦500,000 – ₦2,000,000+",
    usd: "$313 – $1,250+",
  },
  {
    title: "Advanced Custom Web Applications",
    price: "₦1,500,000 – ₦7,500,000+",
    usd: "$938 – $4,688+",
  },
  {
    title: "Website Redesign",
    price: "₦150,000 – ₦2,000,000+",
    usd: "$94 – $1,250+",
  },
];

const recurringCosts = [
  {
    title: "Domain (.com)",
    price: "₦20,000 – ₦40,000 / year",
    usd: "$13 – $25 / year",
  },
  {
    title: "Domain (.ng)",
    price: "₦15,000 – ₦25,000 / year",
    usd: "$9 – $16 / year",
  },
  {
    title: "Web Hosting (shared)",
    price: "₦25,000 – ₦100,000+ / year",
    usd: "$16 – $63+ / year",
  },
  {
    title: "SSL Certificate",
    price: "₦5,000 – ₦150,000 / year (often free)",
    usd: "$3 – $94 / year (often free)",
  },
  {
    title: "Website Maintenance",
    price: "₦30,000 – ₦150,000+ / year",
    usd: "$19 – $94+ / year",
  },
];

const addOns = [
  {
    title: "1‑Hour Consultation",
    price: "₦50,000",
    usd: "$31",
  },
  {
    title: "Additional Web Pages",
    price: "₦30,000 per page",
    usd: "$19 per page",
  },
  {
    title: "Content / Copywriting",
    price: "₦30,000 – ₦50,000 per page",
    usd: "$19 – $31 per page",
  },
  {
    title: "SEO Setup",
    price: "₦50,000+ per project",
    usd: "$31+ per project",
  },
];

const costFactors = [
  "Platform: WordPress/ready‑made themes are cheaper than fully custom builds.",
  "Functionality: E‑commerce, payment gateways, portals, and APIs increase scope.",
  "Timeline: Rushed projects may incur premium charges for expedited delivery.",
];

export default function RateCard() {
  return (
    <section className="mt-14 md:mt-20" id="rate-card">
      <div className="bg-white border border-black/10 rounded-3xl p-6 md:p-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h2 className="text-[8vw] md:text-[3vw] leading-none font-display font-semibold uppercase">
              Payment & Rate Card
            </h2>
            <p className="mt-3 text-sm md:text-base font-sans text-black/70 max-w-3xl">
              Transparent ranges to help you plan. Final quotes depend on scope, content readiness, and timeline.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-black/10 px-5 py-3 text-sm md:text-base font-sans hover:border-black/30 transition-colors"
          >
            Request a custom quote
          </Link>
        </div>

        <div className="mt-8">
          <h3 className="text-[6vw] md:text-[2vw] font-display font-semibold uppercase">
            Website development project rates
          </h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {projectRates.map((item) => (
              <div key={item.title} className="rounded-2xl border border-black/10 p-5 md:p-6">
                <h4 className="text-lg md:text-xl font-display font-semibold">{item.title}</h4>
                <p className="mt-2 text-base md:text-lg font-semibold text-black">{item.price}</p>
                <p className="mt-1 text-sm md:text-base font-sans text-black/60">{item.usd}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 md:mt-14">
          <h3 className="text-[6vw] md:text-[2vw] font-display font-semibold uppercase">
            Recurring costs (annual)
          </h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {recurringCosts.map((item) => (
              <div key={item.title} className="rounded-2xl border border-black/10 p-5 md:p-6">
                <h4 className="text-lg md:text-xl font-display font-semibold">{item.title}</h4>
                <p className="mt-2 text-base md:text-lg font-semibold text-black">{item.price}</p>
                <p className="mt-1 text-sm md:text-base font-sans text-black/60">{item.usd}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 md:mt-14">
          <h3 className="text-[6vw] md:text-[2vw] font-display font-semibold uppercase">
            Additional services (add‑ons)
          </h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {addOns.map((item) => (
              <div key={item.title} className="rounded-2xl border border-black/10 p-5 md:p-6">
                <h4 className="text-lg md:text-xl font-display font-semibold">{item.title}</h4>
                <p className="mt-2 text-base md:text-lg font-semibold text-black">{item.price}</p>
                <p className="mt-1 text-sm md:text-base font-sans text-black/60">{item.usd}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 md:mt-14">
          <h3 className="text-[6vw] md:text-[2vw] font-display font-semibold uppercase">
            Key factors influencing cost
          </h3>
          <ul className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 text-sm md:text-base font-sans text-black/80">
            {costFactors.map((item) => (
              <li key={item} className="flex items-start gap-2 rounded-xl border border-black/10 p-4">
                <span className="mt-1 size-2 rounded-full bg-black/70" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
