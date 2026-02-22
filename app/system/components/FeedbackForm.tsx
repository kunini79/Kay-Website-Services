import React, { useState } from 'react';
import { AlertCircle, Send } from 'lucide-react';

export function FeedbackForm({ onClose }: { onClose?: () => void }) {
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback, email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to send feedback');
      }
      setSubmitted(true);
      setFeedback('');
      setEmail('');
      if (onClose) onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="py-8 px-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#DCFCE7] border-2 border-[#86efac] mb-4">
          <Send className="text-[#58CC02]" size={32} />
        </div>
        <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">Thank you for your feedback!</h3>
        <p className="text-[#777] text-sm max-w-xs mx-auto">We appreciate your suggestions and reports. Our team reviews every submission.</p>
        {onClose && (
          <button className="mt-6 px-5 py-2 rounded-xl bg-[#58CC02] text-white font-bold shadow-sm" onClick={onClose}>Close</button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-2xl border border-[#E5E5E5] max-w-md mx-auto shadow-lg">
      <h2 className="text-lg font-bold text-[#1a1a1a] mb-2">Feedback & Suggestions</h2>
      <p className="text-sm text-[#777] mb-4">Share your ideas, report issues, or suggest improvements. We value your input!</p>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2 items-start">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        </div>
      )}
      <textarea
        className="w-full px-4 py-3 border-2 border-[#E5E5E5] rounded-xl text-[#3C3C3C] placeholder-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#58CC02]/30 focus:border-[#58CC02] transition-all text-sm bg-white"
        placeholder="Your feedback or suggestion..."
        value={feedback}
        onChange={e => setFeedback(e.target.value)}
        required
        rows={4}
        disabled={loading}
      />
      <input
        type="email"
        className="w-full px-4 py-3 border-2 border-[#E5E5E5] rounded-xl text-[#3C3C3C] placeholder-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#58CC02]/30 focus:border-[#58CC02] transition-all text-sm bg-white"
        placeholder="Your email (optional)"
        value={email}
        onChange={e => setEmail(e.target.value)}
        disabled={loading}
      />
      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-[#58CC02] text-white font-bold shadow-sm flex items-center justify-center gap-2"
        disabled={loading || !feedback.trim()}
      >
        <Send size={20} />
        Submit Feedback
      </button>
      {onClose && (
        <button type="button" className="w-full mt-2 py-2 rounded-xl bg-[#E5E5E5] text-[#3C3C3C] font-bold" onClick={onClose} disabled={loading}>Cancel</button>
      )}
    </form>
  );
}
