/**
 * Local Offline Storage for Prachurjo Calculator
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Prachurjo Calculator. All rights reserved.
 *
 * Implements offline persistence for calculation history and preferences
 * without external APIs, tracking, or cloud services.
 */

import {
  AngleMode,
  ButtonShape,
  CustomThemeColors,
  HistoryItem,
  KeypadScale,
  SoundEffectType,
  ThemeMode,
} from '../types.ts';
import { DEFAULT_THEME_ID } from './themes.ts';
import { DEFAULT_FONT_ID } from './fonts.ts';

const STORAGE_KEYS = {
  HISTORY: 'prachurjo_calc_history_v1',
  THEME_MODE: 'prachurjo_calc_theme_mode_v1',
  THEME_ID: 'prachurjo_calc_theme_id_v2',
  FONT_ID: 'prachurjo_calc_font_id_v1',
  BUTTON_SHAPE: 'prachurjo_calc_button_shape_v1',
  KEYPAD_SCALE: 'prachurjo_calc_keypad_scale_v1',
  SOUND_ENABLED: 'prachurjo_calc_sound_enabled_v1',
  SOUND_TYPE: 'prachurjo_calc_sound_type_v1',
  HAPTIC_ENABLED: 'prachurjo_calc_haptic_enabled_v1',
  FORMAT_THOUSANDS: 'prachurjo_calc_format_thousands_v1',
  ANGLE_MODE: 'prachurjo_calc_angle_mode_v1',
  SCIENTIFIC_EXPANDED: 'prachurjo_calc_scientific_expanded_v1',
  CUSTOM_COLORS: 'prachurjo_calc_custom_colors_v1',
  PERSONAL_NAME: 'prachurjo_calc_personal_name_v1',
  DISPLAY_SIZE: 'prachurjo_calc_display_size_v1',
  USER_WALLPAPERS: 'prachurjo_calc_user_wallpapers_v1',
  APP_ICON_ID: 'prachurjo_calc_app_icon_id_v1',
  BUTTON_BLUR: 'prachurjo_calc_button_blur_v1',
  HAS_ONBOARDED: 'prachurjo_calc_has_onboarded_v2',
  SYSTEM_TIME_THEME: 'prachurjo_calc_system_time_theme_v1',
  SOUND_VOLUME: 'prachurjo_calc_sound_volume_v1',
  VOICE_AUTO_SPEAK: 'prachurjo_calc_voice_auto_speak_v1',
  VOICE_KEY_CLICK: 'prachurjo_calc_voice_key_click_v1',
  VOICE_LANGUAGE: 'prachurjo_calc_voice_lang_v1',
  VOICE_PITCH: 'prachurjo_calc_voice_pitch_v1',
  VOICE_RATE: 'prachurjo_calc_voice_rate_v1',
  ANIMATIONS_ENABLED: 'prachurjo_calc_animations_v1',
  EFFECTS_ENABLED: 'prachurjo_calc_effects_v1',
  CELEBRATION_ENABLED: 'prachurjo_calc_celebration_v1',
  SYNC_WALLPAPER_THEME: 'prachurjo_calc_sync_wallpaper_v1',
  STANDALONE_APK_MODE: 'prachurjo_calc_standalone_apk_v1',
  NAV_BAR_STYLE: 'prachurjo_calc_nav_bar_style_v1',
};

export interface UserSavedWallpaper {
  id: string;
  name: string;
  url: string;
  timestamp: number;
}

let _inMemoryHasOnboarded: boolean | null = null;

export class LocalStorageManager {
  // History management
  static getHistory(): HistoryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  static saveHistoryItem(expression: string, result: string): HistoryItem {
    const history = this.getHistory();
    const newItem: HistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      expression,
      result,
      timestamp: Date.now(),
    };

