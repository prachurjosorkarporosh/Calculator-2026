/**
 * Advanced Personalize & Sizing Studio (Theme-Adaptive)
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Calculator. All rights reserved.
 *
 * Professional Personalization & Sizing Studio:
 * - Personal Name / Signature branding on calculator top bar
 * - 5 Keypad Scales: Compact (48px), Standard (56px), Spacious (64px), Jumbo (72px), Ultra (80px)
 * - 3 Display Font Sizes: Standard (100%), Large (125%), Huge (150%)
 * - 4 Button Corner Shapes: Circle/Pill, Squircle, Soft Corners, Subtle Sharp
 * - Button Glass Blur slider (0px - 24px)
 * - Audio Effects with live Play Sound preview triggers
 * - Haptic Touch Vibration & Thousands Formatting Commas
 * - Real-time working interactive mini preview
 * - Dynamically adapts to the currently active Theme Palette
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
  ChevronRight,
} from 'lucide-react';
import { ButtonShape, KeypadScale, DisplaySize, SoundEffectType } from '../types.ts';
import { triggerHaptic } from '../utils/haptics.ts';
import { playKeypressSound } from '../utils/sound.ts';
import { FONTS_CATALOG } from '../data/fonts.ts';
import { THEME_PALETTES, ThemePalette } from '../data/themes.ts';
import { getAppIconDataUri } from '../data/appIcons.ts';
import { getModalThemeStyles } from '../utils/themeStyles.ts';

interface CustomizationModalProps {
  isOpen: boolean;
  palette?: ThemePalette;
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
  palette,
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
  const [activeTab, setActiveTab] = useState<'sizing' | 'personal'>('sizing');
  const [inputName, setInputName] = useState(personalName);

  const currentFont = FONTS_CATALOG.find((f) => f.id === activeFontId);
  const currentTheme = THEME_PALETTES.find((t) => t.id === activeThemeId);
  const theme = getModalThemeStyles(palette || currentTheme);

  if (!isOpen) return null;

  const shapes: { id: ButtonShape; label: string; previewClass: string }[] = [
    { id: 'round', label: 'Pill / Circle', previewClass: 'rounded-full' },
    { id: 'squircle', label: 'Squircle', previewClass: 'rounded-[16px]' },
    { id: 'soft', label: 'Soft Corners', previewClass: 'rounded-xl' },
    { id: 'sharp', label: 'Subtle Sharp', previewClass: 'rounded-md' },
  ];

  const scales: { id: KeypadScale; label: string; desc: string; tag: string }[] = [
    { id: 'compact', label: 'Compact', desc: 'Tight spacing for smaller phones', tag: '48px' },
    { id: 'standard', label: 'Standard', desc: 'Balanced Android Material layout', tag: '56px' },
    { id: 'spacious', label: 'Spacious', desc: 'Comfortable tall touch targets', tag: '64px' },
    { id: 'jumbo', label: 'Jumbo', desc: 'Large high-reach touch buttons', tag: '72px' },
    { id: 'ultra', label: 'Ultra', desc: 'Maximum full-height giant keys', tag: '80px' },
  ];

  const displaySizes: { id: DisplaySize; label: string; desc: string }[] = [
    { id: 'standard', label: 'Standard (100%)', desc: 'Default balanced size' },
    { id: 'large', label: 'Large (125%)', desc: '+25% larger numbers' },
    { id: 'huge', label: 'Huge (150%)', desc: '+50% oversized digits' },
  ];

  const soundStyles: { id: SoundEffectType; label: string; desc: string }[] = [
    { id: 'tactile', label: 'Android Tactile', desc: 'Standard haptic click' },
    { id: 'pop', label: 'Bubble Pop', desc: 'Playful organic pop' },
    { id: 'mechanical', label: 'Mechanical Switch', desc: 'Crisp mechanical keystroke' },
    { id: 'beep', label: 'Digital Beep', desc: 'Classic digital watch tone' },
    { id: 'cyberpunk', label: 'Cyberpunk', desc: 'Synth wave pulse' },
    { id: 'marimba', label: 'Marimba Chime', desc: 'Tuned harmonic chime' },
    { id: 'typewriter', label: 'Typewriter', desc: 'Vintage mechanical clack' },
    { id: 'bubble', label: 'Water Drop', desc: 'Liquid droplet pop' },
    { id: 'laser', label: 'Sci-Fi Laser', desc: 'Futuristic arcade zap' },
    { id: 'woodblock', label: 'Woodblock', desc: 'Organic percussion' },
  ];

  const handleNameSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onChangePersonalName) {
      onChangePersonalName(inputName.trim());
      triggerHaptic('medium');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-md animate-in fade-in duration-150 select-none">
      <div
        style={{
          backgroundColor: theme.dialogBg,
          borderColor: theme.dialogBorder,
          color: theme.textPrimary,
          boxShadow: theme.isDark
            ? '0 25px 60px rgba(0,0,0,0.7)'
            : '0 20px 50px rgba(0,0,0,0.18)',
        }}
        className="w-full max-w-lg rounded-3xl border overflow-hidden flex flex-col max-h-[92vh] transition-colors"
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
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-2">
                <span>Personalize & Sizing Studio</span>
              </h3>
              <p style={{ color: theme.textSecondary }} className="text-[11px]">
                Keypad scale, corner styling, sound styles & custom signature
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

        {/* Tab Switcher */}
        <div
          style={{
            borderColor: theme.headerBorder,
            backgroundColor: theme.headerBg,
          }}
          className="px-5 pt-3 pb-2 flex gap-2 border-b"
        >
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('sizing');
            }}
            style={{
              backgroundColor: activeTab === 'sizing' ? theme.accentBg : 'transparent',
              color: activeTab === 'sizing' ? theme.accentText : theme.textSecondary,
            }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm hover:brightness-105"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Size & Scaling</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('personal');
            }}
            style={{
              backgroundColor: activeTab === 'personal' ? theme.accentBg : 'transparent',
              color: activeTab === 'personal' ? theme.accentText : theme.textSecondary,
            }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm hover:brightness-105"
          >
            <User className="w-3.5 h-3.5" />
            <span>Personal Profile & Audio</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs scrollbar-thin">
          {/* TAB 1: SIZING */}
          {activeTab === 'sizing' && (
            <div className="space-y-4">
              {/* Live Interactive Keypad Mini Sample Preview */}
              <div
                style={{
                  backgroundColor: theme.itemBg,
                  borderColor: theme.itemBorder,
                }}
                className="p-4 rounded-2xl border space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span
                    style={{ color: theme.accentColor }}
                    className="flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Live Keypad Sizing Preview</span>
                  </span>
                  <span style={{ color: theme.textSecondary }} className="text-[10px] uppercase font-mono">
                    {keypadScale} • {buttonShape} • {displaySize}
                  </span>
                </div>

                {/* Display Sample */}
                <div
                  style={{
                    backgroundColor: theme.isDark ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.06)',
                    borderColor: theme.itemBorder,
                  }}
                  className="text-right p-2.5 rounded-xl font-mono border"
                >
                  <div style={{ color: theme.textSecondary }} className="text-[10px]">128 × 256</div>
                  <div
                    style={{ color: theme.textPrimary }}
                    className={`font-bold transition-all ${
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
                      style={{
                        backgroundColor: k === '×' ? theme.accentBg : theme.itemBg,
                        color: k === '×' ? theme.accentText : theme.textPrimary,
                        borderColor: theme.itemBorder,
                      }}
                      className={`flex items-center justify-center font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer border ${
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
                <div className="flex items-center gap-2 font-bold mb-2">
                  <Maximize2
                    style={{ color: theme.accentColor }}
                    className="w-4 h-4"
                  />
                  <span>Keypad Height Scaling:</span>
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
                      style={{
                        backgroundColor: keypadScale === s.id ? theme.subtleAccentBg : theme.itemBg,
                        borderColor: keypadScale === s.id ? theme.accentColor : theme.itemBorder,
                        color: theme.textPrimary,
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        keypadScale === s.id ? 'shadow-sm ring-1 ring-emerald-500/20' : ''
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs">{s.label}</div>
                        <div style={{ color: theme.textSecondary }} className="text-[10px] mt-0.5">
                          {s.desc}
                        </div>
                      </div>
                      <span
                        style={{
                          backgroundColor: theme.subtleAccentBg,
                          color: theme.accentColor,
                        }}
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md shrink-0 ml-2"
                      >
                        {s.tag}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Result Font Size */}
              <div>
                <div className="flex items-center gap-2 font-bold mb-2">
                  <Type
                    style={{ color: theme.accentColor }}
                    className="w-4 h-4"
                  />
                  <span>Display Digits Size:</span>
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
                      style={{
                        backgroundColor: displaySize === ds.id ? theme.subtleAccentBg : theme.itemBg,
                        borderColor: displaySize === ds.id ? theme.accentColor : theme.itemBorder,
                        color: theme.textPrimary,
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        displaySize === ds.id ? 'shadow-sm ring-1 ring-emerald-500/20' : ''
                      }`}
                    >
                      <div className="font-bold text-xs">{ds.label}</div>
                      <div style={{ color: theme.textSecondary }} className="text-[10px] mt-0.5 leading-tight">
                        {ds.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Button Corner Style */}
              <div>
                <div className="flex items-center gap-2 font-bold mb-2">
                  <Shapes
                    style={{ color: theme.accentColor }}
                    className="w-4 h-4"
                  />
                  <span>Button Corner Shape:</span>
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
                      style={{
                        backgroundColor: buttonShape === s.id ? theme.subtleAccentBg : theme.itemBg,
                        borderColor: buttonShape === s.id ? theme.accentColor : theme.itemBorder,
                        color: theme.textPrimary,
                      }}
                      className={`p-2.5 flex flex-col items-center justify-center gap-1.5 rounded-xl border transition-all cursor-pointer ${
                        buttonShape === s.id ? 'shadow-sm ring-1 ring-emerald-500/20' : ''
                      }`}
                    >
                      <div
                        style={{
                          backgroundColor: theme.subtleAccentBg,
                          borderColor: theme.accentColor,
                          color: theme.accentColor,
                        }}
                        className={`w-8 h-8 border flex items-center justify-center text-[11px] font-bold ${s.previewClass}`}
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
                <div
                  style={{
                    backgroundColor: theme.itemBg,
                    borderColor: theme.itemBorder,
                  }}
                  className="p-4 rounded-2xl border space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <Sliders
                        style={{ color: theme.accentColor }}
                        className="w-4 h-4"
                      />
                      <span>Keypad Glass Backdrop Blur:</span>
                    </div>
                    <span
                      style={{
                        backgroundColor: theme.subtleAccentBg,
                        color: theme.accentColor,
                      }}
                      className="font-mono px-2 py-0.5 rounded-md"
                    >
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
                    style={{ accentColor: theme.accentColor }}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-700/40"
                  />
                  <div style={{ color: theme.textSecondary }} className="flex justify-between text-[10px]">
                    <span>0px (Sharp)</span>
                    <span>8px (Balanced)</span>
                    <span>16px (Frosted)</span>
                    <span>24px (Heavy Glass)</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PERSONAL */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              {/* Personal Name / Signature Branding */}
              <div
                style={{
                  backgroundColor: theme.itemBg,
                  borderColor: theme.itemBorder,
                }}
                className="p-4 rounded-2xl border space-y-2"
              >
                <div className="flex items-center gap-2 font-bold">
                  <User
                    style={{ color: theme.accentColor }}
                    className="w-4 h-4"
                  />
                  <span>Personal Calculator Signature:</span>
                </div>
                <p style={{ color: theme.textSecondary }} className="text-[11px] leading-relaxed">
                  Enter your name or custom label to appear prominently on the top bar of the calculator.
                </p>

                <form onSubmit={handleNameSave} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="e.g. Porosh's Calc, প্রচ্ছুর্য..."
                    style={{
                      backgroundColor: theme.inputBg,
                      borderColor: theme.inputBorder,
                      color: theme.textPrimary,
                    }}
                    className="flex-1 px-3 py-2 rounded-xl border text-xs font-semibold focus:outline-none"
                  />
                  <button
                    type="submit"
                    style={{
                      backgroundColor: theme.accentBg,
                      color: theme.accentText,
                    }}
                    className="px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1 shadow-md active:scale-95 transition-all cursor-pointer hover:brightness-110"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                </form>
              </div>

              {/* Sound & Audio Styles with Live Play Sound Buttons */}
              <div
                style={{
                  backgroundColor: theme.itemBg,
                  borderColor: theme.itemBorder,
                }}
                className="p-4 rounded-2xl border space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {soundEnabled ? (
                      <Volume2
                        style={{ color: theme.accentColor }}
                        className="w-4 h-4"
                      />
                    ) : (
                      <VolumeX style={{ color: theme.textSecondary }} className="w-4 h-4" />
                    )}
                    <div>
                      <div className="font-bold text-xs">Audio Click Feedback</div>
                      <div style={{ color: theme.textSecondary }} className="text-[10px]">
                        Play acoustic audio click on button press
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      onToggleSound();
                      if (!soundEnabled) {
                        setTimeout(() => playKeypressSound('number', soundType), 50);
                      }
                    }}
                    style={{
                      backgroundColor: soundEnabled
                        ? theme.accentBg
                        : theme.isDark
                        ? 'rgba(255,255,255,0.2)'
                        : 'rgba(0,0,0,0.2)',
                    }}
                    className="w-10 h-5 flex items-center rounded-full p-0.5 duration-200 transition-colors cursor-pointer"
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${
                        soundEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {soundEnabled && (
                  <div className="space-y-1.5 pt-1 border-t border-white/[0.06]">
                    <span style={{ color: theme.textSecondary }} className="text-[10px] font-bold uppercase tracking-wider block mb-1">
                      Choose Sound Style:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {soundStyles.map((ss) => (
                        <div
                          key={ss.id}
                          onClick={() => {
                            triggerHaptic('light');
                            onChangeSoundType(ss.id);
                            playKeypressSound('number', ss.id);
                          }}
                          style={{
                            backgroundColor: soundType === ss.id ? theme.subtleAccentBg : 'transparent',
                            borderColor: soundType === ss.id ? theme.accentColor : theme.itemBorder,
                          }}
                          className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            soundType === ss.id ? 'shadow-sm ring-1 ring-emerald-500/20' : ''
                          }`}
                        >
                          <div>
                            <div className="font-bold text-xs">{ss.label}</div>
                            <div style={{ color: theme.textSecondary }} className="text-[10px]">
                              {ss.desc}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              playKeypressSound('equals', ss.id);
                            }}
                            style={{
                              backgroundColor: theme.subtleAccentBg,
                              color: theme.accentColor,
                            }}
                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
                            title="Play sound sample"
                          >
                            <Play className="w-3 h-3 fill-current" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Haptics & Thousands Separator Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div
                  style={{
                    backgroundColor: theme.itemBg,
                    borderColor: theme.itemBorder,
                  }}
                  className="flex items-center justify-between p-3.5 rounded-2xl border"
                >
                  <div className="flex items-center gap-2.5">
                    <Smartphone
                      style={{ color: theme.accentColor }}
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="font-bold text-xs">Haptic Vibration</div>
                      <div style={{ color: theme.textSecondary }} className="text-[10px]">Android touch response</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('medium');
                      onToggleHaptic();
                    }}
                    style={{
                      backgroundColor: hapticEnabled
                        ? theme.accentBg
                        : theme.isDark
                        ? 'rgba(255,255,255,0.2)'
                        : 'rgba(0,0,0,0.2)',
                    }}
                    className="w-10 h-5 flex items-center rounded-full p-0.5 duration-200 transition-colors cursor-pointer"
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${
                        hapticEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div
                  style={{
                    backgroundColor: theme.itemBg,
                    borderColor: theme.itemBorder,
                  }}
                  className="flex items-center justify-between p-3.5 rounded-2xl border"
                >
                  <div className="flex items-center gap-2.5">
                    <Hash
                      style={{ color: theme.accentColor }}
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="font-bold text-xs">Thousands Commas</div>
                      <div style={{ color: theme.textSecondary }} className="text-[10px]">1,000,000 formatting</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      onToggleFormatThousands();
                    }}
                    style={{
                      backgroundColor: formatThousands
                        ? theme.accentBg
                        : theme.isDark
                        ? 'rgba(255,255,255,0.2)'
                        : 'rgba(0,0,0,0.2)',
                    }}
                    className="w-10 h-5 flex items-center rounded-full p-0.5 duration-200 transition-colors cursor-pointer"
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
                  style={{
                    backgroundColor: theme.itemBg,
                    borderColor: theme.itemBorder,
                  }}
                  className="p-3.5 rounded-2xl border text-left transition-all cursor-pointer group hover:brightness-105"
                >
                  <div
                    style={{ color: theme.accentColor }}
                    className="flex items-center gap-2 font-bold mb-1"
                  >
                    <Palette className="w-4 h-4" />
                    <span>Theme Studio</span>
                  </div>
                  <div style={{ color: theme.textSecondary }} className="text-[11px] truncate">
                    {currentTheme?.name || 'Custom'}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    onOpenFonts();
                  }}
                  style={{
                    backgroundColor: theme.itemBg,
                    borderColor: theme.itemBorder,
                  }}
                  className="p-3.5 rounded-2xl border text-left transition-all cursor-pointer group hover:brightness-105"
                >
                  <div
                    style={{ color: theme.accentColor }}
                    className="flex items-center gap-2 font-bold mb-1"
                  >
                    <Type className="w-4 h-4" />
                    <span>52+ Fonts Gallery</span>
                  </div>
                  <div style={{ color: theme.textSecondary }} className="text-[11px] truncate">
                    {currentFont?.name || 'Roboto'}
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            borderColor: theme.footerBorder,
            backgroundColor: theme.footerBg,
          }}
          className="px-5 py-3.5 border-t flex items-center justify-between text-xs"
        >
          <span style={{ color: theme.textSecondary }}>
            Automatically saved offline
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              backgroundColor: theme.accentBg,
              color: theme.accentText,
            }}
            className="px-6 py-2 rounded-xl font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5 hover:brightness-110"
          >
            <Check className="w-4 h-4" />
            <span>Apply & Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
