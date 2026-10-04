/**
 * First-Time Onboarding Theme & Wallpaper Selector Modal
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Prachurjo Calculator. All rights reserved.
 *
 * Greets first-time users and prompts them to pick their favorite Wallpaper (shown first)
 * or Theme Palette. Sets it as default permanently, with the ability to change anytime later.
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Check,
  Palette,
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
  Search,
  Upload,
  Clock,
  Trash2,
  X,
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
import { ThemePreviewCard } from './ThemePreviewCard.tsx';
import { LocalStorageManager } from '../data/storage.ts';
import { CustomThemeColors } from '../types.ts';
import { triggerHaptic } from '../utils/haptics.ts';

interface OnboardingThemeModalProps {
  isOpen: boolean;
  activeThemeId: string;
  customColors: CustomThemeColors | null;
  onSelectThemeId: (themeId: string) => void;
  onSaveCustomColors: (colors: CustomThemeColors) => void;
  onComplete: () => void;
}

export const OnboardingThemeModal: React.FC<OnboardingThemeModalProps> = ({
  isOpen,
  activeThemeId,
  customColors,
  onSelectThemeId,
  onSaveCustomColors,
  onComplete,
}) => {
  // Wallpapers tab is FIRST by default as requested
  const [activeTab, setActiveTab] = useState<'wallpapers' | 'themes'>('wallpapers');
  const [selectedWallpaperUrl, setSelectedWallpaperUrl] = useState<string>(
    customColors?.bgImage || CURATED_WALLPAPERS[0].url
  );
  const [selectedThemeId, setSelectedThemeId] = useState<string>(activeThemeId);
  const [wallpaperCategory, setWallpaperCategory] = useState<string>('All');
  const [themeCategory, setThemeCategory] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [savedUserWallpapers, setSavedUserWallpapers] = useState<CustomUploadedWallpaper[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved device uploaded wallpapers & mark onboarded so it NEVER shows a 2nd time!
  useEffect(() => {
    if (isOpen) {
      setSavedUserWallpapers(CustomWallpaperManager.getSavedWallpapers());
      LocalStorageManager.setHasOnboarded(true);
    }
  }, [isOpen]);

  // Handle direct image file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      triggerHaptic('medium');
      const optimizedUrl = await optimizeWallpaperImage(file);
      const name = file.name.replace(/\.[^/.]+$/, '').slice(0, 30);
      const updated = CustomWallpaperManager.saveWallpaper(name, optimizedUrl);
      setSavedUserWallpapers(updated);
      setSelectedWallpaperUrl(optimizedUrl);
    } catch (err) {
      console.error('Failed to upload custom wallpaper:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Filtered wallpapers
  const filteredWallpapers = useMemo(() => {
    return CURATED_WALLPAPERS.filter((w) => {
      const matchCat = wallpaperCategory === 'All' || w.category === wallpaperCategory;
      const matchSearch =
        w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.nameBn.toLowerCase().includes(search.toLowerCase()) ||
        w.category.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [wallpaperCategory, search]);

  // Filtered themes
  const filteredThemes = useMemo(() => {
    return THEME_PALETTES.filter((t) => {
      const matchCat = themeCategory === 'All' || t.category === themeCategory;
      const matchSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [themeCategory, search]);

  if (!isOpen) return null;

  // Final confirmation: apply permanently
  const handleConfirm = () => {
    triggerHaptic('heavy');
    if (activeTab === 'wallpapers' && selectedWallpaperUrl) {
      const newCustom: CustomThemeColors = {
        bg: '#0B0D19',
        numberBg: 'rgba(255, 255, 255, 0.14)',
        operatorBg: 'rgba(56, 189, 248, 0.35)',
        scientificBg: 'rgba(129, 140, 248, 0.25)',
        actionBg: 'rgba(239, 68, 68, 0.3)',
        backspaceBg: 'rgba(245, 158, 11, 0.3)',
        equalsBg: '#087A36',
        textColor: '#FFFFFF',
        bgImage: selectedWallpaperUrl,
        bgBlur: 2,
        bgOverlayOpacity: 35,
        isGlassmorphic: true,
        buttonBlur: 8,
        buttonOpacity: 95,
        buttonGlassmorphic: true,
      };
      onSaveCustomColors(newCustom);
      onSelectThemeId('custom');
    } else {
      onSelectThemeId(selectedThemeId);
    }
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#0F121C] text-slate-100 rounded-3xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col max-h-[92vh] relative">
        {/* Top-Right Dismiss Button */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            onComplete();
          }}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close"
          title="Close (বন্ধ করুন)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Greeting Banner */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-purple-950/60 via-slate-900 to-emerald-950/60 border-b border-slate-800 text-center relative pr-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-2 border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>স্বাগতম! (Welcome to Calculator)</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white">
            আপনার পছন্দের লুক নির্বাচন করুন
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
            প্রথমে আপনার পছন্দের ওয়ালপেপার বা থিম বেছে নিন। এটি সবসময় চালু থাকবে এবং পরবর্তীতে যেকোনো সময় পরিবর্তন করতে পারবেন।
          </p>

          {/* Tab Switcher: Wallpapers FIRST */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setActiveTab('wallpapers');
                setSearch('');
              }}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'wallpapers'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>১০০+ ওয়ালপেপার (Wallpapers First)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setActiveTab('themes');
                setSearch('');
              }}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'themes'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>২১+ থিম (Themes)</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="p-3 bg-[#0B0D16] border-b border-slate-800 space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                activeTab === 'wallpapers'
                  ? 'ওয়ালপেপার খুঁজুন (পাহাড়, নিয়ন, গ্যালাক্সি, সাগর...)'
                  : 'থিম খুঁজুন (OLED, Cyberpunk, Light, Dark...)'
              }
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black/40 border border-slate-700/60 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
            {activeTab === 'wallpapers' ? (
              WALLPAPER_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setWallpaperCategory(cat);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    wallpaperCategory === cat
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))
            ) : (
              THEME_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setThemeCategory(cat);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    themeCategory === cat
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Content Items Grid */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5">
          {activeTab === 'wallpapers' ? (
            <div className="space-y-4">
              {/* Direct Upload Trigger Banner */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      ডিভাইস থেকে নিজের ওয়ালপেপার দিন
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      গ্যালারি থেকে ফটো আপলোড করুন, ফোনে চিরতরে সেভ থাকবে
                    </p>
                  </div>
                </div>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="onboarding-upload-input"
                  />
                  <label
                    htmlFor="onboarding-upload-input"
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'প্রসেসিং...' : 'আপলোড'}</span>
                  </label>
                </div>
              </div>

              {/* Saved User Wallpapers from Device Storage (if any) */}
              {savedUserWallpapers.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>আমার সংরক্ষিত ওয়ালপেপার ({savedUserWallpapers.length})</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {savedUserWallpapers.map((userW) => {
                      const isSelected = selectedWallpaperUrl === userW.dataUrl;
                      return (
                        <div
                          key={userW.id}
                          onClick={() => {
                            triggerHaptic('light');
                            setSelectedWallpaperUrl(userW.dataUrl);
                          }}
                          className={`group relative rounded-2xl overflow-hidden aspect-4/3 cursor-pointer border transition-all ${
                            isSelected
                              ? 'border-emerald-500 ring-4 ring-emerald-500/40 shadow-xl scale-[1.02]'
                              : 'border-emerald-800/60 hover:border-emerald-600 hover:scale-[1.01]'
                          }`}
                        >
                          <img
                            src={userW.dataUrl}
                            alt={userW.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-2.5">
                            <span className="text-xs font-bold text-white truncate">
                              {userW.name}
                            </span>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-[9px] text-emerald-300 font-medium">
                                Device Photo
                              </span>
                              {isSelected && (
                                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 100+ Curated Wallpapers */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>১০০+ সেরা ওয়ালপেপার গ্যালারি ({filteredWallpapers.length})</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredWallpapers.map((w: WallpaperOption) => {
                    const isSelected = selectedWallpaperUrl === w.url;
                    return (
                      <div
                        key={w.id}
                        onClick={() => {
                          triggerHaptic('light');
                          setSelectedWallpaperUrl(w.url);
                        }}
                        className={`group relative rounded-2xl overflow-hidden aspect-4/3 cursor-pointer border transition-all ${
                          isSelected
                            ? 'border-emerald-500 ring-4 ring-emerald-500/40 shadow-xl scale-[1.02]'
                            : 'border-slate-800 hover:border-slate-600 hover:scale-[1.01]'
                        }`}
                      >
                        <img
                          src={w.url}
                          alt={w.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
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
                            {isSelected && (
                              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                                <Check className="w-3 h-3 stroke-[3]" />
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
          ) : (
            <div>
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                <Palette className="w-3.5 h-3.5 text-purple-400" />
                <span>২১+ আল্ট্রা থিম কালেকশন ({filteredThemes.length})</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredThemes.map((t: ThemePalette) => (
                  <ThemePreviewCard
                    key={t.id}
                    theme={t}
                    isSelected={selectedThemeId === t.id}
                    onSelect={() => {
                      triggerHaptic('light');
                      setSelectedThemeId(t.id);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Confirmation Action Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#0B0D16] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            <span>নির্বাচিত: </span>
            <strong className="text-white">
              {activeTab === 'wallpapers' ? 'এইচডি ওয়ালপেপার ও গ্লাস বোতাম' : THEME_PALETTES.find(t => t.id === selectedThemeId)?.name || 'Theme'}
            </strong>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>সেট করুন ও শুরু করুন (Set & Start)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
