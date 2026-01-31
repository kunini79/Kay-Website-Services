import AnimatedSection from "./AnimatedSection";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="w-full bg-black text-white py-[10vh] md:py-[14vh]" id="cta">
      <div className="px-4 md:px-[5vw]">
        <AnimatedSection animation="fade">
          <h2 className="text-[12vw] md:text-[6vw] leading-none font-display font-semibold uppercase">
            Ready to Build Something That Converts?
          </h2>
          <p className="mt-4 md:mt-6 text-base md:text-lg font-sans text-white/70 max-w-2xl">
            Get a free audit and a clear plan for your next website move. We’ll reply within 24–48 hours.
          </p>
          <div className="mt-8">
            <Link href="/contact" className="inline-block">
              <button className="text-[4vw] rounded-lg cursor-pointer md:text-[1.3vw] tracking-wide text-black font-semibold font-display uppercase px-8 py-4 md:px-8 md:py-4 bg-[#BBFD6A] group overflow-hidden relative transition-all hover:bg-[#a9e65e]">
                <span className="relative overflow-clip inline-block" style={{ transformStyle: "preserve-3d", perspective: "1000px" }}>
                  <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full" style={{ transformStyle: "preserve-3d" }}>
                    Request Free Audit
                  </span>
                  <span className="inline-block absolute top-0 left-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0" style={{ transformStyle: "preserve-3d" }}>
                    Request Free Audit
                  </span>
                </span>
              </button>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
