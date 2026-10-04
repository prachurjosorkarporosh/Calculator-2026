/**
 * Top Bar Component with Voice Calculator Access
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.pro.bd/
 * © 2026 Prachurjo Calculator. All rights reserved.
 */

import React from 'react';
import { History, MoreVertical, Mic, Palette, Sparkles } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics.ts';

interface TopBarProps {
  onOpenHistory: () => void;
  onOpenMenu: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onOpenVoice: () => void;
  onOpenThemeStudio?: () => void;
  personalName?: string;
  onOpenCustomization?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenHistory,
  onOpenMenu,
  onOpenVoice,
  onOpenThemeStudio,
  personalName,
  onOpenCustomization,
}) => {
  return (
    <header className="w-full flex items-center justify-between px-4 pt-3 pb-1 select-none z-10">
      {/* Top Left: History icon */}
      <button
        type="button"
        onClick={() => {
          triggerHaptic('light');
          onOpenHistory();
        }}
        aria-label="Calculation history"
        title="History"
        className="w-10 h-10 flex items-center justify-center rounded-full text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
      >
        <History className="w-5 h-5 stroke-[2.2]" />
      </button>

      {/* Middle: Personal Name / Signature Badge */}
      {personalName ? (
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            onOpenCustomization && onOpenCustomization();
          }}
          title="Personalize settings"
          className="px-3 py-1 rounded-full bg-slate-200/60 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-800 dark:text-slate-200 text-xs font-bold truncate max-w-[130px] sm:max-w-[200px] flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-500 shrink-0" />
          <span className="truncate">{personalName}</span>
        </button>
      ) : (
        <div className="flex-1" />
      )}

      {/* Top Right: Voice Calculator Mic, Theme Studio & 3-dot overflow menu */}
      <div className="flex items-center gap-1">
        {onOpenThemeStudio && (
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onOpenThemeStudio();
            }}
            aria-label="Theme Studio (থিম স্টুডিও পেজ)"
            title="Theme Studio (থিম স্টুডিও পেজ)"
            className="w-10 h-10 flex items-center justify-center rounded-full text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 active:scale-95 transition-all outline-none"
          >
            <Palette className="w-5 h-5 stroke-[2.2]" />
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            triggerHaptic('medium');
            onOpenVoice();
          }}
          aria-label="Voice Calculator (ভয়েস ক্যালকুলেটর)"
          title="Voice Calculator (মুখে বলে হিসাব করুন)"
          className="relative w-10 h-10 flex items-center justify-center rounded-full text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          <Mic className="w-5 h-5 stroke-[2.2]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            triggerHaptic('light');
            onOpenMenu(e);
          }}
          aria-label="More options"
          title="More options"
          className="w-10 h-10 flex items-center justify-center rounded-full text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          <MoreVertical className="w-5 h-5 stroke-[2.2]" />
        </button>
      </div>
    </header>
  );
};
