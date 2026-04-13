'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type AdminSection = {
  id: string;
  heading: string;
  bodyText: string;
};

type AdminBlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  publishedAtInput: string;
  featured: boolean;
  status: 'draft' | 'published';
  tags: string[];
  intro: string[];
  sections: { heading: string; body: string[] }[];
  closingCta: string;
  createdAt: string;
  updatedAt: string;
};

type EditorState = {
  id: string | null;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAtInput: string;
  featured: boolean;
  status: 'draft' | 'published';
  tagsText: string;
  introText: string;
  sections: AdminSection[];
  closingCta: string;
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function splitParagraphs(value: string): string[] {
  return value
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function newSection(): AdminSection {
  return {
    id: crypto.randomUUID(),
    heading: '',
    bodyText: '',
  };
}

function createEmptyEditor(): EditorState {
  return {
    id: null,
    title: '',
    slug: '',
    excerpt: '',
    category: '',
    readTime: '5 min read',
    publishedAtInput: new Date().toISOString().slice(0, 10),
    featured: false,
    status: 'draft',
    tagsText: '',
    introText: '',
    sections: [newSection()],
    closingCta: '',
  };
}

function toEditorState(post: AdminBlogPost): EditorState {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    category: post.category,
    readTime: post.readTime,
    publishedAtInput: post.publishedAtInput,
    featured: post.featured,
    status: post.status,
    tagsText: post.tags.join(', '),
    introText: post.intro.join('\n\n'),
    sections:
      post.sections.length > 0
        ? post.sections.map((section) => ({
            id: crypto.randomUUID(),
            heading: section.heading,
            bodyText: section.body.join('\n\n'),
          }))
        : [newSection()],
    closingCta: post.closingCta,
  };
}

export default function AdminBlogPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [editor, setEditor] = useState<EditorState>(createEmptyEditor());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  const selectedPost = useMemo(
    () => posts.find((post) => post.id === selectedPostId) || null,
    [posts, selectedPostId]
  );

  const resetEditor = () => {
    setEditor(createEmptyEditor());
    setSelectedPostId(null);
    setSlugTouched(false);
  };

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/blog-posts', {
        cache: 'no-store',
      });

      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          throw new Error('Session expired. Please log in again.');
        }

        const data = await response.json().catch(() => null);
        throw new Error(data?.message || 'Failed to load blog posts');
      }

      const data = await response.json();
      const nextPosts = Array.isArray(data.posts) ? data.posts : [];
      setPosts(nextPosts);

      if (nextPosts.length === 0) {
        resetEditor();
        return;
      }

      const nextActive =
        nextPosts.find((post: AdminBlogPost) => post.id === selectedPostId) ||
        nextPosts[0];

      setSelectedPostId(nextActive.id);
      setEditor(toEditorState(nextActive));
      setSlugTouched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch('/api/admin/blog-posts', { cache: 'no-store' }).then((response) => {
      if (response.ok) {
        setIsAuthenticated(true);
        fetchPosts();
      }
    });
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || 'Invalid password');
      }

      setPassword('');
      setIsAuthenticated(true);
      await fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setIsAuthenticated(false);
    setPosts([]);
    resetEditor();
  };

  const handleSelectPost = (post: AdminBlogPost) => {
    setSelectedPostId(post.id);
    setEditor(toEditorState(post));
    setSlugTouched(true);
    setError(null);
    setSuccess(null);
  };

  const handleNewPost = () => {
    resetEditor();
    setError(null);
    setSuccess(null);
  };

  const updateEditor = <K extends keyof EditorState>(
    key: K,
    value: EditorState[K]
  ) => {
    setEditor((current) => ({ ...current, [key]: value }));
  };

  const handleTitleChange = (value: string) => {
    setEditor((current) => ({
      ...current,
      title: value,
      slug: slugTouched ? current.slug : slugify(value),
    }));
  };

  const handleSectionChange = (
    sectionId: string,
    field: keyof AdminSection,
    value: string
  ) => {
    setEditor((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId ? { ...section, [field]: value } : section
      ),
    }));
  };

  const addSection = () => {
    setEditor((current) => ({
      ...current,
      sections: [...current.sections, newSection()],
    }));
  };

  const removeSection = (sectionId: string) => {
    setEditor((current) => ({
      ...current,
      sections:
        current.sections.length === 1
          ? current.sections
          : current.sections.filter((section) => section.id !== sectionId),
    }));
  };

  const buildPayload = () => ({
    title: editor.title,
    slug: editor.slug || slugify(editor.title),
    excerpt: editor.excerpt,
    category: editor.category,
    readTime: editor.readTime,
    publishedAt: editor.publishedAtInput,
    featured: editor.featured,
    status: editor.status,
    tags: editor.tagsText
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
    intro: splitParagraphs(editor.introText),
    sections: editor.sections.map((section) => ({
      heading: section.heading,
      body: splitParagraphs(section.bodyText),
    })),
    closingCta: editor.closingCta,
  });

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const endpoint = editor.id
        ? `/api/admin/blog-posts/${editor.id}`
        : '/api/admin/blog-posts';
      const method = editor.id ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          throw new Error('Session expired. Please log in again.');
        }

        throw new Error(data?.message || 'Failed to save blog post');
      }

      await fetchPosts();
      setSuccess(editor.id ? 'Post updated successfully.' : 'Post created successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save blog post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editor.id) return;

    const shouldDelete = window.confirm(
      'Delete this post permanently? This action cannot be undone.'
    );
    if (!shouldDelete) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/admin/blog-posts/${editor.id}`, {
        method: 'DELETE',
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          throw new Error('Session expired. Please log in again.');
        }

        throw new Error(data?.message || 'Failed to delete post');
      }

      await fetchPosts();
      setSuccess('Post deleted successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f1115] px-4 py-10 text-white">
        <div className="mx-auto max-w-md">
          <form
            onSubmit={handleLogin}
            className="rounded-[2rem] border border-white/10 bg-[#171b21] p-8"
          >
            <p className="text-xs font-sans uppercase tracking-[0.3em] text-[#BBFD6A]">
              Admin CMS
            </p>
            <h1 className="mt-4 text-4xl font-display font-semibold uppercase">
              Blog editor
            </h1>
            <p className="mt-4 text-sm font-sans leading-7 text-white/65">
              Sign in with your existing admin password to manage blog posts from anywhere.
            </p>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <label className="mt-8 block text-xs font-sans uppercase tracking-[0.22em] text-white/55">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-base text-white outline-none transition-colors focus:border-[#BBFD6A]"
              placeholder="Enter admin password"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-full bg-[#BBFD6A] px-5 py-4 text-sm font-sans font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-[#a9e65e] disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Enter CMS'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1115] px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-sans uppercase tracking-[0.3em] text-[#BBFD6A]">
              Admin CMS
            </p>
            <h1 className="mt-4 text-4xl font-display font-semibold uppercase md:text-5xl">
              Blog Management
            </h1>
            <p className="mt-4 max-w-2xl text-sm font-sans leading-7 text-white/65 md:text-base">
              Create, edit, publish, and remove blog posts without touching code. Changes go straight into your database.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-xs font-sans uppercase tracking-[0.22em] text-white/75 transition-colors hover:border-white/25"
            >
              View blog
            </Link>
            <button
              onClick={handleNewPost}
              className="rounded-full bg-[#BBFD6A] px-5 py-3 text-xs font-sans font-semibold uppercase tracking-[0.22em] text-black transition-colors hover:bg-[#a9e65e]"
            >
              New post
            </button>
            <button
              onClick={handleLogout}
              className="rounded-full border border-red-500/30 px-5 py-3 text-xs font-sans uppercase tracking-[0.22em] text-red-200 transition-colors hover:border-red-500/60"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
          <aside className="rounded-[2rem] border border-white/10 bg-[#171b21] p-4">
            <div className="flex items-center justify-between gap-4 px-2 pb-4">
              <div>
                <p className="text-xs font-sans uppercase tracking-[0.22em] text-white/45">
                  Your Posts
                </p>
                <p className="mt-2 text-sm font-sans text-white/65">
                  {posts.length} total
                </p>
              </div>
              <button
                onClick={fetchPosts}
                className="rounded-full border border-white/10 px-3 py-2 text-[11px] font-sans uppercase tracking-[0.18em] text-white/70 transition-colors hover:border-white/25"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-6 text-sm text-white/60">
                Loading posts...
              </div>
            ) : posts.length === 0 ? (
              <div className="rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-6 text-sm text-white/60">
                No posts yet. Start with your first article.
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => handleSelectPost(post)}
                    className={`w-full rounded-[1.5rem] border px-4 py-4 text-left transition-colors ${
                      selectedPost?.id === post.id
                        ? 'border-[#BBFD6A] bg-[#BBFD6A]/10'
                        : 'border-white/10 bg-black/20 hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[11px] font-sans uppercase tracking-[0.22em] text-white/45">
                        {post.status}
                      </span>
                      {post.featured && (
                        <span className="rounded-full bg-[#BBFD6A] px-2 py-1 text-[10px] font-sans font-semibold uppercase tracking-[0.16em] text-black">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-lg font-display font-semibold uppercase leading-tight">
                      {post.title}
                    </p>
                    <p className="mt-2 text-xs font-sans uppercase tracking-[0.18em] text-white/45">
                      {post.publishedAt}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </aside>

          <section className="rounded-[2rem] border border-white/10 bg-[#171b21] p-5 md:p-6">
            <form onSubmit={handleSave}>
              <div className="flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-sans uppercase tracking-[0.22em] text-white/45">
                    Editor
                  </p>
                  <h2 className="mt-3 text-3xl font-display font-semibold uppercase">
                    {editor.id ? 'Edit post' : 'Create post'}
                  </h2>
                </div>

                <div className="flex flex-wrap gap-3">
                  {editor.id && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={saving}
                      className="rounded-full border border-red-500/30 px-5 py-3 text-xs font-sans uppercase tracking-[0.18em] text-red-200 transition-colors hover:border-red-500/60 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-full bg-[#BBFD6A] px-5 py-3 text-xs font-sans font-semibold uppercase tracking-[0.18em] text-black transition-colors hover:bg-[#a9e65e] disabled:opacity-60"
                  >
                    {saving ? 'Saving...' : editor.id ? 'Update post' : 'Create post'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              {success && (
                <div className="mt-6 rounded-2xl border border-[#BBFD6A]/30 bg-[#BBFD6A]/10 px-4 py-3 text-sm text-[#efffd9]">
                  {success}
                </div>
              )}

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-sans uppercase tracking-[0.18em] text-white/50">
                    Title
                  </span>
                  <input
                    value={editor.title}
                    onChange={(event) => handleTitleChange(event.target.value)}
                    className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-base outline-none transition-colors focus:border-[#BBFD6A]"
                    placeholder="Post title"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-sans uppercase tracking-[0.18em] text-white/50">
                    Slug
                  </span>
                  <input
                    value={editor.slug}
                    onChange={(event) => {
                      setSlugTouched(true);
                      updateEditor('slug', slugify(event.target.value));
                    }}
                    className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-base outline-none transition-colors focus:border-[#BBFD6A]"
                    placeholder="post-url-slug"
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="text-xs font-sans uppercase tracking-[0.18em] text-white/50">
                    Excerpt
                  </span>
                  <textarea
                    value={editor.excerpt}
                    onChange={(event) => updateEditor('excerpt', event.target.value)}
                    rows={3}
                    className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-base outline-none transition-colors focus:border-[#BBFD6A]"
                    placeholder="Short summary for the article card and SEO description"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-sans uppercase tracking-[0.18em] text-white/50">
                    Category
                  </span>
                  <input
                    value={editor.category}
                    onChange={(event) => updateEditor('category', event.target.value)}
                    className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-base outline-none transition-colors focus:border-[#BBFD6A]"
                    placeholder="Family Tech"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-sans uppercase tracking-[0.18em] text-white/50">
                    Read Time
                  </span>
                  <input
                    value={editor.readTime}
                    onChange={(event) => updateEditor('readTime', event.target.value)}
                    className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-base outline-none transition-colors focus:border-[#BBFD6A]"
                    placeholder="6 min read"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-sans uppercase tracking-[0.18em] text-white/50">
                    Publish Date
                  </span>
                  <input
                    type="date"
                    value={editor.publishedAtInput}
                    onChange={(event) => updateEditor('publishedAtInput', event.target.value)}
                    className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-base outline-none transition-colors focus:border-[#BBFD6A]"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-sans uppercase tracking-[0.18em] text-white/50">
                    Status
                  </span>
                  <select
                    value={editor.status}
                    onChange={(event) =>
                      updateEditor('status', event.target.value as 'draft' | 'published')
                    }
                    className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-base outline-none transition-colors focus:border-[#BBFD6A]"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </label>

                <label className="block md:col-span-2">
                  <span className="text-xs font-sans uppercase tracking-[0.18em] text-white/50">
                    Tags
                  </span>
                  <input
                    value={editor.tagsText}
                    onChange={(event) => updateEditor('tagsText', event.target.value)}
                    className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-base outline-none transition-colors focus:border-[#BBFD6A]"
                    placeholder="Parenting, Screen Time, Child Development"
                  />
                </label>
              </div>

              <label className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                <input
                  type="checkbox"
                  checked={editor.featured}
                  onChange={(event) => updateEditor('featured', event.target.checked)}
                  className="h-4 w-4 accent-[#BBFD6A]"
                />
                <span className="text-sm font-sans text-white/75">
                  Mark as featured post. Saving this will remove the featured flag from any other post.
                </span>
              </label>

              <label className="mt-6 block">
                <span className="text-xs font-sans uppercase tracking-[0.18em] text-white/50">
                  Intro Paragraphs
                </span>
                <textarea
                  value={editor.introText}
                  onChange={(event) => updateEditor('introText', event.target.value)}
                  rows={8}
                  className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-base outline-none transition-colors focus:border-[#BBFD6A]"
                  placeholder="Write the opening paragraphs here. Separate paragraphs with a blank line."
                />
              </label>

              <div className="mt-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-sans uppercase tracking-[0.18em] text-white/50">
                      Sections
                    </p>
                    <p className="mt-2 text-sm font-sans text-white/60">
                      Each section becomes a heading with paragraphs underneath it.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addSection}
                    className="rounded-full border border-white/10 px-4 py-3 text-xs font-sans uppercase tracking-[0.18em] text-white/75 transition-colors hover:border-white/25"
                  >
                    Add section
                  </button>
                </div>

                <div className="mt-5 space-y-4">
                  {editor.sections.map((section, index) => (
                    <div
                      key={section.id}
                      className="rounded-[1.75rem] border border-white/10 bg-black/20 p-5"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-xs font-sans uppercase tracking-[0.18em] text-white/45">
                          Section {index + 1}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeSection(section.id)}
                          disabled={editor.sections.length === 1}
                          className="text-xs font-sans uppercase tracking-[0.18em] text-red-200 disabled:opacity-40"
                        >
                          Remove
                        </button>
                      </div>

                      <input
                        value={section.heading}
                        onChange={(event) =>
                          handleSectionChange(section.id, 'heading', event.target.value)
                        }
                        className="mt-4 w-full rounded-2xl border border-white/10 bg-[#11151a] px-4 py-4 text-base outline-none transition-colors focus:border-[#BBFD6A]"
                        placeholder="Section heading"
                      />

                      <textarea
                        value={section.bodyText}
                        onChange={(event) =>
                          handleSectionChange(section.id, 'bodyText', event.target.value)
                        }
                        rows={6}
                        className="mt-4 w-full rounded-2xl border border-white/10 bg-[#11151a] px-4 py-4 text-base outline-none transition-colors focus:border-[#BBFD6A]"
                        placeholder="Write the section content here. Separate paragraphs with a blank line."
                      />
                    </div>
                  ))}
                </div>
              </div>

              <label className="mt-8 block">
                <span className="text-xs font-sans uppercase tracking-[0.18em] text-white/50">
                  Closing CTA
                </span>
                <textarea
                  value={editor.closingCta}
                  onChange={(event) => updateEditor('closingCta', event.target.value)}
                  rows={4}
                  className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-base outline-none transition-colors focus:border-[#BBFD6A]"
                  placeholder="Final takeaway or call to action"
                />
              </label>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
