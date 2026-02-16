'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ThinkBoxForm from './forms';
import { BookOpen, Zap, Users, BarChart3, ArrowRight } from 'lucide-react';

export default function ThinkBoxProductPage() {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'AI-Powered Learning',
      description: 'Leverage cutting-edge Google Gemini AI to generate personalized educational content on any topic.',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Knowledge',
      description: 'Get comprehensive articles with visual insights in seconds, powered by Wikipedia imagery.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Interactive Exploration',
      description: 'Explore topics fluidly with our intuitive interface designed for learners of all levels.',
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Data-Rich Content',
      description: 'Access rich, contextual information with beautiful visualizations and relevant imagery.',
    },
  ];

  return (
    <main className="relative w-full">
      <Navigation />

      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-[#BBFD6A] bg-opacity-20 border border-[#BBFD6A] rounded-full">
            <span className="text-[#BBFD6A] text-sm font-semibold">AI-Powered Education</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            The ThinkBox System
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
            An intelligent, AI-powered educational platform that transforms how you explore and understand
            complex topics. Learn faster with personalized, instantly-generated knowledge.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a
              href="#demo-form"
              className="px-8 py-4 bg-[#BBFD6A] text-black font-semibold rounded-lg hover:bg-[#a9e65e] transition-colors flex items-center justify-center gap-2"
            >
              Request Demo Access
              <ArrowRight size={18} />
            </a>
            <a
              href="/thinkbox"
              className="px-8 py-4 border-2 border-[#BBFD6A] text-[#BBFD6A] font-semibold rounded-lg hover:bg-[#BBFD6A] hover:text-black transition-colors"
            >
              Access ThinkBox
            </a>
          </div>

          <div className="text-gray-400 text-sm">👇 Explore ThinkBox Features Below</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-16 text-center">Powerful Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800 hover:bg-gray-750 transition-colors p-8 rounded-xl border border-gray-700 hover:border-[#BBFD6A]"
              >
                <div className="text-[#BBFD6A] mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="demo-form" className="py-20 px-4 bg-gray-950">
        <div className="max-w-2xl mx-auto">
          <Suspense fallback={<div className="text-center text-white">Loading form...</div>}>
            <ThinkBoxForm defaultTab="request" />
          </Suspense>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-16 text-center">How It Works</h2>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-[#BBFD6A] text-black font-bold text-lg">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Request Demo</h3>
                <p className="text-gray-400">
                  Fill out our quick demo request form with your details and learning interests.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-[#BBFD6A] text-black font-bold text-lg">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">We Review & Approve</h3>
                <p className="text-gray-400">
                  Our team reviews your request and prepares your account for access.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-[#BBFD6A] text-black font-bold text-lg">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Receive Credentials</h3>
                <p className="text-gray-400">
                  Get login credentials and a welcome email with instructions via email.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-[#BBFD6A] text-black font-bold text-lg">
                  4
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Start Learning</h3>
                <p className="text-gray-400">
                  Sign in to ThinkBox and begin exploring topics with AI-powered insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gray-950">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-16 text-center">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-2">How long does approval take?</h3>
              <p className="text-gray-400">
                We typically review and approve demo requests within 24 hours, and you'll receive your
                credentials via email.
              </p>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-2">Is there a cost for the demo?</h3>
              <p className="text-gray-400">
                Demo access is completely free. You can explore all features without any payment required.
              </p>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-2">How long is demo access valid?</h3>
              <p className="text-gray-400">
                Demo access is valid indefinitely, allowing you to explore and learn at your own pace.
              </p>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-2">Can I invite team members?</h3>
              <p className="text-gray-400">
                Currently, each demo account is individual. Contact us if you'd like team access.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Products */}
      <section className="py-16 px-4 bg-gray-900 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 mb-6">
            Want to learn more about our other products and services?
          </p>
          <Link href="/" className="inline-flex items-center gap-2 text-[#BBFD6A] hover:gap-4 transition-all">
            Back to KayCorp Home
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
