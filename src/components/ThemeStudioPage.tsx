/**
 * Dedicated Full-Page Theme & Wallpaper Studio (থিম ও ওয়ালপেপার স্টুডিও - Redesigned)
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Prachurjo Calculator. All rights reserved.
 *
 * Professional Studio Suite:
 * - Two-column design workstation (Studio Controls & Hardware-Accurate Live Phone Canvas)
 * - 21 Curated Themes with live color swatches and instant one-tap preview
 * - 66+ 100% Unique HD Backdrops categorized + Instant device photo upload & management
 * - Real-time working interactive calculator in the live canvas with authentic math evaluation, sound & haptics
 * - Precision glass tuning (Keypad backdrop blur, button opacity, wallpaper blur, and darkening dimmer)
 * - Advanced 6-point custom color studio with 1-click designer recipes
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
  Smartphone,
  Eye,
  EyeOff,
  RotateCcw,
  CheckCircle2,
  Layers,
  SunMedium,
  Droplets,
  Zap,
  ChevronRight,
  Shuffle,
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
import { CalculatorEngine } from '../domain/calculatorEngine.ts';

interface ThemeStudioPageProps {
  activeThemeId: string;
  customColors: CustomThemeColors | null;
  onSelectThemeId: (themeId: string) => void;
  onSaveCustomColors: (colors: CustomThemeColors) => void;
  onBackToCalculator: () => void;
}

type StudioTab = 'themes' | 'wallpapers' | 'glass' | 'colors';

export const ThemeStudioPage: React.FC<ThemeStudioPageProps> = ({
  activeThemeId,
  customColors,
  onSelectThemeId,
  onSaveCustomColors,
  onBackToCalculator,
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<StudioTab>('themes');
  const [themeCategory, setThemeCategory] = useState<string>('All');
  const [wallpaperCategory, setWallpaperCategory] = useState<string>('All');
  const [themeSearch, setThemeSearch] = useState('');
  const [wallpaperSearch, setWallpaperSearch] = useState('');
  const [showMobilePreview, setShowMobilePreview] = useState(false);
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
    customColors?.buttonOpacity ?? 92
  );
  const [animatedBg, setAnimatedBg] = useState<boolean>(
    customColors?.animatedBg ?? activePresetTheme.animatedBg ?? false
  );

  // Saved uploaded wallpapers from device
  const [savedWallpapers, setSavedWallpapers] = useState<CustomUploadedWallpaper[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live Calculator Engine State inside Phone Canvas
  const [calcExpression, setCalcExpression] = useState('128 × 256');
  const [calcResult, setCalcResult] = useState('32,768');
  const [calcIsEvaluated, setCalcIsEvaluated] = useState(true);

  // Load saved device wallpapers on mount
  useEffect(() => {
    setSavedWallpapers(CustomWallpaperManager.getSavedWallpapers());
  }, []);

  // Show a brief toast notification
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
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
    showToast(`"${theme.name}" applied`);
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
    showToast('Wallpaper applied');
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
    showToast('Backdrop cleared');
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
      showToast('Image uploaded and set as wallpaper');
    } catch (err) {
      console.error('Wallpaper upload error:', err);
      showToast('Failed to upload image');
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
    showToast('Wallpaper deleted');
  };

  // Surprise Me / Random Theme button
  const handleRandomTheme = useCallback(() => {
    triggerHaptic('heavy');
    playKeypressSound('equals');
    const randomIndex = Math.floor(Math.random() * THEME_PALETTES.length);
    const chosen = THEME_PALETTES[randomIndex];
    handleSelectPreset(chosen);
  }, [handleSelectPreset]);

  // Shuffle Random Wallpaper
  const handleRandomWallpaper = useCallback(() => {
    triggerHaptic('medium');
    playKeypressSound('number');
    const randomIndex = Math.floor(Math.random() * CURATED_WALLPAPERS.length);
    const chosen = CURATED_WALLPAPERS[randomIndex];
    handleSelectWallpaper(chosen.url);
  }, [handleSelectWallpaper]);

  // Quick Glass Presets
  const applyGlassPreset = (type: 'frosted' | 'smoked' | 'crystal' | 'solid') => {
    triggerHaptic('medium');
    playKeypressSound('action');
    let newBtnBlur = 8;
    let newBtnOpacity = 90;
    let newBgBlur = 2;
    let newDimmer = 35;

    if (type === 'frosted') {
      newBtnBlur = 16;
      newBtnOpacity = 65;
      newBgBlur = 6;
      newDimmer = 40;
    } else if (type === 'smoked') {
      newBtnBlur = 10;
      newBtnOpacity = 85;
      newBgBlur = 3;
      newDimmer = 65;
    } else if (type === 'crystal') {
      newBtnBlur = 24;
      newBtnOpacity = 35;
      newBgBlur = 1;
      newDimmer = 25;
    } else if (type === 'solid') {
      newBtnBlur = 0;
      newBtnOpacity = 100;
      newBgBlur = 0;
      newDimmer = 0;
    }

    setButtonBlur(newBtnBlur);
    setButtonOpacity(newBtnOpacity);
    setBgBlur(newBgBlur);
    setBgOverlayOpacity(newDimmer);

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
      bgBlur: newBgBlur,
      bgOverlayOpacity: newDimmer,
      isGlassmorphic: true,
      buttonBlur: newBtnBlur,
      buttonOpacity: newBtnOpacity,
      buttonGlassmorphic: true,
    };
    setCurrentThemeId('custom');
    onSaveCustomColors(custom);
    onSelectThemeId('custom');
    showToast(`Applied ${type} glass preset`);
  };

  // Quick Designer Color Palette Recipes
  const applyColorRecipe = (recipe: {
    name: string;
    bg: string;
    surface: string;
    numberBg: string;
    operatorBg: string;
    actionBg: string;
    equalsBg: string;
    textColor: string;
    equalsText: string;
  }) => {
    triggerHaptic('medium');
    playKeypressSound('operator');
    setBg(recipe.bg);
    setSurface(recipe.surface);
    setNumberBg(recipe.numberBg);
    setOperatorBg(recipe.operatorBg);
    setActionBg(recipe.actionBg);
    setEqualsBg(recipe.equalsBg);
    setTextColor(recipe.textColor);
    setNumberText(recipe.textColor);
    setOperatorText(recipe.textColor);
    setEqualsText(recipe.equalsText);

    const custom: CustomThemeColors = {
      bg: recipe.bg,
      numberBg: recipe.numberBg,
      operatorBg: recipe.operatorBg,
      scientificBg: recipe.operatorBg,
      actionBg: recipe.actionBg,
      backspaceBg: 'rgba(245, 158, 11, 0.3)',
      equalsBg: recipe.equalsBg,
      textColor: recipe.textColor,
      equalsTextColor: recipe.equalsText,
      bgImage,
      bgBlur,
      bgOverlayOpacity,
      isGlassmorphic: true,
      buttonBlur,
      buttonOpacity,
    };
    setCurrentThemeId('custom');
    onSaveCustomColors(custom);
    onSelectThemeId('custom');
    showToast(`"${recipe.name}" recipe applied`);
  };

  // Commit Custom Changes to App State and Return
  const handleSaveAndExit = () => {
    triggerHaptic('heavy');
    playKeypressSound('equals');

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
        operatorTextColor: operatorText,
        equalsTextColor: equalsText,
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
  };

  // Interactive Live Calculator Handler inside Canvas
  const handleLiveCalcKey = (key: string) => {
    playKeypressSound(
      key === '=' ? 'equals' : ['+', '−', '×', '÷'].includes(key) ? 'operator' : 'number'
    );
    triggerHaptic('light');

    if (key === 'C') {
      setCalcExpression('');
      setCalcResult('0');
      setCalcIsEvaluated(false);
      return;
    }

    if (key === '⌫') {
      if (calcIsEvaluated) {
        setCalcIsEvaluated(false);
        setCalcResult('');
        return;
      }
      setCalcExpression((prev) => (prev ? prev.slice(0, -1) : ''));
      return;
    }

    if (key === '=') {
      if (!calcExpression) return;
      const res = CalculatorEngine.evaluate(calcExpression, 'DEG');
      if (res.success && res.formatted !== undefined) {
        setCalcResult(res.formatted);
        setCalcIsEvaluated(true);
      } else {
        setCalcResult('Error');
      }
      return;
    }

    if (calcIsEvaluated) {
      setCalcIsEvaluated(false);
      if (['+', '−', '×', '÷'].includes(key)) {
        setCalcExpression(calcResult && calcResult !== 'Error' ? `${calcResult}${key}` : key);
        return;
      }
      setCalcExpression(key);
      setCalcResult('');
      return;
    }

    // Replace trailing operator if user enters consecutive operators
    if (['+', '−', '×', '÷'].includes(key)) {
      if (!calcExpression) {
        if (key === '−') setCalcExpression('−');
        return;
      }
      const last = calcExpression[calcExpression.length - 1];
      if (['+', '−', '×', '÷'].includes(last)) {
        setCalcExpression((prev) => prev.slice(0, -1) + key);
        return;
      }
    }

    setCalcExpression((prev) => prev + key);
  };

  // Filtered Themes Catalog
  const filteredThemes = useMemo(() => {
    return THEME_PALETTES.filter((theme) => {
      const matchCat =
        themeCategory === 'All' || theme.category === themeCategory;
      const matchSearch =
        !themeSearch ||
        theme.name.toLowerCase().includes(themeSearch.toLowerCase()) ||
        (theme.nameBn && theme.nameBn.includes(themeSearch));
      return matchCat && matchSearch;
    });
  }, [themeCategory, themeSearch]);

  // Filtered Wallpapers Catalog (Guaranteed 100% Unique)
  const filteredWallpapers = useMemo(() => {
    return CURATED_WALLPAPERS.filter((wp) => {
      const matchCat =
        wallpaperCategory === 'All' || wp.category === wallpaperCategory;
      const matchSearch =
        !wallpaperSearch ||
        wp.name.toLowerCase().includes(wallpaperSearch.toLowerCase()) ||
        wp.category.toLowerCase().includes(wallpaperSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [wallpaperCategory, wallpaperSearch]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#090C15] text-slate-100 select-none overflow-hidden font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="absolute top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/95 text-white shadow-2xl backdrop-blur-md text-xs font-semibold tracking-wide border border-white/15 animate-in fade-in duration-150 pointer-events-none"
        >
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
            <Check className="w-2.5 h-2.5 stroke-[3]" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar - Compact & Sleek */}
      <header className="h-12 sm:h-14 px-3 sm:px-5 flex items-center justify-between border-b border-white/[0.08] bg-[#0D111E]/95 backdrop-blur-xl shrink-0 z-20">
        {/* Left: Brand & Return Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onBackToCalculator();
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white active:scale-95 transition-all cursor-pointer border border-white/[0.06] shrink-0"
            title="Return to Calculator"
            aria-label="Return to Calculator"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex flex-col min-w-0">
            <span className="text-xs sm:text-sm font-bold tracking-tight text-white flex items-center gap-1.5 truncate">
              <span>Theme Studio</span>
              <span className="hidden sm:inline-block text-[9px] px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                {currentThemeId === 'custom' ? 'Custom' : activePresetTheme.name}
              </span>
            </span>
            <div className="hidden xs:flex items-center gap-1 text-[10px] text-slate-400 truncate">
              <span>থিম ও ওয়ালপেপার স্টুডিও</span>
              <span aria-hidden="true">·</span>
              <span>21 Themes</span>
            </div>
          </div>
        </div>

        {/* Center: Segmented Navigation Control (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 p-0.5 bg-black/40 border border-white/[0.08] rounded-xl">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('themes');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'themes'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Themes</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('wallpapers');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'wallpapers'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Wallpapers</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('glass');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'glass'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Glass & Atmosphere</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('colors');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'colors'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Palette Workshop</span>
          </button>
        </nav>

        {/* Right: Studio Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Mobile Preview Toggle */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setShowMobilePreview((v) => !v);
            }}
            className="md:hidden px-2.5 py-1 rounded-lg bg-white/[0.08] border border-white/10 text-[11px] font-bold text-slate-200 flex items-center gap-1 active:scale-95 cursor-pointer"
          >
            <Smartphone className="w-3 h-3 text-emerald-400" />
            <span>{showMobilePreview ? 'Controls' : 'Preview'}</span>
          </button>

          <button
            type="button"
            onClick={handleRandomTheme}
            title="Random Theme"
            className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-[11px] font-medium text-slate-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Dices className="w-3 h-3 text-purple-400" />
            <span className="hidden lg:inline">Surprise Me</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAndExit}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center gap-1 cursor-pointer shadow-md active:scale-95"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span className="hidden sm:inline">Apply to Calculator</span>
            <span className="sm:hidden">Apply</span>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Tabs - Compact */}
      <nav className="md:hidden flex items-center gap-1 px-2.5 py-1 border-b border-white/[0.08] bg-[#0B0E18] overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('themes');
            setShowMobilePreview(false);
          }}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'themes'
              ? 'bg-purple-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Themes ({THEME_PALETTES.length})
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('wallpapers');
            setShowMobilePreview(false);
          }}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'wallpapers'
              ? 'bg-purple-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Wallpapers ({CURATED_WALLPAPERS.length})
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('glass');
            setShowMobilePreview(false);
          }}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'glass'
              ? 'bg-purple-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Glass
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('colors');
            setShowMobilePreview(false);
          }}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'colors'
              ? 'bg-purple-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Palette
        </button>
      </nav>

      {/* Main Studio Workstation */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Column: Studio Controls */}
        <section
          className={`flex-1 flex flex-col overflow-y-auto border-r border-white/[0.08] bg-[#090C15] ${
            showMobilePreview ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* TAB 1: THEMES GALLERY */}
          {activeTab === 'themes' && (
            <div className="p-4 sm:p-6 flex flex-col gap-5 max-w-5xl">
              {/* Category Filter Chips & Search Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
                  {THEME_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setThemeCategory(cat);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        themeCategory === cat
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={themeSearch}
                    onChange={(e) => setThemeSearch(e.target.value)}
                    placeholder="Search 21+ themes..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              {/* Themes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {filteredThemes.map((theme) => (
                  <ThemePreviewCard
                    key={theme.id}
                    theme={theme}
                    isSelected={currentThemeId === theme.id}
                    onSelect={() => handleSelectPreset(theme)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: WALLPAPERS GALLERY */}
          {activeTab === 'wallpapers' && (
            <div className="p-4 sm:p-6 flex flex-col gap-6 max-w-5xl">
              {/* Device Upload Dropzone Banner */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white">
                      Custom Device Wallpaper (নিজের ছবি আপলোড)
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Upload any photo from your device. Optimized and preserved persistently offline.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {bgImage && (
                    <button
                      type="button"
                      onClick={handleRemoveWallpaper}
                      className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-rose-500/15 text-slate-400 hover:text-rose-300 text-xs font-semibold border border-white/[0.08] transition-colors cursor-pointer"
                    >
                      Clear Backdrop
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md active:scale-95"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'Optimizing...' : 'Upload Photo'}</span>
                  </button>
                </div>
              </div>

              {/* User Saved Uploads (if any) */}
              {savedWallpapers.length > 0 && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>My Uploaded Photos ({savedWallpapers.length})</span>
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {savedWallpapers.map((wp) => (
                      <div
                        key={wp.id}
                        onClick={() => handleSelectWallpaper(wp.dataUrl)}
                        className={`group relative rounded-2xl overflow-hidden aspect-4/3 cursor-pointer border transition-all ${
                          bgImage === wp.dataUrl
                            ? 'border-emerald-500 ring-4 ring-emerald-500/30'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <img
                          src={wp.dataUrl}
                          alt={wp.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <button
                          type="button"
                          onClick={(e) => handleDeleteSavedWallpaper(wp.id, e)}
                          title="Delete photo"
                          className="absolute top-2 right-2 w-6 h-6 rounded-lg bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-2.5 text-[10px] text-white font-semibold truncate">
                          {wp.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Curated 100% Unique Wallpapers Filter & Search */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
                  {WALLPAPER_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setWallpaperCategory(cat);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        wallpaperCategory === cat
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={wallpaperSearch}
                    onChange={(e) => setWallpaperSearch(e.target.value)}
                    placeholder="Search 66+ backdrops..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              {/* Wallpapers Grid (All 66 100% unique) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {filteredWallpapers.map((wp) => (
                  <div
                    key={wp.id}
                    onClick={() => handleSelectWallpaper(wp.url)}
                    className={`group relative rounded-2xl overflow-hidden aspect-4/3 cursor-pointer border transition-all ${
                      bgImage === wp.url
                        ? 'border-emerald-500 ring-4 ring-emerald-500/30 scale-[1.02]'
                        : 'border-white/10 hover:border-white/30 hover:scale-[1.01]'
                    }`}
                  >
                    <img
                      src={wp.url}
                      alt={wp.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-3">
                      <span className="text-xs font-bold text-white truncate">
                        {wp.name}
                      </span>
                      <div className="flex items-center justify-between mt-0.5 text-[10px] text-slate-300">
                        <span className="truncate">{wp.category}</span>
                        {bgImage === wp.url && (
                          <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: GLASS & ATMOSPHERE */}
          {activeTab === 'glass' && (
            <div className="p-4 sm:p-6 flex flex-col gap-6 max-w-3xl">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Glassmorphism & Optical Atmosphere
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fine-tune real-time backdrop blur, surface translucency, and ambient contrast.
                </p>
              </div>

              {/* Quick Material Presets */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-300">
                  Quick Optical Atmosphere Presets
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'frosted', label: 'Frosted Crystal', desc: '16px blur · 65% opacity' },
                    { id: 'smoked', label: 'Smoked Obsidian', desc: '10px blur · 85% opacity' },
                    { id: 'crystal', label: 'Ultra Clear', desc: '24px blur · 35% opacity' },
                    { id: 'solid', label: 'OLED Solid', desc: '0px blur · 100% solid' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => applyGlassPreset(p.id as any)}
                      className="p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-left transition-all cursor-pointer active:scale-95"
                    >
                      <span className="text-xs font-bold text-white block">
                        {p.label}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {p.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Precision Sliders */}
              <div className="flex flex-col gap-5 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                {/* Slider 1: Button Glass Blur */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">
                      Keypad Glass Blur (বাটন কাঁচ ব্লার)
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {buttonBlur}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={28}
                    value={buttonBlur}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      setButtonBlur(v);
                      setCurrentThemeId('custom');
                    }}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Sharp / Flat (0px)</span>
                    <span>High Diffusion (28px)</span>
                  </div>
                </div>

                {/* Slider 2: Button Surface Opacity */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">
                      Button Surface Opacity (বাটনের স্বচ্ছতা)
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {buttonOpacity}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={100}
                    value={buttonOpacity}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      setButtonOpacity(v);
                      setCurrentThemeId('custom');
                    }}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Translucent (20%)</span>
                    <span>Solid Opaque (100%)</span>
                  </div>
                </div>

                {/* Slider 3: Wallpaper Background Blur */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">
                      Wallpaper Blur (ব্যাকগ্রাউন্ড ব্লার)
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {bgBlur}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    value={bgBlur}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      setBgBlur(v);
                      setCurrentThemeId('custom');
                    }}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Sharp Image (0px)</span>
                    <span>Soft Ambient (20px)</span>
                  </div>
                </div>

                {/* Slider 4: Wallpaper Overlay Dimmer */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">
                      Wallpaper Dimmer / Darkness (কনট্রাস্ট অন্ধকার মাত্রা)
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {bgOverlayOpacity}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={85}
                    value={bgOverlayOpacity}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      setBgOverlayOpacity(v);
                      setCurrentThemeId('custom');
                    }}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Bright (0%)</span>
                    <span>Deep Contrast (85%)</span>
                  </div>
                </div>

                {/* Toggle: Ambient Aurora Mesh */}
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Ambient Aurora Gradient
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      Dynamic fluid animation on background canvas
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setAnimatedBg((v) => !v);
                      setCurrentThemeId('custom');
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      animatedBg ? 'bg-emerald-500' : 'bg-white/20'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 left-1 ${
                        animatedBg ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOM COLORS PALETTE */}
          {activeTab === 'colors' && (
            <div className="p-4 sm:p-6 flex flex-col gap-6 max-w-3xl">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Color Harmony Workshop
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pick direct colors for every element. Synchronizes in real-time with the live phone canvas.
                </p>
              </div>

              {/* Designer Color Recipes */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-300">
                  1-Click Designer Recipes
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    {
                      name: 'Cyber Neon',
                      bg: '#080816',
                      surface: '#0E112A',
                      numberBg: '#15193B',
                      operatorBg: '#06B6D4',
                      actionBg: '#F43F5E',
                      equalsBg: '#8B5CF6',
                      textColor: '#FFFFFF',
                      equalsText: '#FFFFFF',
                    },
                    {
                      name: 'Emerald Matrix',
                      bg: '#04120B',
                      surface: '#0A2316',
                      numberBg: '#0F3422',
                      operatorBg: '#10B981',
                      actionBg: '#E11D48',
                      equalsBg: '#059669',
                      textColor: '#ECFDF5',
                      equalsText: '#FFFFFF',
                    },
                    {
                      name: 'Nordic Ice',
                      bg: '#0A1118',
                      surface: '#131F2C',
                      numberBg: '#1D2E40',
                      operatorBg: '#38BDF8',
                      actionBg: '#FB7185',
                      equalsBg: '#0284C7',
                      textColor: '#F0F9FF',
                      equalsText: '#FFFFFF',
                    },
                    {
                      name: 'Sunset Flame',
                      bg: '#180B09',
                      surface: '#2B1410',
                      numberBg: '#3F1E18',
                      operatorBg: '#F97316',
                      actionBg: '#E11D48',
                      equalsBg: '#EA580C',
                      textColor: '#FFF7ED',
                      equalsText: '#FFFFFF',
                    },
                  ].map((r) => (
                    <button
                      key={r.name}
                      type="button"
                      onClick={() => applyColorRecipe(r)}
                      className="p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-left transition-all cursor-pointer active:scale-95"
                    >
                      <div className="flex items-center gap-1.5 mb-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full shadow-sm"
                          style={{ backgroundColor: r.operatorBg }}
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full shadow-sm"
                          style={{ backgroundColor: r.equalsBg }}
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full shadow-sm"
                          style={{ backgroundColor: r.numberBg }}
                        />
                      </div>
                      <span className="text-xs font-bold text-white block">
                        {r.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Swatch Editors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                {/* Swatch 1: Canvas Background */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Canvas Background
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {bg}
                    </span>
                  </div>
                  <input
                    type="color"
                    value={bg.startsWith('#') ? bg : '#0F172A'}
                    onChange={(e) => {
                      setBg(e.target.value);
                      setCurrentThemeId('custom');
                    }}
                    className="w-9 h-9 rounded-xl border-0 bg-transparent cursor-pointer"
                  />
                </div>

                {/* Swatch 2: Number Buttons */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Number Keys Surface
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {numberBg}
                    </span>
                  </div>
                  <input
                    type="color"
                    value={numberBg.startsWith('#') ? numberBg : '#1E293B'}
                    onChange={(e) => {
                      setNumberBg(e.target.value);
                      setCurrentThemeId('custom');
                    }}
                    className="w-9 h-9 rounded-xl border-0 bg-transparent cursor-pointer"
                  />
                </div>

                {/* Swatch 3: Operator Buttons */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Operator Keys Surface
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {operatorBg}
                    </span>
                  </div>
                  <input
                    type="color"
                    value={operatorBg.startsWith('#') ? operatorBg : '#3B82F6'}
                    onChange={(e) => {
                      setOperatorBg(e.target.value);
                      setCurrentThemeId('custom');
                    }}
                    className="w-9 h-9 rounded-xl border-0 bg-transparent cursor-pointer"
                  />
                </div>

                {/* Swatch 4: Equals (=) Button */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Equals (=) Button
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {equalsBg}
                    </span>
                  </div>
                  <input
                    type="color"
                    value={equalsBg.startsWith('#') ? equalsBg : '#10B981'}
                    onChange={(e) => {
                      setEqualsBg(e.target.value);
                      setCurrentThemeId('custom');
                    }}
                    className="w-9 h-9 rounded-xl border-0 bg-transparent cursor-pointer"
                  />
                </div>

                {/* Swatch 5: Action Keys (AC, (), %) */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Action Keys (AC, %, ())
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {actionBg}
                    </span>
                  </div>
                  <input
                    type="color"
                    value={actionBg.startsWith('#') ? actionBg : '#EF4444'}
                    onChange={(e) => {
                      setActionBg(e.target.value);
                      setCurrentThemeId('custom');
                    }}
                    className="w-9 h-9 rounded-xl border-0 bg-transparent cursor-pointer"
                  />
                </div>

                {/* Swatch 6: Numbers & Text Typography */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Display & Key Text
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {textColor}
                    </span>
                  </div>
                  <input
                    type="color"
                    value={textColor.startsWith('#') ? textColor : '#FFFFFF'}
                    onChange={(e) => {
                      setTextColor(e.target.value);
                      setNumberText(e.target.value);
                      setCurrentThemeId('custom');
                    }}
                    className="w-9 h-9 rounded-xl border-0 bg-transparent cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Right Column: Hardware-Accurate Interactive Live Phone */}
        <aside
          className={`w-full md:w-[380px] lg:w-[440px] xl:w-[480px] shrink-0 p-4 sm:p-6 flex flex-col items-center justify-center bg-[#060810] overflow-y-auto ${
            showMobilePreview ? 'flex' : 'hidden md:flex'
          }`}
        >
          {/* Smartphone Frame Outer Bezel */}
          <div className="relative w-full max-w-[340px] sm:max-w-[360px] rounded-[44px] p-3 sm:p-3.5 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 shadow-2xl border border-white/20 select-none">
            {/* Screen Inner Glass Area */}
            <div
              className={`relative w-full aspect-[9/18.5] rounded-[34px] overflow-hidden flex flex-col justify-between p-4 shadow-inner ${
                animatedBg ? 'animate-aurora-mesh' : ''
              }`}
              style={{
                backgroundColor: bg,
              }}
            >
              {/* Wallpaper Layer if selected */}
              {bgImage && (
                <img
                  src={bgImage}
                  alt="Canvas Wallpaper"
                  className="absolute inset-0 w-full h-full object-cover transition-all"
                  style={{
                    filter: bgBlur > 0 ? `blur(${bgBlur}px)` : 'none',
                    transform: bgBlur > 0 ? 'scale(1.08)' : 'none',
                  }}
                />
              )}

              {/* Contrast Dimmer Scrim */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity"
                style={{
                  backgroundColor: bgImage
                    ? `rgba(0, 0, 0, ${bgOverlayOpacity / 100})`
                    : 'transparent',
                }}
              />

              {/* Punch-hole camera & status notch */}
              <div className="relative z-10 mx-auto w-24 h-4 rounded-full bg-black/80 border border-white/10 flex items-center justify-center shrink-0 mb-2">
                <span className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700 mr-2" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70" />
              </div>

              {/* Phone Live Display Area */}
              <div
                className="relative z-10 w-full rounded-2xl p-3 flex flex-col justify-end text-right border border-white/[0.08] shadow-sm mb-3 min-h-[90px]"
                style={{
                  backgroundColor: surface,
                  backdropFilter: `blur(${buttonBlur}px)`,
                }}
              >
                <div
                  className="text-xs font-mono tracking-tight text-slate-400 truncate"
                  style={{ color: textColor, opacity: 0.7 }}
                >
                  {calcExpression || '0'}
                </div>
                <div
                  className="text-3xl font-mono font-bold tracking-tight text-white truncate mt-0.5"
                  style={{ color: textColor }}
                >
                  {calcResult || '0'}
                </div>
              </div>

              {/* Phone Live Working Keypad */}
              <div className="relative z-10 grid grid-cols-4 gap-2 w-full mt-auto">
                {/* Row 1 */}
                <button
                  type="button"
                  onClick={() => handleLiveCalcKey('C')}
                  className="h-11 rounded-2xl font-bold text-sm transition-transform active:scale-95 cursor-pointer shadow-sm flex items-center justify-center"
                  style={{
                    backgroundColor: actionBg,
                    color: textColor,
                    backdropFilter: `blur(${buttonBlur}px)`,
                    opacity: buttonOpacity / 100,
                  }}
                >
                  AC
                </button>
                <button
                  type="button"
                  onClick={() => handleLiveCalcKey('(')}
                  className="h-11 rounded-2xl font-bold text-sm transition-transform active:scale-95 cursor-pointer shadow-sm flex items-center justify-center"
                  style={{
                    backgroundColor: actionBg,
                    color: textColor,
                    backdropFilter: `blur(${buttonBlur}px)`,
                    opacity: buttonOpacity / 100,
                  }}
                >
                  ( )
                </button>
                <button
                  type="button"
                  onClick={() => handleLiveCalcKey('%')}
                  className="h-11 rounded-2xl font-bold text-sm transition-transform active:scale-95 cursor-pointer shadow-sm flex items-center justify-center"
                  style={{
                    backgroundColor: actionBg,
                    color: textColor,
                    backdropFilter: `blur(${buttonBlur}px)`,
                    opacity: buttonOpacity / 100,
                  }}
                >
                  %
                </button>
                <button
                  type="button"
                  onClick={() => handleLiveCalcKey('÷')}
                  className="h-11 rounded-2xl font-bold text-base transition-transform active:scale-95 cursor-pointer shadow-sm flex items-center justify-center"
                  style={{
                    backgroundColor: operatorBg,
                    color: operatorText,
                    backdropFilter: `blur(${buttonBlur}px)`,
                    opacity: buttonOpacity / 100,
                  }}
                >
                  ÷
                </button>

                {/* Row 2 */}
                {['7', '8', '9'].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => handleLiveCalcKey(n)}
                    className="h-11 rounded-2xl font-medium text-lg transition-transform active:scale-95 cursor-pointer shadow-sm flex items-center justify-center"
                    style={{
                      backgroundColor: numberBg,
                      color: numberText,
                      backdropFilter: `blur(${buttonBlur}px)`,
                      opacity: buttonOpacity / 100,
                    }}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleLiveCalcKey('×')}
                  className="h-11 rounded-2xl font-bold text-base transition-transform active:scale-95 cursor-pointer shadow-sm flex items-center justify-center"
                  style={{
                    backgroundColor: operatorBg,
                    color: operatorText,
                    backdropFilter: `blur(${buttonBlur}px)`,
                    opacity: buttonOpacity / 100,
                  }}
                >
                  ×
                </button>

                {/* Row 3 */}
                {['4', '5', '6'].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => handleLiveCalcKey(n)}
                    className="h-11 rounded-2xl font-medium text-lg transition-transform active:scale-95 cursor-pointer shadow-sm flex items-center justify-center"
                    style={{
                      backgroundColor: numberBg,
                      color: numberText,
                      backdropFilter: `blur(${buttonBlur}px)`,
                      opacity: buttonOpacity / 100,
                    }}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleLiveCalcKey('−')}
                  className="h-11 rounded-2xl font-bold text-base transition-transform active:scale-95 cursor-pointer shadow-sm flex items-center justify-center"
                  style={{
                    backgroundColor: operatorBg,
                    color: operatorText,
                    backdropFilter: `blur(${buttonBlur}px)`,
                    opacity: buttonOpacity / 100,
                  }}
                >
                  −
                </button>

                {/* Row 4 */}
                {['1', '2', '3'].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => handleLiveCalcKey(n)}
                    className="h-11 rounded-2xl font-medium text-lg transition-transform active:scale-95 cursor-pointer shadow-sm flex items-center justify-center"
                    style={{
                      backgroundColor: numberBg,
                      color: numberText,
                      backdropFilter: `blur(${buttonBlur}px)`,
                      opacity: buttonOpacity / 100,
                    }}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleLiveCalcKey('+')}
                  className="h-11 rounded-2xl font-bold text-base transition-transform active:scale-95 cursor-pointer shadow-sm flex items-center justify-center"
                  style={{
                    backgroundColor: operatorBg,
                    color: operatorText,
                    backdropFilter: `blur(${buttonBlur}px)`,
                    opacity: buttonOpacity / 100,
                  }}
                >
                  +
                </button>

                {/* Row 5 */}
                <button
                  type="button"
                  onClick={() => handleLiveCalcKey('0')}
                  className="h-11 rounded-2xl font-medium text-lg transition-transform active:scale-95 cursor-pointer shadow-sm flex items-center justify-center"
                  style={{
                    backgroundColor: numberBg,
                    color: numberText,
                    backdropFilter: `blur(${buttonBlur}px)`,
                    opacity: buttonOpacity / 100,
                  }}
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={() => handleLiveCalcKey('.')}
                  className="h-11 rounded-2xl font-bold text-lg transition-transform active:scale-95 cursor-pointer shadow-sm flex items-center justify-center"
                  style={{
                    backgroundColor: numberBg,
                    color: numberText,
                    backdropFilter: `blur(${buttonBlur}px)`,
                    opacity: buttonOpacity / 100,
                  }}
                >
                  .
                </button>
                <button
                  type="button"
                  onClick={() => handleLiveCalcKey('⌫')}
                  className="h-11 rounded-2xl font-medium text-base transition-transform active:scale-95 cursor-pointer shadow-sm flex items-center justify-center"
                  style={{
                    backgroundColor: numberBg,
                    color: numberText,
                    backdropFilter: `blur(${buttonBlur}px)`,
                    opacity: buttonOpacity / 100,
                  }}
                >
                  ⌫
                </button>
                <button
                  type="button"
                  onClick={() => handleLiveCalcKey('=')}
                  className="h-11 rounded-2xl font-bold text-lg transition-transform active:scale-95 cursor-pointer shadow-md flex items-center justify-center"
                  style={{
                    backgroundColor: equalsBg,
                    color: equalsText,
                    backdropFilter: `blur(${buttonBlur}px)`,
                    opacity: buttonOpacity / 100,
                  }}
                >
                  =
                </button>
              </div>

              {/* Bottom Home Indicator Bar */}
              <div className="relative z-10 mx-auto w-28 h-1 rounded-full bg-white/40 mt-3" />
            </div>
          </div>

          {/* Under-phone Quick Actions */}
          <div className="flex items-center gap-2 mt-4 text-[11px] text-slate-400">
            <button
              type="button"
              onClick={handleRandomWallpaper}
              className="px-2.5 py-1 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Shuffle className="w-3 h-3 text-purple-400" />
              <span>Shuffle Wallpaper</span>
            </button>
            <span className="text-slate-600">·</span>
            <button
              type="button"
              onClick={() => {
                setCalcExpression('128 × 256');
                setCalcResult('32,768');
                setCalcIsEvaluated(true);
              }}
              className="px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 font-mono transition-colors cursor-pointer"
            >
              128×256
            </button>
            <button
              type="button"
              onClick={() => {
                setCalcExpression('sin(30) + 4');
                setCalcResult('4.5');
                setCalcIsEvaluated(true);
              }}
              className="px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 font-mono transition-colors cursor-pointer"
            >
              sin(30)
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
