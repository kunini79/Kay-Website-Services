'use client';

import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, Loader2, Search, X } from 'lucide-react';

interface DictionaryEntry {
  word: string;
  meaning: string;
  example: string;
  partOfSpeech?: string;
}

export const DictionaryPanel: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [word, setWord] = useState('');
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [recentWords, setRecentWords] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const openDictionary = () => setOpen(true);
    window.addEventListener('tb-dictionary-open', openDictionary);
    return () => window.removeEventListener('tb-dictionary-open', openDictionary);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('tb-dictionary-recent') || '[]');
      if (Array.isArray(stored)) setRecentWords(stored.filter((item): item is string => typeof item === 'string').slice(0, 8));
    } catch {
      setRecentWords([]);
    }
  }, []);

  async function lookupWord(query: string) {
    if (!query || loading) return;
    setWord(query);
    setLoading(true);
    setSearched(true);
    const nextRecentWords = [query, ...recentWords.filter((recentWord) => recentWord.toLowerCase() !== query.toLowerCase())].slice(0, 8);
    setRecentWords(nextRecentWords);
    localStorage.setItem('tb-dictionary-recent', JSON.stringify(nextRecentWords));
    try {
      const response = await fetch(`/api/system/dictionary?word=${encodeURIComponent(query)}`);
      const data = await response.json() as { entries?: DictionaryEntry[] };
      setEntries(data.entries || []);
    } finally {
      setLoading(false);
    }
  }

  async function lookup(event: React.FormEvent) {
    event.preventDefault();
    await lookupWord(word.trim());
  }

  return (
    <div className="tb-dictionary tb-print-hide">
      {open && (
        <section className="tb-dictionary-panel" aria-label="ThinkBox offline dictionary">
          <div className="tb-dictionary-header">
            <div>
              <strong>ThinkBox Dictionary</strong>
              <span>Offline definitions and examples</span>
            </div>
            <button type="button" className="tb-assistant-close" onClick={() => setOpen(false)} aria-label="Close dictionary">
              <X size={18} />
            </button>
          </div>
          {recentWords.length > 0 && (
            <div className="tb-dictionary-recent" aria-label="Recently searched words">
              <span>Recent</span>
              <div>
                {recentWords.map((recentWord) => (
                  <button key={recentWord} type="button" onClick={() => lookupWord(recentWord)} disabled={loading}>
                    {recentWord}
                  </button>
                ))}
              </div>
            </div>
          )}
          <form className="tb-dictionary-search" onSubmit={lookup}>
            <Search size={17} aria-hidden="true" />
            <input ref={inputRef} value={word} onChange={(event) => setWord(event.target.value)} placeholder="Search a word..." aria-label="Search dictionary" maxLength={80} />
            <button type="submit" disabled={loading || !word.trim()} aria-label="Define word">
              {loading ? <Loader2 className="tb-assistant-spin" size={16} /> : 'Search'}
            </button>
          </form>
          <div className="tb-dictionary-panel-results" aria-live="polite">
            {!searched && <p>Search for a word to see its meaning, part of speech, and an example.</p>}
            {searched && entries.length === 0 && <p>No offline definition found for “{word.trim()}”.</p>}
            {entries.map((entry, index) => (
              <article key={`${entry.word}-${entry.partOfSpeech || index}`}>
                <strong>{entry.word}</strong>{entry.partOfSpeech && <em> · {entry.partOfSpeech}</em>}
                <p>{entry.meaning}</p>
                {entry.example && <small>Example: {entry.example}</small>}
              </article>
            ))}
          </div>
        </section>
      )}
      <button type="button" className="tb-dictionary-launcher" onClick={() => setOpen((current) => !current)} aria-label={open ? 'Close dictionary' : 'Open offline dictionary'} title="Offline dictionary">
        {open ? <X size={21} /> : <BookOpen size={21} />}
        <span>Dictionary</span>
      </button>
    </div>
  );
};