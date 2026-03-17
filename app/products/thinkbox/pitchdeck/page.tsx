import Image from 'next/image';
import Link from 'next/link';

const tractionItems = [
  { label: 'Product stage', value: 'V1 beta running in live pilots' },
  { label: 'Demo testers', value: '20 approved beta testers' },
  { label: 'Pilot students', value: '40+ students actively accessing ThinkBox' },
  { label: 'Pilot school', value: 'American University of Nigeria Schools' },
];

const problemPoints = [
  'Most kids learning experiences break when internet quality drops.',
  'Parents and schools need a safer, curated alternative to open web browsing.',
  'Many education apps prioritize entertainment loops over long-form discovery.',
];

const solutionPillars = [
  {
    title: 'Offline learning that actually works',
    detail: 'ThinkBox content is designed to remain available once installed so learning can continue anywhere.',
  },
  {
    title: 'Curated knowledge library',
    detail: 'Learners explore articles across science, nature, history, technology, arts, sports, and more.',
  },
  {
    title: 'Motivation built into exploration',
    detail: 'Backpack saves, XP, and streak mechanics keep discovery active without turning learning into noise.',
  },
];

const gtMChannels = [
  {
    title: 'Families first',
    detail: 'Parent-facing beta onboarding through the public ThinkBox product funnel.',
  },
  {
    title: 'School pilots',
    detail: 'Live pilot with 40+ students at American University of Nigeria Schools, expanding into additional classrooms.',
  },
  {
    title: 'Partnership rollout',
    detail: 'Community organizations and learning centers for scaled distribution.',
  },
];

const roadmap = [
  {
    quarter: 'Now',
    title: 'Beta access funnel',
    detail: 'Live request, approval, login, and dashboard flow with real user onboarding.',
  },
  {
    quarter: 'Next',
    title: 'Pilot cohorts',
    detail: 'Run guided cohorts, capture engagement insights, and tighten UX for learners 6-14.',
  },
  {
    quarter: 'Then',
    title: 'Distribution expansion',
    detail: 'Package classroom-ready deployments and partnership onboarding kits.',
  },
];

