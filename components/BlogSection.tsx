import Link from "next/link";
import AnimatedSection from "./AnimatedSection";
import { blogPosts } from "@/data/blogPosts";

export default function BlogSection() {
  const featuredPost = blogPosts[0];

  return (
    <section
      className="w-full py-[10vh] md:py-[14vh]"
      style={{ backgroundColor: "#f6f1e8", color: "#0a0a0a", colorScheme: "light" }}
      id="blog"
    >
      <div className="px-4 md:px-[5vw]">
        <AnimatedSection
          animation="fade"
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-3xl">
            <p className="text-xs md:text-sm font-sans uppercase tracking-[0.3em] text-lime-700">
              Insights
            </p>
            <h2 className="mt-3 text-[12vw] md:text-[5vw] leading-none font-display font-semibold uppercase">
              From the KayCorp Blog
            </h2>
            <p className="mt-4 md:mt-6 max-w-2xl text-base font-sans text-black/70 md:text-lg">
              Thoughtful writing on technology, digital habits, and the way modern tools shape family life.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex w-fit items-center gap-3 rounded-full border border-black/10 px-5 py-3 text-sm font-sans uppercase tracking-[0.2em] transition-colors hover:border-black/30"
          >
            Visit blog
            <span aria-hidden="true">-&gt;</span>
          </Link>
        </AnimatedSection>

        <div className="mt-10 md:mt-14">
          <AnimatedSection animation="fade">
            <article className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-black px-6 py-8 text-white md:px-10 md:py-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(187,253,106,0.28),_transparent_40%),linear-gradient(135deg,_rgba(255,255,255,0.06),_transparent_55%)]" />
              <div className="relative z-10">
                <div className="flex h-full flex-col justify-between gap-8">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-sans uppercase tracking-[0.25em] text-white/60">
                      <span>{featuredPost.category}</span>
                      <span>{featuredPost.publishedAt}</span>
                      <span>{featuredPost.readTime}</span>
                    </div>
                    <h3 className="mt-5 max-w-3xl text-[10vw] leading-[0.9] font-display font-semibold uppercase md:text-[4vw]">
                      {featuredPost.title}
                    </h3>
                    <p className="mt-5 max-w-2xl text-sm font-sans leading-7 text-white/75 md:text-base">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div className="flex flex-wrap gap-2">
                      {featuredPost.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/15 px-3 py-1 text-xs font-sans uppercase tracking-[0.15em] text-white/75"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center gap-3 text-sm font-sans uppercase tracking-[0.2em] text-[#BBFD6A]"
                    >
                      Read article
                      <span aria-hidden="true">-&gt;</span>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
