/**
 * Scientific Mode Chevron Toggle
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.pro.bd/
 * © 2026 Prachurjo Calculator. All rights reserved.
 *
 * Minimal subtle chevron button placed above the keypad to expand/collapse scientific mode.
 */

import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics.ts';

interface ChevronToggleProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export const ChevronToggle: React.FC<ChevronToggleProps> = ({ isExpanded, onToggle }) => {
  return (
    <div className="w-full flex items-center justify-center py-1 select-none">
      <button
        type="button"
        onClick={() => {
          triggerHaptic('light');
          onToggle();
        }}
        aria-label={isExpanded ? 'Collapse scientific functions' : 'Expand scientific functions'}
        className="w-10 h-7 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 active:scale-90 transition-all outline-none"
      >
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 stroke-[2.5]" />
        ) : (
          <ChevronDown className="w-5 h-5 stroke-[2.5]" />
        )}
      </button>
    </div>
  );
};
