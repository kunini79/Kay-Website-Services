'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Article, getGuideCharacter } from '../types';
import { Loader2, Send, ShieldCheck, Sparkles, X } from 'lucide-react';

interface AssistantPanelProps {
  article: Article | null;
  userLevel: number;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface VocabularyItem {
  word: string;
  meaning: string;
  example: string;
}

export const AssistantPanel: React.FC<AssistantPanelProps> = ({ article, userLevel }) => {
  const guide = getGuideCharacter(userLevel);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [articleReference, setArticleReference] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [open, messages, loading]);

  useEffect(() => {
    const openAssistant = () => setOpen(true);
    window.addEventListener('tb-assistant-open', openAssistant);
    return () => window.removeEventListener('tb-assistant-open', openAssistant);
  }, []);

  useEffect(() => {
    setMessages([]);
    setError(null);
    setVocabulary([]);
    setArticleReference(null);
  }, [article?.topicId]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || loading) return;

    const nextMessages = [...messages, { role: 'user' as const, content: trimmed }];
    setMessages(nextMessages);
    setMessage('');
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/system/assistant', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: messages,
          topicId: article?.topicId,
        }),
      });
      const data = await response.json() as { answer?: string; message?: string; vocabulary?: VocabularyItem[]; articleReference?: { title?: string } | null };
      if (!response.ok || !data.answer) throw new Error(data.message || 'The assistant is unavailable.');
      setMessages([...nextMessages, { role: 'assistant', content: data.answer }]);
      setVocabulary(data.vocabulary || []);
      setArticleReference(data.articleReference?.title || null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'The assistant is unavailable.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="tb-assistant tb-print-hide">
      {open && (
        <section className="tb-assistant-panel" aria-label="ThinkBox learning assistant">
          <div className="tb-assistant-header">
            <div>
              <strong>{guide.name}, ThinkBox Guide</strong>
              <span>{article ? `Studying: ${article.title}` : 'Ask about a topic'}</span>
            </div>
            <button type="button" className="tb-assistant-close" onClick={() => setOpen(false)} aria-label="Close assistant">
              <X size={18} />
            </button>
          </div>

          <div className="tb-assistant-safety">
            <ShieldCheck size={16} /> Local, article-grounded, and safety filtered
          </div>

          <div className="tb-assistant-identity">
            <img src={guide.image} alt={`${guide.name}, level ${userLevel} guide`} />
            <span>Level {userLevel} guide</span>
          </div>


          <div className="tb-assistant-messages" aria-live="polite">
            {messages.length === 0 && (
              <p className="tb-assistant-empty">
                {article ? 'Ask me to explain, quiz you, or connect this article to another idea.' : 'Choose a topic, then ask me to explain or quiz you.'}
              </p>
            )}
            {messages.map((item, index) => (
              <div key={`${item.role}-${index}`} className={`tb-assistant-message tb-assistant-${item.role}`}>
                {item.content}
              </div>
            ))}
            {loading && <div className="tb-assistant-message tb-assistant-assistant"><Loader2 className="tb-assistant-spin" size={16} /> Thinking...</div>}
            {error && <p className="tb-assistant-error" role="alert">{error}</p>}
            {vocabulary.length > 0 && (
              <div className="tb-assistant-vocabulary">
                <strong><Sparkles size={14} /> Words to know</strong>
                {vocabulary.map((item) => (
                  <div key={item.word}>
                    <b>{item.word}</b>: {item.meaning}<br /><small>Example: {item.example}</small>
                  </div>
                ))}
              </div>
            )}
            {articleReference && <small className="tb-assistant-reference">Based on: {articleReference}</small>}
            <div ref={endRef} />
          </div>

          <form className="tb-assistant-form" onSubmit={submit}>
            <textarea
              ref={inputRef}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask a question..."
              aria-label="Ask the ThinkBox assistant"
              maxLength={2000}
              rows={2}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !message.trim()} aria-label="Send question" title="Send question">
              <Send size={18} />
            </button>
          </form>
        </section>
      )}
      <button type="button" className="tb-assistant-launcher" onClick={() => setOpen((current) => !current)} aria-label={open ? 'Close ThinkBox assistant' : 'Open ThinkBox assistant'}>
        {open ? <X size={22} /> : <img src={guide.image} alt="" aria-hidden="true" />}
        <span>{open ? 'Close' : 'Ask Guide'}</span>
      </button>
    </div>
  );
};