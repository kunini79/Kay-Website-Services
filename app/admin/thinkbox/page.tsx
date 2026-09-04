'use client';

import { useEffect, useState } from 'react';

type Article = {
  id: string;
  topicId: string;
  title: string;
  intro: string;
  funFact: string;
  sections: { subtitle: string; content: string }[];
  relatedTopics: string[];
  category: string;
  imageSeed: string;
  ageRange: [number, number];
  source?: { type?: string; title?: string; url?: string };
  reviewStatus: 'ai-draft' | 'review' | 'published' | 'needs-update';
  quiz?: { question: string; options: string[]; correctAnswer: number; explanation: string }[];
};

type Editor = Omit<Article, 'id'> & { id: string | null; relatedTopicsText: string };

const emptyEditor = (): Editor => ({
  id: null,
  topicId: '',
  title: '',
  intro: '',
  funFact: '',
  sections: [{ subtitle: '', content: '' }],
  relatedTopics: [],
  relatedTopicsText: '',
  category: 'Animals & Nature',
  imageSeed: '',
  ageRange: [8, 12],
  source: { type: 'editorial', title: '', url: '' },
  reviewStatus: 'review',
  quiz: [],
});

function toEditor(article: Article): Editor {
  return { ...article, quiz: article.quiz || [], relatedTopicsText: article.relatedTopics.join(', ') };
}

