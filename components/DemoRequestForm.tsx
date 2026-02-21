'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  User,
  Mail,
  Building2,
  Phone,
  Briefcase,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface DemoRequestFormProps {
  onSuccess?: () => void;
}

const ROLE_OPTIONS = [
  'Student',
  'Educator / Teacher',
  'Researcher',
  'Software Developer',
  'Product Manager',
  'Business Analyst',
  'Content Creator',
  'Executive / Manager',
  'Freelancer',
  'Other',
];

const USE_CASE_OPTIONS = [
  'Learning at home (self-study)',
  'Classroom / school use',
  'Supporting my child\'s education',
  'Homeschooling',
  'After-school or tutoring programme',
  'Educational research or evaluation',
  'Other',
];

export default function DemoRequestForm({ onSuccess }: DemoRequestFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    useCase: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit request');
      }

      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  /* ─── Success State ─── */
  if (submitted) {
    return (
      <div className="text-center py-10 px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#DCFCE7] border-2 border-[#86efac] mb-6">
          <CheckCircle className="text-[#58CC02]" size={40} />
        </div>
        <h3 className="text-2xl font-bold text-[#1a1a1a] mb-3">Request Received!</h3>
        <p className="text-[#777] text-sm max-w-sm mx-auto leading-relaxed">
          Thanks{' '}
          <span className="text-[#1a1a1a] font-semibold">{formData.name}</span>! We&apos;ve
          received your demo request. Our team will review it and send your login
          credentials to{' '}
          <span className="text-[#58CC02] font-semibold">{formData.email}</span> within{' '}
          <strong className="text-[#1a1a1a]">24 hours</strong>.
        </p>
        <div className="mt-8">
          <button
            onClick={() => {
              setSubmitted(false);
              setStep(1);
              setFormData({ name: '', email: '', phone: '', company: '', role: '', useCase: '', message: '' });
            }}
            className="px-6 py-2.5 border-2 border-[#E5E5E5] text-[#777] rounded-xl text-sm font-semibold hover:border-[#58CC02] hover:text-[#58CC02] transition-colors"
          >
            Submit another request
          </button>
        </div>
      </div>
    );
  }

  const inputClass =
    'w-full bg-white border-2 border-[#E5E5E5] text-[#3C3C3C] placeholder-[#bbb] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#58CC02]/30 focus:border-[#58CC02] transition-all text-sm';
  const labelClass = 'block text-sm font-bold text-[#3C3C3C] mb-1.5';
  const iconClass = 'text-[#aaa] flex-shrink-0 pointer-events-none';

  return (
    <div>
      {/* Step progress indicator */}
      <div className="flex items-center gap-3 mb-8">
        {([1, 2] as const).map((s) => (
          <React.Fragment key={s}>
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= s ? 'bg-[#58CC02] text-white' : 'bg-[#E5E5E5] text-[#aaa]'
                }`}
                style={{ boxShadow: step >= s ? '0 2px 0 #46A302' : '0 2px 0 #D9D9D9' }}
              >
                {step > s ? <CheckCircle size={14} /> : s}
              </div>
              <span
                className={`text-xs font-bold transition-colors ${
                  step >= s ? 'text-[#58CC02]' : 'text-[#bbb]'
                }`}
              >
                {s === 1 ? 'Your Info' : 'Your Goals'}
              </span>
            </div>
            {s < 2 && (
              <div
                className={`flex-1 h-0.5 transition-all ${
                  step > s ? 'bg-[#58CC02]/60' : 'bg-[#E5E5E5]'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-5 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex gap-3 items-start">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* ── STEP 1: Personal & Contact Info ── */}
      {step === 1 && (
        <form onSubmit={handleNext} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className={labelClass}>
                Full Name <span className="text-[#BBFD6A]">*</span>
              </label>
              <div className="relative">
                <User
                  size={15}
                  className={`${iconClass} absolute left-3 top-1/2 -translate-y-1/2`}
                />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                Email Address <span className="text-[#BBFD6A]">*</span>
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className={`${iconClass} absolute left-3 top-1/2 -translate-y-1/2`}
                />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="phone" className={labelClass}>
                Phone Number
              </label>
              <div className="relative">
                <Phone
                  size={15}
                  className={`${iconClass} absolute left-3 top-1/2 -translate-y-1/2`}
                />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="company" className={labelClass}>
                Organisation / School <span className="text-[#BBFD6A]">*</span>
              </label>
              <div className="relative">
                <Building2
                  size={15}
                  className={`${iconClass} absolute left-3 top-1/2 -translate-y-1/2`}
                />
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  placeholder="Company or school name"
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 group flex items-center justify-center gap-2 bg-[#58CC02] hover:bg-[#6add0e] text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 text-sm"
          style={{ boxShadow: '0 3px 0 #46A302' }}
          >
            Continue
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </form>
      )}

      {/* ── STEP 2: Role, Use Case & Message ── */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="role" className={labelClass}>
                Your Role
              </label>
              <div className="relative">
                <Briefcase
                  size={15}
                  className={`${iconClass} absolute left-3 top-1/2 -translate-y-1/2`}
                />
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`${inputClass} pl-9 appearance-none cursor-pointer`}
                  style={{ backgroundColor: '#fff', color: '#3C3C3C', colorScheme: 'light' }}
                >
                  <option value="" style={{ backgroundColor: '#fff', color: '#3C3C3C' }}>
                    Select your role…
                  </option>
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r} style={{ backgroundColor: '#fff', color: '#3C3C3C' }}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="useCase" className={labelClass}>
                Primary Use Case
              </label>
              <div className="relative">
                <Sparkles
                  size={15}
                  className={`${iconClass} absolute left-3 top-1/2 -translate-y-1/2`}
                />
                <select
                  id="useCase"
                  name="useCase"
                  value={formData.useCase}
                  onChange={handleChange}
                  className={`${inputClass} pl-9 appearance-none cursor-pointer`}
                  style={{ backgroundColor: '#fff', color: '#3C3C3C', colorScheme: 'light' }}
                >
                  <option value="" style={{ backgroundColor: '#fff', color: '#3C3C3C' }}>
                    How will you use ThinkBox?
                  </option>
                  {USE_CASE_OPTIONS.map((u) => (
                    <option key={u} value={u} style={{ backgroundColor: '#fff', color: '#3C3C3C' }}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="message" className={labelClass}>
              Anything else you&apos;d like us to know?
            </label>
            <div className="relative">
              <MessageSquare size={15} className={`${iconClass} absolute left-3 top-4`} />
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your learning goals, expectations, or any questions you have…"
                rows={4}
                className={`${inputClass} pl-9 resize-none`}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-3 border-2 border-[#E5E5E5] text-[#777] hover:text-[#3C3C3C] hover:border-[#3C3C3C] rounded-xl transition-all text-sm font-bold"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 group flex items-center justify-center gap-2 bg-[#58CC02] hover:bg-[#6add0e] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 text-sm"
              style={{ boxShadow: '0 3px 0 #46A302' }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  Request Demo Access
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-[#aaa] text-center font-medium">
            We review requests within{' '}
            <strong className="text-[#3C3C3C]">24 hours</strong>. Login credentials will be
            sent to your email upon approval.
          </p>
        </form>
      )}
    </div>
  );
}
