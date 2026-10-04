/**
 * Advanced Theme Studio & Wallpaper Customizer Modal
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Prachurjo Calculator. All rights reserved.
 *
 * Implements:
 * - 18+ Curated Themes categorized just like wallpapers (OLED & Dark, Neon & Cyber, Glass & Aurora, Pastel & Light, Retro & Tech, Nature & Earth)
 * - 100+ HD Curated Wallpapers (Nature, AMOLED, Cyberpunk, Cosmos, 3D Glass, Pastel, Anime, Architecture)
 * - Custom Wallpaper Upload with automatic optimization and persistent device storage (IndexedDB + LocalStorage)
 * - My Saved Wallpapers library: switch, re-apply, and manage uploaded wallpapers anytime
 * - Button Glass Blur (0px - 24px) & Button Opacity sliders
 * - Live interactive mini-calculator preview
 */

import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  X,
  Check,
  Palette,
  Sliders,
  Image as ImageIcon,
  Upload,
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
import { ThemePreviewCard } from './ThemePreviewCard.tsx';
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
  const [tab, setTab] = useState<'presets' | 'wallpapers' | 'glass'>('presets');
  const [themeCategory, setThemeCategory] = useState<string>('All');
  const [wallpaperCategory, setWallpaperCategory] = useState<string>('All');
  const [themeSearch, setThemeSearch] = useState('');
  const [wallpaperSearch, setWallpaperSearch] = useState('');

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
    if (isOpen) {
      const list = CustomWallpaperManager.getSavedWallpapers();
      setSavedWallpapers(list);
    }
  }, [isOpen]);

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

  if (!isOpen) return null;

  // Apply custom colors & glass settings
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 sm:p-4 animate-in fade-in duration-150 backdrop-blur-xs">
      <div className="w-full max-w-4xl bg-[#0F121C] text-slate-100 rounded-3xl shadow-2xl border border-slate-700/60 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-800 flex items-center justify-between bg-black/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-white">
                Themes & Wallpapers Studio
              </h3>
              <p className="text-[11px] text-slate-400">
                ১৮+ থিম · ১০০+ এইচডি ওয়ালপেপার · কাঁচের বোতামের ব্লার
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-4 sm:px-6 pt-3 pb-2 flex gap-2 border-b border-slate-800 bg-black/10 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setTab('presets');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              tab === 'presets'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>থিমসমূহ ({THEME_PALETTES.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setTab('wallpapers');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              tab === 'wallpapers'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>১০০+ ওয়ালপেপার ও আপলোড</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setTab('glass');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              tab === 'glass'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>বোতামের ব্লার ও কাঁচ</span>
          </button>
        </div>

        {/* Content Body with Left controls and Right Mini preview */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left: Tab Content */}
          <div className="flex-1 flex flex-col overflow-hidden border-b md:border-b-0 md:border-r border-slate-800">
            {/* TAB 1: PRESETS */}
            {tab === 'presets' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-3 bg-[#0B0D16] border-b border-slate-800 space-y-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={themeSearch}
                      onChange={(e) => setThemeSearch(e.target.value)}
                      placeholder="Search themes..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black/40 border border-slate-700/60 text-xs text-white placeholder-slate-500 outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-0.5">
                    {THEME_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          triggerHaptic('light');
                          setThemeCategory(cat);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                          themeCategory === cat
                            ? 'bg-purple-600 text-white'
                            : 'bg-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredThemes.map((t: ThemePalette) => (
                    <ThemePreviewCard
                      key={t.id}
                      theme={t}
                      isSelected={activeThemeId === t.id}
                      onSelect={() => {
                        triggerHaptic('medium');
                        setBg(t.bg);
                        setNumberBg(t.numberBg);
                        setOperatorBg(t.operatorBg);
                        setEqualsBg(t.equalsBg);
                        setTextColor(t.displayText);
                        setBgImage(t.bgImage);
                        setBgBlur(t.bgBlur ?? 2);
                        setBgOverlayOpacity(t.bgOverlayOpacity ?? 35);
                        onSelectThemeId(t.id);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: WALLPAPERS */}
            {tab === 'wallpapers' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-3 bg-[#0B0D16] border-b border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={wallpaperSearch}
                        onChange={(e) => setWallpaperSearch(e.target.value)}
                        placeholder="Search 100+ wallpapers..."
                        className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black/40 border border-slate-700/60 text-xs text-white placeholder-slate-500 outline-none"
                      />
                    </div>
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
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shrink-0 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading ? 'আপলোড...' : 'ছবি আপলোড'}</span>
                    </button>
                  </div>

                  {uploadStatus && (
                    <div className="text-[11px] font-medium text-emerald-400 bg-emerald-950/30 px-2.5 py-0.5 rounded-md">
                      {uploadStatus}
                    </div>
                  )}

                  <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-0.5">
                    {WALLPAPER_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          triggerHaptic('light');
                          setWallpaperCategory(cat);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                          wallpaperCategory === cat
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
                  {/* Saved User Wallpapers */}
                  {savedWallpapers.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-bold text-emerald-400 tracking-wider uppercase flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>আমার সংরক্ষিত ওয়ালপেপারসমূহ ({savedWallpapers.length})</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {savedWallpapers.map((w) => {
                          const isActive = bgImage === w.dataUrl;
                          return (
                            <div
                              key={w.id}
                              onClick={() => handleSelectWallpaper(w.dataUrl)}
                              className={`group relative rounded-xl overflow-hidden aspect-4/3 cursor-pointer border ${
                                isActive
                                  ? 'border-emerald-500 ring-2 ring-emerald-500/40'
                                  : 'border-slate-800 hover:border-slate-600'
                              }`}
                            >
                              <img
                                src={w.dataUrl}
                                alt={w.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2">
                                <span className="text-[11px] font-bold text-white truncate">
                                  {w.name}
                                </span>
                                <div className="flex items-center justify-between mt-0.5">
                                  <span className="text-[9px] text-emerald-400 font-semibold">
                                    {isActive ? 'Active' : 'Apply'}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => handleDeleteSavedWallpaper(w.id, e)}
                                    className="w-4 h-4 rounded bg-black/60 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center"
                                  >
                                    <Trash2 className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 100+ Curated HD Wallpapers */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300 tracking-wider uppercase">
                        কিউরেটেড ওয়ালপেপার ({filteredWallpapers.length})
                      </span>
                      {bgImage && (
                        <button
                          type="button"
                          onClick={handleRemoveWallpaper}
                          className="text-[10px] text-red-400 hover:underline"
                        >
                          Remove Wallpaper
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {filteredWallpapers.map((w: WallpaperOption) => {
                        const isActive = bgImage === w.url;
                        return (
                          <div
                            key={w.id}
                            onClick={() => handleSelectWallpaper(w.url)}
                            className={`group relative rounded-xl overflow-hidden aspect-4/3 cursor-pointer border ${
                              isActive
                                ? 'border-emerald-500 ring-2 ring-emerald-500/40'
                                : 'border-slate-800 hover:border-slate-600'
                            }`}
                          >
                            <img
                              src={w.url}
                              alt={w.name}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-2">
                              <span className="text-[11px] font-bold text-white truncate">
                                {w.name}
                              </span>
                              <div className="flex items-center justify-between mt-0.5">
                                <span className="text-[9px] text-purple-300 font-medium">
                                  {w.category}
                                </span>
                                {isActive && (
                                  <span className="text-[8px] px-1 rounded bg-emerald-500 text-white font-bold">
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

            {/* TAB 3: BUTTON GLASS BLUR & OPACITY */}
            {tab === 'glass' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="bg-[#141724] rounded-2xl p-4 border border-slate-800 space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-blue-400" />
                      <span>বোতামের কাঁচের ব্লার ও স্বচ্ছতা</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      বোতামের রঙ থিমের সাথে মিলবে। আপনি ব্লার বাড়িয়ে কাঁচের ইফেক্ট পেতে পারেন।
                    </p>
                  </div>

                  {/* 1. Button Blur Slider (0px - 24px) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-200">Button Backdrop Blur (বোতামের ব্লার)</span>
                      <span className="text-blue-400 font-mono">{buttonBlur}px</span>
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
                      <span>0px (Sharp)</span>
                      <span>8px</span>
                      <span>16px</span>
                      <span>24px (Heavy)</span>
                    </div>
                  </div>

                  {/* 2. Button Opacity Slider (20% - 100%) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-200">Button Opacity (বোতামের অস্বচ্ছতা)</span>
                      <span className="text-emerald-400 font-mono">{buttonOpacity}%</span>
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
                  </div>

                  {/* 3. Wallpaper Blur Slider (0px - 20px) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-200">Wallpaper Blur</span>
                      <span className="text-purple-400 font-mono">{bgBlur}px</span>
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
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-200">Dark Dimmer Overlay</span>
                      <span className="text-amber-400 font-mono">{bgOverlayOpacity}%</span>
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

                  <button
                    type="button"
                    onClick={() => handleApplyCustom()}
                    className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                  >
                    Save & Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Live Interactive Mini Calculator */}
          <div className="w-full md:w-[280px] shrink-0 p-4 bg-[#090B12] flex flex-col items-center justify-center">
            <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
              Live Preview
            </div>
            <div
              className="w-full max-w-[260px] rounded-3xl overflow-hidden shadow-xl border border-white/15 relative flex flex-col p-3.5"
              style={{
                backgroundColor: bg,
                backgroundImage: bgImage ? `url(${bgImage})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {bgImage && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundColor: `rgba(0, 0, 0, ${bgOverlayOpacity / 100})`,
                    backdropFilter: bgBlur > 0 ? `blur(${bgBlur}px)` : undefined,
                  }}
                />
              )}

              <div className="relative z-10 text-right py-3 px-1 mb-2">
                <div className="text-[11px] font-mono opacity-75" style={{ color: textColor }}>
                  {previewFormula}
                </div>
                <div className="text-2xl font-bold mt-0.5 truncate" style={{ color: textColor }}>
                  {previewResult}
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-4 gap-1.5">
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
                      className="h-9 rounded-xl border border-white/20 font-bold text-xs flex items-center justify-center shadow-xs active:scale-95 transition-transform cursor-pointer"
                    >
                      {btn.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-800 bg-black/40 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            {tab === 'presets' ? `${filteredThemes.length} Themes` : `${filteredWallpapers.length} Wallpapers`}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-1.5 rounded-full bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
