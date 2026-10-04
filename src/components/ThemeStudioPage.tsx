/**
 * Dedicated Full-Page Theme Studio (থিম ও কালার স্টুডিও পেজ)
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Calculator. All rights reserved.
 *
 * Supercharged Features:
 * - 18+ Curated Themes categorized just like wallpapers (OLED & Dark, Neon & Cyber, Glass & Aurora, Pastel & Light, Retro & Tech, Nature & Earth)
 * - 100+ HD Curated Wallpapers categorized (Nature, AMOLED, Cyberpunk, Cosmos, 3D Glass, Pastel, Anime, Architecture)
 * - Custom Wallpaper Upload with automatic optimization and persistent device storage (IndexedDB + LocalStorage)
 * - My Saved Wallpapers library: switch, re-apply, and manage uploaded wallpapers anytime
 * - Automatic theme-matching buttons with dedicated Button Glass Blur (0px-24px) & Button Opacity sliders
 * - Live interactive responsive preview calculator
 */

import React, { useState, useRef, useMemo, useEffect } from 'react';
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
  Sparkles,
  Trash2,
  Search,
  SlidersHorizontal,
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
  const [tab, setTab] = useState<'presets' | 'wallpapers' | 'glass'>('presets');
  const [themeCategory, setThemeCategory] = useState<string>('All');
  const [wallpaperCategory, setWallpaperCategory] = useState<string>('All');
  const [themeSearch, setThemeSearch] = useState('');
  const [wallpaperSearch, setWallpaperSearch] = useState('');
  const [showMobilePreview, setShowMobilePreview] = useState(true);

  // Custom theme & styling states
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
    customColors?.buttonBlur ?? 8
  );
  const [buttonOpacity, setButtonOpacity] = useState<number>(
    customColors?.buttonOpacity ?? 95
  );

  // Saved uploaded wallpapers
  const [savedWallpapers, setSavedWallpapers] = useState<CustomUploadedWallpaper[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Mini calculator test formula
  const [previewFormula, setPreviewFormula] = useState('128 × 256');
  const [previewResult, setPreviewResult] = useState('32,768');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved custom wallpapers from device on mount
  useEffect(() => {
    const list = CustomWallpaperManager.getSavedWallpapers();
    setSavedWallpapers(list);
  }, []);

  // Filtered preset themes by category & search
  const filteredThemes = useMemo(() => {
    return THEME_PALETTES.filter((t) => {
      const matchesCategory =
        themeCategory === 'All' || t.category === themeCategory;
      const matchesSearch =
        t.name.toLowerCase().includes(themeSearch.toLowerCase()) ||
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

  // Apply custom colors & glass settings to calculator
  const handleApplyCustom = (overrideImage?: string) => {
    triggerHaptic('medium');
    const finalImage = overrideImage !== undefined ? overrideImage : bgImage;
    const custom: CustomThemeColors = {
      bg,
      numberBg,
      operatorBg,
      scientificBg,
      actionBg,
      backspaceBg,
      equalsBg,
      textColor,
      bgImage: finalImage,
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
  };

  // Handle uploading custom wallpaper
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadStatus('প্রসেস করা হচ্ছে...');
      const optimizedDataUrl = await optimizeWallpaperImage(file);
      const name = file.name.replace(/\.[^/.]+$/, '').slice(0, 25);

      const updated = CustomWallpaperManager.saveWallpaper(name, optimizedDataUrl);
      setSavedWallpapers(updated);
      setBgImage(optimizedDataUrl);
      setUploadStatus('ওয়ালপেপার সংরক্ষিত ও সেট হয়েছে!');
      triggerHaptic('heavy');

      // Auto-apply custom theme with this wallpaper
      handleApplyCustom(optimizedDataUrl);

      setTimeout(() => setUploadStatus(null), 3000);
    } catch (err) {
      console.error('Wallpaper upload error:', err);
      setUploadStatus('ওয়ালপেপার আপলোড ব্যর্থ হয়েছে।');
      setTimeout(() => setUploadStatus(null), 3000);
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
  };

  // Quick select a curated or saved wallpaper
  const handleSelectWallpaper = (url: string) => {
    triggerHaptic('light');
    setBgImage(url);
    handleApplyCustom(url);
  };

  // Remove active wallpaper
  const handleRemoveWallpaper = () => {
    triggerHaptic('light');
    setBgImage(undefined);
    handleApplyCustom('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0D14] text-slate-100 flex flex-col overflow-hidden select-none font-sans">
      {/* Top Header */}
      <header className="shrink-0 h-14 border-b border-slate-800 bg-[#111422]/90 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onBackToCalculator();
            }}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
            title="Back to Calculator"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-400" />
              <span>থিম ও ওয়ালপেপার স্টুডিও (Theme Studio)</span>
            </h1>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              ১৮+ থিম · ১০০+ এইচডি ওয়ালপেপার · কাঁচের বোতামের ব্লার অ্যাডজাস্টার
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Mobile Preview Toggle */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setShowMobilePreview((v) => !v);
            }}
            className="sm:hidden px-2.5 py-1.5 rounded-lg bg-white/5 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5"
          >
            {showMobilePreview ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                <span>প্রিভিউ লুকান</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span>প্রিভিউ দেখুন</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleApplyCustom()}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Apply Done</span>
          </button>
        </div>
      </header>

      {/* Main Body: Left Configuration + Right Live Interactive Preview */}
      <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
        {/* Left Section: Tabs and Controls */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-slate-800">
          {/* Main Navigation Tabs */}
          <div className="shrink-0 flex items-center gap-1.5 px-3 sm:px-6 pt-3 pb-2 border-b border-slate-800/80 bg-[#0E101A] overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setTab('presets');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                tab === 'presets'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>থিমসমূহ (Themes)</span>
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
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                tab === 'wallpapers'
                  ? 'bg-emerald-600 text-white shadow-md'
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
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                tab === 'glass'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>বোতামের ব্লার ও কাঁচ (Button Blur)</span>
            </button>
          </div>

          {/* TAB 1: PRESET THEMES (Categorized just like wallpapers) */}
          {tab === 'presets' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Category Chips & Search */}
              <div className="p-3 sm:px-6 bg-[#0E111C]/60 border-b border-slate-800 space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={themeSearch}
                    onChange={(e) => setThemeSearch(e.target.value)}
                    placeholder="Search themes (OLED, Neon, Pastel, Retro...)"
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black/40 border border-slate-700/60 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
                  {THEME_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setThemeCategory(cat);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
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
              <div className="flex-1 overflow-y-auto p-3 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredThemes.map((t: ThemePalette) => {
                  const isSelected = activeThemeId === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => {
                        triggerHaptic('medium');
                        onSelectThemeId(t.id);
                      }}
                      className={`p-3.5 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between ${
                        isSelected
                          ? 'bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/30 shadow-lg'
                          : 'bg-[#141724] border-slate-800/80 hover:border-slate-700 hover:bg-[#181C2E]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                            {t.name}
                          </div>
                          <div className="text-[10px] text-purple-400 font-medium mt-0.5">
                            {t.category}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      {/* Swatch Preview Bar */}
                      <div className="flex items-center gap-1.5 p-2 rounded-xl bg-black/40 border border-white/5">
                        <div
                          className="w-5 h-5 rounded-lg border border-white/20 shrink-0"
                          style={{ backgroundColor: t.bg }}
                          title="Background"
                        />
                        <div
                          className="flex-1 h-5 rounded-lg border border-white/10 flex items-center justify-center text-[10px] font-bold"
                          style={{
                            backgroundColor: t.numberBg,
                            color: t.numberText,
                          }}
                        >
                          7
                        </div>
                        <div
                          className="flex-1 h-5 rounded-lg border border-white/10 flex items-center justify-center text-[10px] font-bold"
                          style={{
                            backgroundColor: t.operatorBg,
                            color: t.operatorText,
                          }}
                        >
                          ×
                        </div>
                        <div
                          className="flex-1 h-5 rounded-lg border border-white/10 flex items-center justify-center text-[10px] font-bold"
                          style={{
                            backgroundColor: t.equalsBg,
                            color: t.equalsText,
                          }}
                        >
                          =
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: 100+ WALLPAPERS & CUSTOM UPLOAD */}
          {tab === 'wallpapers' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Category Chips & Search */}
              <div className="p-3 sm:px-6 bg-[#0E111C]/60 border-b border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={wallpaperSearch}
                      onChange={(e) => setWallpaperSearch(e.target.value)}
                      placeholder="Search 100+ wallpapers (পাহাড়, নিয়ন, সমুদ্র, আকাশ...)"
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black/40 border border-slate-700/60 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Upload Button */}
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
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'আপলোড হচ্ছে...' : 'ছবি আপলোড'}</span>
                  </button>
                </div>

                {uploadStatus && (
                  <div className="text-[11px] font-medium text-emerald-400 bg-emerald-950/30 px-3 py-1 rounded-lg border border-emerald-800/40 animate-in fade-in">
                    {uploadStatus}
                  </div>
                )}

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
                      className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
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

              {/* Wallpaper Grid with Uploaded section */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-5">
                {/* 1. My Saved Uploaded Wallpapers (if any) */}
                {savedWallpapers.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-emerald-400 tracking-wider uppercase flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>আমার সংরক্ষিত ওয়ালপেপারসমূহ (My Saved Wallpapers)</span>
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
                                ? 'border-emerald-500 ring-2 ring-emerald-500/40 shadow-lg'
                                : 'border-slate-800 hover:border-slate-600'
                            }`}
                          >
                            <img
                              src={w.dataUrl}
                              alt={w.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5">
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-300 tracking-wider uppercase flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                      <span>১০০+ কিউরেটেড এইচডি ওয়ালপেপার ({filteredWallpapers.length})</span>
                    </h4>
                    {bgImage && (
                      <button
                        type="button"
                        onClick={handleRemoveWallpaper}
                        className="text-[11px] text-red-400 hover:text-red-300 underline font-medium"
                      >
                        ওয়ালপেপার বাদ দিন (Remove)
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
                              ? 'border-emerald-500 ring-2 ring-emerald-500/40 shadow-lg'
                              : 'border-slate-800 hover:border-slate-600'
                          }`}
                        >
                          <img
                            src={w.url}
                            alt={w.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-2.5">
                            <span className="text-xs font-bold text-white truncate">
                              {w.name}
                            </span>
                            <span className="text-[10px] text-slate-300 truncate">
                              {w.nameBn}
                            </span>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-[9px] text-purple-300 font-medium">
                                {w.category}
                              </span>
                              {isActive && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500 text-white font-bold">
                                  Active
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
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              <div className="bg-[#141724] rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-blue-400" />
                    <span>বোতামের কাঁচের ব্লার ও স্বচ্ছতা (Button Glass & Blur)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    বোতামগুলোর কালার থিমের সাথে স্বয়ংক্রিয়ভাবে মিলে যাবে। আপনি নিচে থেকে ব্লার ও স্বচ্ছতা বাড়াতে-কমাতে পারবেন।
                  </p>
                </div>

                {/* 1. Button Blur Slider (0px - 24px) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-200">Button Backdrop Blur (বোতামের ব্লার)</span>
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
                    <span>8px (Balanced)</span>
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
                    <span>60% (Medium Glass)</span>
                    <span>100% (Solid)</span>
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
                    <span className="text-slate-200">Dark Dimmer Overlay (কালো ওভারলে)</span>
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

                {/* Quick Presets */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400">
                    ১-ক্লিক প্রিসেট (Quick Glass Presets):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setButtonBlur(0);
                        setButtonOpacity(100);
                        setBgBlur(0);
                      }}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-center font-medium"
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
                      }}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-center font-medium"
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
                      }}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-center font-medium"
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
                      }}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-center font-medium"
                    >
                      Ultra Clear
                    </button>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => handleApplyCustom()}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                  >
                    Save & Apply Glass Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Live Interactive Responsive Preview */}
        <div
          className={`w-full sm:w-[320px] md:w-[360px] lg:w-[400px] shrink-0 border-t sm:border-t-0 sm:border-l border-slate-800 bg-[#090B12] flex flex-col items-center justify-center p-4 relative ${
            showMobilePreview ? 'block' : 'hidden sm:flex'
          }`}
        >
          <div className="text-[11px] font-bold text-slate-400 mb-2 tracking-wider uppercase flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span>লাইভ প্রিভিউ (Live Preview)</span>
          </div>

          {/* Mini Calculator Container */}
          <div
            className="w-full max-w-[340px] rounded-3xl overflow-hidden shadow-2xl border border-white/15 relative flex flex-col p-4"
            style={{
              backgroundColor: bg,
              backgroundImage: bgImage ? `url(${bgImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Wallpaper Overlay Dimmer */}
            {bgImage && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundColor: `rgba(0, 0, 0, ${bgOverlayOpacity / 100})`,
                  backdropFilter: bgBlur > 0 ? `blur(${bgBlur}px)` : undefined,
                }}
              />
            )}

            {/* Display Area Mockup */}
            <div className="relative z-10 text-right py-4 px-2 mb-3">
              <div
                className="text-xs font-mono tracking-tight opacity-75"
                style={{ color: textColor }}
              >
                {previewFormula}
              </div>
              <div
                className="text-3xl font-bold tracking-tight mt-1 truncate"
                style={{ color: textColor }}
              >
                {previewResult}
              </div>
            </div>

            {/* Keypad Mockup */}
            <div className="relative z-10 grid grid-cols-4 gap-2">
              {[
                { label: 'C', variant: 'action' },
                { label: '÷', variant: 'operator' },
                { label: '×', variant: 'operator' },
                { label: '⌫', variant: 'action' },
                { label: '7', variant: 'number' },
                { label: '8', variant: 'number' },
                { label: '9', variant: 'number' },
                { label: '−', variant: 'operator' },
                { label: '4', variant: 'number' },
                { label: '5', variant: 'number' },
                { label: '6', variant: 'number' },
                { label: '+', variant: 'operator' },
                { label: '1', variant: 'number' },
                { label: '2', variant: 'number' },
                { label: '3', variant: 'number' },
                { label: '=', variant: 'equals' },
              ].map((btn, idx) => {
                let btnBg = numberBg;
                let btnText = textColor;

                if (btn.variant === 'operator') {
                  btnBg = operatorBg;
                } else if (btn.variant === 'equals') {
                  btnBg = equalsBg;
                  btnText = '#FFFFFF';
                } else if (btn.variant === 'action') {
                  btnBg = actionBg;
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      playKeypressSound('number');
                      if (btn.label === 'C') {
                        setPreviewFormula('');
                        setPreviewResult('0');
                      } else if (btn.label === '=') {
                        setPreviewFormula('512 × 2');
                        setPreviewResult('1,024');
                      } else {
                        setPreviewFormula((prev) => `${prev} ${btn.label}`);
                      }
                    }}
                    style={{
                      backgroundColor: btnBg,
                      color: btnText,
                      backdropFilter: buttonBlur > 0 ? `blur(${buttonBlur}px)` : undefined,
                      WebkitBackdropFilter:
                        buttonBlur > 0 ? `blur(${buttonBlur}px)` : undefined,
                      opacity: Math.max(0.2, buttonOpacity / 100),
                    }}
                    className="h-11 rounded-2xl border border-white/20 font-bold text-sm flex items-center justify-center shadow-sm active:scale-95 transition-transform cursor-pointer"
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
