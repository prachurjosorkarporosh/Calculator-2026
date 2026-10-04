/**
 * 50+ Fonts Gallery & Customizer Modal
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.pro.bd/
 * © 2026 Prachurjo Calculator. All rights reserved.
 */

import React, { useState, useMemo } from 'react';
import { X, Search, Check, Type, Sparkles, Pin } from 'lucide-react';
import { FONTS_CATALOG, FontOption, SYSTEM_FONT } from '../data/fonts.ts';
import { triggerHaptic } from '../utils/haptics.ts';

interface FontSelectorModalProps {
  isOpen: boolean;
  activeFontId: string;
  onSelectFont: (fontId: string) => void;
  onClose: () => void;
}

export const FontSelectorModal: React.FC<FontSelectorModalProps> = ({
  isOpen,
  activeFontId,
  onSelectFont,
  onClose,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Modern Sans', 'Tech & Mono', 'Futuristic', 'Editorial Serif', 'Handwriting'];

  const filteredFonts = useMemo(() => {
    return FONTS_CATALOG.filter((f) => {
      const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
      const matchesSearch =
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.category.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#EEF2F6] dark:bg-[#1E2126] text-slate-800 dark:text-slate-100 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700/60 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between bg-white/50 dark:bg-black/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight">
                Typography & Fonts Gallery
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose from 50+ beautiful typefaces for display & keys
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-700/60 bg-white/30 dark:bg-black/10">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search 50+ fonts by name or style..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Categories Tab Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2.5 pb-1 scrollbar-none text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setSelectedCategory(cat);
                }}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-black/10 dark:hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Pinned Phone System Font Card (Always at the top) */}
        <div className="p-3 sm:px-4 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-indigo-950/40 border-b border-indigo-200/50 dark:border-indigo-800/40">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Pin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 fill-indigo-600 dark:fill-indigo-400" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-indigo-700 dark:text-indigo-300">
                Pinned · ফোনের সিস্টেম ফন্ট (Phone System Font)
              </span>
            </div>
            {activeFontId === SYSTEM_FONT.id && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <Check className="w-3.5 h-3.5 stroke-[3]" /> Active
              </span>
            )}
          </div>

          <div
            onClick={() => {
              triggerHaptic('light');
              onSelectFont(SYSTEM_FONT.id);
            }}
            className={`p-3 rounded-2xl cursor-pointer transition-all border ${
              activeFontId === SYSTEM_FONT.id
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                : 'bg-white/80 dark:bg-slate-800/80 border-indigo-200/70 dark:border-indigo-700/60 hover:bg-white dark:hover:bg-slate-800 text-slate-900 dark:text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-sm">
                  {SYSTEM_FONT.name}
                </div>
                <div className={`text-[11px] ${activeFontId === SYSTEM_FONT.id ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  Uses your mobile device's native OS font (Android / iOS / Windows)
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                activeFontId === SYSTEM_FONT.id
                  ? 'bg-white/20 text-white'
                  : 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'
              }`}>
                Native UI
              </span>
            </div>
            <div
              style={{ fontFamily: SYSTEM_FONT.family }}
              className={`text-base sm:text-xl font-medium tracking-tight mt-1.5 overflow-hidden text-ellipsis whitespace-nowrap ${
                activeFontId === SYSTEM_FONT.id ? 'text-white' : 'text-slate-800 dark:text-slate-100'
              }`}
            >
              1,234,567.89 × 42 = 51,851,851.38
            </div>
          </div>
        </div>

        {/* Fonts Grid */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
          {filteredFonts.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
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
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-indigo-500/10 dark:bg-indigo-500/20 border-indigo-500/50 shadow-sm'
                      : 'bg-white/70 dark:bg-black/20 border-slate-200/50 dark:border-slate-700/40 hover:bg-white dark:hover:bg-black/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {f.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-slate-500 dark:text-slate-400">
                        {f.category}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        <Check className="w-4 h-4 stroke-[3]" /> Selected
                      </span>
                    )}
                  </div>

                  {/* Font Live Sample */}
                  <div
                    style={{ fontFamily: f.family }}
                    className="text-lg sm:text-2xl tracking-tight text-slate-800 dark:text-slate-100 overflow-hidden text-ellipsis whitespace-nowrap py-1"
                  >
                    1,234,567.89 × 42 = 51,851,851.38
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-700/60 bg-white/50 dark:bg-black/20 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            Showing {filteredFonts.length} of {FONTS_CATALOG.length} fonts
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors shadow-sm"
          >
            Apply & Done
          </button>
        </div>
      </div>
    </div>
  );
};
