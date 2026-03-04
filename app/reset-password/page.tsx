'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError('No reset token found. Please request a new password reset.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    if (!token) {
      setError('No reset token found. Please request a new password reset.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/password/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setMessage(data.message);
      setPassword('');
      setConfirmPassword('');
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
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔐</div>
            <h1 style={{ fontFamily: 'Fredoka, Nunito, sans-serif', fontSize: '28px', fontWeight: 800, color: '#1a1a1a', marginBottom: '8px' }}>Set New Password</h1>
            <p style={{ fontSize: '14px', color: '#777', lineHeight: '1.6' }}>Choose a strong password to secure your account.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                <CheckCircle style={{ color: '#58CC02', marginTop: '2px', flexShrink: 0 }} size={20} />
                <div>
                  <div style={{ fontWeight: 700, color: '#15803D', fontSize: '13px' }}>Password Reset</div>
                  <p style={{ color: '#166534', fontSize: '13px', marginTop: '4px' }}>{message} <Link href="/products/thinkbox?tab=login" style={{ color: '#58CC02', fontWeight: 700, textDecoration: 'none' }}>Sign in now →</Link></p>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#3C3C3C', marginBottom: '8px' }}>New Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="At least 6 characters"
                style={{ width: '100%', padding: '12px 16px', border: '2px solid #E5E5E5', borderRadius: '16px', fontSize: '14px', color: '#3C3C3C', outline: 'none', transition: 'all 0.2s', background: '#fff' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#58CC02'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; }}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#3C3C3C', marginBottom: '8px' }}>Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your new password"
                style={{ width: '100%', padding: '12px 16px', border: '2px solid #E5E5E5', borderRadius: '16px', fontSize: '14px', color: '#3C3C3C', outline: 'none', transition: 'all 0.2s', background: '#fff' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#58CC02'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; }}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !token || !password.trim() || !confirmPassword.trim()}
              style={{ background: loading || !token || !password.trim() || !confirmPassword.trim() ? '#ccc' : '#58CC02', color: '#fff', fontWeight: 800, padding: '14px 24px', borderRadius: '16px', border: 'none', fontSize: '15px', cursor: loading || !token ? 'not-allowed' : 'pointer', opacity: loading || !token ? 0.6 : 1, transition: 'all 0.2s', boxShadow: '0 4px 0 #46A302', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '8px' }}
            >
              {loading ? '⏳ Resetting...' : '✓ Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
