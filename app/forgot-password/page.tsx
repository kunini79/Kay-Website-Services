'use client';

import React, { useState } from 'react';
import { AlertCircle, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch('/api/password/forgot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setMessage(data.message);
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F7F7F7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Back link */}
        <Link href="/products/thinkbox?tab=login" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#58CC02', fontWeight: 700, fontSize: '14px', textDecoration: 'none', marginBottom: '32px' }}>
          <ArrowLeft size={18} /> Back to Sign In
        </Link>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', border: '2px solid #E5E5E5', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔑</div>
            <h1 style={{ fontFamily: 'Fredoka, Nunito, sans-serif', fontSize: '28px', fontWeight: 800, color: '#1a1a1a', marginBottom: '8px' }}>Forgot Password?</h1>
            <p style={{ fontSize: '14px', color: '#777', lineHeight: '1.6' }}>No problem! Enter your email and we'll send you a link to reset it.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {error && (
              <div style={{ background: '#FEE2E2', border: '2px solid #FECACA', borderRadius: '14px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <AlertCircle style={{ color: '#DC2626', marginTop: '2px', flexShrink: 0 }} size={20} />
                <div>
                  <div style={{ fontWeight: 700, color: '#7F1D1D', fontSize: '13px' }}>Error</div>
                  <p style={{ color: '#991B1B', fontSize: '13px', marginTop: '4px' }}>{error}</p>
                </div>
              </div>
            )}

            {message && (
              <div style={{ background: '#DCFCE7', border: '2px solid #86EFAC', borderRadius: '14px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Mail style={{ color: '#58CC02', marginTop: '2px', flexShrink: 0 }} size={20} />
                <div>
                  <div style={{ fontWeight: 700, color: '#15803D', fontSize: '13px' }}>Check Your Email</div>
                  <p style={{ color: '#166534', fontSize: '13px', marginTop: '4px' }}>{message}</p>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#3C3C3C', marginBottom: '8px' }}>Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{ width: '100%', padding: '12px 16px', border: '2px solid #E5E5E5', borderRadius: '16px', fontSize: '14px', color: '#3C3C3C', outline: 'none', transition: 'all 0.2s', background: '#fff' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#58CC02'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; }}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              style={{ background: loading || !email.trim() ? '#ccc' : '#58CC02', color: '#fff', fontWeight: 800, padding: '14px 24px', borderRadius: '16px', border: 'none', fontSize: '15px', cursor: loading || !email.trim() ? 'not-allowed' : 'pointer', opacity: loading || !email.trim() ? 0.6 : 1, transition: 'all 0.2s', boxShadow: '0 4px 0 #46A302', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              {loading ? '⏳ Sending...' : '📧 Send Reset Link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
