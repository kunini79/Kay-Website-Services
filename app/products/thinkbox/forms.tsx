'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import DemoRequestForm from '@/components/DemoRequestForm';
import LoginForm from '@/components/LoginForm';

interface ThinkBoxFormProps {
  defaultTab?: 'request' | 'login';
}

export default function ThinkBoxForm({ defaultTab = 'request' }: ThinkBoxFormProps) {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'request' | 'login'>(defaultTab);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'login' || tab === 'request') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <>
      {/* Tab Navigation */}
      <div className="flex gap-4 mb-12 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('request')}
          className={`pb-4 px-6 font-semibold transition-colors ${
            activeTab === 'request'
              ? 'text-[#BBFD6A] border-b-2 border-[#BBFD6A]'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Request Demo
        </button>
        <button
          onClick={() => setActiveTab('login')}
          className={`pb-4 px-6 font-semibold transition-colors ${
            activeTab === 'login'
              ? 'text-[#BBFD6A] border-b-2 border-[#BBFD6A]'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Sign In
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
        {activeTab === 'request' ? (
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Get Demo Access</h3>
            <p className="text-gray-400 mb-8">
              Fill out the form below to request access to ThinkBox. Our team will review your request
              and send you login credentials within 24 hours.
            </p>
            <DemoRequestForm />
          </div>
        ) : (
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Sign In to ThinkBox</h3>
            <p className="text-gray-400 mb-8">
              Already have credentials? Log in below to access the ThinkBox system.
            </p>
            <LoginForm />
          </div>
        )}
      </div>
    </>
  );
}
