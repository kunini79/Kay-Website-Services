import React, { useState, useEffect } from 'react';
import { Article, TopicMastery } from '../types';
import { DidYouKnow } from './DidYouKnow';
import { QuizView } from './QuizView';
import { fetchWikimediaImage, fetchWikimediaImages } from '../services/geminiService';
import { ArrowLeft, ArrowRight, Volume2, Bookmark, Check, Printer } from 'lucide-react';
import { TextWithTTS } from './TextWithTTS';
import { QuizResult } from '../services/learning';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

interface ArticleViewProps {
  article: Article;
  onTopicClick: (topic: string) => void;
  onBack: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
  topicMastery?: TopicMastery;
  onEarnXP?: (result: QuizResult) => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  article,
  onTopicClick,
  onBack,
  isSaved = false,
  onToggleSave,
  onEarnXP,
  topicMastery,
}) => {
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [heroLoading, setHeroLoading] = useState(true);
  const imageSeed = article.imageSeed || article.title;
  
  // Embla Carousel hook
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

  useEffect(() => {
    if (article.isCurriculumNote) {
      setHeroLoading(false);
      return;
    }
    let isMounted = true;
    const loadHeroImage = async () => {
      try {
        const imageUrls = await fetchWikimediaImages(imageSeed, 1200, 600, 5);
        if (isMounted) {
          setHeroImages(imageUrls.length > 0 ? imageUrls : []);
        }
      } catch (err) {
        console.warn('Failed to load hero image:', err);
        setHeroImages([]);
      } finally {
        if (isMounted) setHeroLoading(false);
      }
    };
    loadHeroImage();
    return () => {
      isMounted = false;
    };
  }, [imageSeed, article.isCurriculumNote]);

  const sectionColors = ['#0D9488', '#F97316', '#FCD34D', '#14B8A6'];

  return (
    <div className="tb-article-enter tb-printable-article" style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
      
      {/* Back button */}
      <div className="tb-print-hide" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <button
          onClick={onBack}
          style={{
            marginBottom: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--tb-text-muted)',
            fontWeight: 600,
            fontSize: '14px'
          }}
        >
          <ArrowLeft size={16} /> Back to Topics
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          title="Print article"
          aria-label="Print article"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '2px solid var(--tb-border)', borderRadius: '999px', background: 'var(--tb-surface)', color: 'var(--tb-text)', padding: '9px 14px', cursor: 'pointer', fontWeight: 700 }}
        >
          <Printer size={16} /> Print Article
        </button>
      </div>
      <h1 className="tb-print-title">{article.title}</h1>

      {/* Hero Header / Banner */}
      {article.isCurriculumNote ? (
        <div
          style={{
            background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
            borderRadius: 'var(--tb-radius-xl)',
            padding: '32px 28px',
            color: 'white',
            boxShadow: 'var(--tb-shadow-md)',
            marginBottom: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div>
            <span
              style={{
                display: 'inline-block',
                background: '#58CC02',
                color: '#ffffff',
                padding: '6px 16px',
                borderRadius: 'var(--tb-radius-full)',
                fontFamily: 'var(--tb-font-heading)',
                fontWeight: 800,
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              📚 ACADEMIC LESSON NOTE • {article.gradeLabel || article.category}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
            <h1
              style={{
                fontFamily: 'var(--tb-font-heading)',
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                fontWeight: 700,
                color: 'white',
                margin: 0,
                lineHeight: 1.15,
              }}
            >
              {article.title}
            </h1>
            {onToggleSave && (
              <button
                onClick={onToggleSave}
                style={{
                  background: isSaved ? 'var(--tb-primary)' : 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(4px)',
                  border: isSaved ? '2px solid var(--tb-primary-light)' : '2px solid rgba(255,255,255,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isSaved ? '0 4px 12px rgba(88, 204, 2, 0.4)' : 'none'
                }}
                title={isSaved ? "Saved to Backpack" : "Save to Backpack"}
              >
                {isSaved ? <Check size={24} strokeWidth={3} /> : <Bookmark size={24} />}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="tb-article-hero" style={{ position: 'relative', borderRadius: 'var(--tb-radius-xl)', overflow: 'hidden', boxShadow: 'var(--tb-shadow-lg)', marginBottom: '32px' }}>
          {heroLoading ? (
              <div style={{ aspectRatio: '16/9', width: '100%', background: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="text-gray-400 font-bold">Loading visuals...</span>
              </div>
          ) : (
            <div className="embla" ref={emblaRef} style={{ overflow: 'hidden', height: '100%', aspectRatio: '16/9' }}>
              <div className="embla__container" style={{ display: 'flex', height: '100%' }}>
                {(heroImages.length > 0 ? heroImages : ['/placeholder.jpg']).map((src, index) => (
                   <div className="embla__slide" key={index} style={{ flex: '0 0 100%', minWidth: 0, position: 'relative' }}>
                      <img
                        src={src}
                        alt={`${article.title} - view ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          filter: 'brightness(0.7)',
                        }}
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                   </div>
                ))}
              </div>
            </div>
          )}

          {/* Title Overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              padding: '40px 32px',
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              pointerEvents: 'none'
            }}
          >
            <div style={{ pointerEvents: 'auto' }}>
              <div style={{ marginBottom: '16px' }}>
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
                    }}
                  >
                    {article.category}
                  </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
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
                  
                  {onToggleSave && (
                      <button
                          onClick={onToggleSave}
                          style={{
                              pointerEvents: 'auto',
                              background: isSaved ? 'var(--tb-primary)' : 'rgba(255,255,255,0.2)',
                              backdropFilter: 'blur(4px)',
                              border: isSaved ? '2px solid var(--tb-primary-light)' : '2px solid rgba(255,255,255,0.4)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              width: '48px',
                              height: '48px',
                              borderRadius: '50%',
                              color: 'white',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              boxShadow: isSaved ? '0 4px 12px rgba(88, 204, 2, 0.4)' : 'none'
                          }}
                          title={isSaved ? "Saved to Backpack" : "Save to Backpack"}
                      >
                          {isSaved ? <Check size={24} strokeWidth={3} /> : <Bookmark size={24} />}
                      </button>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Intro Section with TTS */}
      <div className="tb-article-body mb-8">
         <div
          style={{
            fontSize: '20px',
            fontWeight: 500,
            color: 'var(--tb-text-muted)',
            lineHeight: 1.6,
            marginBottom: '32px',
            borderLeft: '4px solid var(--tb-primary)',
            paddingLeft: '20px',
          }}
        >
          <TextWithTTS content={article.intro} title={article.title} />
        </div>

        {article.source?.title && (
          <div
            style={{
              marginBottom: '24px',
              color: 'var(--tb-text-muted)',
              fontSize: '13px',
            }}
          >
            Source:{' '}
            {article.source.url ? (
              <a
                href={article.source.url}
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--tb-primary)', fontWeight: 700 }}
              >
                {article.source.title}
              </a>
            ) : (
              article.source.title
            )}
            {article.reviewStatus === 'ai-draft' && ' | AI draft'}
          </div>
        )}

         {/* Fun Fact / Key Concept Card */}
         <DidYouKnow
           fact={article.funFact}
           title={article.isCurriculumNote ? '📌 Key Memory Concept & Rule' : 'Did You Know?'}
         />
      </div>

      {/* Article Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginTop: '32px' }}>
          {article.sections && article.sections.length > 0 ? (
            article.sections.map((section, idx) => (
              <SectionBlock
                key={idx}
                section={section}
                index={idx}
                articleTitle={article.title}
                articleImageSeed={imageSeed}
                accentColor={sectionColors[idx % sectionColors.length]}
                isCurriculumNote={article.isCurriculumNote}
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

      {article.quiz && article.quiz.length > 0 && onEarnXP && (
        <div className="tb-article-quiz" style={{ marginTop: '48px', marginBottom: '48px' }}>
          <QuizView questions={article.quiz} mastery={topicMastery} onComplete={onEarnXP} />
        </div>
      )}

      {/* Related Topics */}
      <div className="tb-article-related" style={{ marginTop: '48px', textAlign: 'center' }}>
        <h3
          style={{
            fontSize: '24px',
            marginBottom: '24px',
            color: 'var(--tb-text)',
          }}
        >
          Keep Exploring!
        </h3>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          {article.relatedTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => onTopicClick(topic)}
              style={{
                padding: '12px 24px',
                background: 'white',
                border: '2px solid var(--tb-border)',
                borderRadius: 'var(--tb-radius-full)',
                fontFamily: 'var(--tb-font-heading)',
                fontSize: '16px',
                fontWeight: 700,
                color: 'var(--tb-primary)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--tb-primary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--tb-border)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {topic} <ArrowRight size={16} />
            </button>
          ))}
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
  articleImageSeed: string;
  accentColor: string;
  isCurriculumNote?: boolean;
}

const SectionBlock: React.FC<SectionBlockProps> = ({
  section,
  index,
  articleTitle,
  articleImageSeed,
  accentColor,
  isCurriculumNote = false,
}) => {
  const [sectionImages, setSectionImages] = useState<string[]>([]);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    if (!isCurriculumNote && index % 2 === 0) {
      let isMounted = true;
      const loadImage = async () => {
        try {
          const seed = `${articleImageSeed} - ${section.subtitle}`;
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
  }, [articleImageSeed, index, isCurriculumNote, section.subtitle]);

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
        <div style={{
          fontSize: '16px',
          color: 'var(--tb-text)',
          lineHeight: '1.7',
          whiteSpace: 'pre-line',
        }}>
          <TextWithTTS content={section.content} />
        </div>
      </div>
      {!isCurriculumNote && index % 2 === 0 && (
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
