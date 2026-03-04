'use client';

import React, { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/password/change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setMessage(data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
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
              <div style={{ fontWeight: 700, color: '#15803D', fontSize: '13px' }}>Success</div>
              <p style={{ color: '#166534', fontSize: '13px', marginTop: '4px' }}>{message}</p>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="currentPassword" style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#3C3C3C', marginBottom: '8px' }}>Current Password</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            placeholder="Enter your current password"
            style={{ width: '100%', padding: '12px 16px', border: '2px solid #E5E5E5', borderRadius: '16px', fontSize: '14px', color: '#3C3C3C', outline: 'none', transition: 'all 0.2s', background: '#fff' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#58CC02'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; }}
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="newPassword" style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#3C3C3C', marginBottom: '8px' }}>New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="Enter your new password"
            style={{ width: '100%', padding: '12px 16px', border: '2px solid #E5E5E5', borderRadius: '16px', fontSize: '14px', color: '#3C3C3C', outline: 'none', transition: 'all 0.2s', background: '#fff' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#58CC02'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; }}
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#3C3C3C', marginBottom: '8px' }}>Confirm New Password</label>
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
          disabled={loading}
          style={{ background: loading ? '#ccc' : '#58CC02', color: '#fff', fontWeight: 800, padding: '12px 24px', borderRadius: '16px', border: 'none', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, transition: 'all 0.2s', boxShadow: '0 4px 0 #46A302', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px' }}
        >
          {loading ? '⏳ Saving...' : '✓ Update Password'}
        </button>
      </form>
    </div>
  );
}
