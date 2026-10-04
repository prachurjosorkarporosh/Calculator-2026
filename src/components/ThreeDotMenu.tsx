/**
 * Top-Right Overflow Menu
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Prachurjo Calculator. All rights reserved.
 *
 * Implements Android Material 3 popup menu with:
 * 1. Clear history
 * 2. Sound effects quick toggle
 * 3. Choose theme (12+ themes)
 * 4. 50+ Fonts gallery
 * 5. App Icon Changer
 * 6. Personalize & Sizing
 * 7. Settings
 * 8. Privacy Policy
 * 9. Send feedback
 * 10. Help
 * 11. About
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
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics.ts';
import { playKeypressSound } from '../utils/sound.ts';

interface ThreeDotMenuProps {
  isOpen: boolean;
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
  onOpenOnboarding?: () => void;
  onOpenPrivacy: () => void;
  onSendFeedback: () => void;
  onOpenHelp: () => void;
  onOpenAbout: () => void;
}

export const ThreeDotMenu: React.FC<ThreeDotMenuProps> = ({
  isOpen,
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
  onOpenOnboarding,
  onOpenPrivacy,
  onSendFeedback,
  onOpenHelp,
  onOpenAbout,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
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
      className="absolute top-12 right-4 z-50 min-w-[230px] py-1.5 bg-[#EEF2F6] dark:bg-[#25282D] rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 animate-in fade-in zoom-in-95 duration-100 origin-top-right text-slate-800 dark:text-slate-100 select-none max-h-[85vh] overflow-y-auto"
    >
      <button
        type="button"
        onClick={() => handleItemClick(onClearHistory)}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors"
      >
        <Trash2 className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        <span>Clear history</span>
      </button>

      {/* Keypress Sound Quick Switch */}
      <div
        onClick={handleSoundToggle}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-3">
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-[#087A36] dark:text-emerald-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-400" />
          )}
          <span>Sound effects</span>
        </div>
        <div
          className={`w-9 h-5 flex items-center rounded-full p-0.5 duration-200 transition-colors ${
            soundEnabled
              ? 'bg-[#087A36] dark:bg-emerald-500'
              : 'bg-slate-300 dark:bg-slate-600'
          }`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${
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
          className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Mic className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>ভয়েস ক্যালকুলেটর (Voice)</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold uppercase">
            New
          </span>
        </button>
      )}

      {/* Phone Database Manager */}
      {onOpenDatabase && (
        <button
          type="button"
          onClick={() => handleItemClick(onOpenDatabase)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>ফোন ডাটাবেজ (Phone DB)</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold uppercase">
            DB
          </span>
        </button>
      )}

      <div className="h-[1px] bg-slate-200 dark:bg-slate-700/60 my-1 mx-2" />

      {/* Theme Studio Dedicated Page */}
      <button
        type="button"
        onClick={() => handleItemClick(onOpenThemes)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Palette className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>থিম স্টুডিও (Theme Studio)</span>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold uppercase">
          Studio
        </span>
      </button>

      {/* 50+ Fonts Gallery */}
      <button
        type="button"
        onClick={() => handleItemClick(onOpenFonts)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Type className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>50+ Fonts Gallery</span>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold">
          52
        </span>
      </button>

      {/* App Icon Changer */}
      {onOpenAppIcons && (
        <button
          type="button"
          onClick={() => handleItemClick(onOpenAppIcons)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>অ্যাপ আইকন (App Icon)</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold uppercase">
            Icon
          </span>
        </button>
      )}

      {/* Sizing & Customization */}
      <button
        type="button"
        onClick={() => handleItemClick(onOpenCustomization)}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <span>Personalize & Sizing</span>
      </button>

      <button
        type="button"
        onClick={() => handleItemClick(onOpenSettings)}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors"
      >
        <Settings className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        <span>Settings</span>
      </button>

      {onOpenOnboarding && (
        <button
          type="button"
          onClick={() => handleItemClick(onOpenOnboarding)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors text-purple-600 dark:text-purple-400"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4" />
            <span>স্বাগতম সেটআপ (Welcome Setup)</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 font-bold uppercase">
            100+
          </span>
        </button>
      )}

      <div className="h-[1px] bg-slate-200 dark:bg-slate-700/60 my-1 mx-2" />

      <button
        type="button"
        onClick={() => handleItemClick(onOpenPrivacy)}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors"
      >
        <ShieldCheck className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        <span>Privacy Policy</span>
      </button>

      <button
        type="button"
        onClick={() => handleItemClick(onSendFeedback)}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors"
      >
        <Mail className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        <span>Send feedback</span>
      </button>

      <button
        type="button"
        onClick={() => handleItemClick(onOpenHelp)}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors"
      >
        <HelpCircle className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        <span>Help</span>
      </button>

      <button
        type="button"
        onClick={() => handleItemClick(onOpenAbout)}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors"
      >
        <Info className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        <span>About</span>
      </button>
    </div>
  );
};
