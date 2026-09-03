'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, Building2, KeyRound, LogIn, Mail } from 'lucide-react';

interface LoginFormProps {
  defaultTab?: 'request' | 'login';
}

export default function LoginForm() {
  const [loginMethod, setLoginMethod] = useState<'email' | 'school'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [schools, setSchools] = useState<Array<{ id: string; name: string }>>([]);
  const [schoolId, setSchoolId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [pin, setPin] = useState('');
  const [schoolsLoading, setSchoolsLoading] = useState(true);
  const [schoolsError, setSchoolsError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/system';

  useEffect(() => {
    const loadSchools = async () => {
      try {
        const response = await fetch('/api/schools');
        if (!response.ok) throw new Error('Unable to load schools');
        const data = await response.json();
        setSchools(data.schools || []);
      } catch {
        setSchoolsError('Schools are temporarily unavailable. Please use email sign-in or try again later.');
      } finally {
        setSchoolsLoading(false);
      }
    };

    loadSchools();
  }, []);

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
        body: JSON.stringify(
          loginMethod === 'school'
            ? { loginMethod: 'school', schoolId, studentId, pin }
            : { loginMethod: 'email', email, password }
        ),
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
      if (data?.user?.id) {
        localStorage.setItem('tb-user-id', data.user.id);
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
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#E5E5E5] p-1" role="tablist" aria-label="Sign-in method">
        <button
          type="button"
          role="tab"
          aria-selected={loginMethod === 'email'}
          onClick={() => setLoginMethod('email')}
          className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold transition-colors ${loginMethod === 'email' ? 'bg-white text-[#3C3C3C] shadow-sm' : 'text-[#777]'}`}
          disabled={loading}
        >
          <Mail size={16} />
          Email
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={loginMethod === 'school'}
          onClick={() => setLoginMethod('school')}
          className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold transition-colors ${loginMethod === 'school' ? 'bg-white text-[#3C3C3C] shadow-sm' : 'text-[#777]'}`}
          disabled={loading}
        >
          <Building2 size={16} />
          School
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 items-start">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-red-900">Login Failed</h3>
            <p className="text-red-800 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {loginMethod === 'email' ? (
        <>
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
            <label htmlFor="password" className="block text-sm font-bold text-[#3C3C3C] mb-2">
              Password *
            </label>
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
        </>
      ) : (
        <>
          <div>
            <label htmlFor="school" className="block text-sm font-bold text-[#3C3C3C] mb-2">
              School *
            </label>
            <select
              id="school"
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              required
              disabled={loading || schoolsLoading || schools.length === 0}
              className="w-full px-4 py-3 border-2 border-[#E5E5E5] rounded-xl text-[#3C3C3C] focus:outline-none focus:ring-2 focus:ring-[#58CC02]/30 focus:border-[#58CC02] transition-all text-sm bg-white disabled:bg-gray-50 disabled:text-[#999]"
            >
              <option value="">{schoolsLoading ? 'Loading schools...' : 'Select your school'}</option>
              {schools.map((school) => <option key={school.id} value={school.id}>{school.name}</option>)}
            </select>
            {schoolsError && <p className="mt-2 text-xs font-medium text-red-700">{schoolsError}</p>}
            {!schoolsLoading && !schoolsError && schools.length === 0 && <p className="mt-2 text-xs font-medium text-[#777]">Your school is not available yet. Ask a teacher or administrator for help.</p>}
          </div>

          <div>
            <label htmlFor="student-id" className="block text-sm font-bold text-[#3C3C3C] mb-2">
              User ID *
            </label>
            <input
              type="text"
              id="student-id"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value.toUpperCase())}
              required
              placeholder="Your school User ID"
              autoCapitalize="characters"
              className="w-full px-4 py-3 border-2 border-[#E5E5E5] rounded-xl text-[#3C3C3C] placeholder-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#58CC02]/30 focus:border-[#58CC02] transition-all text-sm bg-white"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="pin" className="block text-sm font-bold text-[#3C3C3C] mb-2">
              PIN *
            </label>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              id="pin"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
              required
              minLength={4}
              maxLength={8}
              placeholder="4 to 8 digits"
              className="w-full px-4 py-3 border-2 border-[#E5E5E5] rounded-xl text-[#3C3C3C] placeholder-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#58CC02]/30 focus:border-[#58CC02] transition-all text-sm bg-white"
              disabled={loading}
            />
          </div>
        </>
      )}

      <div className="flex flex-col gap-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#58CC02] hover:bg-[#6add0e] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
          style={{ boxShadow: '0 3px 0 #46A302' }}
        >
          {loginMethod === 'school' ? <KeyRound size={18} /> : <LogIn size={18} />}
          {loading ? 'Signing in…' : 'Sign In to ThinkBox'}
        </button>
        {loginMethod === 'email' && (
          <button
            type="button"
            onClick={() => router.push('/forgot-password')}
            className="w-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-bold py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
          >
            Forgot Password?
          </button>
        )}
      </div>

      <p className="text-xs text-[#aaa] text-center font-medium">
        {loginMethod === 'school' ? 'Ask your teacher or school administrator for your User ID and PIN.' : <>
          Don&apos;t have credentials yet?{' '}
          <button type="button" className="text-[#58CC02] font-bold hover:underline" onClick={() => (document.querySelector('[data-tab="request"]') as HTMLButtonElement)?.click()}>
            Request demo access
          </button>{' '}above to get started.
        </>}
      </p>
    </form>
  );
}
