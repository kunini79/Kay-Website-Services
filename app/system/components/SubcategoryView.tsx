'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { CATEGORY_CONFIG } from '../constants';
import { getImageUrl } from '../services/geminiService';

interface SubcategoryData {
  id: string;
  title: string;
  icon: string;
  description: string;
  topics: string[];
}

interface SubcategoryViewProps {
  category: string;
  subcategories: SubcategoryData[];
  initialSubcategoryId?: string;
  onTopicClick: (topic: string) => void;
  onBack: () => void;
}

export const SubcategoryView: React.FC<SubcategoryViewProps> = ({
  category,
  subcategories,
  initialSubcategoryId,
  onTopicClick,
  onBack,
}) => {
  const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
  const [activeSubcategory, setActiveSubcategory] = useState<string>(() => {
    if (initialSubcategoryId && subcategories.some((s) => s.id === initialSubcategoryId)) {
      return initialSubcategoryId;
    }
    return subcategories[0]?.id || '';
  });
  const [topicImages, setTopicImages] = useState<Record<string, string>>({});
  const [subcategoryImages, setSubcategoryImages] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialSubcategoryId && subcategories.some((s) => s.id === initialSubcategoryId)) {
      setActiveSubcategory(initialSubcategoryId);
      return;
    }
    setActiveSubcategory(subcategories[0]?.id || '');
  }, [initialSubcategoryId, subcategories]);

  const activeSub = subcategories.find((s) => s.id === activeSubcategory);
  const topics = activeSub?.topics || [];

  useEffect(() => {
    let mounted = true;
    const loadImages = async () => {
      const entries = await Promise.all(
        topics.map(async (topic) => [topic, await getImageUrl(topic, 320, 220)] as const)
      );
      if (mounted) setTopicImages(Object.fromEntries(entries));
    };
    loadImages();
    return () => { mounted = false; };
  }, [activeSubcategory, topics]);

  useEffect(() => {
    let mounted = true;
    const loadSubcategoryImages = async () => {
      const entries = await Promise.all(
        subcategories.map(async (sub) => [sub.id, await getImageUrl(sub.topics[0] || sub.title, 160, 100)] as const)
      );
      if (mounted) setSubcategoryImages(Object.fromEntries(entries));
    };
    loadSubcategoryImages();
    return () => { mounted = false; };
  }, [subcategories]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--tb-bg)', padding: '0' }}>
      {/* Category Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #82c93b 0%, #5f9f2d 100%)',
          padding: '24px 32px 20px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'rgba(255,255,255,0.85)',
            fontSize: '14px',
            fontWeight: 700,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0',
            marginBottom: '12px',
          }}
        >
          <ArrowLeft size={18} /> Back to Home
        </button>
        <h1
          style={{
            fontFamily: 'var(--tb-font-heading)',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800,
            color: '#fff',
            margin: '0',
          }}
        >
          {category}
        </h1>
        {/* Decorative icon */}
        <div
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '100px',
            opacity: 0.15,
            pointerEvents: 'none',
          }}
        >
          {config?.icon}
        </div>
      </div>

      {/* Encarta Layout: sidebar + grid */}
      <div
        style={{
          display: 'flex',
          minHeight: 'calc(100vh - 140px)',
        }}
      >
        {/* Left Sidebar — Subcategory Tabs */}
        <aside
          style={{
            width: '188px',
            flexShrink: 0,
            background: 'linear-gradient(180deg, #edf7e9 0%, #d5eacd 100%)',
            borderRight: '2px solid #a9cf9f',
            padding: '16px 0',
            overflowY: 'auto',
          }}
        >
          {subcategories.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setActiveSubcategory(sub.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 18px',
                border: 'none',
                borderLeft: activeSubcategory === sub.id ? '4px solid #8fc63d' : '4px solid transparent',
                background: activeSubcategory === sub.id
                  ? 'linear-gradient(90deg, rgba(154,200,60,0.28) 0%, transparent 100%)'
                  : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                fontFamily: 'var(--tb-font-heading)',
                fontSize: '14px',
                fontWeight: activeSubcategory === sub.id ? 800 : 600,
                color: activeSubcategory === sub.id ? '#4f8236' : 'var(--tb-brand-navy)',
              }}
              onMouseEnter={(e) => {
                if (sub.id !== activeSubcategory) {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(154,200,60,0.14)';
                }
              }}
              onMouseLeave={(e) => {
                if (sub.id !== activeSubcategory) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }
              }}
            >
              <span style={{ width: '34px', height: '34px', flexShrink: 0, overflow: 'hidden', borderRadius: '9px', background: '#dcefd5' }}>
                {subcategoryImages[sub.id] ? (
                  <img src={subcategoryImages[sub.id]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ display: 'grid', width: '100%', height: '100%', placeItems: 'center', fontSize: '19px' }}>{sub.icon}</span>
                )}
              </span>
              <span style={{ lineHeight: 1.3 }}>{sub.title}</span>
            </button>
          ))}
        </aside>

        {/* Right Panel — Topic Grid */}
        <div
          style={{
            flex: 1,
            padding: '28px 32px',
            overflowY: 'auto',
          }}
        >
          {/* Subcategory title + count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <span style={{ fontSize: '32px' }}>{activeSub?.icon}</span>
            <div>
              <h2
                style={{
                  fontFamily: 'var(--tb-font-heading)',
                  fontSize: '24px',
                  fontWeight: 800,
                  color: 'var(--tb-text)',
                  margin: '0',
                }}
              >
                {activeSub?.title}
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--tb-text-muted)', margin: '4px 0 0' }}>
                {topics.length} topics to explore
              </p>
            </div>
          </div>

          {/* Topic Grid — Encarta style */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
              gap: '14px',
            }}
          >
            {topics.map((topic) => (
              <button
                key={topic}
                onClick={() => onTopicClick(topic)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 10px',
                      background: '#fff',
                      border: '2px solid #e0e6e8',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = '#8fc63d';
                  el.style.transform = 'translateY(-3px)';
                  el.style.boxShadow = '0 6px 20px rgba(111,157,37,0.18)';
                  el.style.background = '#f6fbf2';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = '#e0e6e8';
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
                  el.style.background = '#fff';
                }}
              >
                {/* Topic image */}
                <div
                  style={{
                    width: '100%',
                    height: '92px',
                    borderRadius: '10px',
                    background: '#e9f4e5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {topicImages[topic] ? (
                    <img src={topicImages[topic]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '22px', color: '#6e9d25' }}>...</span>
                  )}
                </div>

                {/* Topic name */}
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'var(--tb-text)',
                    lineHeight: 1.3,
                    wordBreak: 'break-word',
                  }}
                >
                  {topic}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
