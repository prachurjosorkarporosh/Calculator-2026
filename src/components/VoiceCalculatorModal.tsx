/**
 * Voice Calculator Modal (Theme-Adaptive)
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Prachurjo Calculator. All rights reserved.
 *
 * Dynamically adapts to the currently active Theme Palette (Light, Dark, OLED, Cyber, Pastel, Custom).
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Check,
} from 'lucide-react';
import { parseSpokenMath, speakResult, VoiceParseResult } from '../utils/voiceParser.ts';
import { triggerHaptic } from '../utils/haptics.ts';
import { CalculatorEngine } from '../domain/calculatorEngine.ts';
import { AngleMode } from '../types.ts';
import { ThemePalette } from '../data/themes.ts';
import { getModalThemeStyles } from '../utils/themeStyles.ts';

interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

interface VoiceCalculatorModalProps {
  isOpen: boolean;
  palette?: ThemePalette;
  angleMode: AngleMode;
  onApplyCalculation: (expression: string, evaluateImmediately: boolean) => void;
  onClose: () => void;
}

export const VoiceCalculatorModal: React.FC<VoiceCalculatorModalProps> = ({
  isOpen,
  palette,
  angleMode,
  onApplyCalculation,
  onClose,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsedExpression, setParsedExpression] = useState('');
  const [calculatedResult, setCalculatedResult] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState<'bn-BD' | 'en-US'>('bn-BD');
  const [speakAnswer, setSpeakAnswer] = useState(true);
  const [isSupported, setIsSupported] = useState(true);
  const [statusMessage, setStatusMessage] = useState('মাইক্রোফোনে ট্যাপ করে মুখে বলুন');

  const recognitionRef = useRef<any>(null);
  const theme = getModalThemeStyles(palette);

  // Initialize Speech Recognition
  useEffect(() => {
    if (!isOpen) {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      setIsListening(false);
      return;
    }

    const win = window as unknown as IWindow;
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRec) {
      setIsSupported(false);
      setStatusMessage('আপনার ব্রাউজারে ভয়েস রিকগনিশন সাপোর্ট নেই, নমুনা ট্যাপ করুন');
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLang;

      recognition.onstart = () => {
        setIsListening(true);
        setStatusMessage(
          selectedLang === 'bn-BD'
            ? 'শুনছি... মুখে বলুন (যেমন: পাঁচ যোগ সাত)'
            : 'Listening... Speak equation (e.g. 25 times 4)'
        );
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }

        if (currentTranscript.trim()) {
          setTranscript(currentTranscript);
          handleProcessVoice(currentTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          setStatusMessage('মাইক্রোফোন অনুমতি দেওয়া হয়নি (Microphone blocked)');
        } else if (event.error !== 'no-speech') {
          setStatusMessage(`ত্রুটি: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;

      // Auto start listening on open
      try {
        recognition.start();
        setIsListening(true);
      } catch {
        // Ignored
      }
    } catch {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isOpen, selectedLang]);

  // Process voice text into parsed math and calculate preview
  const handleProcessVoice = (rawText: string) => {
    const parseRes: VoiceParseResult = parseSpokenMath(rawText);

    if (parseRes.action === 'CLEAR') {
      setParsedExpression('');
      setCalculatedResult('0');
      setStatusMessage('সব মুছে ফেলা হয়েছে (Cleared)');
      return;
    }

    if (parseRes.expression) {
      setParsedExpression(parseRes.expression);
      const evalRes = CalculatorEngine.evaluate(parseRes.expression, angleMode);
      if (evalRes.success && evalRes.formatted) {
        setCalculatedResult(evalRes.formatted);
        setStatusMessage('হিসাব সম্পন্ন হয়েছে!');
        triggerHaptic('light');

        // Speak result if enabled
        if (speakAnswer) {
          speakResult(evalRes.formatted, parseRes.detectedLang, true);
        }
      } else {
        setCalculatedResult(null);
      }
    }
  };

  // Toggle listening
  const toggleListening = () => {
    triggerHaptic('medium');
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setStatusMessage('ভয়েস থামানো হয়েছে (Stopped)');
    } else {
      setTranscript('');
      setCalculatedResult(null);
      recognitionRef.current.lang = selectedLang;
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        recognitionRef.current.stop();
        setTimeout(() => {
          try {
            recognitionRef.current.start();
            setIsListening(true);
          } catch {
            // Ignored
          }
        }, 150);
      }
    }
  };

  // Quick preset voice queries to test
  const handleQuickSample = (sample: string) => {
    triggerHaptic('light');
    setTranscript(sample);
    handleProcessVoice(sample);
  };

  // Apply to main calculator screen
  const handleApplyToCalculator = () => {
    if (!parsedExpression) return;
    triggerHaptic('medium');
    onApplyCalculation(parsedExpression, true);
    onClose();
  };

  if (!isOpen) return null;

  const quickSamplesBn = [
    { voice: 'পাঁচ যোগ তিন', exp: '5+3' },
    { voice: 'একশো বিশ গুণ পাঁচ', exp: '120×5' },
    { voice: 'রুট একশো চুয়াল্লিশ', exp: '√(144)' },
    { voice: 'সাতচল্লিশ বিয়োগ বারো', exp: '47−12' },
    { voice: 'পাঁচশো ভাগ দশ', exp: '500÷10' },
  ];

  const quickSamplesEn = [
    { voice: '25 times 4', exp: '25×4' },
    { voice: '100 divided by 5', exp: '100÷5' },
    { voice: 'square root of 81', exp: '√(81)' },
    { voice: '45 plus 55', exp: '45+55' },
    { voice: '15 percent of 200', exp: '200×15%' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-md animate-in fade-in duration-150 select-none">
      <div
        style={{
          backgroundColor: theme.dialogBg,
          borderColor: theme.dialogBorder,
          color: theme.textPrimary,
          boxShadow: theme.isDark
            ? '0 25px 60px rgba(0,0,0,0.7)'
            : '0 20px 50px rgba(0,0,0,0.18)',
        }}
        className="w-full max-w-md rounded-3xl border overflow-hidden flex flex-col max-h-[92vh] transition-colors"
      >
        {/* Header */}
        <div
          style={{
            borderColor: theme.headerBorder,
            backgroundColor: theme.headerBg,
          }}
          className="px-5 py-4 border-b flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div
              style={{
                backgroundColor: theme.subtleAccentBg,
                color: theme.accentColor,
                borderColor: theme.subtleAccentBorder,
              }}
              className="w-10 h-10 rounded-2xl flex items-center justify-center border"
            >
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-2">
                <span>Voice Calculator</span>
                <span
                  style={{
                    backgroundColor: theme.subtleAccentBg,
                    color: theme.accentColor,
                  }}
                  className="text-[10px] px-2 py-0.5 rounded-full font-bold font-mono"
                >
                  Bilingual
                </span>
              </h3>
              <p style={{ color: theme.textSecondary }} className="text-[11px]">
                বাংলা ও ইংরেজিতে মুখে বলে সরাসরি হিসাব করুন
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ color: theme.textSecondary }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              theme.isDark ? 'hover:bg-white/10 hover:text-white' : 'hover:bg-black/10 hover:text-black'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* Controls Bar: Language + Voice Speech Toggle */}
          <div className="flex items-center justify-between gap-2">
            {/* Language Selector */}
            <div
              style={{
                backgroundColor: theme.itemBg,
                borderColor: theme.itemBorder,
              }}
              className="flex items-center p-1 rounded-xl border"
            >
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setSelectedLang('bn-BD');
                }}
                style={{
                  backgroundColor: selectedLang === 'bn-BD' ? theme.accentBg : 'transparent',
                  color: selectedLang === 'bn-BD' ? theme.accentText : theme.textSecondary,
                }}
                className="px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setSelectedLang('en-US');
                }}
                style={{
                  backgroundColor: selectedLang === 'en-US' ? theme.accentBg : 'transparent',
                  color: selectedLang === 'en-US' ? theme.accentText : theme.textSecondary,
                }}
                className="px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                English
              </button>
            </div>

            {/* Speech Announcer Toggle */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setSpeakAnswer(!speakAnswer);
              }}
              style={{
                backgroundColor: speakAnswer ? theme.subtleAccentBg : theme.itemBg,
                borderColor: speakAnswer ? theme.subtleAccentBorder : theme.itemBorder,
                color: speakAnswer ? theme.accentColor : theme.textSecondary,
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer"
            >
              {speakAnswer ? (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Speech On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Mute Speech</span>
                </>
              )}
            </button>
          </div>

          {/* Microphone Visualizer */}
          <div
            style={{
              backgroundColor: theme.itemBg,
              borderColor: theme.itemBorder,
            }}
            className="flex flex-col items-center justify-center py-4 rounded-2xl border relative overflow-hidden"
          >
            <div className="relative flex items-center justify-center my-2">
              {/* Outer Glow Wave Rings */}
              {isListening && (
                <>
                  <span
                    style={{ backgroundColor: theme.accentColor, opacity: 0.15 }}
                    className="absolute w-28 h-28 rounded-full animate-ping duration-1000 pointer-events-none"
                  />
                  <span
                    style={{ backgroundColor: theme.accentColor, opacity: 0.25 }}
                    className="absolute w-24 h-24 rounded-full animate-pulse duration-700 pointer-events-none"
                  />
                </>
              )}

              <button
                type="button"
                onClick={toggleListening}
                style={{
                  backgroundColor: isListening
                    ? theme.accentBg
                    : (theme.isDark ? '#1E293B' : '#E2E8F0'),
                  color: isListening ? theme.accentText : theme.textPrimary,
                }}
                className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-95 cursor-pointer"
              >
                {isListening ? (
                  <Mic className="w-9 h-9 animate-bounce duration-300" />
                ) : (
                  <MicOff className="w-8 h-8 opacity-70" />
                )}
              </button>
            </div>

            {/* Status Message */}
            <div className="mt-3 text-center px-4">
              <p className="text-xs font-bold">{statusMessage}</p>
              <p style={{ color: theme.textSecondary }} className="text-[11px] mt-0.5">
                {isListening ? 'কথা শেষ হলে স্বয়ংক্রিয় গণনা হবে' : 'মাইক্রোফোনে ট্যাপ করে কথা বলুন'}
              </p>
            </div>
          </div>

          {/* Transcript & Result Card */}
          <div
            style={{
              backgroundColor: theme.itemBg,
              borderColor: theme.itemBorder,
            }}
            className="p-4 rounded-2xl border space-y-2"
          >
            <div className="flex items-center justify-between text-[11px]">
              <span style={{ color: theme.textSecondary }}>কথার বিবরণ (Transcript):</span>
              {transcript && (
                <button
                  type="button"
                  onClick={() => {
                    setTranscript('');
                    setParsedExpression('');
                    setCalculatedResult(null);
                  }}
                  className="text-rose-500 hover:underline flex items-center gap-1 cursor-pointer font-bold"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>মুছুন</span>
                </button>
              )}
            </div>

            <div className="min-h-7 text-sm font-medium italic">
              {transcript ? `"${transcript}"` : '(এখনো কিছু বলা হয়নি)'}
            </div>

            {/* Expression & Result */}
            {parsedExpression && (
              <div
                style={{ borderColor: theme.headerBorder }}
                className="pt-2 border-t flex items-center justify-between"
              >
                <div>
                  <div style={{ color: theme.textMuted }} className="text-[10px] uppercase font-bold">
                    Expression
                  </div>
                  <div className="font-mono text-base font-bold">
                    {parsedExpression}
                  </div>
                </div>

                {calculatedResult && (
                  <div className="text-right">
                    <div style={{ color: theme.accentColor }} className="text-[10px] uppercase font-bold">
                      Result
                    </div>
                    <div style={{ color: theme.accentColor }} className="font-mono text-2xl font-bold">
                      = {calculatedResult}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Voice Sample Chips */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>নমুনা বাক্য (Quick Test Samples):</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(selectedLang === 'bn-BD' ? quickSamplesBn : quickSamplesEn).map(
                (sample) => (
                  <button
                    key={sample.voice}
                    type="button"
                    onClick={() => handleQuickSample(sample.voice)}
                    style={{
                      backgroundColor: theme.itemBg,
                      borderColor: theme.itemBorder,
                      color: theme.textPrimary,
                    }}
                    className="px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all active:scale-95 text-left cursor-pointer hover:opacity-80"
                  >
                    <span>{sample.voice}</span>
                    <span style={{ color: theme.textMuted }} className="text-[10px] ml-1.5 font-mono">
                      ({sample.exp})
                    </span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            borderColor: theme.footerBorder,
            backgroundColor: theme.footerBg,
          }}
          className="px-5 py-3.5 border-t flex items-center justify-between text-xs"
        >
          <button
            type="button"
            onClick={onClose}
            style={{ color: theme.textSecondary }}
            className={`px-4 py-2 rounded-xl font-bold transition-colors cursor-pointer ${
              theme.isDark ? 'hover:bg-white/10 hover:text-white' : 'hover:bg-black/10 hover:text-black'
            }`}
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!parsedExpression}
            onClick={handleApplyToCalculator}
            style={{
              backgroundColor: theme.accentBg,
              color: theme.accentText,
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Apply to Calculator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
