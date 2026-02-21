import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import BodyContent from "@/app/components/BodyContent";

export const metadata: Metadata = {
  metadataBase: new URL("https://kaycorp.tech"),
  title: {
    default: "Kay Website Services | Web Design, Development & Branding",
    template: "%s | Kay Website Services",
  },
  description:
    "Kay Website Services helps startups and businesses build high‑converting websites, web apps, and brand experiences. Based in Yola, Nigeria. Available worldwide.",
  applicationName: "Kay Website Services",
  keywords: [
    "web design",
    "web development",
    "branding",
    "UI/UX",
    "Next.js agency",
    "website redesign",
    "startup websites",
    "Nigeria web agency",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://kaycorp.tech",
    siteName: "Kay Website Services",
    title: "Kay Website Services | Web Design, Development & Branding",
    description:
      "High‑converting websites and digital experiences for modern businesses.",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Kay Website Services",
    description:
      "Web design, development, and branding for modern businesses.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Script id="ld-json" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Kay Website Services",
            url: "https://kaycorp.tech",
            email: "info@kaycorp.tech",
            telephone: "+2347011350459",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Yola",
              addressCountry: "NG",
            },
            sameAs: ["https://instagram.com/kaycorp"],
            description:
              "Web design, development, and branding studio for startups and businesses.",
            serviceArea: {
              "@type": "Place",
              name: "Worldwide",
            },
            makesOffer: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Web Design",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Web Development",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Branding & UI/UX",
                },
              },
            ],
          })}
        </Script>
        <BodyContent>{children}</BodyContent>
        <Analytics />
      </body>
    </html>
  );
}
