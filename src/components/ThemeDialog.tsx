/**
 * Choose Theme Dialog
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.pro.bd/
 * © 2026 Prachurjo Calculator. All rights reserved.
 *
 * Implements Android Material 3 radio dialog for:
 * - System default
 * - Light
 * - Dark
 */

import React, { useState } from 'react';
import { ThemeMode } from '../types.ts';
import { triggerHaptic } from '../utils/haptics.ts';

interface ThemeDialogProps {
  isOpen: boolean;
  currentTheme: ThemeMode;
  onClose: () => void;
  onSelectTheme: (theme: ThemeMode) => void;
}

export const ThemeDialog: React.FC<ThemeDialogProps> = ({
  isOpen,
  currentTheme,
  onClose,
  onSelectTheme,
}) => {
  const [selected, setSelected] = useState<ThemeMode>(currentTheme);

  if (!isOpen) return null;

  const options: { id: ThemeMode; label: string }[] = [
    { id: 'system', label: 'System default' },
    { id: 'light', label: 'Light' },
    { id: 'dark', label: 'Dark' },
  ];

  const handleSave = () => {
    triggerHaptic('light');
    onSelectTheme(selected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xs bg-[#EEF2F6] dark:bg-[#25282D] rounded-3xl p-6 shadow-2xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-slate-100 select-none">
        <h3 className="text-xl font-medium mb-4 tracking-tight">Choose theme</h3>

        <div className="space-y-3 mb-6">
          {options.map((opt) => (
            <label
              key={opt.id}
              onClick={() => {
                triggerHaptic('light');
                setSelected(opt.id);
              }}
              className="flex items-center gap-3 cursor-pointer py-1.5 px-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  selected === opt.id
                    ? 'border-[#087A36] dark:border-emerald-400'
                    : 'border-slate-400 dark:border-slate-500'
                }`}
              >
                {selected === opt.id && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#087A36] dark:bg-emerald-400" />
                )}
              </div>
              <span className="text-base">{opt.label}</span>
            </label>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-sm font-semibold text-white bg-[#087A36] hover:bg-[#076c30] rounded-full transition-colors shadow-sm"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
