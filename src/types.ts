/**
 * Prachurjo Calculator Types & State Definitions
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Prachurjo Calculator. All rights reserved.
 */

export type AngleMode = 'RAD' | 'DEG';
export type ThemeMode = 'system' | 'light' | 'dark';
export type ButtonShape = 'round' | 'squircle' | 'soft' | 'sharp';
export type KeypadScale = 'compact' | 'standard' | 'spacious' | 'jumbo' | 'ultra';
export type DisplaySize = 'standard' | 'large' | 'huge';
export type SoundEffectType =
  | 'tactile'
  | 'pop'
  | 'mechanical'
  | 'beep'
  | 'cyberpunk'
  | 'marimba'
  | 'typewriter'
  | 'bubble'
  | 'laser'
  | 'woodblock';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export interface CustomThemeColors {
  bg: string;
  numberBg: string;
  operatorBg: string;
  scientificBg?: string;
  actionBg?: string;
  backspaceBg?: string;
  equalsBg: string;
  textColor: string;
  operatorTextColor?: string;
  scientificTextColor?: string;
  actionTextColor?: string;
  equalsTextColor?: string;
  bgImage?: string;
  bgBlur?: number;
  bgOverlayOpacity?: number;
  isGlassmorphic?: boolean;
  animatedBg?: boolean;
  buttonBlur?: number;
  buttonBgImage?: string;
  buttonOpacity?: number;
  buttonGlassmorphic?: boolean;
  keyBgOverrides?: Record<string, string>;
  keyTextOverrides?: Record<string, string>;
}

export interface UserPreferences {
  themeId: string;
  fontId: string;
  appIconId?: string;
  buttonBlur?: number;
  buttonShape: ButtonShape;
  keypadScale: KeypadScale;
  displaySize?: DisplaySize;
  personalName?: string;
  soundEnabled: boolean;
  soundType: SoundEffectType;
  soundVolume: number;
  voiceAutoSpeak: boolean;
  voiceKeyClick: boolean;
  voiceLanguage: string;
  voicePitch: number;
  voiceRate: number;
  animationsEnabled: boolean;
  effectsEnabled: boolean;
  celebrationEnabled: boolean;
  syncWallpaperWithTheme: boolean;
  androidApkMode: boolean;
  hapticEnabled: boolean;
  formatThousands: boolean;
  scientificExpanded: boolean;
  angleMode: AngleMode;
  customColors?: CustomThemeColors;
}

