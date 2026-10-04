/**
 * Advanced Personalize & Sizing Studio (পার্সোনালাইজেশন ও সাইজিং স্টুডিও)
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Calculator. All rights reserved.
 *
 * Supercharged Features:
 * - Personal Name / Signature branding on calculator
 * - 5 Keypad Scales: Compact, Standard, Spacious, Jumbo, Ultra
 * - 3 Display Font Sizes: Standard (100%), Large (125%), Huge (150%)
 * - 4 Corner Shapes: Circle/Pill, Squircle, Soft Corners, Subtle Sharp
 * - Button Glass Blur slider (0px - 24px)
 * - App Icon style switcher
 * - Audio Effects with live Play Sound test buttons
 * - Haptic Vibration toggle
 * - Live Interactive Mini Keypad Preview
 */

import React, { useState } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Smartphone,
  Type,
  Palette,
  SlidersHorizontal,
  Shapes,
  Maximize2,
  Hash,
  User,
  Sparkles,
  Play,
  Check,
  Sliders,
} from 'lucide-react';
import { ButtonShape, KeypadScale, DisplaySize, SoundEffectType } from '../types.ts';
import { triggerHaptic } from '../utils/haptics.ts';
import { playKeypressSound } from '../utils/sound.ts';
import { FONTS_CATALOG } from '../data/fonts.ts';
import { THEME_PALETTES } from '../data/themes.ts';
import { getAppIconDataUri } from '../data/appIcons.ts';

interface CustomizationModalProps {
  isOpen: boolean;
  buttonShape: ButtonShape;
  keypadScale: KeypadScale;
  displaySize?: DisplaySize;
  personalName?: string;
  buttonBlur?: number;
  activeAppIconId?: string;
  soundEnabled: boolean;
  soundType: SoundEffectType;
  hapticEnabled: boolean;
  formatThousands: boolean;
  activeFontId: string;
  activeThemeId: string;
  onChangeButtonShape: (shape: ButtonShape) => void;
  onChangeKeypadScale: (scale: KeypadScale) => void;
  onChangeDisplaySize?: (size: DisplaySize) => void;
  onChangePersonalName?: (name: string) => void;
  onChangeButtonBlur?: (blur: number) => void;
  onOpenAppIcons?: () => void;
  onToggleSound: () => void;
  onChangeSoundType: (type: SoundEffectType) => void;
  onToggleHaptic: () => void;
  onToggleFormatThousands: () => void;
  onOpenFonts: () => void;
  onOpenThemes: () => void;
  onClose: () => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  isOpen,
  buttonShape,
  keypadScale,
  displaySize = 'standard',
  personalName = '',
  buttonBlur = 8,
  activeAppIconId = 'emerald-pro',
  soundEnabled,
  soundType,
  hapticEnabled,
  formatThousands,
  activeFontId,
  activeThemeId,
  onChangeButtonShape,
  onChangeKeypadScale,
  onChangeDisplaySize,
  onChangePersonalName,
  onChangeButtonBlur,
  onOpenAppIcons,
  onToggleSound,
  onChangeSoundType,
  onToggleHaptic,
  onToggleFormatThousands,
  onOpenFonts,
  onOpenThemes,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'sizing'>('sizing');
  const [inputName, setInputName] = useState(personalName);

  if (!isOpen) return null;

  const currentFont = FONTS_CATALOG.find((f) => f.id === activeFontId);
  const currentTheme = THEME_PALETTES.find((t) => t.id === activeThemeId);

  const shapes: { id: ButtonShape; label: string; previewClass: string }[] = [
    { id: 'round', label: 'Circle / Pill', previewClass: 'rounded-full' },
    { id: 'squircle', label: 'Squircle', previewClass: 'rounded-[20px]' },
    { id: 'soft', label: 'Soft Corners', previewClass: 'rounded-xl' },
    { id: 'sharp', label: 'Subtle Sharp', previewClass: 'rounded-md' },
  ];

