/**
 * Privacy Policy Dialog (Theme-Adaptive)
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Prachurjo Calculator. All rights reserved.
 *
 * 100% Offline Device Security & Privacy Architecture
 * Dynamically adapts to the currently active Theme Palette
 */

import React from 'react';
import { ShieldCheck, HardDrive, WifiOff, Lock, EyeOff, X } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics.ts';
import { ThemePalette } from '../data/themes.ts';
import { getModalThemeStyles } from '../utils/themeStyles.ts';

interface PrivacyDialogProps {
  isOpen: boolean;
  palette?: ThemePalette;
  onClose: () => void;
}

export const PrivacyDialog: React.FC<PrivacyDialogProps> = ({
  isOpen,
  palette,
  onClose,
}) => {
  const theme = getModalThemeStyles(palette);

  if (!isOpen) return null;

  const points = [
    {
      icon: WifiOff,
      title: '100% Offline-First',
      desc: 'Never requires internet access. All calculation formulas and algorithms run directly on your hardware.',
    },
    {
      icon: HardDrive,
      title: 'Local Device Storage (IndexedDB)',
      desc: 'Your history, customized colors, and uploaded wallpapers remain exclusively inside your device.',
    },
    {
      icon: EyeOff,
      title: 'Zero Tracking & No Analytics',
      desc: 'No cookies, telemetry, user tracking, advertisements, or background telemetry whatsoever.',
    },
    {
      icon: Lock,
      title: 'No Sign-in or Account Required',
      desc: 'Instant access. No email, registration, personal identifiers, or cloud permissions needed.',
    },
  ];

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
        className="w-full max-w-md rounded-3xl border overflow-hidden flex flex-col max-h-[90vh] transition-colors"
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
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-2">
                <span>Privacy & Security</span>
                <span
                  style={{
                    backgroundColor: theme.subtleAccentBg,
                    color: theme.accentColor,
                  }}
                  className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold"
                >
                  Offline
                </span>
              </h3>
              <p style={{ color: theme.textSecondary }} className="text-[11px]">
                Calculator · Privacy Architecture
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 scrollbar-thin">
          <p style={{ color: theme.textSecondary }} className="text-xs leading-relaxed">
            Your privacy is absolute. <strong>Calculator</strong> is engineered from the ground up as a pure offline software utility.
          </p>

          <div className="space-y-2.5">
            {points.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  style={{
                    backgroundColor: theme.itemBg,
                    borderColor: theme.itemBorder,
                  }}
                  className="p-3.5 rounded-2xl border flex items-start gap-3"
                >
                  <div
                    style={{
                      backgroundColor: theme.subtleAccentBg,
                      color: theme.accentColor,
                    }}
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div style={{ color: theme.textPrimary }} className="text-xs font-bold">
                      {p.title}
                    </div>
                    <div
                      style={{ color: theme.textSecondary }}
                      className="text-[11px] mt-0.5 leading-relaxed"
                    >
                      {p.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ color: theme.textMuted }} className="pt-2 text-[11px]">
            Developer: Prachurjo Sorkar Porosh ·{' '}
            <a
              href="https://prachurjo.dev.cv"
              target="_blank"
              rel="noreferrer"
              style={{ color: theme.accentColor }}
              className="hover:underline"
            >
              https://prachurjo.dev.cv
            </a>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            borderColor: theme.footerBorder,
            backgroundColor: theme.footerBg,
          }}
          className="px-5 py-3.5 border-t flex items-center justify-end"
        >
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
            className="px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer hover:brightness-110"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
