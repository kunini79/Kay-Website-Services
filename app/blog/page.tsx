import type { Metadata } from "next";
import Link from "next/link";
import BlogNewsletterSignup from "@/components/BlogNewsletterSignup";
import Navigation from "@/components/Navigation";
import { getPublishedBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles from KayCorp on technology, digital habits, and how modern life interacts with screens and family wellbeing.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();
  const featuredPost = posts[0];

  if (!featuredPost) {
    return (
      <>
        <main
          className="min-h-screen bg-[#f6f1e8] px-4 py-[12vh] text-black md:px-[5vw] md:py-[14vh]"
          style={{ colorScheme: "light" }}
        >
          <section className="max-w-4xl">
            <p className="text-xs font-sans uppercase tracking-[0.3em] text-lime-700 md:text-sm">
              KayCorp Journal
            </p>
            <h1 className="mt-4 text-[16vw] leading-[0.9] font-display font-semibold uppercase md:text-[7vw]">
              No published posts yet.
            </h1>
            <p className="mt-6 max-w-2xl text-base font-sans text-black/70 md:text-lg">
              Your blog CMS is ready. Publish your first article and it will appear here automatically.
            </p>
            <div className="mt-8">
              <Link
                href="/admin/blog"
                className="inline-flex items-center gap-3 rounded-full bg-black px-5 py-3 text-sm font-sans font-semibold uppercase tracking-[0.2em] text-white"
              >
                Open CMS
                <span aria-hidden="true">-&gt;</span>
              </Link>
            </div>
          </section>

          <BlogNewsletterSignup />
        </main>
        <Navigation />
      </>
    );
  }

  return (
    <>
      <main
        className="min-h-screen bg-[#f6f1e8] px-4 py-[12vh] text-black md:px-[5vw] md:py-[14vh]"
        style={{ colorScheme: "light" }}
      >
        <section className="max-w-6xl">
          <p className="text-xs font-sans uppercase tracking-[0.3em] text-lime-700 md:text-sm">
            KayCorp Journal
          </p>
          <h1 className="mt-4 text-[16vw] leading-[0.9] font-display font-semibold uppercase md:text-[7vw]">
            Technology, family life, and what deserves attention.
          </h1>
          <p className="mt-6 max-w-2xl text-base font-sans text-black/70 md:text-lg">
            A focused editorial space for thoughtful pieces on digital habits, emerging guidance, and practical decisions that affect everyday life.
          </p>
        </section>

        <section className="mt-12">
          <article className="overflow-hidden rounded-[2rem] border border-black/10 bg-black px-6 py-8 text-white md:px-10 md:py-10">
            <div className="flex flex-wrap items-center gap-3 text-xs font-sans uppercase tracking-[0.25em] text-white/60">
              <span>Featured</span>
              <span>{featuredPost.category}</span>
              <span>{featuredPost.publishedAt}</span>
              <span>{featuredPost.readTime}</span>
            </div>
            <h2 className="mt-5 text-[10vw] leading-[0.92] font-display font-semibold uppercase md:text-[4.5vw]">
              {featuredPost.title}
            </h2>
            <p className="mt-5 max-w-2xl text-sm font-sans leading-7 text-white/75 md:text-base">
              {featuredPost.excerpt}
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {featuredPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/15 px-3 py-1 text-xs font-sans uppercase tracking-[0.15em] text-white/75"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-12 rounded-[2rem] border border-black/10 bg-white p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-black/45">
                Read Now
              </p>
              <h2 className="mt-4 text-[9vw] leading-[0.9] font-display font-semibold uppercase md:text-[3vw]">
                {featuredPost.title}
              </h2>
            </div>
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="inline-flex items-center gap-3 rounded-full border border-black/10 px-5 py-3 text-sm font-sans uppercase tracking-[0.2em] transition-colors hover:border-black/30"
            >
              Open article
              <span aria-hidden="true">-&gt;</span>
            </Link>
          </div>

          <p className="mt-6 text-xs font-sans uppercase tracking-[0.25em] text-black/45">
            Article Snapshot
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {featuredPost.sections.slice(0, 3).map((section) => (
              <div
                key={section.heading}
                className="rounded-[1.5rem] border border-black/10 bg-[#f8f8f8] p-5"
              >
                <h3 className="text-[8vw] leading-[0.9] font-display font-semibold uppercase md:text-[2vw]">
                  {section.heading}
                </h3>
                <p className="mt-4 text-sm font-sans leading-7 text-black/70">
                  {section.body[0]}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-[2rem] border border-black/10 bg-white p-6 md:p-8">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-black/45">
                Live Blog
              </p>
              <p className="mt-3 text-sm font-sans leading-7 text-black/70 md:text-base">
                New posts you publish from the CMS will appear here automatically.
              </p>
            </div>
            <Link
              href="/admin/blog"
              className="inline-flex items-center gap-3 rounded-full bg-[#BBFD6A] px-5 py-3 text-sm font-sans font-semibold uppercase tracking-[0.2em] text-black"
            >
              Open CMS
              <span aria-hidden="true">-&gt;</span>
            </Link>
          </div>
        </section>

        <BlogNewsletterSignup />
      </main>
      <Navigation />
    </>
  );
}
