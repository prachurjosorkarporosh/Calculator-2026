/**
 * Ultra-Advanced Theme Studio & Color Customizer Modal
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.pro.bd/
 * © 2026 Prachurjo Calculator. All rights reserved.
 *
 * Implements:
 * - Live Interactive Mini-Calculator Preview that responds to all color & wallpaper tweaks
 * - 18+ Curated Theme Presets with Category Filtering (AMOLED, Light, Photo, Retro, Neon)
 * - Pro Color Lab / Theme Studio with Harmonic One-Click Palettes & Random Theme Generator
 * - Key-by-Key Visual Customizer with Batch Actions (Apply to All Numbers, Operators, Scientific)
 * - 12+ HD Curated Photo Wallpapers, Custom Photo Upload, Glassmorphic Blur & Dimmer Sliders
 * - Theme Code Export & Clipboard Sharing
 */

import React, { useState, useRef, useMemo } from 'react';
import {
  X,
  Check,
  Palette,
  Sliders,
  Image as ImageIcon,
  Upload,
  Sparkles,
  RefreshCw,
  Eye,
  Layers,
  Copy,
  Wand2,
  Share2,
} from 'lucide-react';
import {
  THEME_PALETTES,
  CURATED_WALLPAPERS,
  ThemePalette,
  WallpaperOption,
} from '../data/themes.ts';
import { CustomThemeColors } from '../types.ts';
import { triggerHaptic } from '../utils/haptics.ts';
import { playKeypressSound } from '../utils/sound.ts';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  activeThemeId: string;
  customColors: CustomThemeColors | null;
  onSelectThemeId: (themeId: string) => void;
  onSaveCustomColors: (colors: CustomThemeColors) => void;
  onClose: () => void;
}

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({
  isOpen,
  activeThemeId,
  customColors,
  onSelectThemeId,
  onSaveCustomColors,
  onClose,
}) => {
  const [tab, setTab] = useState<'presets' | 'studio' | 'keys' | 'wallpapers'>('presets');
  const [presetCategory, setPresetCategory] = useState<'all' | 'dark' | 'light' | 'photo' | 'special'>('all');

  // Custom theme states
  const [bg, setBg] = useState(customColors?.bg || '#0B0D19');
  const [numberBg, setNumberBg] = useState(
    customColors?.numberBg || 'rgba(255, 255, 255, 0.12)'
  );
  const [operatorBg, setOperatorBg] = useState(
    customColors?.operatorBg || 'rgba(56, 189, 248, 0.35)'
  );
  const [scientificBg, setScientificBg] = useState(
    customColors?.scientificBg || 'rgba(129, 140, 248, 0.25)'
  );
  const [actionBg, setActionBg] = useState(
    customColors?.actionBg || 'rgba(239, 68, 68, 0.3)'
  );
  const [backspaceBg, setBackspaceBg] = useState(
    customColors?.backspaceBg || 'rgba(245, 158, 11, 0.3)'
  );
  const [equalsBg, setEqualsBg] = useState(customColors?.equalsBg || '#087A36');
  const [textColor, setTextColor] = useState(customColors?.textColor || '#FFFFFF');
  const [bgImage, setBgImage] = useState<string | undefined>(customColors?.bgImage);
  const [bgBlur, setBgBlur] = useState<number>(customColors?.bgBlur ?? 2);
  const [bgOverlayOpacity, setBgOverlayOpacity] = useState<number>(
    customColors?.bgOverlayOpacity ?? 35
  );
  const [isGlassmorphic, setIsGlassmorphic] = useState<boolean>(
    customColors?.isGlassmorphic ?? true
  );
  const [animatedBg, setAnimatedBg] = useState<boolean>(
    customColors?.animatedBg ?? false
  );

  // Individual key-by-key background overrides
  const [keyBgOverrides, setKeyBgOverrides] = useState<Record<string, string>>(
    customColors?.keyBgOverrides || {}
  );
  const [selectedKeyForEditing, setSelectedKeyForEditing] = useState<string>('7');

  // Live preview test interaction
  const [previewFormula, setPreviewFormula] = useState('128 × 256');
  const [previewResult, setPreviewResult] = useState('32,768');
  const [copiedCode, setCopiedCode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered preset themes
  const filteredPresets = useMemo(() => {
    if (presetCategory === 'dark') return THEME_PALETTES.filter((t) => t.isDark && !t.bgImage);
    if (presetCategory === 'light') return THEME_PALETTES.filter((t) => !t.isDark && !t.bgImage);
    if (presetCategory === 'photo') return THEME_PALETTES.filter((t) => Boolean(t.bgImage) || t.animatedBg);
    if (presetCategory === 'special') {
      return THEME_PALETTES.filter(
        (t) =>
          t.id === 'classic-casio' ||
          t.id === 'ios-dark' ||
          t.id === 'matrix-phosphor' ||
          t.id === 'cyberpunk' ||
          t.id === 'crimson-gaming'
      );
    }
    return THEME_PALETTES;
  }, [presetCategory]);

  if (!isOpen) return null;

  // Apply custom colors to active session
  const handleApplyCustom = () => {
    triggerHaptic('medium');
    const custom: CustomThemeColors = {
      bg,
      numberBg,
      operatorBg,
      scientificBg,
      actionBg,
      backspaceBg,
      equalsBg,
      textColor,
      bgImage,
      bgBlur,
      bgOverlayOpacity,
      isGlassmorphic,
      animatedBg,
      keyBgOverrides,
    };
    onSaveCustomColors(custom);
    onSelectThemeId('custom');
    onClose();
  };

  // Select wallpaper
  const handleSelectWallpaper = (wp: WallpaperOption) => {
    triggerHaptic('light');
    setBgImage(wp.url);
    setIsGlassmorphic(true);
    setBg('#0B0D19');

    const custom: CustomThemeColors = {
      bg: '#0B0D19',
      numberBg: 'rgba(255, 255, 255, 0.14)',
      operatorBg: 'rgba(56, 189, 248, 0.35)',
      scientificBg: 'rgba(129, 140, 248, 0.25)',
      actionBg: 'rgba(239, 68, 68, 0.3)',
      backspaceBg: 'rgba(245, 158, 11, 0.3)',
      equalsBg: '#087A36',
      textColor: '#FFFFFF',
      bgImage: wp.url,
      bgBlur: 2,
      bgOverlayOpacity: 35,
      isGlassmorphic: true,
      animatedBg: false,
      keyBgOverrides,
    };
    onSaveCustomColors(custom);
    onSelectThemeId('custom');
  };

  // Custom photo upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      triggerHaptic('medium');
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setBgImage(dataUrl);
        setIsGlassmorphic(true);
        setBg('#0B0D19');

        const custom: CustomThemeColors = {
          bg: '#0B0D19',
          numberBg: 'rgba(255, 255, 255, 0.15)',
          operatorBg: 'rgba(56, 189, 248, 0.35)',
          scientificBg: 'rgba(129, 140, 248, 0.25)',
          actionBg: 'rgba(239, 68, 68, 0.3)',
          backspaceBg: 'rgba(245, 158, 11, 0.3)',
          equalsBg: '#087A36',
          textColor: '#FFFFFF',
          bgImage: dataUrl,
          bgBlur: 2,
          bgOverlayOpacity: 35,
          isGlassmorphic: true,
          animatedBg: false,
          keyBgOverrides,
        };
        onSaveCustomColors(custom);
        onSelectThemeId('custom');
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove photo wallpaper
  const handleRemoveWallpaper = () => {
    triggerHaptic('light');
    setBgImage(undefined);
    setIsGlassmorphic(false);
  };

  // Reset to default
  const handleResetToDefault = () => {
    triggerHaptic('light');
    setBg('#0B0D19');
    setNumberBg('rgba(255, 255, 255, 0.12)');
    setOperatorBg('rgba(56, 189, 248, 0.35)');
    setScientificBg('rgba(129, 140, 248, 0.25)');
    setActionBg('rgba(239, 68, 68, 0.3)');
    setBackspaceBg('rgba(245, 158, 11, 0.3)');
    setEqualsBg('#087A36');
    setTextColor('#FFFFFF');
    setBgImage(undefined);
    setBgBlur(2);
    setBgOverlayOpacity(35);
    setIsGlassmorphic(true);
    setAnimatedBg(false);
    setKeyBgOverrides({});
  };

  // Random Palette Generator (Magic Button)
  const handleSurpriseMe = () => {
    triggerHaptic('medium');
    const palettes = [
      {
        bg: '#0B0D1B',
        num: '#1A1D36',
        op: '#6366F1',
        sci: '#312E81',
        eq: '#10B981',
        txt: '#FFFFFF',
      },
      {
        bg: '#0D1117',
        num: '#161B22',
        op: '#238636',
        sci: '#1F6FEB',
        eq: '#2EA043',
        txt: '#E6EDF3',
      },
      {
        bg: '#180A18',
        num: '#2D142C',
        op: '#801336',
        sci: '#C72C41',
        eq: '#EE4540',
        txt: '#FFFFFF',
      },
      {
        bg: '#051923',
        num: '#003554',
        op: '#006494',
        sci: '#0582CA',
        eq: '#00A6FB',
        txt: '#FFFFFF',
      },
      {
        bg: '#1A181B',
        num: '#2E282A',
        op: '#FF8811',
        sci: '#392F5A',
        eq: '#9DD9D2',
        txt: '#FFF8F0',
      },
    ];
    const picked = palettes[Math.floor(Math.random() * palettes.length)];
    setBg(picked.bg);
    setNumberBg(picked.num);
    setOperatorBg(picked.op);
    setScientificBg(picked.sci);
    setEqualsBg(picked.eq);
    setTextColor(picked.txt);
  };

  // Copy Theme JSON
  const handleCopyThemeJson = () => {
    triggerHaptic('light');
    const data = {
      bg,
      numberBg,
      operatorBg,
      scientificBg,
      equalsBg,
      textColor,
      isGlassmorphic,
      bgBlur,
      bgOverlayOpacity,
      keyBgOverrides,
    };
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1500);
  };

  // Batch Key Color Applicators
  const handleBatchApply = (type: 'numbers' | 'operators' | 'scientific' | 'all', color: string) => {
    triggerHaptic('medium');
    setKeyBgOverrides((prev) => {
      const next = { ...prev };
      if (type === 'numbers' || type === 'all') {
        ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'].forEach((k) => (next[k] = color));
      }
      if (type === 'operators' || type === 'all') {
        ['+', '−', '×', '÷'].forEach((k) => (next[k] = color));
      }
      if (type === 'scientific' || type === 'all') {
        ['sin', 'cos', 'tan', 'ln', 'log', '√', 'π', 'e', '^', '!', 'RAD', 'DEG', 'INV'].forEach(
          (k) => (next[k] = color)
        );
      }
      return next;
    });
  };

  // Set single key color
  const handleSetKeyColor = (keyId: string, color: string) => {
    triggerHaptic('light');
    setKeyBgOverrides((prev) => ({
      ...prev,
      [keyId]: color,
    }));
  };

  // Live preview test button press
  const handleTestBtn = (val: string) => {
    triggerHaptic('light');
    playKeypressSound(val === '=' ? 'equals' : val === '×' ? 'operator' : 'number');
    if (val === '=') {
      setPreviewFormula('128 × 256');
      setPreviewResult('32,768');
    } else {
      setPreviewFormula((prev) => prev + val);
    }
  };

  // Quick Colors Swatches
  const quickColors = [
    { label: 'Neon Emerald', color: '#10B981' },
    { label: 'Cyan Sky', color: '#0EA5E9' },
    { label: 'Indigo Purple', color: '#6366F1' },
    { label: 'Neon Magenta', color: '#EC4899' },
    { label: 'Crimson Red', color: '#EF4444' },
    { label: 'Vibrant Amber', color: '#F59E0B' },
    { label: 'Teal Mint', color: '#14B8A6' },
    { label: 'Obsidian Black', color: '#18181B' },
    { label: 'Frosted Glass', color: 'rgba(255, 255, 255, 0.20)' },
    { label: 'Ultra Dark', color: '#0A0A0C' },
    { label: 'Gold Metallic', color: '#D97706' },
    { label: 'Pure White', color: '#FFFFFF' },
  ];

  // Helper for key display background
  const getKeyColor = (keyId: string, defaultColor: string) => {
    return keyBgOverrides[keyId] || defaultColor;
  };

  // All interactive keys for visual mapper
  const allCalculatorKeys = [
    { id: 'AC', label: 'AC', defaultBg: actionBg },
    { id: '()', label: '( )', defaultBg: actionBg },
    { id: '%', label: '%', defaultBg: actionBg },
    { id: '÷', label: '÷', defaultBg: operatorBg },
    { id: '7', label: '7', defaultBg: numberBg },
    { id: '8', label: '8', defaultBg: numberBg },
    { id: '9', label: '9', defaultBg: numberBg },
    { id: '×', label: '×', defaultBg: operatorBg },
    { id: '4', label: '4', defaultBg: numberBg },
    { id: '5', label: '5', defaultBg: numberBg },
    { id: '6', label: '6', defaultBg: numberBg },
    { id: '−', label: '−', defaultBg: operatorBg },
    { id: '1', label: '1', defaultBg: numberBg },
    { id: '2', label: '2', defaultBg: numberBg },
    { id: '3', label: '3', defaultBg: numberBg },
    { id: '+', label: '+', defaultBg: operatorBg },
    { id: '0', label: '0', defaultBg: numberBg },
    { id: '.', label: '.', defaultBg: numberBg },
    { id: '⌫', label: '⌫', defaultBg: backspaceBg },
    { id: '=', label: '=', defaultBg: equalsBg },
    // Scientific keys row
    { id: '√', label: '√', defaultBg: scientificBg },
    { id: 'π', label: 'π', defaultBg: scientificBg },
    { id: '^', label: '^', defaultBg: scientificBg },
    { id: '!', label: '!', defaultBg: scientificBg },
    { id: 'sin', label: 'sin', defaultBg: scientificBg },
    { id: 'cos', label: 'cos', defaultBg: scientificBg },
    { id: 'tan', label: 'tan', defaultBg: scientificBg },
    { id: 'ln', label: 'ln', defaultBg: scientificBg },
    { id: 'log', label: 'log', defaultBg: scientificBg },
    { id: '1/x', label: '1/x', defaultBg: scientificBg },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 animate-in fade-in duration-150 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-[#EEF2F6] dark:bg-[#1E2126] text-slate-800 dark:text-slate-100 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700/60 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Studio Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between bg-white/50 dark:bg-black/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight">
                থিম স্টুডিও (Theme Studio)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ১৮+ থিম, কালার ল্যাব ও বাটন-বাই-বাটন কাস্টমাইজেশন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleSurpriseMe}
              title="Surprise Me (র‍্যান্ডম কালার প্যালেট)"
              className="p-2 rounded-xl text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 transition-colors"
            >
              <Wand2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleCopyThemeJson}
              title="Copy Theme JSON"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Tabs Navigation */}
        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700/60 flex items-center gap-1 bg-white/30 dark:bg-black/10 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setTab('presets');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 whitespace-nowrap ${
              tab === 'presets'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>থিম সম্ভার (Presets)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setTab('studio');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 whitespace-nowrap ${
              tab === 'studio'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>কালার ল্যাব (Studio)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setTab('keys');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 whitespace-nowrap ${
              tab === 'keys'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>বাটন স্টুডিও (Keys)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setTab('wallpapers');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 whitespace-nowrap ${
              tab === 'wallpapers'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>ওয়ালপেপার (Wallpapers)</span>
          </button>
        </div>

        {/* Live Interactive Mini Preview Bar (Top Sticky Preview) */}
        <div className="px-5 py-2.5 border-b border-slate-200 dark:border-slate-700/60 bg-slate-900 text-white">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Eye className="w-3 h-3 text-purple-400" />
              লাইভ প্রিভিউ (Live Interactive Preview)
            </span>
            <span className="text-[10px] text-slate-400">বাটনে ট্যাপ করে পরীক্ষা করুন</span>
          </div>

          <div
            style={{
              backgroundColor: bg,
              backgroundImage: bgImage ? `url(${bgImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            className="p-3 rounded-2xl border border-white/10 shadow-inner relative overflow-hidden flex items-center justify-between gap-4"
          >
            {/* Blur overlay for live preview */}
            {bgImage && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundColor: `rgba(0, 0, 0, ${bgOverlayOpacity / 100})`,
                  backdropFilter: `blur(${bgBlur}px)`,
                }}
              />
            )}

            {/* Display Area Preview */}
            <div className="relative z-10 min-w-0 flex-1">
              <div className="text-[11px] text-slate-400 truncate">{previewFormula}</div>
              <div
                style={{ color: textColor }}
                className="text-lg sm:text-xl font-extrabold truncate"
              >
                {previewResult}
              </div>
            </div>

            {/* Mini Test Buttons */}
            <div className="relative z-10 flex items-center gap-1.5 shrink-0">
              {['7', '8', '×', '='].map((k) => {
                const isEq = k === '=';
                const isOp = k === '×';
                const buttonBg = isEq
                  ? getKeyColor('=', equalsBg)
                  : isOp
                  ? getKeyColor('×', operatorBg)
                  : getKeyColor(k, numberBg);

                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => handleTestBtn(k)}
                    style={{
                      backgroundColor: buttonBg,
                      color: textColor,
                    }}
                    className="w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center shadow-sm active:scale-90 transition-transform"
                  >
                    {k}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          {/* TAB 1: PRESETS */}
          {tab === 'presets' && (
            <div className="space-y-3">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {[
                  { id: 'all', label: 'সকল থিম (All)' },
                  { id: 'dark', label: 'Dark & AMOLED' },
                  { id: 'light', label: 'Light & Pastel' },
                  { id: 'photo', label: 'Photo & Glass' },
                  { id: 'special', label: 'Special & Retro' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setPresetCategory(cat.id as any);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      presetCategory === cat.id
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                        : 'bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-black/10'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Themes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredPresets.map((palette) => {
                  const isSelected = activeThemeId === palette.id;
                  return (
                    <button
                      key={palette.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        onSelectThemeId(palette.id);
                        // Populate custom states from this theme
                        setBg(palette.bg);
                        setNumberBg(palette.numberBg);
                        setOperatorBg(palette.operatorBg);
                        setScientificBg(palette.scientificBg);
                        setEqualsBg(palette.equalsBg);
                        setTextColor(palette.displayText);
                        setBgImage(palette.bgImage);
                        setAnimatedBg(palette.animatedBg ?? false);
                        setIsGlassmorphic(palette.isGlassmorphic ?? false);
                      }}
                      className={`relative p-3 rounded-2xl border text-left flex items-center justify-between transition-all active:scale-[0.99] shadow-sm ${
                        isSelected
                          ? 'border-purple-500 bg-purple-500/10 dark:bg-purple-500/20 ring-2 ring-purple-500/30'
                          : 'border-slate-200 dark:border-slate-700/60 bg-white dark:bg-black/20 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Mini Color Swatch Pill */}
                        <div
                          style={{ backgroundColor: palette.bg }}
                          className="w-10 h-10 rounded-xl border border-white/20 shadow-inner flex items-center justify-center p-1 shrink-0 overflow-hidden relative"
                        >
                          {palette.bgImage && (
                            <img
                              src={palette.bgImage}
                              alt=""
                              className="absolute inset-0 w-full h-full object-cover opacity-80"
                            />
                          )}
                          <div className="relative z-10 flex gap-0.5">
                            <span
                              style={{ backgroundColor: palette.numberBg }}
                              className="w-2 h-2 rounded-full border border-white/20"
                            />
                            <span
                              style={{ backgroundColor: palette.operatorBg }}
                              className="w-2 h-2 rounded-full border border-white/20"
                            />
                            <span
                              style={{ backgroundColor: palette.equalsBg }}
                              className="w-2 h-2 rounded-full border border-white/20"
                            />
                          </div>
                        </div>

                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                            {palette.name}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span>{palette.isDark ? 'Dark Theme' : 'Light Theme'}</span>
                            {palette.bgImage && <span className="text-purple-500 font-bold">• Photo</span>}
                            {palette.animatedBg && <span className="text-blue-500 font-bold">• Animated</span>}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: STUDIO (COLOR LAB) */}
          {tab === 'studio' && (
            <div className="space-y-4">
              {/* Harmonic Quick Presets */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  ওয়ান-ট্যাপ হারমোনি প্যালেট (One-Click Palettes):
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { name: 'Cyber Neon', bg: '#0B0C10', op: '#FF71CE', eq: '#01CDFE', num: '#1A1D2E' },
                    { name: 'AMOLED Void', bg: '#000000', op: '#064E3B', eq: '#10B981', num: '#18181B' },
                    { name: 'Tokyo Sakura', bg: '#1A131A', op: '#F472B6', eq: '#EC4899', num: '#2B1E2B' },
                    { name: 'Sunset Dusk', bg: '#1A0E1A', op: '#F59E0B', eq: '#FF758F', num: '#2D1B2D' },
                    { name: 'Nordic Frost', bg: '#2E3440', op: '#5E81AC', eq: '#88C0D0', num: '#434C5E' },
                    { name: 'Emerald Forest', bg: '#051E17', op: '#134E4A', eq: '#10B981', num: '#0F382B' },
                  ].map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setBg(p.bg);
                        setOperatorBg(p.op);
                        setEqualsBg(p.eq);
                        setNumberBg(p.num);
                      }}
                      className="p-2 rounded-xl bg-white dark:bg-black/20 border border-slate-200 dark:border-slate-700/60 hover:border-purple-500 flex items-center justify-between text-left text-xs font-bold"
                    >
                      <span>{p.name}</span>
                      <div className="flex -space-x-1">
                        <span style={{ backgroundColor: p.op }} className="w-2.5 h-2.5 rounded-full border border-white/20" />
                        <span style={{ backgroundColor: p.eq }} className="w-2.5 h-2.5 rounded-full border border-white/20" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Master Color Controllers */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  প্রধান কালার নিয়ন্ত্রণ (Master Color Controllers):
                </span>

                {/* Background Color */}
                <div className="p-3 rounded-2xl bg-white dark:bg-black/20 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold">ক্যালকুলেটর ব্যাকগ্রাউন্ড (Background)</div>
                    <div className="text-[10px] text-slate-500">মূল ফ্রেমের ব্যাকগ্রাউন্ড রঙ</div>
                  </div>
                  <input
                    type="color"
                    value={bg.startsWith('#') ? bg : '#0B0D19'}
                    onChange={(e) => setBg(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                  />
                </div>

                {/* Number Keys Color */}
                <div className="p-3 rounded-2xl bg-white dark:bg-black/20 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold">সংখ্যা বাটন (Number Keys 0-9)</div>
                    <div className="text-[10px] text-slate-500">সকল সাধারণ সংখ্যা বাটনের রঙ</div>
                  </div>
                  <input
                    type="color"
                    value={numberBg.startsWith('#') ? numberBg : '#1A1D2E'}
                    onChange={(e) => {
                      setNumberBg(e.target.value);
                      handleBatchApply('numbers', e.target.value);
                    }}
                    className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                  />
                </div>

                {/* Operator Keys Color */}
                <div className="p-3 rounded-2xl bg-white dark:bg-black/20 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold">অপারেটর বাটন (+, −, ×, ÷)</div>
                    <div className="text-[10px] text-slate-500">যোগ, বিয়োগ, গুণ ও ভাগের বাটন</div>
                  </div>
                  <input
                    type="color"
                    value={operatorBg.startsWith('#') ? operatorBg : '#6366F1'}
                    onChange={(e) => {
                      setOperatorBg(e.target.value);
                      handleBatchApply('operators', e.target.value);
                    }}
                    className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                  />
                </div>

                {/* Equals Button Color */}
                <div className="p-3 rounded-2xl bg-white dark:bg-black/20 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold">সমান বাটন (Equals Button =)</div>
                    <div className="text-[10px] text-slate-500">ফলাফল বের করার বাটন</div>
                  </div>
                  <input
                    type="color"
                    value={equalsBg.startsWith('#') ? equalsBg : '#087A36'}
                    onChange={(e) => setEqualsBg(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                  />
                </div>

                {/* Text Color */}
                <div className="p-3 rounded-2xl bg-white dark:bg-black/20 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold">টেক্সট ও ডিজিট কালার (Text Color)</div>
                    <div className="text-[10px] text-slate-500">স্ক্রিনের লেখার রঙ</div>
                  </div>
                  <input
                    type="color"
                    value={textColor.startsWith('#') ? textColor : '#FFFFFF'}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: KEY-BY-KEY STUDIO */}
          {tab === 'keys' && (
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-700 dark:text-purple-300">
                💡 <strong>বাটন-বাই-বাটন স্টুডিও:</strong> নিচের কিপ্যাড থেকে যেকোনো বাটনে ট্যাপ করুন এবং সেটির জন্য আলাদা রঙ নির্বাচন করুন।
              </div>

              {/* Selected Key Display & Controls */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-black/20 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white font-bold text-lg flex items-center justify-center shadow-md">
                    {selectedKeyForEditing}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      নির্বাচিত বাটন: [{selectedKeyForEditing}]
                    </div>
                    <div className="text-[11px] text-slate-500">
                      নিচের রঙ বা কালার পিকার থেকে পছন্দ করুন
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={
                      (keyBgOverrides[selectedKeyForEditing] || '#6366F1').startsWith('#')
                        ? keyBgOverrides[selectedKeyForEditing] || '#6366F1'
                        : '#6366F1'
                    }
                    onChange={(e) => handleSetKeyColor(selectedKeyForEditing, e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                  />
                </div>
              </div>

              {/* Quick Color Swatches */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  দ্রুত রঙের সোয়াচ (Quick Swatches):
                </span>
                <div className="grid grid-cols-6 gap-2">
                  {quickColors.map((swatch) => (
                    <button
                      key={swatch.label}
                      type="button"
                      title={swatch.label}
                      onClick={() => handleSetKeyColor(selectedKeyForEditing, swatch.color)}
                      style={{ backgroundColor: swatch.color }}
                      className="h-9 rounded-xl border border-white/20 shadow-sm active:scale-90 transition-transform"
                    />
                  ))}
                </div>
              </div>

              {/* Interactive Keypad Visual Map */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    বাটন সিলেক্টর ম্যাপ (Tap any key to select):
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setKeyBgOverrides({});
                    }}
                    className="text-[11px] text-rose-500 font-semibold hover:underline"
                  >
                    রিসেট সকল বাটন (Clear All)
                  </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 p-3 rounded-2xl bg-black/10 dark:bg-black/30 border border-slate-200 dark:border-slate-700/60 max-h-56 overflow-y-auto">
                  {allCalculatorKeys.map((k) => {
                    const isSelected = selectedKeyForEditing === k.id;
                    const activeColor = getKeyColor(k.id, k.defaultBg);
                    return (
                      <button
                        key={k.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic('light');
                          setSelectedKeyForEditing(k.id);
                        }}
                        style={{
                          backgroundColor: activeColor,
                          color: textColor,
                        }}
                        className={`h-10 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                          isSelected
                            ? 'ring-2 ring-purple-500 scale-105 shadow-md z-10'
                            : 'opacity-90 hover:opacity-100'
                        }`}
                      >
                        {k.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WALLPAPERS & GLASS */}
          {tab === 'wallpapers' && (
            <div className="space-y-4">
              {/* Photo Upload & Wallpaper Actions */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-black/20 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    নিজের ছবি আপলোড করুন (Upload Photo)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    ফোন বা পিসি থেকে যেকোনো ছবি ব্যাকগ্রাউন্ড বানান
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>আপলোড</span>
                  </button>

                  {bgImage && (
                    <button
                      type="button"
                      onClick={handleRemoveWallpaper}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 font-semibold text-xs hover:bg-rose-500/20 active:scale-95 transition-all"
                    >
                      মুছুন
                    </button>
                  )}
                </div>
              </div>

              {/* Glassmorphism & Sliders */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-black/20 border border-slate-200 dark:border-slate-700/60 space-y-3">
                {/* Blur Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span>গ্লাস ব্লার (Background Blur):</span>
                    <span className="text-purple-600 font-mono">{bgBlur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="16"
                    value={bgBlur}
                    onChange={(e) => setBgBlur(Number(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>

                {/* Dimmer / Opacity Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span>ডার্ক ডিমার / আলো কমানো (Overlay Darkness):</span>
                    <span className="text-purple-600 font-mono">{bgOverlayOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="85"
                    value={bgOverlayOpacity}
                    onChange={(e) => setBgOverlayOpacity(Number(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Curated Wallpaper Gallery */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  এইচডি কিউরেটেড ওয়ালপেপার গ্যালারি (Curated Wallpapers):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {CURATED_WALLPAPERS.map((wp) => {
                    const isSelected = bgImage === wp.url;
                    return (
                      <button
                        key={wp.id}
                        type="button"
                        onClick={() => handleSelectWallpaper(wp)}
                        className={`relative rounded-2xl overflow-hidden aspect-video border group transition-all active:scale-[0.98] ${
                          isSelected
                            ? 'border-purple-500 ring-2 ring-purple-500/50'
                            : 'border-slate-200 dark:border-slate-700/60'
                        }`}
                      >
                        <img
                          src={wp.url}
                          alt={wp.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-2">
                          <span className="text-[11px] font-bold text-white truncate">
                            {wp.name}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Studio Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-700/60 bg-white/50 dark:bg-black/20 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>ডিফল্টে ফিরুন (Reset)</span>
          </button>

          <button
            type="button"
            onClick={handleApplyCustom}
            className="px-6 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold transition-colors shadow-md flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>প্রয়োগ করুন (Apply Studio Theme)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
