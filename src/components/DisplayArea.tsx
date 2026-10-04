/**
 * Calculator Display Area with Dynamic Typography, Theming, and Long-Press Copy
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.pro.bd/
 * © 2026 Prachurjo Calculator. All rights reserved.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Copy, Check, Volume2 } from 'lucide-react';
import { AngleMode, DisplaySize } from '../types.ts';
import { ThemePalette } from '../data/themes.ts';
import { triggerHaptic } from '../utils/haptics.ts';
import { speakCalculationResult, isSpeechSupported, stopSpeech } from '../utils/speech.ts';

interface DisplayAreaProps {
  expression: string;
  result: string;
  error: string | null;
  isEvaluated: boolean;
  angleMode: AngleMode;
  isInvActive: boolean;
  hasMemory?: boolean;
  displaySize?: DisplaySize;
  fontFamily?: string;
  palette?: ThemePalette | null;
  formatThousands?: boolean;
  evaluationKey?: number;
}

export const DisplayArea: React.FC<DisplayAreaProps> = ({
  expression,
  result,
  error,
  isEvaluated,
  angleMode,
  isInvActive,
  hasMemory = false,
  displaySize = 'standard',
  fontFamily,
  palette,
  formatThousands = true,
  evaluationKey = 0,
}) => {
  const expressionScrollRef = useRef<HTMLDivElement>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Copied!');
  const [isPressing, setIsPressing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Long press timer ref
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const isLongPressTriggeredRef = useRef(false);

  // Auto-scroll expression to the end whenever it changes
  useEffect(() => {
    if (expressionScrollRef.current) {
      expressionScrollRef.current.scrollLeft = expressionScrollRef.current.scrollWidth;
    }
  }, [expression]);

  // Dynamic font sizing for result to avoid overflow with displaySize scaling
  const getResultFontSize = (text: string) => {
    const len = text.length;
    if (displaySize === 'huge') {
      if (len > 16) return 'text-3xl sm:text-4xl font-semibold';
      if (len > 12) return 'text-4xl sm:text-5xl font-semibold';
      if (len > 8) return 'text-5xl sm:text-6xl font-bold';
      if (len > 5) return 'text-6xl sm:text-7xl font-extrabold';
      return 'text-7xl sm:text-8xl font-black';
    }
    if (displaySize === 'large') {
      if (len > 16) return 'text-2xl sm:text-3xl font-medium';
      if (len > 12) return 'text-3xl sm:text-4xl font-medium';
      if (len > 8) return 'text-5xl sm:text-6xl font-semibold';
      if (len > 5) return 'text-6xl sm:text-7xl font-bold';
      return 'text-7xl sm:text-8xl font-extrabold';
    }
    if (len > 16) return 'text-2xl sm:text-3xl';
    if (len > 12) return 'text-3xl sm:text-4xl';
    if (len > 8) return 'text-4xl sm:text-5xl';
    if (len > 5) return 'text-5xl sm:text-6xl';
    return 'text-6xl sm:text-7xl';
  };

  const getExpressionFontSize = (isProminent: boolean) => {
    if (isProminent) {
      const len = expression.length;
      if (len > 18) return 'text-3xl sm:text-4xl';
      if (len > 12) return 'text-4xl sm:text-5xl';
      return 'text-5xl sm:text-6xl';
    }
    return 'text-lg sm:text-xl font-normal';
  };

  // Format numbers with commas if enabled
  const formatDisplay = (val: string) => {
    if (!formatThousands || !val || isNaN(Number(val)) || val.includes('e') || val.includes('E')) return val;
    const parts = val.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  // Perform Copy Action and show Toast
  const executeCopy = useCallback((message = 'Copied!') => {
    const textToCopy = result || expression;
    if (!textToCopy) return;

    triggerHaptic('medium');

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for older web views
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch {
      // Ignore clipboard write failures gracefully
    }

    setToastMessage(message);
    setShowToast(true);

    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  }, [result, expression]);

  // Long press event handlers
  const handleStartPress = useCallback(
    (clientX: number, clientY: number) => {
      const textToCopy = result || expression;
      if (!textToCopy) return;

      isLongPressTriggeredRef.current = false;
      touchStartPosRef.current = { x: clientX, y: clientY };
      setIsPressing(true);

      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }

      // Android standard long-press duration ~450ms
      longPressTimerRef.current = setTimeout(() => {
        isLongPressTriggeredRef.current = true;
        setIsPressing(false);
        executeCopy('Copied to clipboard!');
      }, 450);
    },
    [result, expression, executeCopy]
  );

  const handleMovePress = useCallback((clientX: number, clientY: number) => {
    if (!touchStartPosRef.current) return;
    const deltaX = Math.abs(clientX - touchStartPosRef.current.x);
    const deltaY = Math.abs(clientY - touchStartPosRef.current.y);

    // Cancel if moved more than 10 pixels (scrolling)
    if (deltaX > 10 || deltaY > 10) {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
      setIsPressing(false);
      touchStartPosRef.current = null;
    }
  }, []);

  const handleEndPress = useCallback(() => {
    setIsPressing(false);
    touchStartPosRef.current = null;

    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  // Normal quick tap handler
  const handleQuickClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      // If long press already handled it, don't double trigger
      if (isLongPressTriggeredRef.current) {
        isLongPressTriggeredRef.current = false;
        return;
      }
      executeCopy('Copied!');
    },
    [executeCopy]
  );

  // Voice speech announcement handler
  const handleSpeakResult = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      triggerHaptic('light');

      const textToSpeak = result || (isEvaluated ? expression : '');
      if (!textToSpeak) return;

      setIsSpeaking(true);
      speakCalculationResult(textToSpeak, 'bn');

      // Visual indicator reset
      setTimeout(() => {
        setIsSpeaking(false);
      }, 1600);
    },
    [result, isEvaluated, expression]
  );

  const displayStyle: React.CSSProperties = {
    fontFamily: fontFamily || 'inherit',
    color: palette ? palette.displayText : undefined,
  };

  const secondaryColor = palette ? palette.secondaryText : undefined;

  return (
    <div
      style={displayStyle}
      className="relative flex-1 w-full flex flex-col justify-end px-5 sm:px-6 pb-2 min-h-0 select-text overflow-hidden transition-colors"
    >
      {/* Floating Copied! Toast Message */}
      {showToast && (
        <div
          role="status"
          aria-live="polite"
          className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/95 text-white dark:bg-white dark:text-slate-900 shadow-2xl backdrop-blur-md text-xs font-semibold tracking-wide animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-150 border border-slate-700/40 dark:border-slate-200/40 select-none pointer-events-none"
        >
          <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Indicators: Mode, INV Badges & Copy Button */}
      <div className="flex items-center justify-between mb-auto pt-1 text-xs font-semibold tracking-wider">
        <div
          style={{ color: secondaryColor }}
          className="flex items-center gap-2 text-slate-400 dark:text-slate-500"
        >
          <span className="uppercase">{angleMode}</span>
          {isInvActive && (
            <>
              <span aria-hidden="true">·</span>
              <span
                style={{ color: palette?.accent || '#087A36' }}
                className="font-bold text-[#087A36] dark:text-emerald-400"
              >
                INV
              </span>
            </>
          )}
          {hasMemory && (
            <>
              <span aria-hidden="true">·</span>
              <span
                style={{ color: '#F59E0B' }}
                className="font-bold text-amber-500 dark:text-amber-400"
                title="Memory has stored value"
              >
                M
              </span>
            </>
          )}
        </div>

        {/* Top Actions: Voice Announcer & Copy Button */}
        {(result || (isEvaluated && expression)) && (
          <div className="flex items-center gap-2">
            {/* Big Voice Speech Announcer Button */}
            <button
              type="button"
              onClick={handleSpeakResult}
              title="ফলাফল শুনুন (Listen to result in Voice)"
              aria-label="Speak calculation result"
              className={`flex items-center gap-2 text-xs sm:text-sm px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold transition-all active:scale-95 cursor-pointer shadow-md ${
                isSpeaking
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/40 ring-2 ring-purple-300 animate-pulse'
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/30 hover:shadow-purple-600/50'
              }`}
            >
              <Volume2 className={`w-4 h-4 sm:w-5 sm:h-5 ${isSpeaking ? 'animate-bounce text-yellow-300' : 'text-white'}`} />
              <span className="tracking-wide">{isSpeaking ? 'বলছে...' : 'ভয়েস শুনুন'}</span>
            </button>

            {/* Quick Tap Copy Button */}
            <button
              type="button"
              onClick={handleQuickClick}
              title="Tap or long-press to copy"
              aria-label="Copy result to clipboard"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 sm:py-2 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 transition-all active:scale-95 cursor-pointer font-medium"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Copy</span>
            </button>
          </div>
        )}
      </div>

      {/* Expression Row */}
      <div
        ref={expressionScrollRef}
        style={{
          color: isEvaluated ? secondaryColor : palette?.displayText,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        className={`w-full overflow-x-auto overflow-y-hidden text-right whitespace-nowrap scrollbar-none transition-all duration-150 py-1 ${
          isEvaluated
            ? `${getExpressionFontSize(false)} text-slate-500 dark:text-slate-400`
            : `${getExpressionFontSize(true)} text-slate-900 dark:text-slate-100 font-medium tracking-tight`
        }`}
      >
        {expression || (!isEvaluated && <span className="opacity-0">0</span>)}
      </div>

      {/* Result Row with Long-Press & Tap Interactions */}
      <div
        title="Long-press or tap to copy result"
        aria-label={result ? `Result: ${result}. Long press to copy` : undefined}
        tabIndex={result ? 0 : -1}
        onClick={result ? handleQuickClick : undefined}
        onMouseDown={result ? (e) => handleStartPress(e.clientX, e.clientY) : undefined}
        onMouseMove={result ? (e) => handleMovePress(e.clientX, e.clientY) : undefined}
        onMouseUp={handleEndPress}
        onMouseLeave={handleEndPress}
        onTouchStart={
          result && (result || isEvaluated)
            ? (e) => {
                if (e.touches.length > 0) {
                  handleStartPress(e.touches[0].clientX, e.touches[0].clientY);
                }
              }
            : undefined
        }
        onTouchMove={
          result
            ? (e) => {
                if (e.touches.length > 0) {
                  handleMovePress(e.touches[0].clientX, e.touches[0].clientY);
                }
              }
            : undefined
        }
        onTouchEnd={handleEndPress}
        onTouchCancel={handleEndPress}
        className={`w-full text-right overflow-hidden mt-0.5 mb-1 cursor-pointer select-none rounded-xl transition-all duration-150 ${
          isPressing
            ? 'scale-[0.98] opacity-75 bg-black/5 dark:bg-white/5 px-2'
            : ''
        }`}
      >
        {error ? (
          <div
            key={`err-${evaluationKey}-${error}`}
            className="text-3xl sm:text-4xl font-normal text-rose-500 dark:text-rose-400 tracking-tight animate-in fade-in-0 slide-in-from-bottom-2 duration-150 ease-out"
          >
            {error}
          </div>
        ) : isEvaluated ? (
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleSpeakResult}
              title="ফলাফল শুনুন (Listen in Voice)"
              aria-label="Speak calculation result"
              className={`p-2 sm:p-2.5 rounded-2xl transition-all active:scale-90 cursor-pointer shrink-0 ${
                isSpeaking
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/40 ring-4 ring-purple-400/40 animate-pulse'
                  : 'bg-purple-500/15 hover:bg-purple-500/25 text-purple-600 dark:text-purple-400'
              }`}
            >
              <Volume2 className={`w-5 h-5 sm:w-6 sm:h-6 ${isSpeaking ? 'animate-bounce text-white' : ''}`} />
            </button>
            <div
              key={`eval-${evaluationKey}-${result}`}
              style={{ color: palette?.displayText }}
              className={`font-normal tracking-tight animate-in fade-in-0 slide-in-from-bottom-3 zoom-in-[0.96] duration-200 ease-out will-change-transform truncate ${getResultFontSize(
                result
              )}`}
            >
              {formatDisplay(result) || '0'}
            </div>
          </div>
        ) : result ? (
          <div
            style={{ color: secondaryColor }}
            className="text-2xl sm:text-3xl font-light text-slate-400 dark:text-slate-500 tracking-tight transition-opacity duration-150"
          >
            {formatDisplay(result)}
          </div>
        ) : (
          <div className="h-8 opacity-0">0</div>
        )}
      </div>
    </div>
  );
};
