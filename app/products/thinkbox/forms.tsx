'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import LoginForm from '@/components/LoginForm';
import PlanInquiryForm from '@/components/PlanInquiryForm';

interface ThinkBoxFormProps { defaultTab?: 'plans' | 'login'; }

export default function ThinkBoxForm({ defaultTab = 'plans' }: ThinkBoxFormProps) {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'plans' | 'login'>(defaultTab);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'login') setActiveTab('login');
    if (tab === 'plans' || tab === 'request') setActiveTab('plans');
  }, [searchParams]);

  return (
    <div style={{ fontFamily: "Nunito, 'Segoe UI', sans-serif" }}>
      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 28, backgroundColor: '#E5E5E5', borderRadius: 14, padding: 4 }}>
        <button
          onClick={() => setActiveTab('plans')}
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: 11,
            border: 'none',
            cursor: 'pointer',
            fontFamily: "Nunito, sans-serif",
            fontWeight: 700,
            fontSize: 14,
            transition: 'all 0.2s',
            backgroundColor: activeTab === 'plans' ? '#58CC02' : 'transparent',
            color: activeTab === 'plans' ? '#fff' : '#777',
            boxShadow: activeTab === 'plans' ? '0 2px 0 #46A302' : 'none',
          }}
        >
          Choose a Plan
        </button>
        <button
          onClick={() => setActiveTab('login')}
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: 11,
            border: 'none',
            cursor: 'pointer',
            fontFamily: "Nunito, sans-serif",
            fontWeight: 700,
            fontSize: 14,
            transition: 'all 0.2s',
            backgroundColor: activeTab === 'login' ? '#58CC02' : 'transparent',
            color: activeTab === 'login' ? '#fff' : '#777',
            boxShadow: activeTab === 'login' ? '0 2px 0 #46A302' : 'none',
          }}
        >
          🔑 Sign In
        </button>
      </div>

      {/* Content */}
      {activeTab === 'plans' ? (
        <PlanInquiryForm />
      ) : (
        <div>
          <h3 style={{ fontFamily: "Fredoka, Nunito, sans-serif", fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>
            Welcome back! 👋
          </h3>
          <p style={{ fontSize: 14, color: '#777', marginBottom: 24, lineHeight: 1.6 }}>
            Sign in with your email and password, or choose your school and use your User ID and PIN.
          </p>
          <LoginForm />
        </div>
      )}
    </div>
  );
}
