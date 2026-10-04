/**
 * Settings Dialog
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.pro.bd/
 * © 2026 Prachurjo Calculator. All rights reserved.
 *
 * Implements Android settings options:
 * - Keypress sound effect toggle
 * - Haptic feedback toggle
 * - Angle mode default
 */

import React from 'react';
import { Volume2, VolumeX, Smartphone, Settings } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics.ts';
import { playKeypressSound } from '../utils/sound.ts';

interface SettingsDialogProps {
  isOpen: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onClose: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  isOpen,
  soundEnabled,
  onToggleSound,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-[#EEF2F6] dark:bg-[#25282D] rounded-3xl p-6 shadow-2xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-slate-100 select-none">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-[#B9E1F7] dark:bg-[#004A77] flex items-center justify-center text-[#001D35] dark:text-[#C2E7FF]">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-medium tracking-tight">Settings</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Preferences & Feedback
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {/* Keypress Sound Toggle Row */}
          <div
            onClick={() => {
              triggerHaptic('light');
              onToggleSound();
              if (!soundEnabled) {
                // Play preview sound when turned on
                setTimeout(() => playKeypressSound('number'), 50);
              }
            }}
            className="flex items-center justify-between p-3 rounded-2xl bg-white/70 dark:bg-black/20 border border-slate-200/50 dark:border-slate-700/40 cursor-pointer hover:bg-white/90 dark:hover:bg-black/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-[#087A36] dark:text-emerald-400" />
                ) : (
                  <VolumeX className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <div>
                <div className="text-sm font-medium">Keypress sound</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Subtle click audio on touch
                </div>
              </div>
            </div>

            {/* Android Switch */}
            <div
              className={`w-12 h-7 flex items-center rounded-full p-1 duration-200 cursor-pointer transition-colors ${
                soundEnabled
                  ? 'bg-[#087A36] dark:bg-emerald-500'
                  : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
                  soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </div>

          {/* Haptic Feedback Info */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/70 dark:bg-black/20 border border-slate-200/50 dark:border-slate-700/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
                <Smartphone className="w-5 h-5 text-[#004A77] dark:text-sky-400" />
              </div>
              <div>
                <div className="text-sm font-medium">Haptic vibration</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Tactile feedback on Android
                </div>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#087A36] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
              Active
            </span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="px-6 py-2 text-sm font-semibold text-white bg-[#087A36] hover:bg-[#076c30] rounded-full transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
