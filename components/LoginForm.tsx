'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LogIn, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  defaultTab?: 'request' | 'login';
}

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/system';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Login failed');
      }

      // Persist the user's name for ThinkBox profile display
      const data = await response.json();
      if (data?.user?.name) {
        localStorage.setItem('tb-username', data.user.name);
      }

      // Login successful, redirect to ThinkBox system or custom redirect
      router.push(redirectUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 items-start">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-red-900">Login Failed</h3>
            <p className="text-red-800 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-bold text-[#3C3C3C] mb-2">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="your.email@example.com"
          className="w-full px-4 py-3 border-2 border-[#E5E5E5] rounded-xl text-[#3C3C3C] placeholder-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#58CC02]/30 focus:border-[#58CC02] transition-all text-sm bg-white"
          disabled={loading}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="password" className="block text-sm font-bold text-[#3C3C3C]">
            Password *
          </label>
        </div>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Your password"
          className="w-full px-4 py-3 border-2 border-[#E5E5E5] rounded-xl text-[#3C3C3C] placeholder-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#58CC02]/30 focus:border-[#58CC02] transition-all text-sm bg-white"
          disabled={loading}
        />
      </div>

      <div className="flex flex-col gap-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#58CC02] hover:bg-[#6add0e] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
          style={{ boxShadow: '0 3px 0 #46A302' }}
        >
          <LogIn size={18} />
          {loading ? 'Signing in…' : 'Sign In to ThinkBox'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/forgot-password')}
          className="w-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-bold py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
        >
          Forgot Password?
        </button>
      </div>

      <p className="text-xs text-[#aaa] text-center font-medium">
        Don&apos;t have credentials yet?{' '}
        <button type="button" className="text-[#58CC02] font-bold hover:underline" onClick={() => (document.querySelector('[data-tab="request"]') as HTMLButtonElement)?.click()}>
          Request demo access
        </button>{' '}above to get started.
      </p>
    </form>
  );
}
