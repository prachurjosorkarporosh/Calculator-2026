/**
 * Top Bar Component with Voice Calculator Access & Developer Website Visit Link
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Prachurjo Calculator. All rights reserved.
 */

import React from 'react';
import { History, MoreVertical, Mic, Palette, Sparkles, Globe, ExternalLink } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics.ts';
import { getAppIconDataUri } from '../data/appIcons.ts';
import { ThemePalette } from '../data/themes.ts';

interface TopBarProps {
  onOpenHistory: () => void;
  onOpenMenu: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onOpenVoice: () => void;
  onOpenThemeStudio?: () => void;
  personalName?: string;
  onOpenCustomization?: () => void;
  appIconId?: string;
  onOpenAppIcons?: () => void;
  palette?: ThemePalette;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenHistory,
  onOpenMenu,
  onOpenVoice,
  onOpenThemeStudio,
  personalName,
  onOpenCustomization,
  appIconId = 'emerald-pro',
  onOpenAppIcons,
  palette,
}) => {
  const accentColor = palette?.equalsBg || palette?.accent || '#10b981';

  return (
    <header className="w-full flex items-center justify-between px-3 sm:px-4 pt-3 pb-1 select-none z-10">
      {/* Top Left: App Icon + History icon */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {onOpenAppIcons && (
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onOpenAppIcons();
            }}
            aria-label="App Icon Style (অ্যাপ আইকন পরিবর্তন)"
            title="App Icon Style (অ্যাপ আইকন পরিবর্তন)"
            className="w-8 h-8 rounded-xl overflow-hidden shadow-xs border border-white/20 active:scale-95 transition-all flex items-center justify-center p-0.5 hover:ring-2 hover:ring-emerald-500/50 cursor-pointer"
          >
            <img
              src={getAppIconDataUri(appIconId)}
              alt="App icon"
              className="w-full h-full object-cover rounded-[9px]"
            />
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            onOpenHistory();
          }}
          aria-label="Calculation history"
          title="History"
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          <History className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
        </button>
      </div>

      {/* Middle: Developer Website Link + Optional Personal Signature */}
      <div className="flex-1 flex items-center justify-center gap-1.5 px-1 min-w-0">
        {personalName && (
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onOpenCustomization && onOpenCustomization();
            }}
            title="Personalize settings"
            className="px-2 py-1 rounded-full bg-slate-200/60 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-800 dark:text-slate-200 text-xs font-bold truncate max-w-[90px] sm:max-w-[120px] flex items-center gap-1 transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
          >
            <Sparkles className="w-3 h-3 text-purple-500 shrink-0" />
            <span className="truncate">{personalName}</span>
          </button>
        )}

        {/* Home Page Direct Developer Website Visit Button */}
        <a
          href="https://prachurjo.dev.cv"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => triggerHaptic('light')}
          title="Developer Portfolio & Website: prachurjo.dev.cv"
          style={{
            borderColor: palette?.frameBorder || (palette?.isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)'),
            backgroundColor: palette?.isDark
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(0, 0, 0, 0.05)',
            color: palette?.displayText || 'inherit',
          }}
          className="px-2.5 py-1 rounded-full border text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 group hover:brightness-110 shrink-0"
        >
          <Globe
            style={{ color: accentColor }}
            className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform shrink-0"
          />
          <span className="truncate max-w-[100px] sm:max-w-[150px]">prachurjo.dev.cv</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 shrink-0" />
        </a>
      </div>

      {/* Top Right: Theme Studio, Voice Calculator Mic & 3-dot overflow menu */}
      <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
        {onOpenThemeStudio && (
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onOpenThemeStudio();
            }}
            aria-label="Theme Studio (থিম স্টুডিও পেজ)"
            title="Theme Studio (থিম স্টুডিও পেজ)"
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 active:scale-95 transition-all outline-none"
          >
            <Palette className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
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
          className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          <Mic className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
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
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
        </button>
      </div>
    </header>
  );
};