export default function ThinkBoxPitchDeckPage() {
  return (
    <main
      style={{
        fontFamily: "Nunito, 'Segoe UI', Roboto, sans-serif",
        background:
          'radial-gradient(circle at 10% 10%, #dcfce7 0%, #f7f7f7 45%), radial-gradient(circle at 92% 15%, #fee2e2 0%, rgba(255,255,255,0) 36%)',
        minHeight: '100vh',
      }}
    >
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderBottom: '2px solid #E5E5E5',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: '0 auto',
            padding: '0 24px',
            minHeight: 72,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 14,
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/products/thinkbox"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              textDecoration: 'none',
              color: '#1f2937',
              fontWeight: 800,
            }}
          >
            <Image
              src="/ThinkBox/Think Box Logo.png"
              alt="ThinkBox"
              width={420}
              height={160}
              priority
              style={{ height: 48, width: 'auto' }}
            />
            <span style={{ fontSize: 14, color: '#6b7280' }}>Pitch Deck</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <Link
              href="/products/thinkbox"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: '#374151',
                fontWeight: 700,
                fontSize: 14,
                padding: '9px 16px',
                borderRadius: 9999,
                border: '2px solid #E5E5E5',
                backgroundColor: '#fff',
              }}
            >
              Back to ThinkBox
            </Link>
            <Link
              href="/products/thinkbox#demo-form"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: '#fff',
                fontWeight: 800,
                fontSize: 14,
                padding: '9px 16px',
                borderRadius: 9999,
                backgroundColor: '#58CC02',
                boxShadow: '0 3px 0 #46A302',
              }}
            >
              Request Demo
            </Link>
          </div>
        </div>
      </nav>

      <section style={{ padding: '72px 24px 56px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div
            style={{
              background: 'linear-gradient(145deg, #111827 0%, #1f2937 54%, #2b3340 100%)',
              color: '#fff',
              borderRadius: 28,
              border: '2px solid #1f2937',
              boxShadow: '0 10px 0 #cbd5e1',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '44px 30px 30px',
                display: 'grid',
                gap: 24,
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                alignItems: 'center',
              }}
            >
              <div>
                <p
                  style={{
                    margin: '0 0 12px',
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#bbf7d0',
                  }}
                >
                  ThinkBox Investor Snapshot
                </p>
                <h1
                  style={{
                    fontFamily: "Fredoka, Nunito, 'Trebuchet MS', sans-serif",
                    fontSize: 'clamp(2.1rem, 5vw, 3.4rem)',
                    lineHeight: 1.08,
                    margin: '0 0 16px',
                  }}
                >
                  Building the offline learning platform for curious kids.
                </h1>
                <p style={{ margin: 0, color: '#d1d5db', fontSize: 16, lineHeight: 1.7, maxWidth: 620 }}>
                  ThinkBox turns passive screen time into structured, safe, and self-driven discovery for learners aged 6-14, with 20 demo testers and an active 40+ student pilot at American University of Nigeria Schools.
                </p>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 22,
                  padding: 20,
                }}
              >
                <Image
                  src="/ThinkBox/Hero Picture.svg"
                  alt="ThinkBox product preview"
                  width={560}
                  height={420}
                  style={{ width: '100%', height: 'auto', borderRadius: 14, backgroundColor: '#ffffff' }}
                />
              </div>
            </div>

            <div
              style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '18px 24px 24px',
                display: 'grid',
                gap: 10,
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              }}
            >
              {tractionItems.map((item) => (
                <div key={item.label} style={{ padding: '10px 12px', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.07)' }}>
                  <p style={{ margin: '0 0 4px', color: '#93c5fd', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {item.label}
                  </p>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 24px 84px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gap: 20 }}>
          <article
            style={{
              backgroundColor: '#fff',
              border: '2px solid #E5E5E5',
              borderRadius: 24,
              boxShadow: '0 6px 0 #d9d9d9',
              padding: '30px 26px',
            }}
          >
            <p style={{ margin: '0 0 8px', color: '#16a34a', fontWeight: 800, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Slide 01 - Problem
            </p>
            <h2 style={{ margin: '0 0 16px', fontFamily: "Fredoka, Nunito, sans-serif", fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#111827' }}>
              Learning quality drops when connectivity, curation, and motivation are weak.
            </h2>
            <div style={{ display: 'grid', gap: 12 }}>
              {problemPoints.map((point) => (
                <div key={point} style={{ borderRadius: 14, border: '2px solid #e5e7eb', backgroundColor: '#f9fafb', padding: '14px 16px', color: '#374151', lineHeight: 1.6 }}>
                  {point}
                </div>
              ))}
            </div>
          </article>

          <article
            style={{
              backgroundColor: '#fff',
              border: '2px solid #E5E5E5',
              borderRadius: 24,
              boxShadow: '0 6px 0 #d9d9d9',
              padding: '30px 26px',
            }}
          >
            <p style={{ margin: '0 0 8px', color: '#2563eb', fontWeight: 800, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Slide 02 - Solution
            </p>
            <h2 style={{ margin: '0 0 20px', fontFamily: "Fredoka, Nunito, sans-serif", fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#111827' }}>
              ThinkBox delivers structured discovery in a kid-safe, offline-first environment.
            </h2>
            <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              {solutionPillars.map((pillar) => (
                <div key={pillar.title} style={{ borderRadius: 16, border: '2px solid #d1fae5', backgroundColor: '#ecfdf5', padding: '16px 16px 14px' }}>
                  <h3 style={{ margin: '0 0 8px', color: '#14532d', fontFamily: "Fredoka, Nunito, sans-serif", fontSize: 18 }}>{pillar.title}</h3>
                  <p style={{ margin: 0, color: '#166534', lineHeight: 1.6, fontSize: 14 }}>{pillar.detail}</p>
                </div>
              ))}
            </div>
          </article>

          <article
            style={{
              backgroundColor: '#fff',
              border: '2px solid #E5E5E5',
              borderRadius: 24,
              boxShadow: '0 6px 0 #d9d9d9',
              padding: '30px 26px',
            }}
          >
            <p style={{ margin: '0 0 8px', color: '#b45309', fontWeight: 800, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Slide 03 - Go To Market and Monetization
            </p>
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))' }}>
              <div style={{ borderRadius: 16, border: '2px solid #fde68a', backgroundColor: '#fffbeb', padding: '16px 18px' }}>
                <h3 style={{ margin: '0 0 10px', fontFamily: "Fredoka, Nunito, sans-serif", color: '#7c2d12', fontSize: 20 }}>
                  Distribution channels
                </h3>
                <div style={{ display: 'grid', gap: 10 }}>
                  {gtMChannels.map((channel) => (
                    <div key={channel.title} style={{ borderRadius: 12, border: '1px solid #fcd34d', backgroundColor: '#fff', padding: '10px 12px' }}>
                      <p style={{ margin: '0 0 4px', fontWeight: 800, color: '#92400e', fontSize: 14 }}>{channel.title}</p>
                      <p style={{ margin: 0, color: '#78350f', lineHeight: 1.5, fontSize: 13 }}>{channel.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderRadius: 16, border: '2px solid #bfdbfe', backgroundColor: '#eff6ff', padding: '16px 18px' }}>
                <h3 style={{ margin: '0 0 10px', fontFamily: "Fredoka, Nunito, sans-serif", color: '#1d4ed8', fontSize: 20 }}>
                  Revenue evolution
                </h3>
                <div style={{ display: 'grid', gap: 10 }}>
                  <div style={{ borderRadius: 12, border: '1px solid #93c5fd', backgroundColor: '#fff', padding: '10px 12px', color: '#1e3a8a' }}>
                    Beta now includes 20 demo testers and a 40+ student school pilot, validating engagement and retention loops with real learners.
                  </div>
                  <div style={{ borderRadius: 12, border: '1px solid #93c5fd', backgroundColor: '#fff', padding: '10px 12px', color: '#1e3a8a' }}>
                    Phase 1: subscription for families with bundled premium packs.
                  </div>
                  <div style={{ borderRadius: 12, border: '1px solid #93c5fd', backgroundColor: '#fff', padding: '10px 12px', color: '#1e3a8a' }}>
                    Phase 2: school and partner licensing for classroom deployment.
                  </div>
                </div>
              </div>
            </div>
          </article>

          <article
            style={{
              backgroundColor: '#fff',
              border: '2px solid #E5E5E5',
              borderRadius: 24,
              boxShadow: '0 6px 0 #d9d9d9',
              padding: '30px 26px',
            }}
          >
            <p style={{ margin: '0 0 8px', color: '#7c3aed', fontWeight: 800, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Slide 04 - Roadmap and Ask
            </p>
            <h2 style={{ margin: '0 0 18px', fontFamily: "Fredoka, Nunito, sans-serif", fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#111827' }}>
              Focused milestones to scale from beta traction to repeatable growth.
            </h2>
            <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: 20 }}>
              {roadmap.map((item) => (
                <div key={item.quarter} style={{ borderRadius: 14, border: '2px solid #ddd6fe', backgroundColor: '#f5f3ff', padding: '12px 14px' }}>
                  <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 800, color: '#6d28d9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {item.quarter}
                  </p>
                  <p style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 800, color: '#4c1d95' }}>{item.title}</p>
                  <p style={{ margin: 0, color: '#5b21b6', fontSize: 14, lineHeight: 1.55 }}>{item.detail}</p>
                </div>
              ))}
            </div>

            <div
              style={{
                borderRadius: 18,
                border: '2px solid #86efac',
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                padding: '18px 18px',
                display: 'grid',
                gap: 12,
              }}
            >
              <h3 style={{ margin: 0, fontFamily: "Fredoka, Nunito, sans-serif", color: '#14532d', fontSize: 22 }}>
                Current ask
              </h3>
              <p style={{ margin: 0, color: '#166534', lineHeight: 1.65 }}>
                Strategic support for pilot distribution, content expansion, and early GTM execution to move ThinkBox from beta to broad adoption.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link
                  href="/contact"
                  style={{
                    textDecoration: 'none',
                    fontWeight: 800,
                    fontSize: 14,
                    color: '#fff',
                    backgroundColor: '#16a34a',
                    boxShadow: '0 3px 0 #15803d',
                    borderRadius: 9999,
                    padding: '10px 16px',
                  }}
                >
                  Contact KayCorp Team
                </Link>
                <Link
                  href="/products/thinkbox#demo-form"
                  style={{
                    textDecoration: 'none',
                    fontWeight: 800,
                    fontSize: 14,
                    color: '#166534',
                    backgroundColor: '#fff',
                    border: '2px solid #86efac',
                    borderRadius: 9999,
                    padding: '8px 16px',
                  }}
                >
                  Open Live Demo Funnel
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
