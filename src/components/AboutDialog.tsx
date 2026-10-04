/**
 * About Dialog
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Prachurjo Calculator. All rights reserved.
 */

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics.ts';

interface AboutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutDialog: React.FC<AboutDialogProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-[#EEF2F6] dark:bg-[#25282D] rounded-3xl p-6 shadow-2xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-slate-100 flex flex-col items-center text-center">
        {/* App Icon */}
        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md mb-3 flex items-center justify-center bg-[#1E293B]">
          <img
            src="/calculator-icon.svg"
            alt="Calculator icon"
            className="w-14 h-14"
          />
        </div>

        <h3 className="text-xl font-bold tracking-tight">Calculator</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Version 1.0.0 · Production Release
        </p>

        <div className="w-full my-4 py-3 border-y border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
          <p>
            <strong>Developer:</strong> Prachurjo Sorkar Porosh
          </p>
          <p className="flex items-center justify-center gap-1">
            <strong>Website:</strong>{' '}
            <a
              href="https://prachurjo.dev.cv"
              target="_blank"
              rel="noreferrer"
              className="text-[#087A36] dark:text-emerald-400 font-medium inline-flex items-center gap-0.5 hover:underline"
            >
              prachurjo.dev.cv <ExternalLink className="w-3 h-3" />
            </a>
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1">
            © 2026 Calculator. All rights reserved.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            onClose();
          }}
          className="w-full py-2.5 text-sm font-semibold text-white bg-[#087A36] hover:bg-[#076c30] rounded-full transition-colors shadow-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
};
