import AnimatedSection from "./AnimatedSection";
import { projects } from "@/data/projects";

export default function CaseStudies() {
  return (
    <section className="w-full bg-[#f5f5f5] text-black py-[10vh] md:py-[14vh]" id="case-studies">
      <div className="px-4 md:px-[5vw]">
        <AnimatedSection animation="fade">
          <h2 className="text-[12vw] md:text-[5vw] leading-none font-display font-semibold uppercase">
            Case Studies
          </h2>
          <p className="mt-4 md:mt-6 text-base md:text-lg font-sans text-black/70 max-w-2xl">
            Real projects, real outcomes. Here are a few recent builds and what we focused on.
          </p>
        </AnimatedSection>

        <AnimatedSection animation="fade" stagger={0.15} className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {projects.map((project) => (
            <a
              key={project.id}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white border border-black/10 rounded-2xl p-6 md:p-8 hover:border-black/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[6vw] md:text-[2vw] font-display font-semibold">
                  {project.title}
                </h3>
                <span className="text-xs md:text-sm font-sans text-black/50">0{project.id}</span>
              </div>
              <p className="mt-3 md:mt-4 text-sm md:text-base font-sans text-black/70">
                {project.description}
              </p>
              <div className="mt-4 md:mt-6 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs md:text-sm font-sans text-black/60 border border-black/10 rounded-full px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-6 inline-flex items-center gap-2 text-lime-700 font-sans text-sm uppercase tracking-wider">
                View project
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </a>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}
