import AnimatedSection from "./AnimatedSection";
import Link from "next/link";
import { engagementOptions } from "@/data/engagements";

export default function Engagements() {
  return (
    <section className="w-full bg-[#f5f5f5] text-black py-[10vh] md:py-[14vh]" id="engagements">
      <div className="px-4 md:px-[5vw]">
        <AnimatedSection animation="fade">
          <h2 className="text-[12vw] md:text-[5vw] leading-none font-display font-semibold uppercase">
            Engagement Options
          </h2>
          <p className="mt-4 md:mt-6 text-base md:text-lg font-sans text-black/70 max-w-2xl">
            Choose a path that fits your timeline and goals. We can start lean and scale as you grow.
          </p>
        </AnimatedSection>

        <AnimatedSection animation="fade" stagger={0.15} className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {engagementOptions.map((option) => (
            <div key={option.title} className="bg-white border border-black/10 rounded-2xl p-6 md:p-8">
              <h3 className="text-[6vw] md:text-[2vw] font-display font-semibold">
                {option.title}
              </h3>
              <p className="mt-3 text-sm md:text-base font-sans text-black/70">
                {option.description}
              </p>
              <ul className="mt-4 space-y-2">
                {option.highlights.map((item) => (
                  <li key={item} className="text-sm md:text-base font-sans text-black/80">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </AnimatedSection>

        <AnimatedSection animation="fade" className="mt-10">
          <Link href="/services" className="group inline-flex items-center gap-2 text-black font-sans text-sm uppercase tracking-wider">
            Explore all services <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
