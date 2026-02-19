import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { DidYouKnow } from './DidYouKnow';
import { fetchWikimediaImage, fetchWikimediaImages } from '../services/geminiService';
import { ArrowRight, Volume2 } from 'lucide-react';

interface ArticleViewProps {
  article: Article;
  onTopicClick: (topic: string) => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  article,
  onTopicClick,
}) => {
  const [heroImage, setHeroImage] = useState<string>('');
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [heroLoading, setHeroLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadHeroImage = async () => {
      try {
        const imageUrls = await fetchWikimediaImages(article.title, 1200, 600, 4);
        if (isMounted) {
          setHeroImages(imageUrls);
          setHeroImage(imageUrls[0] || '');
        }
      } catch (err) {
        console.warn('Failed to load hero image:', err);
        setHeroImage('');
        setHeroImages([]);
      } finally {
        if (isMounted) setHeroLoading(false);
      }
    };
    loadHeroImage();
    return () => {
      isMounted = false;
    };
  }, [article.title]);

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        `${article.title}. ${article.intro}`
      );
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const sectionColors = ['#0D9488', '#F97316', '#FCD34D', '#14B8A6'];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
      {/* Hero */}
      <div className="tb-article-hero">
        <div
          style={{
            aspectRatio: '16/9',
            width: '100%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {heroLoading && <div className="tb-spinner" />}
          {heroImage && (
            <img
              src={heroImage}
              alt={article.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                inset: 0,
              }}
              loading="lazy"
              onLoad={() => setHeroLoading(false)}
              onError={() => setHeroLoading(false)}
            />
          )}
        </div>

        {/* Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background:
              'linear-gradient(to top, rgba(15,23,42,0.85), transparent)',
            padding: '64px 32px 32px',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              background: 'var(--tb-yellow)',
              color: 'var(--tb-text)',
              padding: '4px 14px',
              borderRadius: 'var(--tb-radius-full)',
              fontFamily: 'var(--tb-font-heading)',
              fontWeight: 700,
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '12px',
            }}
          >
            {article.category}
          </span>
          <h1
            style={{
              fontFamily: 'var(--tb-font-heading)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 700,
              color: 'white',
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            {article.title}
          </h1>
        </div>

        {/* TTS button */}
        <button
          onClick={handleSpeak}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--tb-shadow-md)',
            cursor: 'pointer',
          }}
          aria-label="Read aloud"
        >
          <Volume2 size={22} color="var(--tb-primary)" />
        </button>
      </div>

      {heroImages.length > 1 && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '10px 14px',
            overflowX: 'auto',
            background: 'rgba(255,255,255,0.05)',
          }}
        >
          {heroImages.map((imgUrl, idx) => (
            <button
              key={`${imgUrl}-${idx}`}
              onClick={() => setHeroImage(imgUrl)}
              style={{
                border: imgUrl === heroImage ? '2px solid var(--tb-yellow)' : '2px solid transparent',
                borderRadius: '10px',
                padding: 0,
                width: '88px',
                height: '56px',
                overflow: 'hidden',
                cursor: 'pointer',
                flexShrink: 0,
                background: 'transparent',
              }}
              aria-label={`Select hero image ${idx + 1}`}
            >
              <img
                src={imgUrl}
                alt={`${article.title} preview ${idx + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Body */}
      <div className="tb-article-body">
        <p
          style={{
            fontSize: '20px',
            lineHeight: 1.7,
            color: 'var(--tb-text)',
            fontWeight: 600,
            marginBottom: '32px',
          }}
        >
          {article.intro}
        </p>

        <DidYouKnow fact={article.funFact} />

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginTop: '32px' }}>
          {article.sections && article.sections.length > 0 ? (
            article.sections.map((section, idx) => (
              <SectionBlock
                key={idx}
                section={section}
                index={idx}
                articleTitle={article.title}
                accentColor={sectionColors[idx % sectionColors.length]}
              />
            ))
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '48px',
                background: 'var(--tb-bg)',
                borderRadius: 'var(--tb-radius-lg)',
                color: 'var(--tb-text-muted)',
                fontWeight: 700,
              }}
            >
              Short article! Try searching for another topic.
            </div>
          )}
        </div>

        {/* Related Topics */}
        <div
          style={{
            marginTop: '48px',
            padding: '32px',
            background: 'var(--tb-primary)',
            borderRadius: 'var(--tb-radius-xl)',
            textAlign: 'center',
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--tb-font-heading)',
              fontSize: '24px',
              fontWeight: 700,
              color: 'white',
              marginBottom: '20px',
            }}
          >
            What do you want to explore next?
          </h3>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '12px',
            }}
          >
            {article.relatedTopics && article.relatedTopics.length > 0 ? (
              article.relatedTopics.map((topic, i) => (
                <button
                  key={i}
                  onClick={() => onTopicClick(topic)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '12px 20px',
                    borderRadius: 'var(--tb-radius-md)',
                    fontFamily: 'var(--tb-font-heading)',
                    fontWeight: 700,
                    fontSize: '15px',
                    cursor: 'pointer',
                  }}
                >
                  {topic}
                  <ArrowRight size={16} />
                </button>
              ))
            ) : (
              <p style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                No more suggestions for now!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* Section Block */
interface SectionBlockProps {
  section: { subtitle: string; content: string };
  index: number;
  articleTitle: string;
  accentColor: string;
}

const SectionBlock: React.FC<SectionBlockProps> = ({
  section,
  index,
  articleTitle,
  accentColor,
}) => {
  const [sectionImages, setSectionImages] = useState<string[]>([]);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    if (index % 2 === 0) {
      let isMounted = true;
      const loadImage = async () => {
        try {
          const seed = `${articleTitle} - ${section.subtitle}`;
          const imageUrls = await fetchWikimediaImages(seed, 400, 300, 3);
          if (isMounted) setSectionImages(imageUrls);
        } catch {
          setSectionImages([]);
        } finally {
          if (isMounted) setImageLoading(false);
        }
      };
      loadImage();
      return () => {
        isMounted = false;
      };
    } else {
      setImageLoading(false);
    }
  }, [articleTitle, index]);

  return (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '280px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div className="tb-section-number" style={{ background: accentColor }}>
            {index + 1}
          </div>
          <h2
            style={{
              fontFamily: 'var(--tb-font-heading)',
              fontSize: '22px',
              fontWeight: 700,
              color: accentColor,
              margin: 0,
            }}
          >
            {section.subtitle}
          </h2>
        </div>
        <p
          style={{
            fontSize: '16px',
            lineHeight: 1.7,
            color: 'var(--tb-text)',
            fontWeight: 500,
          }}
        >
          {section.content}
        </p>
      </div>
      {index % 2 === 0 && (
        <div
          style={{
            width: '260px',
            aspectRatio: '4/3',
            borderRadius: 'var(--tb-radius-lg)',
            overflow: 'hidden',
            background: 'var(--tb-bg)',
            flexShrink: 0,
            boxShadow: 'var(--tb-shadow-sm)',
          }}
        >
          {imageLoading ? (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--tb-text-muted)',
                fontWeight: 700,
                fontSize: '13px',
              }}
            >
              Loading...
            </div>
          ) : sectionImages.length > 0 ? (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: '1fr 1fr',
                gap: '4px',
                padding: '4px',
                boxSizing: 'border-box',
              }}
            >
              <img
                src={sectionImages[0]}
                alt={section.subtitle}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  gridColumn: '1 / 3',
                  borderRadius: '8px',
                }}
                loading="lazy"
              />
              {sectionImages.slice(1).map((imgUrl, idx) => (
                <img
                  key={`${imgUrl}-${idx}`}
                  src={imgUrl}
                  alt={`${section.subtitle} ${idx + 2}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                  loading="lazy"
                />
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
