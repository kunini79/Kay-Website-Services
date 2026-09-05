import React, { useState, useRef, useEffect } from "react";
import { Volume2, Pause, Volume1 } from "lucide-react";
import { lookupDictionary } from '@/lib/offlineDictionary';

interface TooltipProps {
  word: string;
}

const DefinitionTooltip: React.FC<TooltipProps> = ({ word }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cleanWord = word.toLowerCase().replace(/[.,;!?()]/g, "");
  const definition = lookupDictionary(cleanWord)?.meaning;

  // If dictionary entry exists, show tooltip
  if (definition) {
    return (
      <span className="relative inline-block group">
        <button
          onClick={(e) => { e.stopPropagation(); setIsVisible(!isVisible); }}
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
          className="cursor-help text-blue-600 underline decoration-dotted underline-offset-4 hover:text-blue-800 transition-colors"
          style={{ textDecorationStyle: 'dotted', textDecorationColor: '#2563EB', textUnderlineOffset: '4px' }}
        >
          {word}
        </button>

        {isVisible && (
          <div 
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-white rounded-xl shadow-xl border-2 border-yellow-400 text-sm text-gray-800 text-center"
            style={{ width: '200px', transform: 'translateX(-50%)', bottom: '100%' }}
          >
            <div className="font-bold mb-1 capitalize text-yellow-600">{cleanWord}</div>
            <div className="leading-snug">{definition}</div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white" 
                 style={{ borderTopColor: '#FFF', borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: 'transparent' }}/>
          </div>
        )}
      </span>
    );
  }
  
  return <>{word}</>;
};

interface TTSProps {
  content: string;
  title?: string;
  className?: string;
}

const TextWithTTS: React.FC<TTSProps> = ({ content, title, className }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Split logic that preserves punctuation attached to words
  const words = React.useMemo(() => content.split(" "), [content]);

  // Cleanup
  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const handleSpeak = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentWordIndex(-1);
      return;
    }

    if (!("speechSynthesis" in window)) return;

    // Use full text
    const textToSpeak = content;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentWordIndex(-1);
    };
    utterance.onerror = () => {
      setIsPlaying(false);
      setCurrentWordIndex(-1);
    };

    // Mapping charIndex to word index
    utterance.onboundary = (event) => {
      if (event.name === "word") {
        const charIndex = event.charIndex;
        // Re-calculate simplistic word index based on length summation
        let currentLength = 0;
        for (let i = 0; i < words.length; i++) {
          // Add 1 for the space that was used to split
          const wordLen = words[i].length + 1;
          if (currentLength <= charIndex && charIndex < currentLength + wordLen) {
            setCurrentWordIndex(i);
            break;
          }
          currentLength += wordLen;
        }
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`tb-tts-wrapper ${className || ''}`}>
      <div className="flex items-center justify-between mb-4" style={{ marginBottom: '16px' }}>
        <button
          onClick={handleSpeak}
          className={`tb-btn tb-btn-sm ${isPlaying ? "tb-btn-active" : "tb-btn-quiet"}`}
          style={{ 
            padding: '8px 16px', 
            borderRadius: '20px', 
            background: isPlaying ? '#FDE68A' : '#f3f4f6',
            color: isPlaying ? '#ed8936' : '#4b5563',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontWeight: 700
          }}
          aria-label={isPlaying ? "Pause reading" : "Read section aloud"}
        >
          {isPlaying ? <Pause size={18} /> : <Volume1 size={18} />}
          <span>
            {isPlaying ? "Pause Reading" : "Read Aloud"}
          </span>
        </button>
      </div>

      <p className="tb-text-body" style={{ lineHeight: 1.8, fontSize: '1.15em' }}>
        {words.map((word, i) => {
          const cleanWord = word.toLowerCase().replace(/[.,;!?()]/g, "");
          // Check our dictionary for complex words
          const isComplex = Boolean(lookupDictionary(cleanWord));

          return (
            <React.Fragment key={i}>
              <span
                style={{
                  backgroundColor: i === currentWordIndex ? '#fef08a' : 'transparent',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s',
                  padding: '2px 0'
                }}
              >
                {/* 
                  If complex, use tooltip. 
                  If not, render word directly.
                */}
                <DefinitionTooltip word={word} />
              </span>
              {/* Add space explicitly since we split by space */}
              {" "}
            </React.Fragment>
          );
        })}
      </p>
    </div>
  );
};

export { TextWithTTS };
