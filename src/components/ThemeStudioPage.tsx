/**
 * Dedicated Full-Page Theme Studio (থিম ও কালার স্টুডিও পেজ)
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.pro.bd/
 * © 2026 Calculator. All rights reserved.
 *
 * Fully Responsive with Perfected Mobile & Desktop Sizing:
 * - Ultra-clean responsive header that never wraps or clips on 320px - 400px mobile phones
 * - Adaptive interactive preview with mobile collapse/expand toggle
 * - Perfectly proportioned preset cards, touch targets, and color controls
 * - Ergonomic key-by-key studio mapper with responsive grids
 * - Compact HD wallpaper cards and touch-friendly sliders
 */

import React, { useState, useRef, useMemo } from 'react';
import {
  ArrowLeft,
  Check,
  Palette,
  Sliders,
  Image as ImageIcon,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
  Layers,
  Copy,
  Wand2,
  Sparkles,
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

interface ThemeStudioPageProps {
  activeThemeId: string;
  customColors: CustomThemeColors | null;
  onSelectThemeId: (themeId: string) => void;
  onSaveCustomColors: (colors: CustomThemeColors) => void;
  onBackToCalculator: () => void;
}

export const ThemeStudioPage: React.FC<ThemeStudioPageProps> = ({
  activeThemeId,
  customColors,
  onSelectThemeId,
  onSaveCustomColors,
  onBackToCalculator,
}) => {
  const [tab, setTab] = useState<'presets' | 'studio' | 'keys' | 'wallpapers'>('presets');
  const [presetCategory, setPresetCategory] = useState<'all' | 'dark' | 'light' | 'photo' | 'special'>('all');
  const [showMobilePreview, setShowMobilePreview] = useState(true);

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
  const [buttonBlur, setButtonBlur] = useState<number>(
    customColors?.buttonBlur ?? 4
  );
  const [buttonGlassmorphic, setButtonGlassmorphic] = useState<boolean>(
    customColors?.buttonGlassmorphic ?? true
  );
  const [buttonOpacity, setButtonOpacity] = useState<number>(
    customColors?.buttonOpacity ?? 100
  );
  const [buttonBgImage, setButtonBgImage] = useState<string | undefined>(
    customColors?.buttonBgImage
  );

  // Individual key overrides
  const [keyBgOverrides, setKeyBgOverrides] = useState<Record<string, string>>(
    customColors?.keyBgOverrides || {}
  );
  const [selectedKeyForEditing, setSelectedKeyForEditing] = useState<string>('7');

  // Interactive Live Preview Formula & Result
  const [previewFormula, setPreviewFormula] = useState('240 + 60 × 2');
  const [previewResult, setPreviewResult] = useState('360');
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
          t.id === 'crimson-gaming' ||
          t.id === 'desert-luxury'
      );
    }
    return THEME_PALETTES;
  }, [presetCategory]);

  // Apply custom colors and return
  const handleApplyAndReturn = () => {
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
      buttonBlur,
      buttonGlassmorphic,
      buttonOpacity,
      buttonBgImage,
      keyBgOverrides,
    };
    onSaveCustomColors(custom);
    onSelectThemeId('custom');
    onBackToCalculator();
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
      { bg: '#0B0D1B', num: '#1A1D36', op: '#6366F1', sci: '#312E81', eq: '#10B981', txt: '#FFFFFF' },
      { bg: '#0D1117', num: '#161B22', op: '#238636', sci: '#1F6FEB', eq: '#2EA043', txt: '#E6EDF3' },
      { bg: '#180A18', num: '#2D142C', op: '#801336', sci: '#C72C41', eq: '#EE4540', txt: '#FFFFFF' },
      { bg: '#051923', num: '#003554', op: '#006494', sci: '#0582CA', eq: '#00A6FB', txt: '#FFFFFF' },
      { bg: '#1A181B', num: '#2E282A', op: '#FF8811', sci: '#392F5A', eq: '#9DD9D2', txt: '#FFF8F0' },
      { bg: '#050B05', num: '#0C1C0C', op: '#0F2E14', sci: '#091A0D', eq: '#00FF66', txt: '#00FF66' },
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
      setPreviewFormula('240 + 60 × 2');
      setPreviewResult('360');
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

  const getKeyColor = (keyId: string, defaultColor: string) => {
    return keyBgOverrides[keyId] || defaultColor;
  };

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
    { id: 'MC', label: 'MC', defaultBg: scientificBg },
    { id: 'MR', label: 'MR', defaultBg: scientificBg },
    { id: 'M-', label: 'M−', defaultBg: scientificBg },
    { id: 'M+', label: 'M+', defaultBg: scientificBg },
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
    <div className="min-h-screen w-full bg-[#E5E9F0] dark:bg-[#0B0D0F] flex flex-col transition-colors">
      {/* Top Studio Page Bar - Responsive & Optimized */}
      <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-[#181A20]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onBackToCalculator();
            }}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-slate-100 font-semibold text-xs sm:text-sm transition-all active:scale-95 shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-[11px] sm:text-xs">ক্যালকুলেটর</span>
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-white leading-tight truncate">
                Theme Studio
              </h1>
              <p className="text-[9px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate hidden xs:block">
                ১৮+ থিম ও কালার ল্যাব
              </p>
            </div>
          </div>
        </div>

        {/* Header Action Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Mobile Preview Toggle Button */}
          <button
            type="button"
            onClick={() => setShowMobilePreview(!showMobilePreview)}
            title={showMobilePreview ? 'প্রিভিউ লুকান (Hide Preview)' : 'প্রিভিউ দেখুন (Show Preview)'}
            className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            {showMobilePreview ? <EyeOff className="w-4 h-4 text-purple-500" /> : <Eye className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={handleSurpriseMe}
            title="Surprise Me (র‍্যান্ডম সুন্দর কালার প্যালেট)"
            className="flex items-center gap-1 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold transition-all active:scale-95"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Surprise</span>
          </button>

          <button
            type="button"
            onClick={handleCopyThemeJson}
            title="Copy Theme JSON"
            className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            {copiedCode ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          <button
            type="button"
            onClick={handleApplyAndReturn}
            className="flex items-center gap-1 px-3 sm:px-4 py-1.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 whitespace-nowrap"
          >
            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>প্রয়োগ (Apply)</span>
          </button>
        </div>
      </header>

      {/* Main Studio Body Workspace - Perfected Responsive Grid */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-2.5 sm:p-5 lg:p-6 flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* LEFT COLUMN: LIVE INTERACTIVE PREVIEW CALCULATOR */}
        {showMobilePreview && (
          <div className="w-full lg:w-72 xl:w-80 shrink-0">
            <div className="lg:sticky lg:top-20 space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 px-1">
                <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                  <Eye className="w-3.5 h-3.5" />
                  লাইভ প্রিভিউ (Live Preview)
                </span>
                <span className="text-[10px] text-slate-400">বাটন চেপে টেস্ট করুন</span>
              </div>

              {/* Responsive Live Interactive Calculator Mockup */}
              <div
                style={{
                  backgroundColor: bg,
                  backgroundImage: bgImage ? `url(${bgImage})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                className="w-full rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-xl border border-slate-300/40 dark:border-white/10 relative overflow-hidden flex flex-col justify-between transition-all"
              >
                {/* Blur Dimmer Overlay */}
                {bgImage && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundColor: `rgba(0, 0, 0, ${bgOverlayOpacity / 100})`,
                      backdropFilter: `blur(${bgBlur}px)`,
                    }}
                  />
                )}

                {/* Display Area */}
                <div className="relative z-10 text-right space-y-0.5 mb-2.5">
                  <div className="text-[11px] sm:text-xs text-slate-400 font-mono truncate">{previewFormula}</div>
                  <div
                    style={{ color: textColor }}
                    className="text-xl sm:text-2xl font-extrabold tracking-tight truncate"
                  >
                    {previewResult}
                  </div>
                </div>

                {/* Live Interactive Keypad */}
                <div className="relative z-10 grid grid-cols-4 gap-1.5 sm:gap-2">
                  {[
                    { label: 'AC', id: 'AC', isAction: true },
                    { label: '()', id: '()', isAction: true },
                    { label: '%', id: '%', isAction: true },
                    { label: '÷', id: '÷', isOp: true },
                    { label: '7', id: '7' },
                    { label: '8', id: '8' },
                    { label: '9', id: '9' },
                    { label: '×', id: '×', isOp: true },
                    { label: '4', id: '4' },
                    { label: '5', id: '5' },
                    { label: '6', id: '6' },
                    { label: '−', id: '−', isOp: true },
                    { label: '1', id: '1' },
                    { label: '2', id: '2' },
                    { label: '3', id: '3' },
                    { label: '+', id: '+', isOp: true },
                    { label: '0', id: '0' },
                    { label: '.', id: '.' },
                    { label: '⌫', id: '⌫', isAction: true },
                    { label: '=', id: '=', isEq: true },
                  ].map((k) => {
                    const buttonBg = k.isEq
                      ? getKeyColor('=', equalsBg)
                      : k.isOp
                      ? getKeyColor(k.id, operatorBg)
                      : k.isAction
                      ? getKeyColor(k.id, actionBg)
                      : getKeyColor(k.id, numberBg);

                    return (
                      <button
                        key={k.id}
                        type="button"
                        onClick={() => handleTestBtn(k.label)}
                        style={{
                          backgroundColor: buttonBg,
                          color: textColor,
                          backdropFilter:
                            buttonBlur > 0
                              ? `blur(${buttonBlur}px)`
                              : buttonGlassmorphic
                              ? 'blur(8px)'
                              : undefined,
                          WebkitBackdropFilter:
                            buttonBlur > 0
                              ? `blur(${buttonBlur}px)`
                              : buttonGlassmorphic
                              ? 'blur(8px)'
                              : undefined,
                          opacity: Math.max(0.2, buttonOpacity / 100),
                        }}
                        className={`h-8 sm:h-9 md:h-10 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center shadow-sm active:scale-90 transition-all cursor-pointer ${
                          buttonGlassmorphic || buttonBlur > 0 ? 'border border-white/20' : ''
                        }`}
                      >
                        {k.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT COLUMN: STUDIO WORKSPACE & TABS */}
        <div className="flex-1 bg-white/90 dark:bg-[#181A20]/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col min-w-0">
          {/* Studio Navigation Tabs - Horizontally Scrollable on Mobile */}
          <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-700/60 pb-2.5 sm:pb-3 mb-3 sm:mb-4 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setTab('presets');
              }}
              className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                tab === 'presets'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>থিম সম্ভার (Presets)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setTab('studio');
              }}
              className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                tab === 'studio'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>কালার ল্যাব (Color Lab)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setTab('keys');
              }}
              className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                tab === 'keys'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>বাটন স্টুডিও (Key Studio)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setTab('wallpapers');
              }}
              className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                tab === 'wallpapers'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>ওয়ালপেপার (Wallpapers)</span>
            </button>
          </div>

          {/* TAB 1: PRESETS */}
          {tab === 'presets' && (
            <div className="space-y-3 sm:space-y-4">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
                {[
                  { id: 'all', label: 'সকল থিম (All 18+)' },
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
                    className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all ${
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {filteredPresets.map((palette) => {
                  const isSelected = activeThemeId === palette.id;
                  return (
                    <button
                      key={palette.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        onSelectThemeId(palette.id);
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
                      className={`relative p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border text-left flex items-center justify-between transition-all active:scale-[0.99] shadow-sm cursor-pointer ${
                        isSelected
                          ? 'border-purple-500 bg-purple-500/10 dark:bg-purple-500/20 ring-2 ring-purple-500/30'
                          : 'border-slate-200 dark:border-slate-700/60 bg-white dark:bg-black/20 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        {/* Mini Color Swatch Pill */}
                        <div
                          style={{ backgroundColor: palette.bg }}
                          className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl border border-white/20 shadow-inner flex items-center justify-center p-1 shrink-0 overflow-hidden relative"
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
                              className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-white/20"
                            />
                            <span
                              style={{ backgroundColor: palette.operatorBg }}
                              className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-white/20"
                            />
                            <span
                              style={{ backgroundColor: palette.equalsBg }}
                              className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-white/20"
                            />
                          </div>
                        </div>

                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                            {palette.name}
                          </div>
                          <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span>{palette.isDark ? 'Dark Theme' : 'Light Theme'}</span>
                            {palette.bgImage && <span className="text-purple-500 font-bold">• Photo</span>}
                            {palette.animatedBg && <span className="text-blue-500 font-bold">• Animated</span>}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: COLOR LAB */}
          {tab === 'studio' && (
            <div className="space-y-3 sm:space-y-4">
              {/* Harmonic Quick Presets */}
              <div className="space-y-1.5 sm:space-y-2">
                <span className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300">
                  ওয়ান-ট্যাপ হারমোনি প্যালেট (One-Click Palettes):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
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
                      className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-black/20 border border-slate-200 dark:border-slate-700/60 hover:border-purple-500 flex items-center justify-between text-left text-xs font-bold cursor-pointer"
                    >
                      <span className="truncate">{p.name}</span>
                      <div className="flex -space-x-1 shrink-0 ml-1">
                        <span style={{ backgroundColor: p.op }} className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-white/20" />
                        <span style={{ backgroundColor: p.eq }} className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-white/20" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Master Controllers */}
              <div className="space-y-2.5 sm:space-y-3 pt-1">
                <span className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300">
                  প্রধান কালার নিয়ন্ত্রণ (Master Color Controllers):
                </span>

                {/* Background */}
                <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white dark:bg-black/20 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm font-bold">ক্যালকুলেটর ব্যাকগ্রাউন্ড (Background)</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500">মূল ফ্রেমের ব্যাকগ্রাউন্ড রঙ</div>
                  </div>
                  <input
                    type="color"
                    value={bg.startsWith('#') ? bg : '#0B0D19'}
                    onChange={(e) => setBg(e.target.value)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl cursor-pointer bg-transparent border-0"
                  />
                </div>

                {/* Number Keys */}
                <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white dark:bg-black/20 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm font-bold">সংখ্যা বাটন (Number Keys 0-9)</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500">সকল সাধারণ সংখ্যা বাটনের রঙ</div>
                  </div>
                  <input
                    type="color"
                    value={numberBg.startsWith('#') ? numberBg : '#1A1D2E'}
                    onChange={(e) => setNumberBg(e.target.value)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl cursor-pointer bg-transparent border-0"
                  />
                </div>

                {/* Operator Keys */}
                <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white dark:bg-black/20 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm font-bold">অপারেটর বাটন (+, −, ×, ÷)</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500">যোগ, বিয়োগ, গুণ ও ভাগের বাটন</div>
                  </div>
                  <input
                    type="color"
                    value={operatorBg.startsWith('#') ? operatorBg : '#6366F1'}
                    onChange={(e) => setOperatorBg(e.target.value)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl cursor-pointer bg-transparent border-0"
                  />
                </div>

                {/* Equals Button */}
                <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white dark:bg-black/20 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm font-bold">সমান বাটন (Equals Button =)</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500">ফলাফল বের করার বাটন</div>
                  </div>
                  <input
                    type="color"
                    value={equalsBg.startsWith('#') ? equalsBg : '#087A36'}
                    onChange={(e) => setEqualsBg(e.target.value)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl cursor-pointer bg-transparent border-0"
                  />
                </div>

                {/* Text Color */}
                <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white dark:bg-black/20 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm font-bold">টেক্সট ও ডিজিট কালার (Text Color)</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500">স্ক্রিনের লেখার রঙ</div>
                  </div>
                  <input
                    type="color"
                    value={textColor.startsWith('#') ? textColor : '#FFFFFF'}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl cursor-pointer bg-transparent border-0"
                  />
                </div>
              </div>

              {/* Button Glassmorphism & Background Blur Control */}
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-black/20 border border-slate-200 dark:border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                      <span>বাটন ব্লার ও ব্যাকগ্রাউন্ড গ্লাস (Button Glass Blur)</span>
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500">
                      বাটনের পেছনের ফ্রস্টেড ব্লার ও স্বচ্ছতা নিয়ন্ত্রণ করুন
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setButtonGlassmorphic(!buttonGlassmorphic)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      buttonGlassmorphic
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-black/10 dark:bg-white/10 text-slate-500'
                    }`}
                  >
                    {buttonGlassmorphic ? 'Glass ON' : 'Glass OFF'}
                  </button>
                </div>

                {/* Button Blur Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span>বাটন ব্লার তীব্রতা (Button Blur):</span>
                    <span className="text-purple-600 font-mono font-bold">{buttonBlur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={buttonBlur}
                    onChange={(e) => setButtonBlur(Number(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
                  />
                </div>

                {/* Button Opacity Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span>বাটন অপাসিটি / দৃশ্যমানতা (Button Opacity):</span>
                    <span className="text-purple-600 font-mono font-bold">{buttonOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={buttonOpacity}
                    onChange={(e) => setButtonOpacity(Number(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: KEY-BY-KEY STUDIO */}
          {tab === 'keys' && (
            <div className="space-y-3 sm:space-y-4">
              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-purple-500/10 border border-purple-500/20 text-[11px] sm:text-xs text-purple-700 dark:text-purple-300">
                💡 <strong>বাটন-বাই-বাটন স্টুডিও:</strong> নিচের কিপ্যাড থেকে যেকোনো বাটনে ট্যাপ করুন এবং সেটির জন্য আলাদা রঙ নির্ধারণ করুন।
              </div>

              {/* Selected Key Display & Controls */}
              <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white dark:bg-black/20 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-purple-600 text-white font-bold text-base sm:text-lg flex items-center justify-center shadow-md">
                    {selectedKeyForEditing}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      বাটন: [{selectedKeyForEditing}]
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500">
                      নিচের রঙ বা কালার পিকার থেকে পছন্দ করুন
                    </div>
                  </div>
                </div>

                <input
                  type="color"
                  value={
                    (keyBgOverrides[selectedKeyForEditing] || '#6366F1').startsWith('#')
                      ? keyBgOverrides[selectedKeyForEditing] || '#6366F1'
                      : '#6366F1'
                  }
                  onChange={(e) => handleSetKeyColor(selectedKeyForEditing, e.target.value)}
                  className="w-9 h-9 rounded-xl cursor-pointer bg-transparent border-0"
                />
              </div>

              {/* Quick Color Swatches */}
              <div className="space-y-1.5">
                <span className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300">
                  দ্রুত রঙের সোয়াচ (Quick Swatches):
                </span>
                <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
                  {quickColors.map((swatch) => (
                    <button
                      key={swatch.label}
                      type="button"
                      title={swatch.label}
                      onClick={() => handleSetKeyColor(selectedKeyForEditing, swatch.color)}
                      style={{ backgroundColor: swatch.color }}
                      className="h-8 sm:h-9 rounded-lg sm:rounded-xl border border-white/20 shadow-sm active:scale-90 transition-transform cursor-pointer"
                    />
                  ))}
                </div>
              </div>

              {/* Interactive Keypad Visual Map */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300">
                    বাটন সিলেক্টর ম্যাপ (Tap to select):
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setKeyBgOverrides({});
                    }}
                    className="text-[10px] sm:text-[11px] text-rose-500 font-semibold hover:underline"
                  >
                    রিসেট বাটন (Reset Keys)
                  </button>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-black/10 dark:bg-black/30 border border-slate-200 dark:border-slate-700/60 max-h-52 overflow-y-auto">
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
                        className={`h-8 sm:h-9 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
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

          {/* TAB 4: WALLPAPERS */}
          {tab === 'wallpapers' && (
            <div className="space-y-3 sm:space-y-4">
              {/* Photo Upload & Wallpaper Actions */}
              <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white dark:bg-black/20 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-2.5">
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    নিজের ছবি আপলোড (Upload Photo)
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500">
                    মোবাইল বা পিসি থেকে ছবি ব্যাকগ্রাউন্ড বানান
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
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
                    className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-semibold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>আপলোড</span>
                  </button>

                  {bgImage && (
                    <button
                      type="button"
                      onClick={() => setBgImage(undefined)}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 font-semibold text-xs hover:bg-rose-500/20 active:scale-95 transition-all"
                    >
                      মুছুন
                    </button>
                  )}
                </div>
              </div>

              {/* Glass Sliders */}
              <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white dark:bg-black/20 border border-slate-200 dark:border-slate-700/60 space-y-2.5">
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
                    className="w-full accent-purple-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
                  />
                </div>

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
                    className="w-full accent-purple-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
                  />
                </div>
              </div>

              {/* Curated Wallpapers */}
              <div className="space-y-1.5">
                <span className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300">
                  এইচডি কিউরেটেড ওয়ালপেপার গ্যালারি (Curated Wallpapers):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                  {CURATED_WALLPAPERS.map((wp) => {
                    const isSelected = bgImage === wp.url;
                    return (
                      <button
                        key={wp.id}
                        type="button"
                        onClick={() => handleSelectWallpaper(wp)}
                        className={`relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[16/10] border group transition-all active:scale-[0.98] cursor-pointer ${
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
                          <span className="text-[10px] sm:text-xs font-bold text-white truncate">
                            {wp.name}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-purple-600 text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Footer Reset & Apply */}
          <div className="mt-auto pt-4 sm:pt-5 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs gap-2">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="flex items-center gap-1 sm:gap-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer text-[11px] sm:text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>ডিফল্টে ফিরুন (Reset)</span>
            </button>

            <button
              type="button"
              onClick={handleApplyAndReturn}
              className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>ক্যালকুলেটরে প্রয়োগ করুন (Save & Apply)</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
