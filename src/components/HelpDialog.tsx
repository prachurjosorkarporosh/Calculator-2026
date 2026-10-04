/**
 * Help Screen Dialog
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.pro.bd/
 * © 2026 Prachurjo Calculator. All rights reserved.
 *
 * Explains basic & scientific calculator functions, angle modes, inverse operations, etc.
 */

import React from 'react';
import { HelpCircle } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics.ts';

interface HelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpDialog: React.FC<HelpDialogProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#EEF2F6] dark:bg-[#25282D] rounded-3xl p-6 shadow-2xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-slate-100 max-h-[85vh] flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950/60 flex items-center justify-center text-[#004A77] dark:text-sky-400">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-medium tracking-tight">Calculator Help</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Guide & Function Reference
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 text-sm text-slate-600 dark:text-slate-300">
          <section>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
              Basic Calculations
            </h4>
            <p className="text-xs leading-relaxed">
              Standard arithmetic operations (+, −, ×, ÷) follow standard mathematical order of operations (precedence). Use ( ) for grouping expressions.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
              Scientific Mode (Optional)
            </h4>
            <p className="text-xs leading-relaxed">
              Tap the small chevron icon above the keypad to expand or collapse the scientific keyboard.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
              Angle Modes (DEG / RAD)
            </h4>
            <p className="text-xs leading-relaxed">
              Tap the <strong>rad</strong> or <strong>deg</strong> key in scientific mode to switch between Radian and Degree mode (e.g., in DEG mode: sin(30) = 0.5).
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
              Inverse Functions (INV)
            </h4>
            <p className="text-xs leading-relaxed">
              Tap <strong>INV</strong> to reveal inverse trigonometric functions (sin⁻¹, cos⁻¹, tan⁻¹).
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
              Power, Factorial, Root & Logs
            </h4>
            <p className="text-xs leading-relaxed">
              Use <strong>^</strong> for exponentiation (e.g., 2^3 = 8), <strong>!</strong> for factorial (5! = 120), <strong>√</strong> for square root, <strong>ln</strong> for natural log, and <strong>log</strong> for base-10 log.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
              AC & Backspace
            </h4>
            <p className="text-xs leading-relaxed">
              <strong>AC</strong> clears the entire current expression and result. The backspace key <strong>⌫</strong> deletes the last entered character or function token.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
              History
            </h4>
            <p className="text-xs leading-relaxed">
              Tap the top-left clock icon to view previous calculations. Tap any history item to restore its expression and result directly into the active display.
            </p>
          </section>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="px-6 py-2 text-sm font-semibold text-white bg-[#087A36] hover:bg-[#076c30] rounded-full transition-colors shadow-sm"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
