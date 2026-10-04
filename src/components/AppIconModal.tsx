/**
 * App Icon Changer Modal (অ্যাপ আইকন পরিবর্তন)
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Prachurjo Calculator. All rights reserved.
 */

import React from 'react';
import { X, Check, Smartphone, Sparkles } from 'lucide-react';
import { APP_ICONS, AppIconOption, getAppIconDataUri } from '../data/appIcons.ts';
import { triggerHaptic } from '../utils/haptics.ts';

interface AppIconModalProps {
  isOpen: boolean;
  activeIconId: string;
  onSelectIcon: (iconId: string) => void;
  onClose: () => void;
}

export const AppIconModal: React.FC<AppIconModalProps> = ({
  isOpen,
  activeIconId,
  onSelectIcon,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 animate-in fade-in duration-150 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-[#EEF2F6] dark:bg-[#1E2126] text-slate-800 dark:text-slate-100 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700/60 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between bg-white/50 dark:bg-black/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight">
                App Icon Style (অ্যাপ আইকন)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose your favorite launcher and tab icon
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

        {/* Icon Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {APP_ICONS.map((icon: AppIconOption) => {
            const isSelected = activeIconId === icon.id;
            const iconUri = getAppIconDataUri(icon.id);

            return (
              <div
                key={icon.id}
                onClick={() => {
                  triggerHaptic('medium');
                  onSelectIcon(icon.id);
                }}
                className={`p-3.5 rounded-2xl cursor-pointer transition-all border flex items-center gap-3.5 ${
                  isSelected
                    ? 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500 shadow-md ring-2 ring-emerald-500/30'
                    : 'bg-white/80 dark:bg-black/25 border-slate-200/70 dark:border-slate-700/50 hover:bg-white dark:hover:bg-black/40'
                }`}
              >
                {/* Icon Image Preview */}
                <div className="relative w-14 h-14 shrink-0 rounded-2xl overflow-hidden shadow-md">
                  <img
                    src={iconUri}
                    alt={icon.name}
                    className="w-full h-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                      {icon.name}
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium truncate mt-0.5">
                    {icon.nameBn}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {icon.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-700/60 bg-white/50 dark:bg-black/20 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Changes browser tab & header icon
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors shadow-sm"
          >
            Apply & Done
          </button>
        </div>
      </div>
    </div>
  );
};
