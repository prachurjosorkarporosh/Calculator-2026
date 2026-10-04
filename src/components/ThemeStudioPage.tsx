/**
 * Dedicated Full-Page Theme & Wallpaper Studio (থিম ও ওয়ালপেপার স্টুডিও পেজ)
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Prachurjo Calculator. All rights reserved.
 *
 * Full Redesign & Features:
 * - 21+ Curated Unique Themes arranged in rich aspect-4/3 interactive preview cards
 * - 100+ HD Curated Wallpapers categorized (Nature, AMOLED, Cyberpunk, Cosmos, 3D Glass, Pastel, Anime, Architecture)
 * - Custom Wallpaper Upload with automatic optimization and persistent storage (IndexedDB + LocalStorage)
 * - Real-time working interactive calculator in the live preview panel (0-9, ., +, −, ×, ÷, C, ⌫, =) with real math evaluation, audio & haptics
 * - Dynamic button glass blur (0px-24px), button opacity (20%-100%), wallpaper blur, and overlay dimmer sliders
 * - Custom color studio with 1-click quick presets
 * - Fully responsive design with mobile preview toggle
 */

import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  Check,
  Palette,
  Sliders,
  Image as ImageIcon,
  Upload,
  Sparkles,
  Trash2,
  Search,
  SlidersHorizontal,
  Dices,
  Eye,
  EyeOff,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import {
  THEME_PALETTES,
  THEME_CATEGORIES,
  ThemePalette,
} from '../data/themes.ts';
import {
  CURATED_WALLPAPERS,
  WALLPAPER_CATEGORIES,
  WallpaperOption,
} from '../data/wallpapers.ts';
import {
  CustomWallpaperManager,
  CustomUploadedWallpaper,
  optimizeWallpaperImage,
} from '../data/customWallpapers.ts';
import { CustomThemeColors } from '../types.ts';
import { ThemePreviewCard } from './ThemePreviewCard.tsx';
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
  // Navigation tabs: 'presets' | 'wallpapers' | 'glass' | 'custom-colors'
  const [tab, setTab] = useState<'presets' | 'wallpapers' | 'glass' | 'custom-colors'>('presets');
  const [themeCategory, setThemeCategory] = useState<string>('All');
  const [wallpaperCategory, setWallpaperCategory] = useState<string>('All');
  const [themeSearch, setThemeSearch] = useState('');
  const [wallpaperSearch, setWallpaperSearch] = useState('');
  const [showMobilePreview, setShowMobilePreview] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active theme tracking
  const [currentThemeId, setCurrentThemeId] = useState<string>(activeThemeId);

  // Find currently active palette object
  const activePresetTheme = useMemo<ThemePalette>(() => {
    const found = THEME_PALETTES.find((t) => t.id === currentThemeId);
    return found || THEME_PALETTES[0];
  }, [currentThemeId]);

  // Color & Glass Customization States
  const [bg, setBg] = useState<string>(customColors?.bg || activePresetTheme.bg);
  const [surface, setSurface] = useState<string>(activePresetTheme.surface);
  const [numberBg, setNumberBg] = useState<string>(
    customColors?.numberBg || activePresetTheme.numberBg
  );
  const [numberText, setNumberText] = useState<string>(
    activePresetTheme.numberText || '#FFFFFF'
  );
  const [operatorBg, setOperatorBg] = useState<string>(
    customColors?.operatorBg || activePresetTheme.operatorBg
  );
  const [operatorText, setOperatorText] = useState<string>(
    activePresetTheme.operatorText || '#FFFFFF'
  );
  const [equalsBg, setEqualsBg] = useState<string>(
    customColors?.equalsBg || activePresetTheme.equalsBg
  );
  const [equalsText, setEqualsText] = useState<string>(
    activePresetTheme.equalsText || '#FFFFFF'
  );
  const [actionBg, setActionBg] = useState<string>(
    customColors?.actionBg || activePresetTheme.actionBg || 'rgba(239, 68, 68, 0.35)'
  );
  const [textColor, setTextColor] = useState<string>(
    customColors?.textColor || activePresetTheme.displayText
  );

  // Wallpaper & Glass state
  const [bgImage, setBgImage] = useState<string | undefined>(
    customColors?.bgImage || activePresetTheme.bgImage
  );
  const [bgBlur, setBgBlur] = useState<number>(
    customColors?.bgBlur ?? activePresetTheme.bgBlur ?? 2
  );
  const [bgOverlayOpacity, setBgOverlayOpacity] = useState<number>(
    customColors?.bgOverlayOpacity ?? activePresetTheme.bgOverlayOpacity ?? 35
  );
  const [buttonBlur, setButtonBlur] = useState<number>(
    customColors?.buttonBlur ?? 8
  );
  const [buttonOpacity, setButtonOpacity] = useState<number>(
    customColors?.buttonOpacity ?? 95
  );
  const [animatedBg, setAnimatedBg] = useState<boolean>(
    customColors?.animatedBg ?? activePresetTheme.animatedBg ?? false
  );

  // Saved uploaded wallpapers from device
  const [savedWallpapers, setSavedWallpapers] = useState<CustomUploadedWallpaper[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live Calculator Engine State
  const [calcExpression, setCalcExpression] = useState('128 × 256');
  const [calcResult, setCalcResult] = useState('32,768');

  // Load saved device wallpapers on mount
  useEffect(() => {
    setSavedWallpapers(CustomWallpaperManager.getSavedWallpapers());
  }, []);

  // Show a brief toast notification
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  }, []);

  // Synchronize state when user selects a preset theme
  const handleSelectPreset = useCallback((theme: ThemePalette) => {
    triggerHaptic('medium');
    playKeypressSound('operator');
    setCurrentThemeId(theme.id);
    setBg(theme.bg);
    setSurface(theme.surface);
    setNumberBg(theme.numberBg);
    setNumberText(theme.numberText);
    setOperatorBg(theme.operatorBg);
    setOperatorText(theme.operatorText);
    setEqualsBg(theme.equalsBg);
    setEqualsText(theme.equalsText);
    setActionBg(theme.actionBg || 'rgba(239, 68, 68, 0.35)');
    setTextColor(theme.displayText);
    setBgImage(theme.bgImage);
    setBgBlur(theme.bgBlur ?? 2);
    setBgOverlayOpacity(theme.bgOverlayOpacity ?? 35);
    setAnimatedBg(theme.animatedBg ?? false);

    onSelectThemeId(theme.id);
    showToast(`"${theme.name}" থিম সক্রিয় হয়েছে!`);
  }, [onSelectThemeId, showToast]);

  // Apply custom wallpaper (curated or uploaded)
  const handleSelectWallpaper = useCallback((url: string) => {
    triggerHaptic('medium');
    playKeypressSound('number');
    setBgImage(url);

    const custom: CustomThemeColors = {
      bg,
      numberBg,
      operatorBg,
      scientificBg: operatorBg,
      actionBg,
      backspaceBg: 'rgba(245, 158, 11, 0.3)',
      equalsBg,
      textColor,
      bgImage: url,
      bgBlur,
      bgOverlayOpacity,
      isGlassmorphic: true,
      animatedBg: false,
      buttonBlur,
      buttonOpacity,
      buttonGlassmorphic: true,
    };
    setCurrentThemeId('custom');
    onSaveCustomColors(custom);
    onSelectThemeId('custom');
    showToast('ওয়ালপেপার ক্যালকুলেটরে প্রয়োগ করা হয়েছে!');
  }, [
    bg,
    numberBg,
    operatorBg,
    actionBg,
    equalsBg,
    textColor,
    bgBlur,
    bgOverlayOpacity,
    buttonBlur,
    buttonOpacity,
    onSaveCustomColors,
    onSelectThemeId,
    showToast,
  ]);

  // Remove wallpaper and revert to clean background
  const handleRemoveWallpaper = useCallback(() => {
    triggerHaptic('light');
    setBgImage(undefined);
    if (currentThemeId === 'custom') {
      const custom: CustomThemeColors = {
        bg,
        numberBg,
        operatorBg,
        scientificBg: operatorBg,
        actionBg,
        backspaceBg: 'rgba(245, 158, 11, 0.3)',
        equalsBg,
        textColor,
        bgImage: undefined,
        bgBlur: 0,
        bgOverlayOpacity: 0,
        isGlassmorphic: true,
        buttonBlur,
        buttonOpacity,
      };
      onSaveCustomColors(custom);
    }
    showToast('ওয়ালপেপার বাদ দেওয়া হয়েছে।');
  }, [
    currentThemeId,
    bg,
    numberBg,
    operatorBg,
    actionBg,
    equalsBg,
    textColor,
    buttonBlur,
    buttonOpacity,
    onSaveCustomColors,
    showToast,
  ]);

  // Handle image upload from device
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      triggerHaptic('medium');
      const optimizedDataUrl = await optimizeWallpaperImage(file);
      const name = file.name.replace(/\.[^/.]+$/, '').slice(0, 25);

      const updated = CustomWallpaperManager.saveWallpaper(name, optimizedDataUrl);
      setSavedWallpapers(updated);
      handleSelectWallpaper(optimizedDataUrl);
      triggerHaptic('heavy');
      showToast('ছবি সফলভাবে আপলোড ও সেট হয়েছে!');
    } catch (err) {
      console.error('Wallpaper upload error:', err);
      showToast('ওয়ালপেপার আপলোড ব্যর্থ হয়েছে।');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Delete saved uploaded wallpaper
  const handleDeleteSavedWallpaper = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('medium');
    const updated = CustomWallpaperManager.deleteWallpaper(id);
    setSavedWallpapers(updated);
    showToast('সংরক্ষিত ওয়ালপেপার মুছে ফেলা হয়েছে।');
  };

  // Surprise Me / Random Theme button
  const handleRandomTheme = useCallback(() => {
    triggerHaptic('heavy');
    const randomIndex = Math.floor(Math.random() * THEME_PALETTES.length);
    const randomTheme = THEME_PALETTES[randomIndex];
    handleSelectPreset(randomTheme);
  }, [handleSelectPreset]);

  // Save current settings and return to calculator
  const handleSaveAndExit = useCallback(() => {
    triggerHaptic('heavy');
    if (currentThemeId === 'custom' || bgImage) {
      const custom: CustomThemeColors = {
        bg,
        numberBg,
        operatorBg,
        scientificBg: operatorBg,
        actionBg,
        backspaceBg: 'rgba(245, 158, 11, 0.3)',
        equalsBg,
        textColor,
        bgImage,
        bgBlur,
        bgOverlayOpacity,
        isGlassmorphic: true,
        animatedBg,
        buttonBlur,
        buttonOpacity,
        buttonGlassmorphic: true,
      };
      onSaveCustomColors(custom);
      onSelectThemeId('custom');
    } else {
      onSelectThemeId(currentThemeId);
    }
    onBackToCalculator();
  }, [
    currentThemeId,
    bgImage,
    bg,
    numberBg,
    operatorBg,
    actionBg,
    equalsBg,
    textColor,
    bgBlur,
    bgOverlayOpacity,
    animatedBg,
    buttonBlur,
    buttonOpacity,
    onSaveCustomColors,
    onSelectThemeId,
    onBackToCalculator,
  ]);

  // Real mini-calculator keypad press logic
  const handleKeypadPress = useCallback((key: string, type: 'number' | 'operator' | 'action' | 'equals') => {
    triggerHaptic('light');
    playKeypressSound(type);

    if (key === 'C') {
      setCalcExpression('');
      setCalcResult('0');
      return;
    }

    if (key === '⌫') {
      setCalcExpression((prev) => {
        const trimmed = prev.trim();
        const next = trimmed.slice(0, -1).trim();
        return next;
      });
      return;
    }

    if (key === '=') {
      try {
        if (!calcExpression) return;
        // Safe evaluation of standard arithmetic
        const sanitized = calcExpression
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/−/g, '-');
        // Only evaluate if it contains valid arithmetic chars
        if (/^[0-9+\-*/. ()]+$/.test(sanitized)) {
          // eslint-disable-next-line no-eval
          const val = Function(`'use strict'; return (${sanitized})`)();
          if (typeof val === 'number' && !isNaN(val)) {
            setCalcResult(Number(val.toFixed(8)).toLocaleString('en-US'));
            triggerHaptic('medium');
          }
        }
      } catch {
        setCalcResult('Error');
      }
      return;
    }

    // Append operator or digit
    setCalcExpression((prev) => {
      if (['+', '−', '×', '÷'].includes(key)) {
        if (!prev) return `0 ${key} `;
        return `${prev} ${key} `;
      }
      if (key === '.') {
        if (!prev) return '0.';
        return `${prev}.`;
      }
      return `${prev}${key}`;
    });
  }, [calcExpression]);

  // Filtered preset themes by category & search
  const filteredThemes = useMemo(() => {
    return THEME_PALETTES.filter((t) => {
      const matchesCategory =
        themeCategory === 'All' || t.category === themeCategory;
      const matchesSearch =
        t.name.toLowerCase().includes(themeSearch.toLowerCase()) ||
        (t.nameBn && t.nameBn.toLowerCase().includes(themeSearch.toLowerCase())) ||
        t.category.toLowerCase().includes(themeSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [themeCategory, themeSearch]);

  // Filtered curated wallpapers by category & search
  const filteredWallpapers = useMemo(() => {
    return CURATED_WALLPAPERS.filter((w) => {
      const matchesCategory =
        wallpaperCategory === 'All' || w.category === wallpaperCategory;
      const matchesSearch =
        w.name.toLowerCase().includes(wallpaperSearch.toLowerCase()) ||
        w.nameBn.toLowerCase().includes(wallpaperSearch.toLowerCase()) ||
        w.category.toLowerCase().includes(wallpaperSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [wallpaperCategory, wallpaperSearch]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0D14] text-slate-100 flex flex-col overflow-hidden select-none font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-slate-900/95 border border-purple-500/40 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 backdrop-blur-md animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="shrink-0 h-14 border-b border-slate-800/80 bg-[#101320]/95 backdrop-blur-xl px-3 sm:px-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onBackToCalculator();
            }}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            title="Back to Calculator (ক্যালকুলেটরে ফিরে যান)"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-2">
              <span className="p-1 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-sm">
                <Palette className="w-3.5 h-3.5" />
              </span>
              <span>থিম ও ওয়ালপেপার স্টুডিও (Themes & Wallpapers)</span>
            </h1>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              ২১+ কিউরেটেড থিম · ১০০+ এইচডি ওয়ালপেপার · লাইভ ইন্টারঅ্যাক্টিভ প্রিভিউ
            </p>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2">
          {/* Random Surprise Button */}
          <button
            type="button"
            onClick={handleRandomTheme}
            className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:text-purple-200 text-xs font-medium border border-purple-500/30 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            title="Random Theme (র্যান্ডম থিম ট্রাই করুন)"
          >
            <Dices className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Surprise Me</span>
          </button>

          {/* Mobile Preview Toggle */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setShowMobilePreview((v) => !v);
            }}
            className="sm:hidden px-2.5 py-1.5 rounded-xl bg-white/5 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 border border-white/10"
          >
            {showMobilePreview ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                <span>প্রিভিউ বন্ধ</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span>প্রিভিউ চালু</span>
              </>
            )}
          </button>

          {/* Apply & Exit Button */}
          <button
            type="button"
            onClick={handleSaveAndExit}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>প্রয়োগ করুন (Done)</span>
          </button>
        </div>
      </header>

      {/* Main Split Layout: Left Controls Catalog + Right Live Working Preview */}
      <div className="flex-1 flex flex-col sm:flex-row overflow-hidden relative">
        {/* Left Section: Tabs and Grid Contents */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-slate-800/80">
          {/* Main Segmented Navigation Bar */}
          <div className="shrink-0 flex items-center gap-2 px-3 sm:px-6 pt-3 pb-2 border-b border-slate-800/80 bg-[#0C0F1A] overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setTab('presets');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                tab === 'presets'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/50'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>২১টি থিম (Themes Catalog)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                {THEME_PALETTES.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setTab('wallpapers');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                tab === 'wallpapers'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>১০০+ ওয়ালপেপার ও কাস্টম (Wallpapers)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                100+
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setTab('glass');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                tab === 'glass'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/50'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>কাঁচ ও ব্লার অ্যাডজাস্টার (Glass & Blur)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setTab('custom-colors');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                tab === 'custom-colors'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-950/50'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>কাস্টম কালার (Colors)</span>
            </button>
          </div>

          {/* TAB 1: THEMES CATALOG (Arranged like Wallpapers in rich cards) */}
          {tab === 'presets' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Category Filter Chips & Search Bar */}
              <div className="p-3 sm:px-6 bg-[#0E111C]/80 border-b border-slate-800/80 space-y-2.5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={themeSearch}
                    onChange={(e) => setThemeSearch(e.target.value)}
                    placeholder="Search 21 themes (OLED, Neon, Pastel, Retro, Nature, Glass...)"
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/50 border border-slate-700/60 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500"
                  />
                  {themeSearch && (
                    <button
                      type="button"
                      onClick={() => setThemeSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Categories */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
                  {THEME_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setThemeCategory(cat);
                      }}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        themeCategory === cat
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Themes Grid */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredThemes.map((t: ThemePalette) => {
                  const isSelected = currentThemeId === t.id;
                  return (
                    <ThemePreviewCard
                      key={t.id}
                      theme={t}
                      isSelected={isSelected}
                      onSelect={() => handleSelectPreset(t)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: 100+ WALLPAPERS & CUSTOM DEVICE UPLOAD */}
          {tab === 'wallpapers' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Category Chips, Search & Upload Action */}
              <div className="p-3 sm:px-6 bg-[#0E111C]/80 border-b border-slate-800/80 space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={wallpaperSearch}
                      onChange={(e) => setWallpaperSearch(e.target.value)}
                      placeholder="Search 100+ HD wallpapers (পাহাড়, সমুদ্র, নিয়ন, স্পেস...)"
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/50 border border-slate-700/60 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                    />
                    {wallpaperSearch && (
                      <button
                        type="button"
                        onClick={() => setWallpaperSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Device File Upload Button */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      fileInputRef.current?.click();
                    }}
                    disabled={isUploading}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all shrink-0 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'প্রসেসিং...' : 'ছবি আপলোড'}</span>
                  </button>
                </div>

                {/* Wallpaper Categories */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
                  {WALLPAPER_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setWallpaperCategory(cat);
                      }}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        wallpaperCategory === cat
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wallpapers List: Uploaded + Curated Grid */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-6">
                {/* 1. Saved Uploaded Wallpapers (if any) */}
                {savedWallpapers.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-emerald-400 tracking-wider uppercase flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>আমার আপলোডকৃত ওয়ালপেপারসমূহ (Saved Device Wallpapers)</span>
                      </h4>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {savedWallpapers.length}টি সংরক্ষিত
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {savedWallpapers.map((w) => {
                        const isActive = bgImage === w.dataUrl;
                        return (
                          <div
                            key={w.id}
                            onClick={() => handleSelectWallpaper(w.dataUrl)}
                            className={`group relative rounded-2xl overflow-hidden aspect-4/3 cursor-pointer border transition-all ${
                              isActive
                                ? 'border-emerald-500 ring-4 ring-emerald-500/40 shadow-xl scale-[1.02]'
                                : 'border-slate-800 hover:border-slate-600'
                            }`}
                          >
                            <img
                              src={w.dataUrl}
                              alt={w.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-2.5">
                              <span className="text-xs font-bold text-white truncate">
                                {w.name}
                              </span>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-[9px] text-emerald-400 font-semibold">
                                  {isActive ? '✓ সক্রিয়' : 'ট্যাপ করুন'}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteSavedWallpaper(w.id, e)}
                                  title="Delete saved wallpaper"
                                  className="w-5 h-5 rounded-md bg-black/60 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. 100+ Curated HD Wallpapers */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-300 tracking-wider uppercase flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                      <span>১০০+ কিউরেটেড এইচডি ওয়ালপেপার ({filteredWallpapers.length})</span>
                    </h4>
                    {bgImage && (
                      <button
                        type="button"
                        onClick={handleRemoveWallpaper}
                        className="text-[11px] text-red-400 hover:text-red-300 underline font-medium cursor-pointer"
                      >
                        ওয়ালপেপার বাদ দিন (Remove Wallpaper)
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {filteredWallpapers.map((w: WallpaperOption) => {
                      const isActive = bgImage === w.url;
                      return (
                        <div
                          key={w.id}
                          onClick={() => handleSelectWallpaper(w.url)}
                          className={`group relative rounded-2xl overflow-hidden aspect-4/3 cursor-pointer border transition-all ${
                            isActive
                              ? 'border-emerald-500 ring-4 ring-emerald-500/40 shadow-xl scale-[1.02]'
                              : 'border-slate-800 hover:border-slate-600 hover:scale-[1.01]'
                          }`}
                        >
                          <img
                            src={w.url}
                            alt={w.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-2.5">
                            <span className="text-xs font-bold text-white truncate drop-shadow-sm">
                              {w.name}
                            </span>
                            <span className="text-[10px] text-slate-300 truncate drop-shadow-sm">
                              {w.nameBn}
                            </span>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-[9px] text-purple-300 font-medium">
                                {w.category}
                              </span>
                              {isActive && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500 text-white font-bold flex items-center gap-1">
                                  ✓ Active
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BUTTON GLASS BLUR & OPACITY CONTROLS */}
          {tab === 'glass' && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              <div className="bg-[#121524] rounded-3xl p-4 sm:p-6 border border-slate-800/80 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-blue-400" />
                    <span>কাঁচের বোতামের ব্লার ও স্বচ্ছতা অ্যাডজাস্টার (Button Glass & Blur)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    বোতামগুলোর রঙ নির্বাচিত থিমের সাথে স্বয়ংক্রিয়ভাবে মিলে যায়। নিচে থেকে বোতামের কাঁচের ব্লার এবং অস্বচ্ছতা নিয়ন্ত্রণ করুন।
                  </p>
                </div>

                {/* 1. Button Blur Slider (0px - 24px) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-200">Button Backdrop Blur (বোতামের কাঁচের ব্লার)</span>
                    <span className="text-blue-400 font-mono text-sm">{buttonBlur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    step="1"
                    value={buttonBlur}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setButtonBlur(val);
                      triggerHaptic('light');
                    }}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>0px (Sharp Solid)</span>
                    <span>8px (Balanced Glass)</span>
                    <span>16px (Frosted)</span>
                    <span>24px (Heavy Glass)</span>
                  </div>
                </div>

                {/* 2. Button Opacity Slider (20% - 100%) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-200">Button Opacity (বোতামের অস্বচ্ছতা)</span>
                    <span className="text-emerald-400 font-mono text-sm">{buttonOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="5"
                    value={buttonOpacity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setButtonOpacity(val);
                      triggerHaptic('light');
                    }}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>20% (Ultra Transparent)</span>
                    <span>65% (Modern Frosted)</span>
                    <span>100% (Solid Color)</span>
                  </div>
                </div>

                {/* 3. Wallpaper Blur Slider (0px - 20px) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-200">Wallpaper Blur (ওয়ালপেপার ব্লার)</span>
                    <span className="text-purple-400 font-mono text-sm">{bgBlur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={bgBlur}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setBgBlur(val);
                      triggerHaptic('light');
                    }}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>

                {/* 4. Wallpaper Dimmer Overlay (0% - 85%) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-200">Dark Dimmer Overlay (কালো ওভারলে ডিমার)</span>
                    <span className="text-amber-400 font-mono text-sm">{bgOverlayOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="85"
                    step="5"
                    value={bgOverlayOpacity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setBgOverlayOpacity(val);
                      triggerHaptic('light');
                    }}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>

                {/* Quick 1-Click Glass Presets */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400">
                    ১-ক্লিক প্রিসেটসমূহ (Quick Glass Presets):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setButtonBlur(0);
                        setButtonOpacity(100);
                        setBgBlur(0);
                        showToast('Sharp Solid প্রিসেট প্রয়োগ হয়েছে');
                      }}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-center font-medium border border-white/10 cursor-pointer active:scale-95 transition-all"
                    >
                      Sharp Solid
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setButtonBlur(8);
                        setButtonOpacity(85);
                        setBgBlur(2);
                        showToast('Soft Glass প্রিসেট প্রয়োগ হয়েছে');
                      }}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-center font-medium border border-white/10 cursor-pointer active:scale-95 transition-all"
                    >
                      Soft Glass
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setButtonBlur(16);
                        setButtonOpacity(70);
                        setBgBlur(4);
                        showToast('Heavy Frosted প্রিসেট প্রয়োগ হয়েছে');
                      }}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-center font-medium border border-white/10 cursor-pointer active:scale-95 transition-all"
                    >
                      Heavy Frosted
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setButtonBlur(22);
                        setButtonOpacity(45);
                        setBgBlur(6);
                        showToast('Ultra Clear প্রিসেট প্রয়োগ হয়েছে');
                      }}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-center font-medium border border-white/10 cursor-pointer active:scale-95 transition-all"
                    >
                      Ultra Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOM COLORS PALETTE STUDIO */}
          {tab === 'custom-colors' && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className="bg-[#121524] rounded-3xl p-4 sm:p-6 border border-slate-800/80 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Palette className="w-4 h-4 text-amber-400" />
                      <span>কাস্টম কালার প্যালেট স্টুডিও (Custom Color Studio)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      প্রতিটি বাটন ও ব্যাকগ্রাউন্ডের রঙ সরাসরি নিজের মতো তৈরি করুন।
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      handleSelectPreset(THEME_PALETTES[0]);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-[11px] font-medium flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>রিসেট</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Background Color */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-black/40 border border-slate-800">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>অ্যাপ ব্যাকগ্রাউন্ড (Background)</span>
                      <span className="font-mono text-[11px] text-slate-400">{bg}</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={bg.startsWith('#') ? bg : '#0B0D19'}
                        onChange={(e) => {
                          setBg(e.target.value);
                          setCurrentThemeId('custom');
                        }}
                        className="w-10 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={bg}
                        onChange={(e) => {
                          setBg(e.target.value);
                          setCurrentThemeId('custom');
                        }}
                        className="flex-1 px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Number Buttons Color */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-black/40 border border-slate-800">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>সংখ্যা বোতাম (Number Buttons)</span>
                      <span className="font-mono text-[11px] text-slate-400">{numberBg}</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={numberBg.startsWith('#') ? numberBg : '#1E293B'}
                        onChange={(e) => {
                          setNumberBg(e.target.value);
                          setCurrentThemeId('custom');
                        }}
                        className="w-10 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={numberBg}
                        onChange={(e) => {
                          setNumberBg(e.target.value);
                          setCurrentThemeId('custom');
                        }}
                        className="flex-1 px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Operator Buttons Color */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-black/40 border border-slate-800">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>অপারেটর বোতাম (+, −, ×, ÷)</span>
                      <span className="font-mono text-[11px] text-slate-400">{operatorBg}</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={operatorBg.startsWith('#') ? operatorBg : '#0284C7'}
                        onChange={(e) => {
                          setOperatorBg(e.target.value);
                          setCurrentThemeId('custom');
                        }}
                        className="w-10 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={operatorBg}
                        onChange={(e) => {
                          setOperatorBg(e.target.value);
                          setCurrentThemeId('custom');
                        }}
                        className="flex-1 px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Equals Button Color */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-black/40 border border-slate-800">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>সমান বাটন (= Equals)</span>
                      <span className="font-mono text-[11px] text-slate-400">{equalsBg}</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={equalsBg.startsWith('#') ? equalsBg : '#087A36'}
                        onChange={(e) => {
                          setEqualsBg(e.target.value);
                          setCurrentThemeId('custom');
                        }}
                        className="w-10 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={equalsBg}
                        onChange={(e) => {
                          setEqualsBg(e.target.value);
                          setCurrentThemeId('custom');
                        }}
                        className="flex-1 px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Text / Display Color */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-black/40 border border-slate-800">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>টেক্সট ও ডিসপ্লে কালার (Text)</span>
                      <span className="font-mono text-[11px] text-slate-400">{textColor}</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={textColor.startsWith('#') ? textColor : '#FFFFFF'}
                        onChange={(e) => {
                          setTextColor(e.target.value);
                          setCurrentThemeId('custom');
                        }}
                        className="w-10 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={textColor}
                        onChange={(e) => {
                          setTextColor(e.target.value);
                          setCurrentThemeId('custom');
                        }}
                        className="flex-1 px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Real-time Interactive Working Calculator Live Preview */}
        <div
          className={`w-full sm:w-[320px] md:w-[360px] lg:w-[400px] shrink-0 border-t sm:border-t-0 sm:border-l border-slate-800/80 bg-[#080A10] flex flex-col items-center justify-center p-4 relative ${
            showMobilePreview ? 'block' : 'hidden sm:flex'
          }`}
        >
          {/* Header indicator */}
          <div className="w-full flex items-center justify-between mb-3 px-1">
            <div className="text-[11px] font-bold text-slate-300 tracking-wider uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>লাইভ ক্যালকুলেটর প্রিভিউ (Live Preview)</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/60 border border-purple-500/30 text-purple-200 font-semibold truncate max-w-[140px]">
              {currentThemeId === 'custom' ? 'Custom Theme' : activePresetTheme.name}
            </span>
          </div>

          {/* Mini Phone Frame Mockup */}
          <div
            className={`w-full max-w-[340px] rounded-[36px] overflow-hidden shadow-2xl border-4 border-slate-800/80 relative flex flex-col p-4 transition-all duration-300 ${
              animatedBg ? 'animate-aurora-mesh' : ''
            }`}
            style={{
              backgroundColor: bg,
              backgroundImage: bgImage ? `url(${bgImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Wallpaper Overlay Dimmer & Blur */}
            {bgImage && (
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-200"
                style={{
                  backgroundColor: `rgba(0, 0, 0, ${bgOverlayOpacity / 100})`,
                  backdropFilter: bgBlur > 0 ? `blur(${bgBlur}px)` : undefined,
                  WebkitBackdropFilter: bgBlur > 0 ? `blur(${bgBlur}px)` : undefined,
                }}
              />
            )}

            {/* Subtle Phone Notch / Speaker Mockup */}
            <div className="relative z-10 w-20 h-3 rounded-full bg-black/40 mx-auto mb-2 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-black/60 mr-2" />
              <div className="w-8 h-1 rounded-full bg-black/60" />
            </div>

            {/* Display Area */}
            <div
              className="relative z-10 text-right py-4 px-3 mb-3 rounded-2xl transition-colors duration-200"
              style={{
                backgroundColor: surface ? `${surface}80` : 'transparent',
              }}
            >
              <div
                className="text-xs font-mono tracking-tight opacity-75 min-h-[16px] truncate"
                style={{ color: textColor }}
              >
                {calcExpression || '0'}
              </div>
              <div
                className="text-3xl font-bold tracking-tight mt-1 truncate font-mono"
                style={{ color: textColor }}
              >
                {calcResult}
              </div>
            </div>

            {/* Interactive Keypad (4 columns x 4 rows) */}
            <div className="relative z-10 grid grid-cols-4 gap-2">
              {[
                { label: 'C', variant: 'action' as const },
                { label: '÷', variant: 'operator' as const },
                { label: '×', variant: 'operator' as const },
                { label: '⌫', variant: 'action' as const },
                { label: '7', variant: 'number' as const },
                { label: '8', variant: 'number' as const },
                { label: '9', variant: 'number' as const },
                { label: '−', variant: 'operator' as const },
                { label: '4', variant: 'number' as const },
                { label: '5', variant: 'number' as const },
                { label: '6', variant: 'number' as const },
                { label: '+', variant: 'operator' as const },
                { label: '1', variant: 'number' as const },
                { label: '2', variant: 'number' as const },
                { label: '3', variant: 'number' as const },
                { label: '=', variant: 'equals' as const },
              ].map((btn, idx) => {
                let btnBg = numberBg;
                let btnText = numberText || textColor;

                if (btn.variant === 'operator') {
                  btnBg = operatorBg;
                  btnText = operatorText || textColor;
                } else if (btn.variant === 'equals') {
                  btnBg = equalsBg;
                  btnText = equalsText || '#FFFFFF';
                } else if (btn.variant === 'action') {
                  btnBg = actionBg;
                  btnText = '#FFFFFF';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleKeypadPress(btn.label, btn.variant)}
                    style={{
                      backgroundColor: btnBg,
                      color: btnText,
                      backdropFilter: buttonBlur > 0 ? `blur(${buttonBlur}px)` : undefined,
                      WebkitBackdropFilter:
                        buttonBlur > 0 ? `blur(${buttonBlur}px)` : undefined,
                      opacity: Math.max(0.2, buttonOpacity / 100),
                    }}
                    className="h-11 rounded-2xl border border-white/15 font-bold text-sm flex items-center justify-center shadow-sm active:scale-95 transition-transform cursor-pointer"
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>

            {/* Bottom mini home bar */}
            <div className="relative z-10 w-28 h-1 rounded-full bg-white/40 mx-auto mt-4" />
          </div>

          {/* Quick Apply Button on Bottom of Preview */}
          <button
            type="button"
            onClick={handleSaveAndExit}
            className="w-full max-w-[340px] mt-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 hover:opacity-95 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>এই থিমটি ক্যালকুলেটরে প্রয়োগ করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
