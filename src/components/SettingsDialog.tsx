/**
 * Settings Dialog (Theme-Adaptive)
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Prachurjo Calculator. All rights reserved.
 *
 * Dynamically adapts to the currently active Theme Palette (Light, Dark, OLED, Cyber, Pastel, Custom).
 */

import React from 'react';
import {
  Volume2,
  VolumeX,
  Smartphone,
  Settings,
  Sun,
  Moon,
  Clock,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Sliders,
  CheckCircle2,
  X,
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics.ts';
import { playKeypressSound } from '../utils/sound.ts';
import { getAppIconDataUri } from '../data/appIcons.ts';
import { ThemePalette } from '../data/themes.ts';
import { getModalThemeStyles } from '../utils/themeStyles.ts';

interface SettingsDialogProps {
  isOpen: boolean;
  palette?: ThemePalette;
  soundEnabled: boolean;
  onToggleSound: () => void;
  systemTimeThemeEnabled?: boolean;
  onToggleSystemTimeTheme?: () => void;
  appIconId?: string;
  onOpenAppIcons?: () => void;
  onOpenOnboarding?: () => void;
  onClose: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  isOpen,
  palette,
  soundEnabled,
  onToggleSound,
  systemTimeThemeEnabled = false,
  onToggleSystemTimeTheme,
  appIconId = 'emerald-pro',
  onOpenAppIcons,
  onOpenOnboarding,
  onClose,
}) => {
  if (!isOpen) return null;

  const theme = getModalThemeStyles(palette);
  const currentHour = new Date().getHours();
  const isDayTime = currentHour >= 6 && currentHour < 18;

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
        className="w-full max-w-sm rounded-3xl p-5 border overflow-hidden flex flex-col max-h-[90vh] transition-colors"
      >
        {/* Header */}
        <div
          style={{ borderColor: theme.headerBorder }}
          className="flex items-center justify-between pb-3.5 mb-3 border-b"
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
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">Settings</h3>
              <p style={{ color: theme.textSecondary }} className="text-[11px]">
                Preferences, Feedback & Automation
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
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5 scrollbar-thin">
          {/* Keypress Sound Toggle Row */}
          <div
            onClick={() => {
              triggerHaptic('light');
              onToggleSound();
              if (!soundEnabled) {
                setTimeout(() => playKeypressSound('number'), 50);
              }
            }}
            style={{
              backgroundColor: theme.itemBg,
              borderColor: theme.itemBorder,
            }}
            className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all group ${
              theme.isDark ? 'hover:bg-white/[0.07]' : 'hover:bg-black/[0.07]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                style={{
                  backgroundColor: soundEnabled ? theme.subtleAccentBg : theme.itemBg,
                  color: soundEnabled ? theme.accentColor : theme.textSecondary,
                }}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </div>
              <div>
                <div className="text-xs font-bold">Keypress Audio Sound</div>
                <div style={{ color: theme.textSecondary }} className="text-[11px]">
                  {soundEnabled ? 'Audio click on touch active' : 'Silent keypress'}
                </div>
              </div>
            </div>

            {/* Switch */}
            <div
              style={{
                backgroundColor: soundEnabled
                  ? theme.accentBg
                  : theme.isDark
                  ? 'rgba(255,255,255,0.2)'
                  : 'rgba(0,0,0,0.2)',
              }}
              className="w-11 h-6 flex items-center rounded-full p-0.5 transition-colors shrink-0"
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
                  soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </div>

          {/* System-Based Theme Auto Switcher */}
          {onToggleSystemTimeTheme && (
            <div
              onClick={() => {
                triggerHaptic('medium');
                onToggleSystemTimeTheme();
              }}
              style={{
                backgroundColor: theme.itemBg,
                borderColor: theme.itemBorder,
              }}
              className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all group ${
                theme.isDark ? 'hover:bg-white/[0.07]' : 'hover:bg-black/[0.07]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
                  {isDayTime ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4 text-indigo-400" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <span>Auto Day / Night Theme</span>
                  </div>
                  <div style={{ color: theme.textSecondary }} className="text-[11px]">
                    {systemTimeThemeEnabled ? (
                      <span className="text-amber-500 font-semibold">
                        {isDayTime ? '☀️ Daytime (Pixel Light)' : '🌙 Nighttime (Material Dark)'}
                      </span>
                    ) : (
                      'Adapts automatically to sunrise/sunset'
                    )}
                  </div>
                </div>
              </div>

              {/* Switch */}
              <div
                style={{
                  backgroundColor: systemTimeThemeEnabled
                    ? '#F59E0B'
                    : theme.isDark
                    ? 'rgba(255,255,255,0.2)'
                    : 'rgba(0,0,0,0.2)',
                }}
                className="w-11 h-6 flex items-center rounded-full p-0.5 transition-colors shrink-0"
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
                    systemTimeThemeEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          )}

          {/* App Launcher Icon Switcher */}
          {onOpenAppIcons && (
            <div
              onClick={() => {
                triggerHaptic('light');
                onClose();
                onOpenAppIcons();
              }}
              style={{
                backgroundColor: theme.itemBg,
                borderColor: theme.itemBorder,
              }}
              className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all group ${
                theme.isDark ? 'hover:bg-white/[0.07]' : 'hover:bg-black/[0.07]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl overflow-hidden shadow-xs border border-white/20 flex items-center justify-center shrink-0">
                  <img
                    src={getAppIconDataUri(appIconId)}
                    alt="Current app icon"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold">App Launcher Icon</div>
                  <div style={{ color: theme.textSecondary }} className="text-[11px]">
                    ১০+ নান্দনিক আইকন কালেকশন
                  </div>
                </div>
              </div>
              <ChevronRight style={{ color: theme.textSecondary }} className="w-4 h-4 transition-colors" />
            </div>
          )}

          {/* First-Time Welcome Setup Screen Trigger */}
          {onOpenOnboarding && (
            <div
              onClick={() => {
                triggerHaptic('light');
                onClose();
                onOpenOnboarding();
              }}
              style={{
                backgroundColor: theme.itemBg,
                borderColor: theme.itemBorder,
              }}
              className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all group ${
                theme.isDark ? 'hover:bg-white/[0.07]' : 'hover:bg-black/[0.07]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">Welcome Setup Tour</div>
                  <div style={{ color: theme.textSecondary }} className="text-[11px]">
                    ওয়ালপেপার ও থিম স্বাগতম স্ক্রিন
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-md">
                Launch
              </span>
            </div>
          )}

          {/* Haptic Vibration Status */}
          <div
            style={{
              backgroundColor: theme.itemBg,
              borderColor: theme.itemBorder,
            }}
            className="flex items-center justify-between p-3.5 rounded-2xl border"
          >
            <div className="flex items-center gap-3">
              <div
                style={{
                  backgroundColor: theme.subtleAccentBg,
                  color: theme.accentColor,
                }}
                className="w-9 h-9 rounded-xl flex items-center justify-center"
              >
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold">Haptic Touch Vibration</div>
                <div style={{ color: theme.textSecondary }} className="text-[11px]">
                  Tactile feedback pulse
                </div>
              </div>
            </div>
            <span
              style={{
                backgroundColor: theme.subtleAccentBg,
                color: theme.accentColor,
              }}
              className="text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3" />
              Active
            </span>
          </div>
        </div>

        {/* Done Button */}
        <div
          style={{ borderColor: theme.headerBorder }}
          className="pt-3.5 mt-2 border-t flex justify-end"
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
            className="w-full py-2.5 text-xs font-bold rounded-xl transition-all shadow-lg active:scale-98 cursor-pointer"
          >
            Save & Done
          </button>
        </div>
      </div>
    </div>
  );
};
