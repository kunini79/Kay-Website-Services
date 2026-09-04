'use client';

import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Loader2, Send } from 'lucide-react';

const planOptions = [
  { value: 'standard-campus-lab', label: 'Standard Campus Lab', price: 'N650,000 - N850,000 / year' },
  { value: 'premium-campus', label: 'Premium / Multi-Arm Campus', price: 'N1,200,000 - N1,800,000 / year' },
  { value: 'network-schools', label: 'Network / Group of Schools', price: 'N2,500,000+ / year' },
  { value: 'turnkey-kit', label: 'Turnkey Hardware + Software Kit', price: 'N1,500,000 setup + N500,000 / year' },
];

export default function PlanInquiryForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organisation: '',
    selectedPlan: 'standard-campus-lab',
    billingPreference: 'annual',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/plan-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to submit your plan enquiry.');
      setSubmitted(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to submit your plan enquiry.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="px-4 py-10 text-center">
        <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#86efac] bg-[#DCFCE7]">
          <CheckCircle className="text-[#58CC02]" size={34} />
        </div>
        <h3 className="mb-3 text-2xl font-bold text-[#1a1a1a]">Your trial request is in.</h3>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-[#777]">
          Our team will confirm your one-month ThinkBox trial and the next step for your selected plan.
        </p>
      </div>
    );
  }

  const inputClass = 'w-full rounded-xl border-2 border-[#E5E5E5] bg-white px-4 py-3 text-sm text-[#3C3C3C] placeholder-[#bbb] transition-all focus:border-[#58CC02] focus:outline-none focus:ring-2 focus:ring-[#58CC02]/30';
  const labelClass = 'mb-1.5 block text-sm font-bold text-[#3C3C3C]';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-start gap-3 rounded-xl border-2 border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 shrink-0 text-red-500" size={16} />
          <p className="text-sm font-medium text-red-600">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="selected-plan" className={labelClass}>Choose a school plan *</label>
        <select
          id="selected-plan"
          value={formData.selectedPlan}
          onChange={(event) => setFormData((current) => ({ ...current, selectedPlan: event.target.value }))}
          className={inputClass}
        >
          {planOptions.map((plan) => <option key={plan.value} value={plan.value}>{plan.label} - {plan.price}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>Your name *</label>
          <input id="name" value={formData.name} onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))} required placeholder="Full name" className={inputClass} disabled={loading} />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Work email *</label>
          <input id="email" type="email" value={formData.email} onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))} required placeholder="you@school.edu.ng" className={inputClass} disabled={loading} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="organisation" className={labelClass}>School or organisation *</label>
          <input id="organisation" value={formData.organisation} onChange={(event) => setFormData((current) => ({ ...current, organisation: event.target.value }))} required placeholder="School name" className={inputClass} disabled={loading} />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>Phone number</label>
          <input id="phone" type="tel" value={formData.phone} onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))} placeholder="Phone number" className={inputClass} disabled={loading} />
        </div>
      </div>

      <div>
        <label htmlFor="billing" className={labelClass}>Billing preference *</label>
        <select id="billing" value={formData.billingPreference} onChange={(event) => setFormData((current) => ({ ...current, billingPreference: event.target.value }))} className={inputClass} disabled={loading}>
          <option value="annual">Annual</option>
          <option value="termly">Per term</option>
          <option value="discuss">Discuss with us</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>Anything we should know?</label>
        <textarea id="message" value={formData.message} onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))} rows={3} placeholder="Pupil count, campuses, hardware needs, or questions" className={`${inputClass} resize-none`} disabled={loading} />
      </div>

      <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#58CC02] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#6add0e] disabled:cursor-not-allowed disabled:opacity-60" style={{ boxShadow: '0 3px 0 #46A302' }}>
        {loading ? <><Loader2 size={16} className="animate-spin" /> Sending request...</> : <><Send size={16} /> Start 1-month trial</>}
      </button>
      <p className="text-center text-xs font-medium text-[#777]">No payment is taken today. We will confirm your trial and plan setup with you.</p>
    </form>
  );
}