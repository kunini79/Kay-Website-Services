import { projects } from "@/data/projects";
import AnimatedSection from "./AnimatedSection";

export default function TrustedBy() {
  return (
    <section className="w-full bg-black text-white py-[10vh] md:py-[12vh]">
      <div className="px-4 md:px-[5vw]">
        <AnimatedSection animation="fade">
          <p className="text-xs md:text-sm font-sans uppercase tracking-[0.3em] text-white/60">
            Trusted By
          </p>
        </AnimatedSection>

        <AnimatedSection animation="fade" className="mt-6 md:mt-10">
          <div className="flex flex-wrap gap-4 md:gap-6">
            {projects.map((project) => (
              <span
                key={project.id}
                className="px-4 py-2 md:px-5 md:py-3 border border-white/15 rounded-full text-sm md:text-base font-sans text-white/80"
              >
                {project.title}
              </span>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade" className="mt-8 md:mt-12">
          <p className="text-white/70 font-sans text-base md:text-lg max-w-3xl">
            We build fast, conversion-focused websites and digital products for teams
            that need clarity, polish, and measurable results.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