export default function ThinkBoxAdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [editor, setEditor] = useState<Editor>(emptyEditor());
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadArticles = async () => {
    setBusy(true);
    try {
      const response = await fetch('/api/admin/thinkbox-articles', { cache: 'no-store' });
      if (response.status === 401) throw new Error('Session expired. Please sign in again.');
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to load articles');
      setArticles(data.articles || []);
      if (data.articles?.length) setEditor(toEditor(data.articles[0]));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load articles');
      setAuthenticated(false);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    fetch('/api/admin/thinkbox-articles', { cache: 'no-store' }).then((response) => {
      if (response.ok) {
        setAuthenticated(true);
        loadArticles();
      }
    });
  }, []);

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || 'Invalid password');
      setPassword('');
      setAuthenticated(true);
      await loadArticles();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  const update = <K extends keyof Editor>(key: K, value: Editor[K]) => {
    setEditor((current) => ({ ...current, [key]: value }));
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    const payload = {
      ...editor,
      relatedTopics: editor.relatedTopicsText.split(',').map((topic) => topic.trim()).filter(Boolean),
      source: editor.source,
    };
    delete (payload as Partial<Editor>).id;
    delete (payload as Partial<Editor>).relatedTopicsText;
    try {
      const response = await fetch(
        editor.id ? `/api/admin/thinkbox-articles/${editor.id}` : '/api/admin/thinkbox-articles',
        { method: editor.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
      );
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || 'Unable to save article');
      setMessage('Article saved.');
      await loadArticles();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to save article');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!editor.id || !window.confirm('Delete this article permanently?')) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/thinkbox-articles/${editor.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Unable to delete article');
      setEditor(emptyEditor());
      setMessage('Article deleted.');
      await loadArticles();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to delete article');
    } finally {
      setBusy(false);
    }
  };

  const updateQuiz = (index: number, field: string, value: string) => {
    const quiz = [...(editor.quiz || [])];
    const current = quiz[index];
    if (!current) return;
    if (field === 'correctAnswer') current.correctAnswer = Number(value);
    else if (field === 'question' || field === 'explanation') current[field] = value;
    else current.options[Number(field)] = value;
    update('quiz', quiz);
  };

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[#0f1115] px-4 py-16 text-white">
        <form onSubmit={login} className="mx-auto max-w-md rounded-3xl border border-white/10 bg-[#171b21] p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[#BBFD6A]">ThinkBox CMS</p>
          <h1 className="mt-4 text-4xl font-semibold">Article library</h1>
          <p className="mt-3 text-sm leading-6 text-white/60">Review and publish trusted educational content.</p>
          {error && <p className="mt-5 rounded-xl bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
          <label className="mt-6 block text-xs uppercase tracking-widest text-white/60">Admin password</label>
          <input className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-white" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <button className="mt-5 w-full rounded-full bg-[#BBFD6A] px-5 py-3 font-semibold text-black" disabled={busy}>Sign in</button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f1115] px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs uppercase tracking-[0.3em] text-[#BBFD6A]">ThinkBox CMS</p><h1 className="mt-3 text-4xl font-semibold">Article library</h1><p className="mt-2 text-sm text-white/60">Only published articles are served to learners.</p></div>
          <div className="flex gap-3"><button onClick={() => setEditor(emptyEditor())} className="rounded-full bg-[#BBFD6A] px-4 py-2 text-sm font-semibold text-black">New article</button><button onClick={() => { fetch('/api/admin/logout', { method: 'POST' }); setAuthenticated(false); }} className="rounded-full border border-white/15 px-4 py-2 text-sm">Logout</button></div>
        </header>
        {error && <p className="mb-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
        {message && <p className="mb-4 rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-200">{message}</p>}
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-3xl border border-white/10 bg-[#171b21] p-4">
            <p className="mb-4 text-xs uppercase tracking-widest text-white/50">Articles ({articles.length})</p>
            <div className="space-y-2">{articles.map((article) => <button key={article.id} onClick={() => setEditor(toEditor(article))} className={`w-full rounded-xl border p-3 text-left ${editor.id === article.id ? 'border-[#BBFD6A] bg-white/10' : 'border-white/10'}`}><span className="block font-medium">{article.title}</span><span className="text-xs text-white/50">{article.reviewStatus} · {article.topicId}</span></button>)}</div>
          </aside>
          <form onSubmit={save} className="rounded-3xl border border-white/10 bg-[#171b21] p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <label>Topic ID<input required value={editor.topicId} onChange={(event) => update('topicId', event.target.value)} placeholder="chicken" /></label>
              <label>Title<input required value={editor.title} onChange={(event) => update('title', event.target.value)} /></label>
              <label>Category<input required value={editor.category} onChange={(event) => update('category', event.target.value)} /></label>
              <label>Image seed<input required value={editor.imageSeed} onChange={(event) => update('imageSeed', event.target.value)} placeholder="Chicken (bird)" /></label>
              <label>Minimum age<input type="number" min="5" max="18" value={editor.ageRange[0]} onChange={(event) => update('ageRange', [Number(event.target.value), editor.ageRange[1]])} /></label>
              <label>Maximum age<input type="number" min="5" max="18" value={editor.ageRange[1]} onChange={(event) => update('ageRange', [editor.ageRange[0], Number(event.target.value)])} /></label>
              <label>Status<select value={editor.reviewStatus} onChange={(event) => update('reviewStatus', event.target.value as Editor['reviewStatus'])}><option value="ai-draft">AI draft</option><option value="review">Review</option><option value="published">Published</option><option value="needs-update">Needs update</option></select></label>
              <label>Related topics<input value={editor.relatedTopicsText} onChange={(event) => update('relatedTopicsText', event.target.value)} placeholder="Birds, Eggs, Farm Animals" /></label>
            </div>
            <label className="mt-4">Introduction<textarea required rows={4} value={editor.intro} onChange={(event) => update('intro', event.target.value)} /></label>
            <label className="mt-4">Fun fact<textarea rows={2} value={editor.funFact} onChange={(event) => update('funFact', event.target.value)} /></label>
            <div className="mt-5"><div className="mb-2 flex items-center justify-between"><span className="text-sm font-semibold">Sections</span><button type="button" onClick={() => update('sections', [...editor.sections, { subtitle: '', content: '' }])} className="text-sm text-[#BBFD6A]">Add section</button></div>{editor.sections.map((section, index) => <div key={index} className="mb-3 rounded-2xl border border-white/10 p-3"><input required placeholder="Section heading" value={section.subtitle} onChange={(event) => update('sections', editor.sections.map((item, itemIndex) => itemIndex === index ? { ...item, subtitle: event.target.value } : item))} /><textarea required className="mt-2" rows={4} placeholder="Section content" value={section.content} onChange={(event) => update('sections', editor.sections.map((item, itemIndex) => itemIndex === index ? { ...item, content: event.target.value } : item))} /></div>)}</div>
            <div className="mt-5"><div className="mb-2 flex items-center justify-between"><span className="text-sm font-semibold">Quiz</span><button type="button" onClick={() => update('quiz', [...(editor.quiz || []), { question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }])} className="text-sm text-[#BBFD6A]">Add question</button></div>{(editor.quiz || []).map((question, index) => <div key={index} className="mb-3 rounded-2xl border border-white/10 p-3"><input placeholder="Question" value={question.question} onChange={(event) => updateQuiz(index, 'question', event.target.value)} />{question.options.map((option, optionIndex) => <input key={optionIndex} className="mt-2" placeholder={`Option ${optionIndex + 1}`} value={option} onChange={(event) => updateQuiz(index, String(optionIndex), event.target.value)} />)}<label className="mt-2">Correct option<select value={question.correctAnswer} onChange={(event) => updateQuiz(index, 'correctAnswer', event.target.value)}><option value={0}>Option 1</option><option value={1}>Option 2</option><option value={2}>Option 3</option><option value={3}>Option 4</option></select></label><textarea className="mt-2" rows={2} placeholder="Explanation" value={question.explanation} onChange={(event) => updateQuiz(index, 'explanation', event.target.value)} /></div>)}</div>
            <div className="grid gap-4 md:grid-cols-2"><label>Source title<input value={editor.source?.title || ''} onChange={(event) => update('source', { ...editor.source, title: event.target.value })} /></label><label>Source URL<input type="url" value={editor.source?.url || ''} onChange={(event) => update('source', { ...editor.source, url: event.target.value })} /></label></div>
            <div className="mt-6 flex gap-3"><button disabled={busy} className="rounded-full bg-[#BBFD6A] px-5 py-3 font-semibold text-black">{busy ? 'Saving...' : 'Save article'}</button>{editor.id && <button type="button" onClick={remove} className="rounded-full border border-red-500/40 px-5 py-3 text-red-200">Delete</button>}</div>
          </form>
        </div>
      </div>
      <style jsx>{`label { display: block; color: rgba(255,255,255,.65); font-size: .8rem; } input, textarea, select { display: block; width: 100%; margin-top: .45rem; border: 1px solid rgba(255,255,255,.12); border-radius: .75rem; background: rgba(0,0,0,.2); color: white; padding: .75rem; } textarea { resize: vertical; } option { color: black; }`}</style>
    </main>
  );
}