/**
 * 50+ Fonts Gallery & Customizer Modal (Theme-Adaptive)
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Prachurjo Calculator. All rights reserved.
 *
 * Dynamically adapts to the currently active Theme Palette (Light, Dark, OLED, Cyber, Pastel, Custom).
 */

import React, { useState, useMemo } from 'react';
import { X, Search, Check, Type, Sparkles, Pin } from 'lucide-react';
import { FONTS_CATALOG, FontOption, SYSTEM_FONT } from '../data/fonts.ts';
import { triggerHaptic } from '../utils/haptics.ts';
import { ThemePalette } from '../data/themes.ts';
import { getModalThemeStyles } from '../utils/themeStyles.ts';

interface FontSelectorModalProps {
  isOpen: boolean;
  palette?: ThemePalette;
  activeFontId: string;
  onSelectFont: (fontId: string) => void;
  onClose: () => void;
}

export const FontSelectorModal: React.FC<FontSelectorModalProps> = ({
  isOpen,
  palette,
  activeFontId,
  onSelectFont,
  onClose,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [customSampleText, setCustomSampleText] = useState('1,234,567.89 × 42 = 51,851,851.38');

  const theme = getModalThemeStyles(palette);

  const categories = [
    'All',
    'Modern Sans',
    'Tech & Mono',
    'Futuristic',
    'Editorial Serif',
    'Handwriting',
  ];

  const filteredFonts = useMemo(() => {
    return FONTS_CATALOG.filter((f) => {
      const matchesCategory =
        selectedCategory === 'All' || f.category === selectedCategory;
      const matchesSearch =
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.category.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-md animate-in fade-in duration-150 select-none">
      <div
        style={{
          backgroundColor: theme.dialogBg,
          borderColor: theme.dialogBorder,
          color: theme.textPrimary,
          boxShadow: theme.isDark
            ? '0 25px 60px rgba(0,0,0,0.7)'
            : '0 20px 50px rgba(0,0,0,0.18)',
        }}
        className="w-full max-w-xl rounded-3xl border overflow-hidden flex flex-col max-h-[90vh] transition-colors"
      >
        {/* Header */}
        <div
          style={{
            borderColor: theme.headerBorder,
            backgroundColor: theme.headerBg,
          }}
          className="px-5 py-4 border-b flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div
              style={{
                backgroundColor: theme.subtleAccentBg,
                color: theme.accentColor,
                borderColor: theme.subtleAccentBorder,
              }}
              className="w-10 h-10 rounded-2xl flex items-center justify-center border"
            >
              <Type className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-2">
                <span>Typography & Font Studio</span>
                <span
                  style={{
                    backgroundColor: theme.subtleAccentBg,
                    color: theme.accentColor,
                  }}
                  className="text-[10px] px-2 py-0.5 rounded-full font-bold font-mono"
                >
                  52 Fonts
                </span>
              </h3>
              <p style={{ color: theme.textSecondary }} className="text-[11px]">
                Choose typography for display area and keypad buttons
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ color: theme.textSecondary }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              theme.isDark ? 'hover:bg-white/10 hover:text-white' : 'hover:bg-black/10 hover:text-black'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Custom Preview Input */}
        <div
          style={{
            borderColor: theme.headerBorder,
            backgroundColor: theme.headerBg,
          }}
          className="p-3.5 border-b space-y-2.5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search style={{ color: theme.textMuted }} className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search 52+ fonts..."
                style={{
                  backgroundColor: theme.itemBg,
                  borderColor: theme.itemBorder,
                  color: theme.textPrimary,
                }}
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border outline-none transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  style={{ color: theme.textMuted }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Live Sample Text Editor */}
            <div className="relative">
              <input
                type="text"
                value={customSampleText}
                onChange={(e) => setCustomSampleText(e.target.value)}
                placeholder="Type custom test math..."
                style={{
                  backgroundColor: theme.itemBg,
                  borderColor: theme.itemBorder,
                  color: theme.accentColor,
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border outline-none font-mono"
              />
            </div>
          </div>

          {/* Categories Tab Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setSelectedCategory(cat);
                }}
                style={{
                  backgroundColor: selectedCategory === cat ? theme.accentBg : theme.itemBg,
                  color: selectedCategory === cat ? theme.accentText : theme.textSecondary,
                }}
                className="px-3 py-1.5 rounded-xl whitespace-nowrap font-bold transition-all cursor-pointer"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Pinned Phone System Font Card */}
        <div
          style={{
            backgroundColor: theme.subtleAccentBg,
            borderColor: theme.headerBorder,
          }}
          className="px-4 py-2.5 border-b"
        >
          <div
            onClick={() => {
              triggerHaptic('light');
              onSelectFont(SYSTEM_FONT.id);
            }}
            style={{
              backgroundColor: activeFontId === SYSTEM_FONT.id ? theme.subtleAccentBg : theme.itemBg,
              borderColor: activeFontId === SYSTEM_FONT.id ? theme.accentColor : theme.itemBorder,
            }}
            className="p-3 rounded-2xl cursor-pointer transition-all border"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pin style={{ color: theme.accentColor }} className="w-3.5 h-3.5 fill-current" />
                <span className="font-bold text-xs">
                  {SYSTEM_FONT.name}
                </span>
                <span
                  style={{
                    backgroundColor: theme.subtleAccentBg,
                    color: theme.accentColor,
                  }}
                  className="text-[10px] px-1.5 py-0.2 rounded font-semibold"
                >
                  Phone Native OS Font
                </span>
              </div>
              {activeFontId === SYSTEM_FONT.id && (
                <span style={{ color: theme.accentColor }} className="flex items-center gap-1 text-xs font-bold">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> Active
                </span>
              )}
            </div>
            <div
              style={{ fontFamily: SYSTEM_FONT.family }}
              className="text-base sm:text-lg font-medium tracking-tight mt-1 truncate"
            >
              {customSampleText || '1,234,567.89 × 42 = 51,851,851.38'}
            </div>
          </div>
        </div>

        {/* Fonts Grid */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
          {filteredFonts.length === 0 ? (
            <div style={{ color: theme.textMuted }} className="py-12 text-center">
              <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No fonts found matching "{search}"</p>
            </div>
          ) : (
            filteredFonts.map((f: FontOption) => {
              const isSelected = activeFontId === f.id;
              return (
                <div
                  key={f.id}
                  onClick={() => {
                    triggerHaptic('light');
                    onSelectFont(f.id);
                  }}
                  style={{
                    backgroundColor: isSelected ? theme.subtleAccentBg : theme.itemBg,
                    borderColor: isSelected ? theme.accentColor : theme.itemBorder,
                  }}
                  className="p-3.5 rounded-2xl cursor-pointer transition-all border"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs">
                        {f.name}
                      </span>
                      <span
                        style={{
                          backgroundColor: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                          color: theme.textSecondary,
                        }}
                        className="text-[10px] px-2 py-0.5 rounded-md"
                      >
                        {f.category}
                      </span>
                    </div>
                    {isSelected && (
                      <span style={{ color: theme.accentColor }} className="flex items-center gap-1 text-xs font-bold">
                        <Check className="w-3.5 h-3.5 stroke-[3]" /> Active Font
                      </span>
                    )}
                  </div>

                  {/* Font Live Sample */}
                  <div
                    style={{ fontFamily: f.family }}
                    className="text-lg sm:text-xl tracking-tight truncate py-1"
                  >
                    {customSampleText || '1,234,567.89 × 42 = 51,851,851.38'}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            borderColor: theme.footerBorder,
            backgroundColor: theme.footerBg,
          }}
          className="px-5 py-3.5 border-t flex items-center justify-between text-xs"
        >
          <span style={{ color: theme.textSecondary }}>
            {filteredFonts.length} of {FONTS_CATALOG.length} fonts
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              backgroundColor: theme.accentBg,
              color: theme.accentText,
            }}
            className="px-6 py-2 rounded-xl font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            Apply & Done
          </button>
        </div>
      </div>
    </div>
  );
};
