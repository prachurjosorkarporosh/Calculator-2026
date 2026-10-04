/**
 * App Icon Changer Modal (অ্যাপ আইকন পরিবর্তন - Theme-Adaptive)
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Prachurjo Calculator. All rights reserved.
 *
 * Professional Launcher Customization Studio:
 * - 10 Curated Launcher Icons (Emerald, Obsidian, Cyber, Ruby, Gold, Neon, etc.)
 * - Instant Browser Tab Favicon & App Title Bar Synchronization
 * - Dynamically adapts to the currently active Theme Palette
 */

import React from 'react';
import { X, Check, Smartphone, Sparkles } from 'lucide-react';
import { APP_ICONS, AppIconOption, getAppIconDataUri } from '../data/appIcons.ts';
import { triggerHaptic } from '../utils/haptics.ts';
import { ThemePalette } from '../data/themes.ts';
import { getModalThemeStyles } from '../utils/themeStyles.ts';

interface AppIconModalProps {
  isOpen: boolean;
  palette?: ThemePalette;
  activeIconId: string;
  onSelectIcon: (iconId: string) => void;
  onClose: () => void;
}

export const AppIconModal: React.FC<AppIconModalProps> = ({
  isOpen,
  palette,
  activeIconId,
  onSelectIcon,
  onClose,
}) => {
  const theme = getModalThemeStyles(palette);

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
        className="w-full max-w-lg rounded-3xl border overflow-hidden flex flex-col max-h-[90vh] transition-colors"
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
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-2">
                <span>App Launcher Icon</span>
                <span
                  style={{
                    backgroundColor: theme.subtleAccentBg,
                    color: theme.accentColor,
                  }}
                  className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold"
                >
                  10 Styles
                </span>
              </h3>
              <p style={{ color: theme.textSecondary }} className="text-[11px]">
                Choose your favorite launcher icon for tab and device
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

        {/* Icon Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 scrollbar-thin">
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
                style={{
                  backgroundColor: isSelected ? theme.subtleAccentBg : theme.itemBg,
                  borderColor: isSelected ? theme.accentColor : theme.itemBorder,
                }}
                className={`p-3.5 rounded-2xl cursor-pointer transition-all border flex items-center gap-3.5 group ${
                  isSelected ? 'shadow-md ring-2 ring-emerald-500/20' : ''
                }`}
              >
                {/* Icon Image Preview */}
                <div
                  style={{ borderColor: theme.dialogBorder }}
                  className="relative w-14 h-14 shrink-0 rounded-2xl overflow-hidden shadow-lg border group-hover:scale-105 transition-transform"
                >
                  <img
                    src={iconUri}
                    alt={icon.name}
                    className="w-full h-full object-cover"
                  />
                  {isSelected && (
                    <div
                      style={{
                        backgroundColor: theme.accentBg,
                        color: theme.accentText,
                      }}
                      className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center shadow-md"
                    >
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      style={{ color: theme.textPrimary }}
                      className="font-bold text-xs truncate"
                    >
                      {icon.name}
                    </span>
                  </div>
                  <div
                    style={{ color: theme.accentColor }}
                    className="text-[11px] font-medium truncate mt-0.5"
                  >
                    {icon.nameBn}
                  </div>
                  <div
                    style={{ color: theme.textSecondary }}
                    className="text-[10px] line-clamp-1 mt-0.5"
                  >
                    {icon.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            borderColor: theme.footerBorder,
            backgroundColor: theme.footerBg,
          }}
          className="px-5 py-3.5 border-t flex items-center justify-between text-xs"
        >
          <span
            style={{ color: theme.textSecondary }}
            className="flex items-center gap-1.5"
          >
            <Sparkles
              style={{ color: theme.accentColor }}
              className="w-3.5 h-3.5"
            />
            <span>Updates browser tab & top bar icon</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              backgroundColor: theme.accentBg,
              color: theme.accentText,
            }}
            className="px-6 py-2 rounded-xl font-bold transition-all shadow-md active:scale-95 cursor-pointer hover:brightness-110"
          >
            Apply & Done
          </button>
        </div>
      </div>
    </div>
  );
};
