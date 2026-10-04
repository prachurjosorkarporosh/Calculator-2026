/**
 * Voice Calculator Modal (ভয়েস ক্যালকুলেটর)
 * Allows calculating by voice in Bengali (বাংলা) and English
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.pro.bd/
 * © 2026 Prachurjo Calculator. All rights reserved.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Check,
} from 'lucide-react';
import { parseSpokenMath, speakResult, VoiceParseResult } from '../utils/voiceParser.ts';
import { triggerHaptic } from '../utils/haptics.ts';
import { CalculatorEngine } from '../domain/calculatorEngine.ts';
import { AngleMode } from '../types.ts';

// TypeScript declaration for webkitSpeechRecognition
interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

interface VoiceCalculatorModalProps {
  isOpen: boolean;
  angleMode: AngleMode;
  onApplyCalculation: (expression: string, evaluateImmediately: boolean) => void;
  onClose: () => void;
}

export const VoiceCalculatorModal: React.FC<VoiceCalculatorModalProps> = ({
  isOpen,
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
            : 'Listening... Speak now (e.g. 5 plus 7)'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 animate-in fade-in duration-150 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#EEF2F6] dark:bg-[#1E2126] text-slate-800 dark:text-slate-100 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700/60 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between bg-white/50 dark:bg-black/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-1.5">
                <span>ভয়েস ক্যালকুলেটর</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                  Voice
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                মুখে বলুন এবং সরাসরি হিসাব করুন
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* Language Switcher & Audio Voice Feedback Toggle */}
          <div className="flex items-center justify-between text-xs">
            {/* Language Selector */}
            <div className="flex items-center bg-black/5 dark:bg-white/5 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setSelectedLang('bn-BD');
                }}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  selectedLang === 'bn-BD'
                    ? 'bg-[#087A36] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                বাংলা (Bengali)
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setSelectedLang('en-US');
                }}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  selectedLang === 'en-US'
                    ? 'bg-[#087A36] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                English
              </button>
            </div>

            {/* Voice Output (Speech) Toggle */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setSpeakAnswer(!speakAnswer);
              }}
              title="উত্তর মুখে বলবে কিনা"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                speakAnswer
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-black/5 dark:bg-white/5 border-transparent text-slate-500'
              }`}
            >
              {speakAnswer ? (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>ভয়েস অন</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>মিউট</span>
                </>
              )}
            </button>
          </div>

          {/* Interactive Microphone Pulsating Circle */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative flex items-center justify-center">
              {/* Ripple Animation Rings */}
              {isListening && (
                <>
                  <span className="absolute w-28 h-28 rounded-full bg-emerald-500/20 animate-ping duration-1000 pointer-events-none" />
                  <span className="absolute w-24 h-24 rounded-full bg-emerald-500/30 animate-pulse pointer-events-none" />
                </>
              )}

              <button
                type="button"
                onClick={toggleListening}
                className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all active:scale-95 ${
                  isListening
                    ? 'bg-emerald-600 hover:bg-emerald-700 ring-4 ring-emerald-400/40 scale-105'
                    : 'bg-slate-700 hover:bg-slate-600 dark:bg-slate-800'
                }`}
              >
                {isListening ? (
                  <Mic className="w-9 h-9 animate-bounce duration-300" />
                ) : (
                  <MicOff className="w-8 h-8 opacity-75" />
                )}
              </button>
            </div>

            {/* Status Message */}
            <div className="mt-3 text-center">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                {statusMessage}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {isListening ? 'কথা বলা শেষ হলে হিসাব তৈরি হবে' : 'ট্যাপ করে কথা বলা শুরু করুন'}
              </p>
            </div>
          </div>

          {/* Real-time Voice Recognition Card */}
          <div className="p-4 rounded-2xl bg-white dark:bg-black/30 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>কথার বিবরণ (Spoken Transcript):</span>
              {transcript && (
                <button
                  type="button"
                  onClick={() => {
                    setTranscript('');
                    setParsedExpression('');
                    setCalculatedResult(null);
                  }}
                  className="text-rose-500 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>মুছুন</span>
                </button>
              )}
            </div>

            <div className="min-h-7 text-sm font-medium text-slate-800 dark:text-slate-200 italic">
              {transcript ? `"${transcript}"` : '(এখনো কিছু বলা হয়নি)'}
            </div>

            {/* Parsed Mathematical Expression & Result */}
            {parsedExpression && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/40 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    গাণিতিক রূপ
                  </div>
                  <div className="font-mono text-base font-bold text-slate-900 dark:text-white">
                    {parsedExpression}
                  </div>
                </div>

                {calculatedResult && (
                  <div className="text-right">
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-bold">
                      ফলাফল
                    </div>
                    <div className="font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      = {calculatedResult}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Click Test Queries */}
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>সহজে পরীক্ষা করুন (নমুনা বাক্য):</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(selectedLang === 'bn-BD' ? quickSamplesBn : quickSamplesEn).map(
                (sample) => (
                  <button
                    key={sample.voice}
                    type="button"
                    onClick={() => handleQuickSample(sample.voice)}
                    className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-black/20 hover:bg-black/5 dark:hover:bg-white/10 border border-slate-200/80 dark:border-slate-700/40 text-xs font-medium text-slate-700 dark:text-slate-300 transition-all active:scale-95 text-left"
                  >
                    <span>{sample.voice}</span>
                    <span className="text-[10px] text-slate-400 ml-1.5">
                      ({sample.exp})
                    </span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-700/60 bg-white/50 dark:bg-black/20 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 font-semibold transition-colors"
          >
            বাতিল (Cancel)
          </button>

          <button
            type="button"
            disabled={!parsedExpression}
            onClick={handleApplyToCalculator}
            className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#087A36] hover:bg-[#076c30] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition-all shadow-sm active:scale-95"
          >
            <span>ক্যালকুলেটরে হিসাব করুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
