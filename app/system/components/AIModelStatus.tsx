'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Cpu, Wifi, WifiOff, Download, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import type { LocalAIProgress, LocalAIMode } from '../services/localAIService';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AIModelStatusProps {
  /** If true, the badge always renders. If false, only shows when offline or local AI is active. */
  alwaysShow?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const modeLabel: Record<LocalAIMode, string> = {
  'window.ai': 'Chrome AI',
  'transformers.js': 'Local AI',
  'unavailable': 'Unavailable',
};

// ─── Component ────────────────────────────────────────────────────────────────

export const AIModelStatus: React.FC<AIModelStatusProps> = ({ alwaysShow = false }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [localMode, setLocalMode] = useState<LocalAIMode | null>(null);
  const [progress, setProgress] = useState<LocalAIProgress | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasPrepared, setHasPrepared] = useState(false);

  // ── Network status ──────────────────────────────────────────────────────────
  useEffect(() => {
    const update = () => setIsOnline(navigator.onLine);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  // ── Detect available local AI mode on mount ─────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { detectLocalAIMode, isLocalAIReady } = await import('../services/localAIService');
        const mode = await detectLocalAIMode();
        if (!cancelled) {
          setLocalMode(mode);
          setIsReady(isLocalAIReady());
        }
      } catch {
        // non-critical
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ── Poll ready state after preparation starts ───────────────────────────────
  useEffect(() => {
    if (!hasPrepared) return;
    const interval = setInterval(async () => {
      try {
        const { isLocalAIReady } = await import('../services/localAIService');
        const ready = isLocalAIReady();
        setIsReady(ready);
        if (ready) clearInterval(interval);
      } catch { /* ignore */ }
    }, 1000);
    return () => clearInterval(interval);
  }, [hasPrepared]);

  // ── Download / prepare the local model ─────────────────────────────────────
  const handleDownload = useCallback(async () => {
    if (hasPrepared) return;
    setHasPrepared(true);
    try {
      const { prepareLocalAI } = await import('../services/localAIService');
      await prepareLocalAI((p) => {
        setProgress(p);
        if (p.status === 'ready') {
          setIsReady(true);
          setProgress(null);
        }
      });
    } catch (err: any) {
      setProgress({
        status: 'error',
        mode: localMode,
        downloadProgress: null,
        message: err?.message ?? 'Failed to prepare local AI.',
      });
      setHasPrepared(false);
    }
  }, [hasPrepared, localMode]);

  // ── Decide visibility ───────────────────────────────────────────────────────
  const shouldShow = alwaysShow || !isOnline || isReady || (progress !== null);
  if (!shouldShow || localMode === 'unavailable' || localMode === null) return null;

  // ── Determine badge state ───────────────────────────────────────────────────
  const isDownloading = progress?.status === 'downloading';
  const isGenerating = progress?.status === 'generating';
  const hasError = progress?.status === 'error';

  const badgeColor = isReady
    ? '#16a34a'   // green
    : !isOnline
    ? '#d97706'   // amber
    : '#6366f1';  // indigo

  const bgColor = isReady
    ? '#dcfce7'
    : !isOnline
    ? '#fef3c7'
    : '#eef2ff';

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
      {/* ── Expanded panel ── */}
      {isExpanded && (
        <div style={{
          background: '#fff',
          border: '1.5px solid #e5e7eb',
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          padding: '20px 22px',
          marginBottom: 10,
          minWidth: 280,
          maxWidth: 320,
          fontFamily: 'var(--tb-font-body, sans-serif)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Cpu size={18} color="#6366f1" />
            <span style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>
              Offline AI Model
            </span>
          </div>

          {/* Status row */}
          <div style={{
            background: bgColor,
            borderRadius: 10,
            padding: '10px 14px',
            marginBottom: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            {isReady ? (
              <CheckCircle size={16} color="#16a34a" />
            ) : isDownloading || isGenerating ? (
              <Loader2 size={16} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} />
            ) : hasError ? (
              <AlertTriangle size={16} color="#dc2626" />
            ) : (
              <WifiOff size={16} color="#d97706" />
            )}
            <span style={{ fontSize: 13, fontWeight: 600, color: badgeColor, flex: 1 }}>
              {isReady
                ? `${modeLabel[localMode!]} ready`
                : progress?.message ?? (isOnline ? 'Download to enable offline AI' : 'Offline — AI not yet downloaded')}
            </span>
          </div>

          {/* Download progress bar */}
          {isDownloading && progress?.downloadProgress !== null && (
            <div style={{ marginBottom: 14 }}>
              <div style={{
                height: 8,
                background: '#e5e7eb',
                borderRadius: 8,
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${progress.downloadProgress}%`,
                  background: 'linear-gradient(90deg, #6366f1, #818cf8)',
                  borderRadius: 8,
                  transition: 'width 0.3s ease',
                }} />
              </div>
              <span style={{ fontSize: 11, color: '#6b7280', marginTop: 4, display: 'block' }}>
                {progress.downloadProgress}% downloaded
              </span>
            </div>
          )}

          {/* Description */}
          <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, marginBottom: 14, margin: '0 0 14px 0' }}>
            {localMode === 'window.ai'
              ? 'Chrome AI is built into your browser — no download needed. ThinkBox can generate articles even without internet.'
              : 'Download the Phi-3.5 Mini model (~600 MB) to enable article generation without internet.'}
          </p>

          {/* Action button */}
          {!isReady && !hasPrepared && (
            <button
              id="tb-download-offline-ai"
              onClick={handleDownload}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '10px 16px',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Download size={15} />
              {localMode === 'window.ai' ? 'Enable Chrome AI' : 'Download Offline AI (~600 MB)'}
            </button>
          )}

          {hasError && (
            <button
              onClick={() => { setProgress(null); setHasPrepared(false); }}
              style={{
                width: '100%',
                background: '#fef2f2',
                color: '#dc2626',
                border: '1px solid #fecaca',
                borderRadius: 10,
                padding: '10px 16px',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Retry
            </button>
          )}
        </div>
      )}

      {/* ── Floating badge ── */}
      <button
        id="tb-ai-status-badge"
        onClick={() => setIsExpanded((v) => !v)}
        title={isReady ? 'Local AI active' : 'Offline AI settings'}
        aria-label="Toggle offline AI settings"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          background: bgColor,
          border: `2px solid ${badgeColor}`,
          borderRadius: 100,
          padding: '7px 14px 7px 10px',
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          outline: 'none',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 14px rgba(0,0,0,0.1)';
        }}
      >
        {/* Animated indicator */}
        {isDownloading || isGenerating ? (
          <Loader2
            size={15}
            color={badgeColor}
            style={{ animation: 'spin 1s linear infinite' }}
          />
        ) : isReady ? (
          <CheckCircle size={15} color={badgeColor} />
        ) : isOnline ? (
          <Wifi size={15} color={badgeColor} />
        ) : (
          <WifiOff size={15} color={badgeColor} />
        )}

        <span style={{
          fontSize: 12,
          fontWeight: 700,
          color: badgeColor,
          whiteSpace: 'nowrap',
        }}>
          {isReady
            ? `🖥️ ${modeLabel[localMode!]}`
            : isOnline
            ? '☁️ Cloud AI'
            : '⚠️ Offline'}
        </span>
      </button>

      {/* Spinner keyframe */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AIModelStatus;
