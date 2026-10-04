/**
 * Custom Material 3 Style Calculator Button
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.pro.bd/
 * © 2026 Prachurjo Calculator. All rights reserved.
 *
 * Implements Android-accurate rounded pill/circular buttons with
 * customizable corner shapes, sizing scales, theme colors, and sound effects.
 */

import React from 'react';
import { ButtonShape, SoundEffectType } from '../types.ts';
import { ThemePalette } from '../data/themes.ts';
import { triggerHaptic } from '../utils/haptics.ts';
import { playKeypressSound } from '../utils/sound.ts';

export type ButtonVariant = 'number' | 'operator' | 'scientific' | 'action' | 'equals';

interface CalculatorButtonProps {
  label: React.ReactNode;
  subLabel?: string;
  onClick: () => void;
  variant?: ButtonVariant;
  isActive?: boolean;
  ariaLabel: string;
  className?: string;
  disabled?: boolean;
  soundEnabled?: boolean;
  soundType?: SoundEffectType;
  shape?: ButtonShape;
  palette?: ThemePalette | null;
  customStyle?: React.CSSProperties;
  keyId?: string;
}

export const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  label,
  subLabel,
  onClick,
  variant = 'number',
  isActive = false,
  ariaLabel,
  className = '',
  disabled = false,
  soundEnabled = true,
  soundType = 'tactile',
  shape = 'round',
  palette,
  customStyle,
  keyId,
}) => {
  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (disabled) return;
    triggerHaptic(variant === 'equals' ? 'medium' : 'light');
    if (soundEnabled) {
      playKeypressSound(variant, soundType);
    }
    onClick();
  };

  // Button shape classes
  const getShapeClass = () => {
    switch (shape) {
      case 'squircle':
        return 'rounded-[22px]';
      case 'soft':
        return 'rounded-2xl';
      case 'sharp':
        return 'rounded-xl';
      case 'round':
      default:
        return 'rounded-full';
    }
  };

  // Palette-based dynamic styles
  const getPaletteStyle = (): React.CSSProperties => {
    if (!palette) return {};

    const lookupId = keyId || (typeof label === 'string' ? label : ariaLabel);

    // 1. Check individual key-by-key override first
    const individualBg = palette.keyBgOverrides?.[lookupId];
    const individualText = palette.keyTextOverrides?.[lookupId];

    let baseBg = palette.numberBg;
    let baseText = palette.numberText;

    switch (variant) {
      case 'equals':
        baseBg = palette.equalsBg;
        baseText = palette.equalsText;
        break;
      case 'action':
        baseBg = palette.actionBg || palette.operatorBg;
        baseText = palette.actionText || palette.operatorText;
        break;
      case 'operator':
        baseBg = palette.operatorBg;
        baseText = palette.operatorText;
        break;
      case 'scientific':
        if (isActive) {
          baseBg = palette.equalsBg;
          baseText = palette.equalsText;
        } else {
          baseBg = palette.scientificBg;
          baseText = palette.scientificText;
        }
        break;
      case 'number':
      default:
        if ((lookupId === 'Backspace' || ariaLabel === 'Backspace') && palette.backspaceBg) {
          baseBg = palette.backspaceBg;
        } else {
          baseBg = palette.numberBg;
          baseText = palette.numberText;
        }
        break;
    }

    const style: React.CSSProperties = {
      backgroundColor: individualBg || baseBg,
      color: individualText || baseText,
    };

    // Button Backdrop Blur support
    if (palette.buttonBlur !== undefined && palette.buttonBlur > 0) {
      style.backdropFilter = `blur(${palette.buttonBlur}px)`;
      style.WebkitBackdropFilter = `blur(${palette.buttonBlur}px)`;
    } else if (palette.isGlassmorphic || palette.buttonGlassmorphic) {
      style.backdropFilter = 'blur(8px)';
      style.WebkitBackdropFilter = 'blur(8px)';
    }

    // Button Background Image support
    if (palette.buttonBgImage) {
      style.backgroundImage = `url(${palette.buttonBgImage})`;
      style.backgroundSize = 'cover';
      style.backgroundPosition = 'center';
    }

    // Button Opacity support
    if (palette.buttonOpacity !== undefined && palette.buttonOpacity < 100) {
      style.opacity = Math.max(0.2, palette.buttonOpacity / 100);
    }

    return style;
  };

  // Default Android Material 3 classes when no custom palette
  const getFallbackClasses = () => {
    if (palette) return '';
    switch (variant) {
      case 'equals':
        return 'bg-[#087A36] text-white hover:bg-[#076c30] active:bg-[#065b28] shadow-sm';
      case 'operator':
      case 'action':
        return 'bg-[#B9E1F7] text-[#001D35] hover:bg-[#a9daf5] active:bg-[#97d0f1] dark:bg-[#004A77] dark:text-[#C2E7FF] dark:hover:bg-[#00558a] dark:active:bg-[#003e65]';
      case 'scientific':
        if (isActive) {
          return 'bg-[#004A77] text-white dark:bg-[#C2E7FF] dark:text-[#001D35] ring-2 ring-[#001D35]/20';
        }
        return 'bg-[#B9E1F7] text-[#001D35] hover:bg-[#a9daf5] active:bg-[#97d0f1] dark:bg-[#1E3A52] dark:text-[#C2E7FF] dark:hover:bg-[#254663] dark:active:bg-[#183146]';
      case 'number':
      default:
        return 'bg-[#DDE3EA] text-[#191C1E] hover:bg-[#d2d9e2] active:bg-[#c7cfda] dark:bg-[#2E3135] dark:text-[#E2E2E6] dark:hover:bg-[#383b40] dark:active:bg-[#25272a]';
    }
  };

  const getGlassClass = () => {
    if (
      palette?.isGlassmorphic ||
      palette?.buttonGlassmorphic ||
      (palette?.buttonBlur !== undefined && palette.buttonBlur > 0)
    ) {
      return 'border border-white/20 shadow-md';
    }
    return '';
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      disabled={disabled}
      style={{ ...getPaletteStyle(), ...customStyle }}
      className={`
        relative select-none outline-none flex flex-col items-center justify-center
        transition-all duration-100 ease-out active:scale-95
        font-medium cursor-pointer overflow-hidden
        focus-visible:ring-2 focus-visible:ring-[#004A77] dark:focus-visible:ring-[#C2E7FF]
        ${getShapeClass()}
        ${getGlassClass()}
        ${getFallbackClasses()}
        ${className}
      `}
    >
      <span className="flex items-center justify-center leading-none tracking-tight">
        {label}
      </span>
      {subLabel && (
        <span className="text-[10px] opacity-75 font-normal -mt-0.5">
          {subLabel}
        </span>
      )}
    </button>
  );
};
