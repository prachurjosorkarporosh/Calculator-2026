/**
 * Help Screen Dialog (Theme-Adaptive)
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Prachurjo Calculator. All rights reserved.
 *
 * Comprehensive Guide:
 * - Arithmetic and scientific function references
 * - DEG vs RAD angles
 * - Inverse trigonometric mode (INV)
 * - Complete keyboard shortcuts table
 * - Dynamically adapts to the currently active Theme Palette
 */

import React, { useState } from 'react';
import {
  HelpCircle,
  X,
  Keyboard,
  Calculator as CalcIcon,
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics.ts';
import { ThemePalette } from '../data/themes.ts';
import { getModalThemeStyles } from '../utils/themeStyles.ts';

interface HelpDialogProps {
  isOpen: boolean;
  palette?: ThemePalette;
  onClose: () => void;
}

export const HelpDialog: React.FC<HelpDialogProps> = ({
  isOpen,
  palette,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'functions' | 'shortcuts'>('functions');
  const theme = getModalThemeStyles(palette);

  if (!isOpen) return null;

  const shortcuts = [
    { key: '0 - 9', desc: 'Input numbers' },
    { key: '+  −  ×  ÷', desc: 'Arithmetic operations' },
    { key: 'Enter or =', desc: 'Evaluate expression' },
    { key: 'Backspace', desc: 'Delete last character' },
    { key: 'Escape or c', desc: 'Clear all (AC)' },
    { key: '(  )', desc: 'Grouping parentheses' },
    { key: '^', desc: 'Power / Exponentiation' },
    { key: '%', desc: 'Percentage calculation' },
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
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight">
                Calculator Guide & Reference
              </h3>
              <p style={{ color: theme.textSecondary }} className="text-[11px]">
                Scientific operations & keyboard shortcuts
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

        {/* Tab Switcher */}
        <div
          style={{
            borderColor: theme.headerBorder,
            backgroundColor: theme.headerBg,
          }}
          className="px-5 pt-3 pb-2 flex gap-2 border-b"
        >
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('functions');
            }}
            style={{
              backgroundColor: activeTab === 'functions' ? theme.accentBg : 'transparent',
              color: activeTab === 'functions' ? theme.accentText : theme.textSecondary,
            }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm hover:brightness-105"
          >
            <CalcIcon className="w-3.5 h-3.5" />
            <span>Math Functions</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('shortcuts');
            }}
            style={{
              backgroundColor: activeTab === 'shortcuts' ? theme.accentBg : 'transparent',
              color: activeTab === 'shortcuts' ? theme.accentText : theme.textSecondary,
            }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm hover:brightness-105"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Keyboard Shortcuts</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 text-xs scrollbar-thin">
          {activeTab === 'functions' ? (
            <>
              <div
                style={{
                  backgroundColor: theme.itemBg,
                  borderColor: theme.itemBorder,
                }}
                className="p-3.5 rounded-2xl border space-y-1"
              >
                <div className="font-bold flex items-center gap-1.5">
                  <span
                    style={{ backgroundColor: theme.accentColor }}
                    className="w-2 h-2 rounded-full"
                  />
                  Basic Order of Operations
                </div>
                <p style={{ color: theme.textSecondary }} className="text-[11px] leading-relaxed">
                  Evaluates according to strict PEMDAS precedence: Parentheses, Exponents, Multiplication & Division, Addition & Subtraction. Consecutive operators are cleanly handled.
                </p>
              </div>

              <div
                style={{
                  backgroundColor: theme.itemBg,
                  borderColor: theme.itemBorder,
                }}
                className="p-3.5 rounded-2xl border space-y-1"
              >
                <div className="font-bold flex items-center gap-1.5">
                  <span
                    style={{ backgroundColor: theme.accentColor }}
                    className="w-2 h-2 rounded-full"
                  />
                  Angle Modes (DEG vs RAD)
                </div>
                <p style={{ color: theme.textSecondary }} className="text-[11px] leading-relaxed">
                  Toggle between <strong>deg</strong> and <strong>rad</strong> in the scientific row. Exact trigonometric identities like sin(30°) = 0.5, cos(60°) = 0.5, and tan(45°) = 1 are precision-guaranteed.
                </p>
              </div>

              <div
                style={{
                  backgroundColor: theme.itemBg,
                  borderColor: theme.itemBorder,
                }}
                className="p-3.5 rounded-2xl border space-y-1"
              >
                <div className="font-bold flex items-center gap-1.5">
                  <span
                    style={{ backgroundColor: theme.accentColor }}
                    className="w-2 h-2 rounded-full"
                  />
                  Inverse Trig Functions (INV)
                </div>
                <p style={{ color: theme.textSecondary }} className="text-[11px] leading-relaxed">
                  Press <strong>INV</strong> on the scientific panel to reveal arcsine (sin⁻¹), arccosine (cos⁻¹), arctangent (tan⁻¹), e^x, and 10^x.
                </p>
              </div>

              <div
                style={{
                  backgroundColor: theme.itemBg,
                  borderColor: theme.itemBorder,
                }}
                className="p-3.5 rounded-2xl border space-y-1"
              >
                <div className="font-bold flex items-center gap-1.5">
                  <span
                    style={{ backgroundColor: theme.accentColor }}
                    className="w-2 h-2 rounded-full"
                  />
                  Factorial, Exponent & Roots
                </div>
                <p style={{ color: theme.textSecondary }} className="text-[11px] leading-relaxed">
                  Supports up to 170! factorial (e.g. 5! = 120), natural logarithm (ln), base-10 log, square root (√), and arbitrary power exponentiation (x^y).
                </p>
              </div>
            </>
          ) : (
            <div className="space-y-1.5">
              {shortcuts.map((s) => (
                <div
                  key={s.key}
                  style={{
                    backgroundColor: theme.itemBg,
                    borderColor: theme.itemBorder,
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl border"
                >
                  <span
                    style={{
                      backgroundColor: theme.subtleAccentBg,
                      color: theme.accentColor,
                    }}
                    className="font-mono text-xs font-bold px-2 py-0.5 rounded"
                  >
                    {s.key}
                  </span>
                  <span style={{ color: theme.textSecondary }} className="text-[11px]">
                    {s.desc}
                  </span>
                </div>
              ))}
            </div>
          )}
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
            onClick={onClose}
            style={{
              backgroundColor: theme.accentBg,
              color: theme.accentText,
            }}
            className="px-6 py-2 rounded-xl font-bold text-xs transition-all shadow-sm active:scale-95 cursor-pointer hover:brightness-110"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
