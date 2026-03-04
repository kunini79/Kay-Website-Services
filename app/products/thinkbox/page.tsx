'use client';

import React, { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ThinkBoxForm from './forms';
import { ArrowLeft, LogIn } from 'lucide-react';

export default function ThinkBoxProductPage() {
  const features = [
    {
      emoji: '\u{1F4D6}',
      color: '#ECFDF5',
      border: '#86efac',
      title: 'Rich Educational Content',
      description: 'Carefully curated articles across 9 subject areas, written to be clear, accurate, and engaging for all ages.',
    },
    {
      emoji: '\u{1F310}',
      color: '#EFF6FF',
      border: '#93c5fd',
      title: 'Works Fully Offline',
      description: 'All content is stored locally on the device — no internet connection needed once installed.',
    },
    {
      emoji: '\u{1F5FA}\uFE0F',
      color: '#FEF3C7',
      border: '#fcd34d',
      title: 'Interactive Exploration',
      description: 'Discover topics fluidly with an interface designed for curious minds of all ages.',
    },
    {
      emoji: '\u{1F4DA}',
      color: '#FDF2F8',
      border: '#f0abfc',
      title: '9 Subject Categories',
      description: 'Animals, Science, History, Technology, Arts, Sports, People, World Cultures, and Reading & Stories.',
    },
    {
      emoji: '\u{1F392}',
      color: '#F0FDF4',
      border: '#86efac',
      title: 'Save to Backpack',
      description: 'Bookmark favourite topics and revisit them anytime — content is always available offline.',
    },
    {
      emoji: '\u{1F3C6}',
      color: '#FFF7ED',
      border: '#fdba74',
      title: 'Earn XP & Level Up',
      description: 'Stay motivated with streaks, XP points, and level rewards as you explore more topics.',
    },
  ];

  const steps = [
    { n: '1', title: 'Request Demo', desc: 'Fill in the short form below with your details and how you plan to use ThinkBox.' },
    { n: '2', title: 'We Review', desc: 'Our team reviews your request and sets up your account — usually within 24 hours.' },
    { n: '3', title: 'Get Credentials', desc: "You'll receive a welcome email with your login details and a getting-started guide." },
    { n: '4', title: 'Start Exploring', desc: 'Sign in and browse our offline knowledge library across 9 topic categories — no internet needed.' },
  ];

  return (
    <main style={{ fontFamily: "Nunito, 'Segoe UI', Roboto, sans-serif", backgroundColor: '#F7F7F7' }}>

      {/* ThinkBox Nav */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: '#ffffff',
        borderBottom: '2px solid #E5E5E5',
        boxShadow: '0 2px 0 #E5E5E5',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          {/* Logo */}
          <Link href="/products/thinkbox" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
            <Image
              src="/ThinkBox/Think Box Logo.png"
              alt="ThinkBox"
              width={480}
              height={184}
              priority
              style={{ height: 52, width: 'auto' }}
            />
          </Link>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link
              href="/"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#777', fontSize: 14, fontWeight: 600, textDecoration: 'none', padding: '8px 14px', borderRadius: 9999, border: '2px solid #E5E5E5', backgroundColor: '#F7F7F7' }}
            >
              <ArrowLeft size={14} />
              kaycorp.tech
            </Link>
            <Link
              href="/products/thinkbox?tab=login#demo-form"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none', padding: '8px 18px', borderRadius: 9999, backgroundColor: '#58CC02', boxShadow: '0 3px 0 #46A302' }}
            >
              <LogIn size={14} />
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg, #ECFDF5 0%, #F0FDF4 40%, #EFF6FF 100%)', padding: '80px 24px 64px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <span style={{ display: 'inline-block', backgroundColor: '#DCFCE7', border: '2px solid #86efac', color: '#15803d', fontWeight: 800, fontSize: 13, padding: '4px 16px', borderRadius: 9999, marginBottom: 24, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            V1 Beta — Open for Testers
          </span>

          <h1 style={{ fontFamily: "Fredoka, Nunito, 'Trebuchet MS', sans-serif", fontSize: 'clamp(2.6rem, 6vw, 4.2rem)', fontWeight: 700, color: '#1a1a1a', lineHeight: 1.1, marginBottom: 20 }}>
            A smarter way for kids to <span style={{ color: '#58CC02' }}>explore knowledge.</span>
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: '#555', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.7 }}>
            ThinkBox is an offline educational encyclopedia built for curious minds aged 6&ndash;14.
            Explore science, history, nature, arts and more — safely, beautifully, without needing the internet.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 32 }}>
            <a
              href="#demo-form"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: '#58CC02', color: '#fff', fontWeight: 800, fontSize: 16, padding: '14px 32px', borderRadius: 9999, boxShadow: '0 4px 0 #46A302', textDecoration: 'none' }}
            >
              Request Demo Access
            </a>
            <a
              href="/products/thinkbox?tab=login#demo-form"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: '#fff', color: '#3C3C3C', fontWeight: 700, fontSize: 16, padding: '14px 32px', borderRadius: 9999, border: '2px solid #E5E5E5', boxShadow: '0 4px 0 #D9D9D9', textDecoration: 'none' }}
            >
              <LogIn size={16} />
              I have login details
            </a>
          </div>

          {/* Trust line */}
          <p style={{ color: '#999', fontSize: 13, fontWeight: 600 }}>
            Free beta &nbsp;&middot;&nbsp; No credit card &nbsp;&middot;&nbsp; Approved within 24 hrs
          </p>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '72px 24px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "Fredoka, Nunito, sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, color: '#1a1a1a', textAlign: 'center', marginBottom: 48 }}>
            Built for curious minds, works anywhere
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {features.map((f, i) => (
              <div key={i} style={{ backgroundColor: f.color, border: `2px solid ${f.border}`, borderRadius: 20, padding: 28, boxShadow: '0 4px 0 #D9D9D9' }}>
                <div style={{ fontSize: 40, marginBottom: 14, display: 'inline-block' }}>{f.emoji}</div>
                <h3 style={{ fontFamily: "Fredoka, Nunito, sans-serif", fontSize: 19, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#555', lineHeight: 1.65, margin: 0 }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '72px 24px', backgroundColor: '#F7F7F7' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "Fredoka, Nunito, sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, color: '#1a1a1a', textAlign: 'center', marginBottom: 48 }}>
            How it works
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {steps.map((s) => (
              <div key={s.n} style={{ backgroundColor: '#fff', border: '2px solid #E5E5E5', borderRadius: 20, padding: '24px 28px', boxShadow: '0 4px 0 #D9D9D9', display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: '50%', backgroundColor: '#58CC02', boxShadow: '0 3px 0 #46A302', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "Fredoka, sans-serif", fontWeight: 700, fontSize: 20 }}>
                  {s.n}
                </div>
                <div>
                  <h3 style={{ fontFamily: "Fredoka, Nunito, sans-serif", fontSize: 17, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: '#777', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Form */}
      <section id="demo-form" style={{ padding: '72px 24px 96px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ display: 'inline-block', backgroundColor: '#DCFCE7', border: '2px solid #86efac', color: '#15803d', fontWeight: 800, fontSize: 12, padding: '4px 14px', borderRadius: 9999, marginBottom: 16, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Beta Sign Up
            </span>
            <h2 style={{ fontFamily: "Fredoka, Nunito, sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 700, color: '#1a1a1a', marginBottom: 12 }}>
              Become a ThinkBox Beta Tester
            </h2>
            <p style={{ fontSize: 15, color: '#777', maxWidth: 460, margin: '0 auto', lineHeight: 1.65 }}>
              We&apos;re looking for early testers to try ThinkBox V1. Fill in your details and we&apos;ll
              email your login credentials within 24 hours so you can start exploring.
            </p>
          </div>

          {/* Form card */}
          <div style={{ backgroundColor: '#F7F7F7', border: '2px solid #E5E5E5', borderRadius: 24, padding: '36px 32px', boxShadow: '0 6px 0 #D9D9D9' }}>
            <Suspense fallback={<div style={{ textAlign: 'center', color: '#777', padding: 40 }}>Loading…</div>}>
              <ThinkBoxForm defaultTab="request" />
            </Suspense>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '72px 24px', backgroundColor: '#F7F7F7' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "Fredoka, Nunito, sans-serif", fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 700, color: '#1a1a1a', textAlign: 'center', marginBottom: 40 }}>
            Questions? We&apos;ve got answers
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { q: 'How long does approval take?', a: 'We typically approve requests within 24 hours and send your login credentials by email.' },
              { q: 'Is beta access free?', a: 'Yes — completely free. No payment details or credit card required.' },
              { q: 'Does ThinkBox need an internet connection?', a: 'No. ThinkBox V1 is fully offline. All content is stored locally so it works anywhere, even without Wi-Fi.' },
              { q: 'What age group is ThinkBox designed for?', a: 'ThinkBox is built for learners aged 6 to 14, covering topics in a way that is engaging, safe, and easy to understand.' },
              { q: 'Can my whole class or team join?', a: 'Currently each account is individual. Reach out to us if you need classroom or group access.' },
            ].map((item, i) => (
              <div key={i} style={{ backgroundColor: '#fff', border: '2px solid #E5E5E5', borderRadius: 18, padding: '20px 24px', boxShadow: '0 3px 0 #D9D9D9' }}>
                <h3 style={{ fontFamily: "Fredoka, Nunito, sans-serif", fontWeight: 700, fontSize: 16, color: '#1a1a1a', marginBottom: 8 }}>{item.q}</h3>
                <p style={{ fontSize: 14, color: '#777', lineHeight: 1.6, margin: 0 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#fff', borderTop: '2px solid #E5E5E5', padding: '28px 24px', textAlign: 'center' }}>
        <Image src="/ThinkBox/Think Box Logo.png" alt="ThinkBox" width={200} height={77} style={{ height: 40, width: 'auto', margin: '0 auto 12px', display: 'block' }} />
        <p style={{ fontSize: 13, color: '#aaa', margin: 0 }}>
          A product by{' '}
          <Link href="/" style={{ color: '#58CC02', fontWeight: 700, textDecoration: 'none' }}>KayCorp</Link>
          {' · '}
          <Link href="/contact" style={{ color: '#777', textDecoration: 'none' }}>Contact</Link>
        </p>
      </footer>
    </main>
  );
}