  const scales: { id: KeypadScale; label: string; desc: string; tag: string }[] = [
    { id: 'compact', label: 'কমপ্যাক্ট (Compact)', desc: 'ছোট স্ক্রিনের জন্য আঁটসাঁট ও কমপ্যাক্ট', tag: '48px' },
    { id: 'standard', label: 'স্ট্যান্ডার্ড (Standard)', desc: 'আদর্শ ব্যালেন্সড এন্ড্রয়েড ম্যাটেরিয়াল লেআউট', tag: '56px' },
    { id: 'spacious', label: 'স্পেশাস (Spacious)', desc: 'দীর্ঘ বাটন, আরামদায়ক আঙুলের ছোঁয়া', tag: '64px' },
    { id: 'jumbo', label: 'জ্যাম্বো (Jumbo)', desc: 'বিশাল বাটন, বড় স্পর্শের জায়গা', tag: '72px' },
    { id: 'ultra', label: 'আল্ট্রা (Ultra Jumbo)', desc: 'সর্বোচ্চ বড় সাইজ ও সর্বোচ্চ উচ্চতা', tag: '80px' },
  ];

  const displaySizes: { id: DisplaySize; label: string; desc: string; sample: string }[] = [
    { id: 'standard', label: 'স্ট্যান্ডার্ড (100%)', desc: 'স্বাভাবিক রেজাল্ট টেক্সট সাইজ', sample: 'text-2xl' },
    { id: 'large', label: 'বড় সাইজ (125%)', desc: 'সহজে পড়ার জন্য +২৫% বড় ফন্ট', sample: 'text-3xl' },
    { id: 'huge', label: 'সুবিশাল (150%)', desc: 'দৃষ্টিসুখকর +৫০% সুপার সাইজ', sample: 'text-4xl' },
  ];

  const soundStyles: { id: SoundEffectType; label: string; soundType: SoundEffectType }[] = [
    { id: 'tactile', label: 'Android Click (ট্যাকটাইল)', soundType: 'tactile' },
    { id: 'pop', label: 'Bubble Pop (বাবল পপ)', soundType: 'pop' },
    { id: 'mechanical', label: 'Mechanical Key (মেকানিক্যাল)', soundType: 'mechanical' },
    { id: 'beep', label: 'Digital Beep (ডিজিটাল বিপ)', soundType: 'beep' },
  ];

