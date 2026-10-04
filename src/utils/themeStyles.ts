/**
 * Theme Styling Helper for Menus & Dialogs
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Prachurjo Calculator. All rights reserved.
 *
 * Dynamically adapts 3-Dot Menu and all popups/modals
 * to the currently selected theme palette (Light, Dark, OLED, Cyber, Pastel, Custom).
 */

import { ThemePalette } from '../data/themes.ts';

export function isHexOrRgbDark(color: string): boolean {
  if (!color) return true;
  const c = color.trim().toLowerCase();
  if (c.startsWith('#')) {
    const hex = c.replace('#', '');
    let r = 0, g = 0, b = 0;
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length >= 6) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    }
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 135;
  }
  if (c.startsWith('rgb')) {
    const parts = c.match(/\d+/g);
    if (parts && parts.length >= 3) {
      const r = parseInt(parts[0], 10);
      const g = parseInt(parts[1], 10);
      const b = parseInt(parts[2], 10);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness < 135;
    }
  }
  return true;
}

function toSubtleAlpha(color: string, hexAlpha: string, fallbackAlpha = 0.2): string {
  if (!color) return `rgba(16, 185, 129, ${fallbackAlpha})`;
  const c = color.trim();
  if (c.startsWith('#')) {
    const raw = c.replace('#', '');
    if (raw.length === 3) {
      const full = raw[0] + raw[0] + raw[1] + raw[1] + raw[2] + raw[2];
      return `#${full}${hexAlpha}`;
    }
    if (raw.length === 6) {
      return `#${raw}${hexAlpha}`;
    }
    if (raw.length === 8) {
      return `#${raw.substring(0, 6)}${hexAlpha}`;
    }
  }
  if (c.startsWith('rgb(')) {
    return c.replace('rgb(', 'rgba(').replace(')', `, ${fallbackAlpha})`);
  }
  return c;
}

export interface ModalThemeStyles {
  isDark: boolean;
  dialogBg: string;
  dialogBorder: string;
  headerBg: string;
  headerBorder: string;
  footerBg: string;
  footerBorder: string;
  itemBg: string;
  itemHoverBg: string;
  itemBorder: string;
  cardBg: string;
  cardBorder: string;
  inputBg: string;
  inputBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accentBg: string;
  accentText: string;
  accentColor: string;
  subtleAccentBg: string;
  subtleAccentBorder: string;
  tagBg: string;
  tagText: string;
  badgeBg: string;
  badgeText: string;
}

export function getModalThemeStyles(palette?: ThemePalette): ModalThemeStyles {
  const isDark = palette ? palette.isDark : true;
  const accent = palette?.equalsBg || palette?.accent || (isDark ? '#10B981' : '#087A36');
  const accentText = palette?.equalsText || '#FFFFFF';

  if (!isDark) {
    // LIGHT THEME ADAPTATION (e.g. Pixel Light, Mint Pastel, Sakura Blossom, Lemon Fresh)
    const baseBg = palette?.surface || '#FFFFFF';
    const border = palette?.frameBorder || 'rgba(0, 0, 0, 0.12)';
    const text1 = palette?.displayText || '#0F172A';
    const text2 = palette?.secondaryText || '#475569';

    return {
      isDark: false,
      dialogBg: baseBg,
      dialogBorder: border,
      headerBg: 'rgba(0, 0, 0, 0.025)',
      headerBorder: 'rgba(0, 0, 0, 0.08)',
      footerBg: 'rgba(0, 0, 0, 0.035)',
      footerBorder: 'rgba(0, 0, 0, 0.08)',
      itemBg: palette?.numberBg || 'rgba(0, 0, 0, 0.04)',
      itemHoverBg: palette?.numberHover || 'rgba(0, 0, 0, 0.07)',
      itemBorder: 'rgba(0, 0, 0, 0.08)',
      cardBg: palette?.numberBg || 'rgba(0, 0, 0, 0.03)',
      cardBorder: 'rgba(0, 0, 0, 0.08)',
      inputBg: 'rgba(0, 0, 0, 0.04)',
      inputBorder: 'rgba(0, 0, 0, 0.12)',
      textPrimary: text1,
      textSecondary: text2,
      textMuted: '#64748B',
      accentBg: accent,
      accentText: accentText,
      accentColor: accent,
      subtleAccentBg: toSubtleAlpha(accent, '18', 0.12),
      subtleAccentBorder: toSubtleAlpha(accent, '35', 0.25),
      tagBg: 'rgba(0, 0, 0, 0.05)',
      tagText: text1,
      badgeBg: toSubtleAlpha(accent, '18', 0.12),
      badgeText: accent,
    };
  }

  // DARK / OLED / CYBER / AURORA THEME ADAPTATION
  const baseBg = palette?.surface || palette?.bg || '#101522';
  const border = palette?.frameBorder || 'rgba(255, 255, 255, 0.12)';
  const text1 = palette?.displayText || '#FFFFFF';
  const text2 = palette?.secondaryText || '#94A3B8';

  return {
    isDark: true,
    dialogBg: baseBg,
    dialogBorder: border,
    headerBg: 'rgba(0, 0, 0, 0.25)',
    headerBorder: 'rgba(255, 255, 255, 0.08)',
    footerBg: 'rgba(0, 0, 0, 0.35)',
    footerBorder: 'rgba(255, 255, 255, 0.08)',
    itemBg: palette?.numberBg || 'rgba(255, 255, 255, 0.04)',
    itemHoverBg: palette?.numberHover || 'rgba(255, 255, 255, 0.08)',
    itemBorder: 'rgba(255, 255, 255, 0.08)',
    cardBg: palette?.numberBg || 'rgba(255, 255, 255, 0.04)',
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    inputBg: 'rgba(0, 0, 0, 0.35)',
    inputBorder: 'rgba(255, 255, 255, 0.12)',
    textPrimary: text1,
    textSecondary: text2,
    textMuted: '#64748B',
    accentBg: accent,
    accentText: accentText,
    accentColor: accent,
    subtleAccentBg: toSubtleAlpha(accent, '25', 0.18),
    subtleAccentBorder: toSubtleAlpha(accent, '45', 0.3),
    tagBg: 'rgba(255, 255, 255, 0.07)',
    tagText: text1,
    badgeBg: toSubtleAlpha(accent, '25', 0.18),
    badgeText: accent,
  };
}
