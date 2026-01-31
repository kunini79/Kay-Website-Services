import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Branding & UI/UX",
  description:
    "Branding, messaging, and UI/UX systems that make your product feel premium and consistent.",
};

export default function BrandingUiUxPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5] text-black px-4 md:px-[5vw] py-[12vh]">
      <h1 className="text-[12vw] md:text-[5vw] font-display font-semibold uppercase">
        Branding & UI/UX
      </h1>
      <p className="mt-4 md:mt-6 text-base md:text-lg font-sans text-black/70 max-w-3xl">
        We define your brand’s tone, visuals, and product experience so everything feels consistent and professional.
      </p>

      <ul className="mt-8 space-y-3 text-sm md:text-base font-sans text-black/80">
        <li>• Brand identity and messaging</li>
        <li>• Visual systems and guidelines</li>
        <li>• UX audits and improvements</li>
        <li>• Product and marketing alignment</li>
      </ul>
    </main>
  );
}
