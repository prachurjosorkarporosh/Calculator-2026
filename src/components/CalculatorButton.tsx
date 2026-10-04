/**
 * Custom Material 3 Style Calculator Button with Ripples, Effects & Voice Readout
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Prachurjo Calculator. All rights reserved.
 */

import React, { useState } from 'react';
import { ButtonShape, SoundEffectType } from '../types.ts';
import { ThemePalette } from '../data/themes.ts';
import { triggerHaptic } from '../utils/haptics.ts';
import { playKeypressSound } from '../utils/sound.ts';
import { speakKeyButton } from '../utils/speech.ts';

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
  soundVolume?: number;
  shape?: ButtonShape;
  palette?: ThemePalette | null;
  customStyle?: React.CSSProperties;
  keyId?: string;
  animationsEnabled?: boolean;
  effectsEnabled?: boolean;
  voiceKeyClick?: boolean;
  voiceLanguage?: string;
  voicePitch?: number;
  voiceRate?: number;
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
  soundVolume = 0.8,
  shape = 'round',
  palette,
  customStyle,
  keyId,
  animationsEnabled = true,
  effectsEnabled = true,
  voiceKeyClick = false,
  voiceLanguage = 'bn-BD',
  voicePitch = 1.0,
  voiceRate = 1.1,
}) => {
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null);

  const lookupId = keyId || (typeof label === 'string' ? label : ariaLabel);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (disabled) return;

    // Haptic feedback
    triggerHaptic(variant === 'equals' ? 'medium' : 'light');

    // Keypress sound
    if (soundEnabled) {
      playKeypressSound(variant, soundType, soundVolume);
    }

    // Voice button readout
    if (voiceKeyClick) {
      speakKeyButton(lookupId, voiceLanguage, voicePitch, voiceRate);
    }

    // Material 3 Ripple animation
    if (animationsEnabled) {
      const rect = e.currentTarget.getBoundingClientRect();
      let clientX = rect.left + rect.width / 2;
      let clientY = rect.top + rect.height / 2;
      if ('clientX' in e && e.clientX !== 0) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      setRipple({ x, y, id: Date.now() });
      setTimeout(() => setRipple(null), 380);
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
    if (palette.buttonBlur !== undefined) {
      if (palette.buttonBlur > 0) {
        style.backdropFilter = `blur(${palette.buttonBlur}px)`;
        style.WebkitBackdropFilter = `blur(${palette.buttonBlur}px)`;
      } else {
        style.backdropFilter = 'none';
        style.WebkitBackdropFilter = 'none';
      }
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

    // Glow Effect
    if (effectsEnabled && (variant === 'equals' || isActive)) {
      style.boxShadow = `0 0 16px ${palette.equalsBg}66`;
    }

    return style;
  };

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
        font-medium cursor-pointer overflow-hidden
        focus-visible:ring-2 focus-visible:ring-[#004A77] dark:focus-visible:ring-[#C2E7FF]
        ${animationsEnabled ? 'transition-all duration-150 ease-out active:scale-90' : 'transition-none'}
        ${getShapeClass()}
        ${getGlassClass()}
        ${getFallbackClasses()}
        ${className}
      `}
    >
      {/* Dynamic Ripple Wave */}
      {animationsEnabled && ripple && (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/40 pointer-events-none animate-key-ripple"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            width: '60px',
            height: '60px',
            marginLeft: '-30px',
            marginTop: '-30px',
          }}
        />
      )}

      <span className="relative z-10 flex items-center justify-center leading-none tracking-tight">
        {label}
      </span>
      {subLabel && (
        <span className="relative z-10 text-[10px] opacity-75 font-normal -mt-0.5">
          {subLabel}
        </span>
      )}
    </button>
  );
};
