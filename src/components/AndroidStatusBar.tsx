/**
 * Android System Status Bar & Gesture Navigation Bar
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Calculator. All rights reserved.
 *
 * Provides a 100% realistic Android system status bar (Time, WiFi, 5G, Battery)
 * and bottom Android gesture navigation pill.
 */

import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, BatteryCharging, Signal } from 'lucide-react';
import { ThemePalette } from '../data/themes.ts';

interface AndroidStatusBarProps {
  palette?: ThemePalette;
  isLightContent?: boolean;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({
  palette,
  isLightContent,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const textColor = isLightContent
    ? 'rgba(255, 255, 255, 0.92)'
    : palette?.isDark
    ? 'rgba(255, 255, 255, 0.92)'
    : 'rgba(15, 23, 42, 0.88)';

  return (
    <div
      style={{ color: textColor }}
      className="w-full flex items-center justify-between px-6 pt-2 pb-1 text-[13px] font-semibold tracking-tight select-none z-30 transition-colors"
    >
      {/* Current Time */}
      <span className="font-medium tracking-normal text-[12.5px] tabular-nums">
        {timeStr || '12:00'}
      </span>

      {/* Android Center Camera Punch Hole */}
      <div className="w-3.5 h-3.5 rounded-full bg-black/80 dark:bg-black ring-1 ring-white/10 flex items-center justify-center pointer-events-none shadow-inner">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-950/60" />
      </div>

      {/* System Icons: Signal, WiFi, Battery */}
      <div className="flex items-center gap-2 text-xs">
        <Signal className="w-3.5 h-3.5 opacity-90 stroke-[2.2]" />
        <Wifi className="w-3.5 h-3.5 opacity-90 stroke-[2.2]" />
        <div className="flex items-center gap-0.5">
          <span className="text-[10px] font-bold opacity-80">98%</span>
          <BatteryMedium className="w-4 h-4 opacity-90 stroke-[2]" />
        </div>
      </div>
    </div>
  );
};

export const AndroidGesturePill: React.FC<{ palette?: ThemePalette }> = ({ palette }) => {
  return (
    <div className="w-full flex justify-center py-2 z-30 pointer-events-none">
      <div
        className="w-32 h-1 rounded-full transition-colors opacity-60"
        style={{
          backgroundColor: palette?.isDark ? '#FFFFFF' : '#0F172A',
        }}
      />
    </div>
  );
};
