/**
 * Top-Right Overflow Menu (Theme-Adaptive)
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Prachurjo Calculator. All rights reserved.
 *
 * Dynamically adapts to the currently active Theme Palette:
 * - Adapts to light, dark, pastel, OLED, and custom theme colors
 * - Tactile sound toggle and instant dialog routers
 * - Mobile touch outside dismiss
 */

import React, { useEffect, useRef } from 'react';
import {
  Trash2,
  Palette,
  Type,
  SlidersHorizontal,
  ShieldCheck,
  Mail,
  HelpCircle,
  Info,
  Volume2,
  VolumeX,
  Settings,
  Mic,
  Database,
  Smartphone,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics.ts';
import { playKeypressSound } from '../utils/sound.ts';
import { ThemePalette } from '../data/themes.ts';
import { getModalThemeStyles } from '../utils/themeStyles.ts';

interface ThreeDotMenuProps {
  isOpen: boolean;
  palette?: ThemePalette;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onClose: () => void;
  onClearHistory: () => void;
  onOpenVoice?: () => void;
  onOpenDatabase?: () => void;
  onOpenThemes: () => void;
  onOpenFonts: () => void;
  onOpenAppIcons?: () => void;
  onOpenCustomization: () => void;
  onOpenSettings: () => void;
  onOpenAndroidApk?: () => void;
  onOpenOnboarding?: () => void;
  onOpenPrivacy: () => void;
  onSendFeedback: () => void;
  onOpenHelp: () => void;
  onOpenAbout: () => void;
}

export const ThreeDotMenu: React.FC<ThreeDotMenuProps> = ({
  isOpen,
  palette,
  soundEnabled,
  onToggleSound,
  onClose,
  onClearHistory,
  onOpenVoice,
  onOpenDatabase,
  onOpenThemes,
  onOpenFonts,
  onOpenAppIcons,
  onOpenCustomization,
  onOpenSettings,
  onOpenAndroidApk,
  onOpenOnboarding,
  onOpenPrivacy,
  onSendFeedback,
  onOpenHelp,
  onOpenAbout,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const theme = getModalThemeStyles(palette);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick, { passive: true });
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleItemClick = (action: () => void) => {
    triggerHaptic('light');
    action();
    onClose();
  };

  const handleSoundToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('light');
    onToggleSound();
    if (!soundEnabled) {
      playKeypressSound('number');
    }
  };

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-orientation="vertical"
      style={{
        backgroundColor: theme.dialogBg,
        borderColor: theme.dialogBorder,
        color: theme.textPrimary,
        boxShadow: theme.isDark
          ? '0 20px 50px rgba(0,0,0,0.65)'
          : '0 20px 45px rgba(0,0,0,0.18)',
      }}
      className="absolute top-14 right-3.5 z-50 w-72 p-2 rounded-2xl border backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 origin-top-right select-none max-h-[88vh] overflow-y-auto scrollbar-thin transition-colors"
    >
      {/* SECTION 1: QUICK ACTIONS */}
      <div
        style={{ color: theme.textMuted }}
        className="px-2.5 pt-1.5 pb-1 flex items-center justify-between text-[10px] font-bold tracking-wider uppercase"
      >
        <span>Quick Actions</span>
        <span
          style={{ color: theme.accentColor }}
          className="text-[9px] font-mono font-bold"
        >
          Offline
        </span>
      </div>

      <div className="space-y-0.5">
        {/* Clear History */}
        <button
          type="button"
          onClick={() => handleItemClick(onClearHistory)}
          style={{ color: theme.textPrimary }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer group ${
            theme.isDark
              ? 'hover:bg-white/[0.08] active:bg-white/[0.14]'
              : 'hover:bg-black/[0.06] active:bg-black/[0.1]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-rose-500/15 text-rose-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Trash2 className="w-3.5 h-3.5" />
            </div>
            <span>Clear History</span>
          </div>
          <span style={{ color: theme.textMuted }} className="text-[10px]">
            Clean
          </span>
        </button>

        {/* Keypress Sound Quick Switch */}
        <div
          onClick={handleSoundToggle}
          style={{ color: theme.textPrimary }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all group ${
            theme.isDark
              ? 'hover:bg-white/[0.08]'
              : 'hover:bg-black/[0.06]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              style={{
                backgroundColor: soundEnabled ? theme.subtleAccentBg : theme.itemBg,
                color: soundEnabled ? theme.accentColor : theme.textMuted,
              }}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </div>
            <div>
              <div className="leading-tight">Key Audio Sound</div>
              <div style={{ color: theme.textMuted }} className="text-[10px] font-normal">
                {soundEnabled ? 'Click Sound Active' : 'Muted'}
              </div>
            </div>
          </div>
          <div
            style={{
              backgroundColor: soundEnabled ? theme.accentBg : (theme.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'),
            }}
            className="w-9 h-5 flex items-center rounded-full p-0.5 transition-colors"
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                soundEnabled ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </div>
        </div>

        {/* Voice Calculator */}
        {onOpenVoice && (
          <button
            type="button"
            onClick={() => handleItemClick(onOpenVoice)}
            style={{ color: theme.textPrimary }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer group ${
              theme.isDark
                ? 'hover:bg-white/[0.08] active:bg-white/[0.14]'
                : 'hover:bg-black/[0.06] active:bg-black/[0.1]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                style={{
                  backgroundColor: theme.subtleAccentBg,
                  color: theme.accentColor,
                }}
                className="w-7 h-7 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform"
              >
                <Mic className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="leading-tight">Voice Calculator</div>
                <div style={{ color: theme.textMuted }} className="text-[10px] font-normal">
                  মুখে বলে সরাসরি হিসাব
                </div>
              </div>
            </div>
            <span
              style={{
                backgroundColor: theme.subtleAccentBg,
                color: theme.accentColor,
              }}
              className="text-[10px] px-1.5 py-0.5 rounded-md font-medium"
            >
              বাংলা / EN
            </span>
          </button>
        )}

        {/* Phone Database Manager */}
        {onOpenDatabase && (
          <button
            type="button"
            onClick={() => handleItemClick(onOpenDatabase)}
            style={{ color: theme.textPrimary }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer group ${
              theme.isDark
                ? 'hover:bg-white/[0.08] active:bg-white/[0.14]'
                : 'hover:bg-black/[0.06] active:bg-black/[0.1]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-sky-500/15 text-sky-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Database className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="leading-tight">Phone Database</div>
                <div style={{ color: theme.textMuted }} className="text-[10px] font-normal">
                  লোকাল ডাটা ও ব্যাকআপ
                </div>
              </div>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-sky-500/20 text-sky-600 dark:text-sky-300 font-mono">
              IndexedDB
            </span>
          </button>
        )}

        {/* Android APK Center */}
        {onOpenAndroidApk && (
          <button
            type="button"
            onClick={() => handleItemClick(onOpenAndroidApk)}
            style={{ color: theme.textPrimary }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer group ${
              theme.isDark
                ? 'hover:bg-white/[0.08] active:bg-white/[0.14]'
                : 'hover:bg-black/[0.06] active:bg-black/[0.1]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Smartphone className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="leading-tight">Android APK Center</div>
                <div style={{ color: theme.textMuted }} className="text-[10px] font-normal">
                  APK ডাউনলোড ও ইনস্টল
                </div>
              </div>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold uppercase">
              APK
            </span>
          </button>
        )}
      </div>

      <div
        style={{ backgroundColor: theme.headerBorder }}
        className="h-[1px] my-2 mx-1"
      />

      {/* SECTION 2: APPEARANCE & THEMES */}
      <div
        style={{ color: theme.textMuted }}
        className="px-2.5 pt-0.5 pb-1 flex items-center justify-between text-[10px] font-bold tracking-wider uppercase"
      >
        <span>Appearance & Styles</span>
      </div>

      <div className="space-y-0.5">
        {/* Theme Studio */}
        <button
          type="button"
          onClick={() => handleItemClick(onOpenThemes)}
          style={{ color: theme.textPrimary }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer group ${
            theme.isDark
              ? 'hover:bg-white/[0.08] active:bg-white/[0.14]'
              : 'hover:bg-black/[0.06] active:bg-black/[0.1]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Palette className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <div className="leading-tight">Theme Studio</div>
              <div style={{ color: theme.textMuted }} className="text-[10px] font-normal">
                21+ Themes & 66 Wallpapers
              </div>
            </div>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-600 dark:text-purple-300 font-medium">
            Studio
          </span>
        </button>

        {/* Typography */}
        <button
          type="button"
          onClick={() => handleItemClick(onOpenFonts)}
          style={{ color: theme.textPrimary }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer group ${
            theme.isDark
              ? 'hover:bg-white/[0.08] active:bg-white/[0.14]'
              : 'hover:bg-black/[0.06] active:bg-black/[0.1]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Type className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <div className="leading-tight">Typography</div>
              <div style={{ color: theme.textMuted }} className="text-[10px] font-normal">
                Display & keypad fonts
              </div>
            </div>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 font-medium">
            52 Fonts
          </span>
        </button>

        {/* App Icon Style */}
        {onOpenAppIcons && (
          <button
            type="button"
            onClick={() => handleItemClick(onOpenAppIcons)}
            style={{ color: theme.textPrimary }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer group ${
              theme.isDark
                ? 'hover:bg-white/[0.08] active:bg-white/[0.14]'
                : 'hover:bg-black/[0.06] active:bg-black/[0.1]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Smartphone className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="leading-tight">App Icon Style</div>
                <div style={{ color: theme.textMuted }} className="text-[10px] font-normal">
                  Launcher icon style
                </div>
              </div>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-300 font-medium">
              10 Icons
            </span>
          </button>
        )}

        {/* Personalize & Sizing */}
        <button
          type="button"
          onClick={() => handleItemClick(onOpenCustomization)}
          style={{ color: theme.textPrimary }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer group ${
            theme.isDark
              ? 'hover:bg-white/[0.08] active:bg-white/[0.14]'
              : 'hover:bg-black/[0.06] active:bg-black/[0.1]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-teal-500/15 text-teal-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <div className="leading-tight">Personalize & Sizing</div>
              <div style={{ color: theme.textMuted }} className="text-[10px] font-normal">
                Scale, shapes, sound styles
              </div>
            </div>
          </div>
          <ChevronRight style={{ color: theme.textMuted }} className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* Welcome Setup Guide */}
        {onOpenOnboarding && (
          <button
            type="button"
            onClick={() => handleItemClick(onOpenOnboarding)}
            style={{ color: theme.textPrimary }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer group ${
              theme.isDark
                ? 'hover:bg-white/[0.08] active:bg-white/[0.14]'
                : 'hover:bg-black/[0.06] active:bg-black/[0.1]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-pink-500/15 text-pink-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="leading-tight">Welcome Setup</div>
                <div style={{ color: theme.textMuted }} className="text-[10px] font-normal">
                  Re-run onboarding tour
                </div>
              </div>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-pink-500/20 text-pink-600 dark:text-pink-300 font-medium">
              Guide
            </span>
          </button>
        )}
      </div>

      <div
        style={{ backgroundColor: theme.headerBorder }}
        className="h-[1px] my-2 mx-1"
      />

      {/* SECTION 3: SYSTEM & PREFERENCES */}
      <div
        style={{ color: theme.textMuted }}
        className="px-2.5 pt-0.5 pb-1 flex items-center justify-between text-[10px] font-bold tracking-wider uppercase"
      >
        <span>System & Info</span>
      </div>

      <div className="space-y-0.5">
        <button
          type="button"
          onClick={() => handleItemClick(onOpenSettings)}
          style={{ color: theme.textPrimary }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer group ${
            theme.isDark
              ? 'hover:bg-white/[0.08] active:bg-white/[0.14]'
              : 'hover:bg-black/[0.06] active:bg-black/[0.1]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              style={{ backgroundColor: theme.itemBg, color: theme.textSecondary }}
              className="w-7 h-7 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform"
            >
              <Settings className="w-3.5 h-3.5" />
            </div>
            <span>Settings</span>
          </div>
          <ChevronRight style={{ color: theme.textMuted }} className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => handleItemClick(onOpenPrivacy)}
          style={{ color: theme.textPrimary }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer group ${
            theme.isDark
              ? 'hover:bg-white/[0.08] active:bg-white/[0.14]'
              : 'hover:bg-black/[0.06] active:bg-black/[0.1]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              style={{ backgroundColor: theme.itemBg, color: theme.textSecondary }}
              className="w-7 h-7 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span>Privacy Policy</span>
          </div>
          <span style={{ color: theme.accentColor }} className="text-[10px] font-mono font-bold">
            100% Offline
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleItemClick(onSendFeedback)}
          style={{ color: theme.textPrimary }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer group ${
            theme.isDark
              ? 'hover:bg-white/[0.08] active:bg-white/[0.14]'
              : 'hover:bg-black/[0.06] active:bg-black/[0.1]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              style={{ backgroundColor: theme.itemBg, color: theme.textSecondary }}
              className="w-7 h-7 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform"
            >
              <Mail className="w-3.5 h-3.5" />
            </div>
            <span>Send Feedback</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleItemClick(onOpenHelp)}
          style={{ color: theme.textPrimary }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer group ${
            theme.isDark
              ? 'hover:bg-white/[0.08] active:bg-white/[0.14]'
              : 'hover:bg-black/[0.06] active:bg-black/[0.1]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              style={{ backgroundColor: theme.itemBg, color: theme.textSecondary }}
              className="w-7 h-7 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </div>
            <span>Help & Guide</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleItemClick(onOpenAbout)}
          style={{ color: theme.textPrimary }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer group ${
            theme.isDark
              ? 'hover:bg-white/[0.08] active:bg-white/[0.14]'
              : 'hover:bg-black/[0.06] active:bg-black/[0.1]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              style={{ backgroundColor: theme.itemBg, color: theme.textSecondary }}
              className="w-7 h-7 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform"
            >
              <Info className="w-3.5 h-3.5" />
            </div>
            <span>About Calculator</span>
          </div>
          <span style={{ color: theme.textMuted }} className="text-[10px]">
            v1.0.0
          </span>
        </button>
      </div>
    </div>
  );
};
