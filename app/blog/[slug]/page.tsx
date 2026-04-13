import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogNewsletterSignup from "@/components/BlogNewsletterSignup";
import Navigation from "@/components/Navigation";
import { blogPosts } from "@/data/blogPosts";

type BlogArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((entry) => entry.slug === slug);

  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogArticlePage({
  params,
}: BlogArticlePageProps) {
  const { slug } = await params;
  const post = blogPosts.find((entry) => entry.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <main
        className="min-h-screen bg-[#f6f1e8] px-4 py-[12vh] text-black md:px-[5vw] md:py-[14vh]"
        style={{ colorScheme: "light" }}
      >
        <section className="mx-auto max-w-6xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.24em] text-black/50 transition-colors hover:text-black"
          >
            <span aria-hidden="true">&lt;-</span>
            Back to blog
          </Link>

          <div className="mt-8">
            <div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-sans uppercase tracking-[0.25em] text-lime-700">
                <span>{post.category}</span>
                <span>{post.publishedAt}</span>
                <span>{post.readTime}</span>
              </div>
              <h1 className="mt-5 text-[14vw] leading-[0.88] font-display font-semibold uppercase md:text-[6vw]">
                {post.title}
              </h1>
              <p className="mt-6 max-w-2xl text-base font-sans leading-8 text-black/72 md:text-lg">
                {post.excerpt}
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-black/10 px-3 py-1 text-xs font-sans uppercase tracking-[0.15em] text-black/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-6xl">
          <article className="rounded-[2rem] border border-black/10 bg-white p-6 md:p-10">
            <div className="space-y-6">
              {post.intro.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-base font-sans leading-8 text-black/78 md:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-10 rounded-[1.75rem] border border-lime-300/50 bg-lime-50 p-6 md:p-8">
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-lime-700">
                Key Takeaway
              </p>
              <p className="mt-4 text-[9vw] leading-[0.92] font-display font-semibold uppercase text-black md:text-[3vw]">
                This is not about guilt. It is about understanding how young brains process digital life.
              </p>
            </div>

            <div className="mt-12 space-y-12">
              {post.sections.map((section, index) => (
                <section key={section.heading}>
                  <div className="flex items-center gap-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-lime-400 bg-lime-100 text-lg font-semibold text-black">
                      {index + 1}
                    </span>
                    <h2 className="text-[10vw] leading-[0.92] font-display font-semibold uppercase md:text-[3.2vw]">
                      {section.heading}
                    </h2>
                  </div>
                  <div className="mt-6 space-y-4">
                    {section.body.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-base font-sans leading-8 text-black/78 md:text-lg"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </article>
        </section>

        <section className="mx-auto mt-12 max-w-6xl rounded-[2rem] border border-black/10 bg-[#f5f5f5] p-6 md:p-10">
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-black/45">
            Next Step
          </p>
          <p className="mt-4 max-w-4xl text-[10vw] leading-[0.92] font-display font-semibold uppercase md:text-[3.6vw]">
            {post.closingCta}
          </p>
        </section>

        <div className="mx-auto max-w-6xl">
          <BlogNewsletterSignup />
        </div>
      </main>
      <Navigation />
    </>
  );
}
