import AnimatedSection from "./AnimatedSection";
import { faqs } from "@/data/faqs";

export default function FaqSection() {
  return (
    <section className="w-full bg-white text-black py-[10vh] md:py-[14vh]" id="faq">
      <div className="px-4 md:px-[5vw]">
        <AnimatedSection animation="fade">
          <h2 className="text-[12vw] md:text-[5vw] leading-none font-display font-semibold uppercase">
            FAQ
          </h2>
          <p className="mt-4 md:mt-6 text-base md:text-lg font-sans text-black/70 max-w-2xl">
            Quick answers to the most common questions.
          </p>
        </AnimatedSection>

        <AnimatedSection animation="fade" stagger={0.1} className="mt-8 md:mt-12 space-y-4">
          {faqs.map((item) => (
            <details key={item.question} className="group border border-black/10 rounded-xl p-4 md:p-6">
              <summary className="cursor-pointer list-none flex items-center justify-between">
                <h3 className="text-base md:text-lg font-sans font-semibold">{item.question}</h3>
                <span className="text-black/50 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-sm md:text-base font-sans text-black/70">
                {item.answer}
              </p>
            </details>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}