  const handleNameSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onChangePersonalName) {
      onChangePersonalName(inputName.trim());
      triggerHaptic('medium');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 animate-in fade-in duration-150 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#EEF2F6] dark:bg-[#1E2126] text-slate-800 dark:text-slate-100 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700/60 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between bg-white/70 dark:bg-black/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight">
                Personalize & Sizing Studio
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                ক্যালকুলেটরের সাইজ, স্কেল ও পার্সোনাল প্রোফাইল
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-4 sm:px-6 pt-3 pb-2 flex gap-2 border-b border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-black/10">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('sizing');
            }}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'sizing'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>সাইজ ও স্কেল (Sizing)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('personal');
            }}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'personal'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>পার্সোনাল প্রোফাইল (Personal)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
          {/* SIZING TAB */}
          {activeTab === 'sizing' && (
            <div className="space-y-4">
              {/* Live Interactive Keypad Mini Sample Preview */}
              <div className="p-3 sm:p-4 rounded-2xl bg-white/80 dark:bg-black/30 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    লাইভ সাইজ প্রিভিউ (Live Size Preview):
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">
                    {keypadScale} • {buttonShape} • {displaySize}
                  </span>
                </div>

                {/* Display Sample */}
                <div className="text-right p-2 rounded-xl bg-black/5 dark:bg-black/40 font-mono">
                  <div className="text-[10px] text-slate-400">128 × 256</div>
                  <div
                    className={`font-bold text-slate-900 dark:text-white transition-all ${
                      displaySize === 'huge' ? 'text-3xl' : displaySize === 'large' ? 'text-2xl' : 'text-xl'
                    }`}
                  >
                    32,768
                  </div>
                </div>

                {/* Keypad Buttons Sample */}
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {['7', '8', '9', '×'].map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        if (soundEnabled) playKeypressSound(k === '×' ? 'operator' : 'number', soundType);
                      }}
                      className={`flex items-center justify-center font-bold text-sm shadow-sm transition-all active:scale-95 cursor-pointer ${
                        k === '×'
                          ? 'bg-purple-600 text-white'
                          : 'bg-white dark:bg-white/10 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10'
                      } ${
                        buttonShape === 'round'
                          ? 'rounded-full'
                          : buttonShape === 'squircle'
                          ? 'rounded-[16px]'
                          : buttonShape === 'soft'
                          ? 'rounded-xl'
                          : 'rounded-md'
                      } ${
                        keypadScale === 'ultra'
                          ? 'h-12'
                          : keypadScale === 'jumbo'
                          ? 'h-11'
                          : keypadScale === 'spacious'
                          ? 'h-10'
                          : keypadScale === 'compact'
                          ? 'h-8'
                          : 'h-9'
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              {/* Keypad Scale (5 Options) */}
              <div>
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-2">
                  <Maximize2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>কিপ্যাড স্কেলিং ও সাইজ (Keypad Scale):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {scales.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        onChangeKeypadScale(s.id);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        keypadScale === s.id
                          ? 'bg-purple-500/10 dark:bg-purple-500/20 border-purple-500 text-slate-900 dark:text-white shadow-sm ring-1 ring-purple-500/40'
                          : 'bg-white/60 dark:bg-black/20 border-slate-200/60 dark:border-slate-700/40 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-black/30'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs">{s.label}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                          {s.desc}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0 ml-2">
                        {s.tag}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Result Font Size */}
              <div>
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-2">
                  <Type className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>স্ক্রিন রেজাল্ট ফন্ট সাইজ (Display Number Size):</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {displaySizes.map((ds) => (
                    <button
                      key={ds.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        if (onChangeDisplaySize) onChangeDisplaySize(ds.id);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        displaySize === ds.id
                          ? 'bg-purple-500/10 dark:bg-purple-500/20 border-purple-500 text-slate-900 dark:text-white shadow-sm ring-1 ring-purple-500/40'
                          : 'bg-white/60 dark:bg-black/20 border-slate-200/60 dark:border-slate-700/40 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-black/30'
                      }`}
                    >
                      <div className="font-bold text-xs">{ds.label}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                        {ds.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Button Corner Style */}
              <div>
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-2">
                  <Shapes className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>বাটন কর্নার শেপ (Button Corner Shape):</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {shapes.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        onChangeButtonShape(s.id);
                      }}
                      className={`p-2 flex flex-col items-center justify-center gap-1.5 rounded-xl border transition-all cursor-pointer ${
                        buttonShape === s.id
                          ? 'bg-purple-500/10 dark:bg-purple-500/20 border-purple-500 text-slate-900 dark:text-white shadow-sm ring-1 ring-purple-500/40'
                          : 'bg-white/60 dark:bg-black/20 border-slate-200/60 dark:border-slate-700/40 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-[11px] font-bold ${s.previewClass}`}
                      >
                        5
                      </div>
                      <span className="text-[10px] text-center font-medium leading-tight">
                        {s.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Button Glass Blur Slider */}
              {onChangeButtonBlur && (
                <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-black/20 border border-slate-200/60 dark:border-slate-700/40 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span>কাঁচের বোতামের ব্লার (Button Glass Blur):</span>
                    </div>
                    <span className="font-mono text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md">
                      {buttonBlur}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    step="1"
                    value={buttonBlur}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      onChangeButtonBlur(val);
                      triggerHaptic('light');
                    }}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                    <span>0px (Sharp)</span>
                    <span>8px (Standard)</span>
                    <span>16px (Frosted)</span>
                    <span>24px (Heavy Glass)</span>
                  </div>
                </div>
              )}

              {/* App Icon Switcher Card */}
              {onOpenAppIcons && (
                <div
                  onClick={() => {
                    triggerHaptic('light');
                    onClose();
                    onOpenAppIcons();
                  }}
                  className="p-3 rounded-2xl bg-white/70 dark:bg-black/20 border border-slate-200/60 dark:border-slate-700/40 flex items-center justify-between cursor-pointer hover:bg-white dark:hover:bg-black/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden shadow-xs border border-white/20 flex items-center justify-center shrink-0">
                      <img
                        src={getAppIconDataUri(activeAppIconId)}
                        alt="Current icon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">
                        অ্যাপ আইকন স্টাইল (App Icon Style)
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        ১০+ স্টাইলিশ লঞ্চার ও ট্যাব আইকন
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    Change
                  </span>
                </div>
              )}
            </div>
          )}

          {/* PERSONAL TAB */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              {/* Personal Name / Signature Branding */}
              <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-black/30 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>ক্যালকুলেটরে আপনার নাম / সিগনেচার (Personal Name):</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  নিজের নাম লিখুন; এটি ক্যালকুলেটরের টপ বারে স্বগৌরবে প্রদর্শিত হবে।
                </p>

                <form onSubmit={handleNameSave} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="যেমন: Porosh's Calc, প্রচ্ছুর্য..."
                    className="flex-1 px-3 py-2 rounded-xl bg-black/5 dark:bg-white/10 border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>সেভ</span>
                  </button>
                </form>
              </div>

              {/* Sound & Audio Styles with Live Play Sound Buttons */}
              <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-black/30 border border-slate-200 dark:border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-slate-400" />
                    )}
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">
                        বাটন টাচ অডিও (Sound Effects)
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        বাটনে চাপলে ক্লিয়ার বাস্তবসম্মত শব্দ বাজবে
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      onToggleSound();
                      if (!soundEnabled) playKeypressSound('number', soundType);
                    }}
                    className={`w-11 h-6 flex items-center rounded-full p-0.5 duration-200 transition-colors cursor-pointer ${
                      soundEnabled ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <div
                      className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-200 ${
                        soundEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {soundEnabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {soundStyles.map((style) => (
                      <div
                        key={style.id}
                        className={`p-2 rounded-xl border flex items-center justify-between text-xs transition-all ${
                          soundType === style.id
                            ? 'bg-purple-500/10 dark:bg-purple-500/20 border-purple-500 text-slate-900 dark:text-white font-bold ring-1 ring-purple-500/40'
                            : 'bg-white/50 dark:bg-black/20 border-slate-200/60 dark:border-slate-700/40 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            triggerHaptic('light');
                            onChangeSoundType(style.id);
                            playKeypressSound('number', style.id);
                          }}
                          className="flex-1 text-left truncate cursor-pointer"
                        >
                          {style.label}
                        </button>

                        <button
                          type="button"
                          title="শব্দ শুনুন"
                          onClick={() => {
                            triggerHaptic('light');
                            onChangeSoundType(style.id);
                            playKeypressSound('number', style.id);
                          }}
                          className="p-1 rounded-lg bg-purple-600 text-white hover:bg-purple-700 active:scale-90 transition-all cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-current" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Haptic Buzz & Thousands Separator */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/80 dark:bg-black/30 border border-slate-200 dark:border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-sky-500" />
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">
                        হ্যাপটিক ভাইব্রেশন
                      </div>
                      <div className="text-[10px] text-slate-500">স্পর্শের সাথে হালকা কম্পন</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('medium');
                      onToggleHaptic();
                    }}
                    className={`w-10 h-5 flex items-center rounded-full p-0.5 duration-200 transition-colors cursor-pointer ${
                      hapticEnabled ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${
                        hapticEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/80 dark:bg-black/30 border border-slate-200 dark:border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-amber-500" />
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">
                        হাজারের কমা (Commas)
                      </div>
                      <div className="text-[10px] text-slate-500">১,০০০,০০০ আকারে গ্রুপ</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      onToggleFormatThousands();
                    }}
                    className={`w-10 h-5 flex items-center rounded-full p-0.5 duration-200 transition-colors cursor-pointer ${
                      formatThousands ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${
                        formatThousands ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Quick Shortcuts to Theme & Font pickers */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    onOpenThemes();
                  }}
                  className="p-3 rounded-2xl bg-white/80 dark:bg-black/30 border border-slate-200 dark:border-slate-700/60 hover:border-purple-500 text-left transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold mb-1">
                    <Palette className="w-4 h-4" />
                    <span>থিম স্টুডিও</span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {currentTheme?.name || 'Custom'}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    onOpenFonts();
                  }}
                  className="p-3 rounded-2xl bg-white/80 dark:bg-black/30 border border-slate-200 dark:border-slate-700/60 hover:border-indigo-500 text-left transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold mb-1">
                    <Type className="w-4 h-4" />
                    <span>৫০+ ফন্ট সম্ভার</span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {currentFont?.name || 'Roboto'}
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-700/60 bg-white/50 dark:bg-black/20 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            অফলাইনে স্বয়ংক্রিয় সেভ থাকে
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>সম্পন্ন (Done)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
