/**
 * ThemePreviewCard - High-fidelity visual preview card for calculator themes
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Prachurjo Calculator. All rights reserved.
 *
 * Renders an aspect-4/3 card identical in layout, typography and structure to wallpaper cards,
 * featuring an authentic miniature calculator screen and keypad with real theme colors and backgrounds.
 */

import React from 'react';
import { Check } from 'lucide-react';
import { ThemePalette } from '../data/themes.ts';

interface ThemePreviewCardProps {
  theme: ThemePalette;
  isSelected: boolean;
  onSelect: () => void;
}

export const ThemePreviewCard: React.FC<ThemePreviewCardProps> = ({
  theme,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-2xl overflow-hidden aspect-4/3 cursor-pointer border transition-all select-none ${
        isSelected
          ? 'border-purple-500 ring-4 ring-purple-500/40 shadow-xl scale-[1.02]'
          : 'border-slate-800 hover:border-slate-600 hover:scale-[1.01]'
      }`}
      style={{
        backgroundColor: theme.bg,
      }}
    >
      {/* Background Image / Aurora if applicable */}
      {theme.bgImage && (
        <img
          src={theme.bgImage}
          alt={theme.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
      )}

      {/* Glassmorphic / Gradient Overlay layer */}
      <div
        className="absolute inset-0 transition-opacity"
        style={{
          backgroundColor: theme.bgImage ? `rgba(0,0,0,${(theme.bgOverlayOpacity ?? 40) / 100})` : 'transparent',
          backdropFilter: theme.bgImage ? `blur(${theme.bgBlur ?? 2}px)` : 'none',
        }}
      />

      {/* Miniature Calculator Mockup Inside Card */}
      <div className="absolute inset-x-2.5 top-2 bottom-12 flex flex-col justify-between pointer-events-none">
        {/* Mini Display Bar */}
        <div
          className="px-2 py-1 rounded-lg border border-white/10 flex items-center justify-between shadow-xs"
          style={{
            backgroundColor: theme.surface,
          }}
        >
          <span
            className="text-[9px] font-mono opacity-60 truncate"
            style={{ color: theme.secondaryText }}
          >
            128 × 4
          </span>
          <span
            className="text-[11px] font-bold font-mono tracking-tight"
            style={{ color: theme.displayText }}
          >
            512
          </span>
        </div>

        {/* Mini Keypad Grid (3 rows x 4 cols) */}
        <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-black/25 backdrop-blur-xs border border-white/5">
          {/* Row 1 */}
          <div
            className="h-3.5 rounded flex items-center justify-center text-[8px] font-bold"
            style={{ backgroundColor: theme.numberBg, color: theme.numberText }}
          >
            7
          </div>
          <div
            className="h-3.5 rounded flex items-center justify-center text-[8px] font-bold"
            style={{ backgroundColor: theme.numberBg, color: theme.numberText }}
          >
            8
          </div>
          <div
            className="h-3.5 rounded flex items-center justify-center text-[8px] font-bold"
            style={{ backgroundColor: theme.numberBg, color: theme.numberText }}
          >
            9
          </div>
          <div
            className="h-3.5 rounded flex items-center justify-center text-[8px] font-bold"
            style={{ backgroundColor: theme.operatorBg, color: theme.operatorText }}
          >
            ÷
          </div>

          {/* Row 2 */}
          <div
            className="h-3.5 rounded flex items-center justify-center text-[8px] font-bold"
            style={{ backgroundColor: theme.numberBg, color: theme.numberText }}
          >
            4
          </div>
          <div
            className="h-3.5 rounded flex items-center justify-center text-[8px] font-bold"
            style={{ backgroundColor: theme.numberBg, color: theme.numberText }}
          >
            5
          </div>
          <div
            className="h-3.5 rounded flex items-center justify-center text-[8px] font-bold"
            style={{ backgroundColor: theme.numberBg, color: theme.numberText }}
          >
            6
          </div>
          <div
            className="h-3.5 rounded flex items-center justify-center text-[8px] font-bold"
            style={{ backgroundColor: theme.operatorBg, color: theme.operatorText }}
          >
            ×
          </div>

          {/* Row 3 */}
          <div
            className="h-3.5 rounded flex items-center justify-center text-[8px] font-bold"
            style={{ backgroundColor: theme.numberBg, color: theme.numberText }}
          >
            1
          </div>
          <div
            className="h-3.5 rounded flex items-center justify-center text-[8px] font-bold"
            style={{ backgroundColor: theme.numberBg, color: theme.numberText }}
          >
            2
          </div>
          <div
            className="h-3.5 rounded flex items-center justify-center text-[8px] font-bold"
            style={{ backgroundColor: theme.numberBg, color: theme.numberText }}
          >
            3
          </div>
          <div
            className="h-3.5 rounded flex items-center justify-center text-[8px] font-bold shadow-xs"
            style={{ backgroundColor: theme.equalsBg, color: theme.equalsText }}
          >
            =
          </div>
        </div>
      </div>

      {/* Bottom Gradient Scrim Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-3">
        <div className="flex items-center justify-between gap-1">
          <span className="text-xs font-semibold text-white truncate tracking-tight">
            {theme.name}
          </span>
          {isSelected && (
            <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5 truncate">
          <span className="truncate">{theme.nameBn || theme.name}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-400">{theme.category}</span>
        </div>
      </div>
    </div>
  );
};
