'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User, Building, Mail, Calendar } from 'lucide-react';

interface UserInfo {
  id: string;
  email: string;
  name: string;
  company: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/verify-auth', {
          credentials: 'include',
        });

        if (!response.ok) {
          router.push('/thinkbox?tab=login');
          return;
        }

        const data = await response.json();
        setUser({
          id: data.user.userId,
          email: data.user.email,
          name: data.user.name,
          company: '', // We can fetch this from a separate endpoint if needed
        });
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        router.push('/thinkbox?tab=login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/thinkbox');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BBFD6A]"></div>
          <p className="text-gray-400 mt-4">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 mb-4">Unable to load your profile</p>
          <Link href="/thinkbox?tab=login" className="text-[#BBFD6A] hover:underline">
            Go back to ThinkBox
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-gray-400">Welcome back to ThinkBox</p>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <LogOut size={18} />
              {loggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>

        {/* User Information Card */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Your Profile</h2>

          <div className="space-y-6">
            {/* Name */}
            <div className="flex items-start gap-4">
              <div className="bg-[#BBFD6A]/20 p-3 rounded-lg">
                <User className="text-[#BBFD6A]" size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Full Name</p>
                <p className="text-white text-lg font-semibold">{user.name}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="bg-[#BBFD6A]/20 p-3 rounded-lg">
                <Mail className="text-[#BBFD6A]" size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Email Address</p>
                <p className="text-white text-lg font-semibold">{user.email}</p>
              </div>
            </div>

            {/* Access Status */}
            <div className="flex items-start gap-4">
              <div className="bg-green-500/20 p-3 rounded-lg">
                <Calendar className="text-green-400" size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Access Status</p>
                <p className="text-green-400 text-lg font-semibold">✓ Active</p>
                <p className="text-gray-400 text-sm mt-1">Your demo access is valid indefinitely</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Links</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/system"
              className="bg-[#BBFD6A] hover:bg-[#a9e65e] text-black font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Access ThinkBox System →
            </Link>

            <Link
              href="/thinkbox"
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              About ThinkBox
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>Questions? Need help? Contact us at support@kaycorp.com</p>
        </div>
      </div>
    </main>
  );
}
