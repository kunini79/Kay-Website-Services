import AnimatedSection from "./AnimatedSection";
import Link from "next/link";
import { engagementOptions } from "@/data/engagements";

export default function Engagements() {
  return (
    <section className="w-full py-[10vh] md:py-[14vh]" style={{ backgroundColor: "var(--background)" }} id="engagements">
      <div className="px-4 md:px-[5vw]">
        <AnimatedSection animation="fade">
          <h2 className="text-[12vw] md:text-[5vw] leading-none font-display font-semibold uppercase" style={{ color: "var(--foreground)" }}>
            Engagement Options
          </h2>
          <p className="mt-4 md:mt-6 text-base md:text-lg font-sans max-w-2xl" style={{ color: "var(--foreground)" }}>
            Choose a path that fits your timeline and goals. We can start lean and scale as you grow.
          </p>
        </AnimatedSection>

        <AnimatedSection animation="fade" stagger={0.15} className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {engagementOptions.map((option) => (
            <div key={option.title} className="border border-black/10 dark:border-white/10 rounded-2xl p-6 md:p-8 dark:bg-zinc-900/50" style={{ backgroundColor: "var(--background)" }}>
              <h3 className="text-[6vw] md:text-[2vw] font-display font-semibold" style={{ color: "var(--foreground)" }}>
                {option.title}
              </h3>
              <p className="mt-3 text-sm md:text-base font-sans" style={{ color: "var(--foreground)" }}>
                {option.description}
              </p>
              <ul className="mt-4 space-y-2">
                {option.highlights.map((item) => (
                  <li key={item} className="text-sm md:text-base font-sans" style={{ color: "var(--foreground)" }}>
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </AnimatedSection>

        <AnimatedSection animation="fade" className="mt-10">
          <Link href="/services" className="group inline-flex items-center gap-2 font-sans text-sm uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Explore all services <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
