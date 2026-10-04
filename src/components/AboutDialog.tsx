/**
 * About Dialog (Theme-Adaptive)
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Prachurjo Calculator. All rights reserved.
 */

import React from 'react';
import { ExternalLink, ShieldCheck, X } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics.ts';
import { ThemePalette } from '../data/themes.ts';
import { getModalThemeStyles } from '../utils/themeStyles.ts';

interface AboutDialogProps {
  isOpen: boolean;
  palette?: ThemePalette;
  onClose: () => void;
}

export const AboutDialog: React.FC<AboutDialogProps> = ({
  isOpen,
  palette,
  onClose,
}) => {
  const theme = getModalThemeStyles(palette);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in duration-150 select-none">
      <div
        style={{
          backgroundColor: theme.dialogBg,
          borderColor: theme.dialogBorder,
          color: theme.textPrimary,
          boxShadow: theme.isDark
            ? '0 25px 60px rgba(0,0,0,0.7)'
            : '0 20px 50px rgba(0,0,0,0.18)',
        }}
        className="w-full max-w-sm rounded-3xl p-6 border flex flex-col items-center text-center relative overflow-hidden transition-colors"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            onClose();
          }}
          style={{ color: theme.textSecondary }}
          className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            theme.isDark ? 'hover:bg-white/10 hover:text-white' : 'hover:bg-black/10 hover:text-black'
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* App Icon */}
        <div
          style={{
            borderColor: theme.dialogBorder,
            backgroundColor: theme.subtleAccentBg,
          }}
          className="relative w-20 h-20 rounded-3xl overflow-hidden shadow-2xl mb-4 border flex items-center justify-center p-2.5"
        >
          <img
            src="/calculator-icon.svg"
            alt="Calculator icon"
            className="w-full h-full object-contain"
          />
        </div>

        <h3 className="text-xl font-bold tracking-tight flex items-center gap-1.5">
          <span>Calculator</span>
          <span
            style={{
              backgroundColor: theme.subtleAccentBg,
              color: theme.accentColor,
            }}
            className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold"
          >
            v1.0.0
          </span>
        </h3>
        <p style={{ color: theme.textSecondary }} className="text-xs mt-1">
          Production Android Scientific Calculator
        </p>

        {/* Developer Info Card */}
        <div
          style={{
            backgroundColor: theme.itemBg,
            borderColor: theme.itemBorder,
          }}
          className="w-full my-4 p-4 rounded-2xl border text-xs space-y-2 text-left"
        >
          <div className="flex items-center justify-between">
            <span style={{ color: theme.textSecondary }}>Developer</span>
            <span style={{ color: theme.textPrimary }} className="font-semibold">
              Prachurjo Sorkar Porosh
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span style={{ color: theme.textSecondary }}>Portfolio</span>
            <a
              href="https://prachurjo.dev.cv"
              target="_blank"
              rel="noreferrer"
              style={{ color: theme.accentColor }}
              className="font-medium inline-flex items-center gap-1 hover:underline"
            >
              <span>prachurjo.dev.cv</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center justify-between">
            <span style={{ color: theme.textSecondary }}>Security</span>
            <span
              style={{ color: theme.accentColor }}
              className="flex items-center gap-1 font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Offline
            </span>
          </div>
        </div>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-5">
          {['React 19', 'TypeScript', 'Tailwind 4', 'IndexedDB', 'Web Audio', 'Bilingual Voice'].map(
            (tech) => (
              <span
                key={tech}
                style={{
                  backgroundColor: theme.tagBg,
                  borderColor: theme.itemBorder,
                  color: theme.textSecondary,
                }}
                className="text-[10px] px-2 py-0.5 rounded-md border"
              >
                {tech}
              </span>
            )
          )}
        </div>

        <p style={{ color: theme.textMuted }} className="text-[11px] mb-4">
          © 2026 Prachurjo Calculator. All rights reserved.
        </p>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            onClose();
          }}
          style={{
            backgroundColor: theme.accentBg,
            color: theme.accentText,
          }}
          className="w-full py-2.5 text-xs font-bold rounded-xl transition-all shadow-lg active:scale-98 cursor-pointer hover:brightness-110"
        >
          Close
        </button>
      </div>
    </div>
  );
};