    const updated = [newItem, ...history].slice(0, 200);
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save history item to local storage:', e);
    }
    return newItem;
  }

  static deleteHistoryItem(id: string): HistoryItem[] {
    const history = this.getHistory().filter((item) => item.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to delete history item:', e);
    }
    return history;
  }

  static clearHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch (e) {
      console.error('Failed to clear history:', e);
    }
  }

  static saveHistory(items: HistoryItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to set history:', e);
    }
  }

  // Theme Mode
  static getTheme(): ThemeMode {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.THEME_MODE);
      if (val === 'light' || val === 'dark' || val === 'system') {
        return val;
      }
      return 'system';
    } catch {
      return 'system';
    }
  }

  static saveTheme(theme: ThemeMode): void {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME_MODE, theme);
    } catch (e) {
      console.error('Failed to save theme mode preference:', e);
    }
  }

  // Theme Palette ID
  static getThemeId(): string {
    try {
      return localStorage.getItem(STORAGE_KEYS.THEME_ID) || DEFAULT_THEME_ID;
    } catch {
      return DEFAULT_THEME_ID;
    }
  }

  static saveThemeId(themeId: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME_ID, themeId);
    } catch (e) {
      console.error('Failed to save theme id:', e);
    }
  }

  // Font ID (Default: 'audiowide')
  static getFontId(): string {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FONT_ID);
      if (!stored || stored === 'system' || stored === 'roboto') {
        return DEFAULT_FONT_ID;
      }
      return stored;
    } catch {
      return DEFAULT_FONT_ID;
    }
  }

  static saveFontId(fontId: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FONT_ID, fontId);
    } catch (e) {
      console.error('Failed to save font id:', e);
    }
  }

  // Button Shape
  static getButtonShape(): ButtonShape {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.BUTTON_SHAPE);
      if (val === 'round' || val === 'squircle' || val === 'soft' || val === 'sharp') {
        return val;
      }
      return 'round';
    } catch {
      return 'round';
    }
  }

  static saveButtonShape(shape: ButtonShape): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BUTTON_SHAPE, shape);
    } catch (e) {
      console.error('Failed to save button shape:', e);
    }
  }

  // Keypad Scale
  static getKeypadScale(): KeypadScale {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.KEYPAD_SCALE);
      if (val === 'compact' || val === 'standard' || val === 'spacious' || val === 'jumbo' || val === 'ultra') {
        return val;
      }
      return 'standard';
    } catch {
      return 'standard';
    }
  }

  static saveKeypadScale(scale: KeypadScale): void {
    try {
      localStorage.setItem(STORAGE_KEYS.KEYPAD_SCALE, scale);
    } catch (e) {
      console.error('Failed to save keypad scale:', e);
    }
  }

  // Keypress Sound
  static getKeypressSound(): boolean {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
      return val === null ? true : val === 'true';
    } catch {
      return true;
    }
  }

  static saveKeypressSound(enabled: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, String(enabled));
    } catch (e) {
      console.error('Failed to save keypress sound preference:', e);
    }
  }

  // Sound Effect Type
  static getSoundType(): SoundEffectType {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.SOUND_TYPE);
      if (val === 'tactile' || val === 'pop' || val === 'mechanical' || val === 'beep') {
        return val;
      }
      return 'tactile';
    } catch {
      return 'tactile';
    }
  }

  static saveSoundType(type: SoundEffectType): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SOUND_TYPE, type);
    } catch (e) {
      console.error('Failed to save sound type:', e);
    }
  }

  // Haptic feedback
  static getHapticEnabled(): boolean {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.HAPTIC_ENABLED);
      return val === null ? true : val === 'true';
    } catch {
      return true;
    }
  }

  static saveHapticEnabled(enabled: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.HAPTIC_ENABLED, String(enabled));
    } catch (e) {
      console.error('Failed to save haptic preference:', e);
    }
  }

  // Format with thousand separators
  static getFormatThousands(): boolean {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.FORMAT_THOUSANDS);
      return val === null ? true : val === 'true';
    } catch {
      return true;
    }
  }

  static saveFormatThousands(enabled: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FORMAT_THOUSANDS, String(enabled));
    } catch (e) {
      console.error('Failed to save format thousands preference:', e);
    }
  }

  // Angle mode preferences
  static getAngleMode(): AngleMode {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.ANGLE_MODE);
      if (val === 'DEG' || val === 'RAD') {
        return val;
      }
      return 'RAD';
    } catch {
      return 'RAD';
    }
  }

  static saveAngleMode(mode: AngleMode): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ANGLE_MODE, mode);
    } catch (e) {
      console.error('Failed to save angle mode preference:', e);
    }
  }

  // Scientific expanded preference
  static getScientificExpanded(): boolean {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.SCIENTIFIC_EXPANDED);
      return val === 'true';
    } catch {
      return false;
    }
  }

  static saveScientificExpanded(expanded: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SCIENTIFIC_EXPANDED, String(expanded));
    } catch (e) {
      console.error('Failed to save scientific expanded state:', e);
    }
  }

  // Custom Colors
  static getCustomColors(): CustomThemeColors | null {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.CUSTOM_COLORS);
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  }

  static saveCustomColors(colors: CustomThemeColors): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_COLORS, JSON.stringify(colors));
    } catch (e) {
      console.error('Failed to save custom colors:', e);
    }
  }

  // Personal Name / Title
  static getPersonalName(): string {
    try {
      return localStorage.getItem(STORAGE_KEYS.PERSONAL_NAME) || '';
    } catch {
      return '';
    }
  }

  static savePersonalName(name: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PERSONAL_NAME, name);
    } catch (e) {
      console.error('Failed to save personal name:', e);
    }
  }

  // Display Font Size Scale ('standard' | 'large' | 'huge')
  static getDisplaySize(): 'standard' | 'large' | 'huge' {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.DISPLAY_SIZE);
      if (val === 'standard' || val === 'large' || val === 'huge') {
        return val;
      }
      return 'huge'; // 150% Default
    } catch {
      return 'huge';
    }
  }

  static saveDisplaySize(size: 'standard' | 'large' | 'huge'): void {
    try {
      localStorage.setItem(STORAGE_KEYS.DISPLAY_SIZE, size);
    } catch (e) {
      console.error('Failed to save display size:', e);
    }
  }

  // App Icon ID
  static getAppIconId(): string {
    try {
      return localStorage.getItem(STORAGE_KEYS.APP_ICON_ID) || 'emerald-pro';
    } catch {
      return 'emerald-pro';
    }
  }

  static saveAppIconId(iconId: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.APP_ICON_ID, iconId);
    } catch (e) {
      console.error('Failed to save app icon id:', e);
    }
  }

  // Button Backdrop Blur (0 - 24px)
  static getButtonBlur(): number {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.BUTTON_BLUR);
      return val !== null ? parseInt(val, 10) : 6;
    } catch {
      return 6;
    }
  }

  static saveButtonBlur(blur: number): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BUTTON_BLUR, String(blur));
    } catch (e) {
      console.error('Failed to save button blur:', e);
    }
  }

  // First-time Onboarding (never shows twice)
  static getHasOnboarded(): boolean {
    if (_inMemoryHasOnboarded === true) return true;
    try {
      const stored =
        localStorage.getItem(STORAGE_KEYS.HAS_ONBOARDED) === 'true' ||
        localStorage.getItem('prachurjo_calc_has_onboarded_v2') === 'true' ||
        localStorage.getItem('prachurjo_calc_has_onboarded_v1') === 'true' ||
        localStorage.getItem('prachurjo_calc_has_onboarded') === 'true' ||
        sessionStorage.getItem('prachurjo_calc_has_onboarded') === 'true';
      if (stored) {
        _inMemoryHasOnboarded = true;
        return true;
      }
      return false;
    } catch {
      return _inMemoryHasOnboarded ?? false;
    }
  }

  static setHasOnboarded(val = true): void {
    _inMemoryHasOnboarded = val;
    try {
      localStorage.setItem(STORAGE_KEYS.HAS_ONBOARDED, String(val));
      localStorage.setItem('prachurjo_calc_has_onboarded_v2', String(val));
      localStorage.setItem('prachurjo_calc_has_onboarded_v1', String(val));
      localStorage.setItem('prachurjo_calc_has_onboarded', String(val));
      sessionStorage.setItem('prachurjo_calc_has_onboarded', String(val));
    } catch (e) {
      console.error('Failed to save onboarding state:', e);
    }
  }

  // System-Based Theme (Day/Night auto switcher based on user's system time)
  static getSystemTimeThemeEnabled(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.SYSTEM_TIME_THEME) === 'true';
    } catch {
      return false;
    }
  }

  static setSystemTimeThemeEnabled(enabled: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SYSTEM_TIME_THEME, String(enabled));
    } catch (e) {
      console.error('Failed to save system time theme preference:', e);
    }
  }

  // Sound Volume
  static getSoundVolume(): number {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.SOUND_VOLUME);
      return val !== null ? parseFloat(val) : 0.8;
    } catch {
      return 0.8;
    }
  }

  static saveSoundVolume(vol: number): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SOUND_VOLUME, String(vol));
    } catch (e) {
      console.error('Failed to save sound volume:', e);
    }
  }

  // Voice Settings - Default to false so it does not auto-speak without user enabling it
  static getVoiceAutoSpeak(): boolean {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.VOICE_AUTO_SPEAK);
      return val === 'true';
    } catch {
      return false;
    }
  }

  static saveVoiceAutoSpeak(enabled: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.VOICE_AUTO_SPEAK, String(enabled));
    } catch (e) {
      console.error('Failed to save voice auto speak:', e);
    }
  }

  static getVoiceKeyClick(): boolean {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.VOICE_KEY_CLICK);
      return val === 'true';
    } catch {
      return false;
    }
  }

  static saveVoiceKeyClick(enabled: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.VOICE_KEY_CLICK, String(enabled));
    } catch (e) {
      console.error('Failed to save voice key click:', e);
    }
  }

  static getVoiceLanguage(): string {
    try {
      return localStorage.getItem(STORAGE_KEYS.VOICE_LANGUAGE) || 'bn-BD';
    } catch {
      return 'bn-BD';
    }
  }

  static saveVoiceLanguage(lang: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.VOICE_LANGUAGE, lang);
    } catch (e) {
      console.error('Failed to save voice language:', e);
    }
  }

  static getVoicePitch(): number {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.VOICE_PITCH);
      return val !== null ? parseFloat(val) : 1.0;
    } catch {
      return 1.0;
    }
  }

  static saveVoicePitch(pitch: number): void {
    try {
      localStorage.setItem(STORAGE_KEYS.VOICE_PITCH, String(pitch));
    } catch (e) {
      console.error('Failed to save voice pitch:', e);
    }
  }

  static getVoiceRate(): number {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.VOICE_RATE);
      return val !== null ? parseFloat(val) : 0.95;
    } catch {
      return 0.95;
    }
  }

  static saveVoiceRate(rate: number): void {
    try {
      localStorage.setItem(STORAGE_KEYS.VOICE_RATE, String(rate));
    } catch (e) {
      console.error('Failed to save voice rate:', e);
    }
  }

  // Animation & Visual Effects
  static getAnimationsEnabled(): boolean {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.ANIMATIONS_ENABLED);
      return val !== null ? val === 'true' : true;
    } catch {
      return true;
    }
  }

  static saveAnimationsEnabled(enabled: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ANIMATIONS_ENABLED, String(enabled));
    } catch (e) {
      console.error('Failed to save animations enabled:', e);
    }
  }

  static getEffectsEnabled(): boolean {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.EFFECTS_ENABLED);
      return val !== null ? val === 'true' : true;
    } catch {
      return true;
    }
  }

  static saveEffectsEnabled(enabled: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.EFFECTS_ENABLED, String(enabled));
    } catch (e) {
      console.error('Failed to save effects enabled:', e);
    }
  }

  static getCelebrationEnabled(): boolean {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.CELEBRATION_ENABLED);
      return val !== null ? val === 'true' : true;
    } catch {
      return true;
    }
  }

  static saveCelebrationEnabled(enabled: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CELEBRATION_ENABLED, String(enabled));
    } catch (e) {
      console.error('Failed to save celebration enabled:', e);
    }
  }

  // Sync Wallpaper with Theme
  static getSyncWallpaperWithTheme(): boolean {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.SYNC_WALLPAPER_THEME);
      return val !== null ? val === 'true' : true;
    } catch {
      return true;
    }
  }

  static saveSyncWallpaperWithTheme(enabled: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SYNC_WALLPAPER_THEME, String(enabled));
    } catch (e) {
      console.error('Failed to save sync wallpaper preference:', e);
    }
  }

  // Standalone Android Mode
  static getAndroidApkMode(): boolean {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.STANDALONE_APK_MODE);
      return val !== null ? val === 'true' : false;
    } catch {
      return false;
    }
  }

  static saveAndroidApkMode(enabled: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.STANDALONE_APK_MODE, String(enabled));
    } catch (e) {
      console.error('Failed to save standalone apk mode preference:', e);
    }
  }

  // Android Navigation Bar Style ('buttons' | 'gesture')
  static getNavBarStyle(): 'buttons' | 'gesture' {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.NAV_BAR_STYLE);
      return val === 'gesture' ? 'gesture' : 'buttons';
    } catch {
      return 'buttons';
    }
  }

  static saveNavBarStyle(style: 'buttons' | 'gesture'): void {
    try {
      localStorage.setItem(STORAGE_KEYS.NAV_BAR_STYLE, style);
    } catch (e) {
      console.error('Failed to save nav bar style preference:', e);
    }
  }
}

