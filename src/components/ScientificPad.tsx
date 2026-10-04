/**
 * Scientific Keypad Panel with Granular Key Customization & Memory (MC, MR, M-, M+)
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.pro.bd/
 * © 2026 Calculator. All rights reserved.
 */

import React from 'react';
import { AngleMode, ButtonShape, KeypadScale, SoundEffectType } from '../types.ts';
import { ThemePalette } from '../data/themes.ts';
import { CalculatorButton } from './CalculatorButton.tsx';

interface ScientificPadProps {
  angleMode: AngleMode;
  isInvActive: boolean;
  onToggleAngleMode: () => void;
  onToggleInv: () => void;
  onInput: (token: string) => void;
  onMemoryAdd?: () => void;
  onMemorySubtract?: () => void;
  onMemoryRecall?: () => void;
  onMemoryClear?: () => void;
  hasMemoryValue?: boolean;
  soundEnabled?: boolean;
  soundType?: SoundEffectType;
  soundVolume?: number;
  shape?: ButtonShape;
  scale?: KeypadScale;
  palette?: ThemePalette | null;
  animationsEnabled?: boolean;
  effectsEnabled?: boolean;
  voiceKeyClick?: boolean;
  voiceLanguage?: string;
  voicePitch?: number;
  voiceRate?: number;
}

export const ScientificPad: React.FC<ScientificPadProps> = ({
  angleMode,
  isInvActive,
  onToggleAngleMode,
  onToggleInv,
  onInput,
  onMemoryAdd,
  onMemorySubtract,
  onMemoryRecall,
  onMemoryClear,
  hasMemoryValue = false,
  soundEnabled = true,
  soundType = 'tactile',
  soundVolume = 0.8,
  shape = 'round',
  scale = 'standard',
  palette,
  animationsEnabled = true,
  effectsEnabled = true,
  voiceKeyClick = false,
  voiceLanguage = 'bn-BD',
  voicePitch = 1.0,
  voiceRate = 1.1,
}) => {
  // Height and text size based on scale
  const getHeightAndTextSize = () => {
    switch (scale) {
      case 'compact':
        return {
          btnHeight: 'h-9 sm:h-10',
          symText: 'text-base sm:text-lg',
          fnText: 'text-[11px] sm:text-xs font-semibold',
          gridGap: 'gap-1.5 sm:gap-2',
        };
      case 'spacious':
        return {
          btnHeight: 'h-12 sm:h-14',
          symText: 'text-xl sm:text-2xl',
          fnText: 'text-xs sm:text-sm font-semibold',
          gridGap: 'gap-2.5 sm:gap-3',
        };
      case 'jumbo':
        return {
          btnHeight: 'h-13 sm:h-15',
          symText: 'text-2xl sm:text-3xl',
          fnText: 'text-sm sm:text-base font-semibold',
          gridGap: 'gap-2.5 sm:gap-3.5',
        };
      case 'ultra':
        return {
          btnHeight: 'h-14 sm:h-16',
          symText: 'text-2xl sm:text-3xl font-bold',
          fnText: 'text-sm sm:text-base font-bold',
          gridGap: 'gap-3 sm:gap-4',
        };
      case 'standard':
      default:
        return {
          btnHeight: 'h-10 sm:h-12',
          symText: 'text-lg sm:text-xl',
          fnText: 'text-xs sm:text-sm font-semibold',
          gridGap: 'gap-2 sm:gap-2.5',
        };
    }
  };

  const { btnHeight, symText, fnText, gridGap } = getHeightAndTextSize();

  const commonProps = {
    soundEnabled,
    soundType,
    soundVolume,
    shape,
    palette,
    animationsEnabled,
    effectsEnabled,
    voiceKeyClick,
    voiceLanguage,
    voicePitch,
    voiceRate,
  };

  return (
    <div className={`grid grid-cols-4 ${gridGap} w-full pb-2.5`}>
      {/* Row 1: Memory Functions (MC | MR | M- | M+) */}
      <CalculatorButton
        {...commonProps}
        keyId="MC"
        label="MC"
        ariaLabel="Memory Clear"
        variant="scientific"
        disabled={!hasMemoryValue}
        onClick={() => onMemoryClear && onMemoryClear()}
        className={`${btnHeight} ${fnText} tracking-wider ${!hasMemoryValue ? 'opacity-40' : 'opacity-100 font-bold'}`}
      />
      <CalculatorButton
        {...commonProps}
        keyId="MR"
        label="MR"
        ariaLabel="Memory Recall"
        variant="scientific"
        disabled={!hasMemoryValue}
        onClick={() => onMemoryRecall && onMemoryRecall()}
        className={`${btnHeight} ${fnText} tracking-wider ${!hasMemoryValue ? 'opacity-40' : 'opacity-100 font-bold'}`}
      />
      <CalculatorButton
        {...commonProps}
        keyId="M-"
        label="M−"
        ariaLabel="Memory Subtract"
        variant="scientific"
        onClick={() => onMemorySubtract && onMemorySubtract()}
        className={`${btnHeight} ${fnText} tracking-wider font-bold`}
      />
      <CalculatorButton
        {...commonProps}
        keyId="M+"
        label="M+"
        ariaLabel="Memory Add"
        variant="scientific"
        onClick={() => onMemoryAdd && onMemoryAdd()}
        className={`${btnHeight} ${fnText} tracking-wider font-bold`}
      />

      {/* Row 2: √ | π | ^ | ! */}
      <CalculatorButton
        {...commonProps}
        keyId="√"
        label="√"
        ariaLabel="Square root"
        variant="scientific"
        onClick={() => onInput('√(')}
        className={`${btnHeight} ${symText}`}
      />
      <CalculatorButton
        {...commonProps}
        keyId="π"
        label="π"
        ariaLabel="Pi"
        variant="scientific"
        onClick={() => onInput('π')}
        className={`${btnHeight} ${symText}`}
      />
      <CalculatorButton
        {...commonProps}
        keyId="^"
        label="^"
        ariaLabel="Power exponent"
        variant="scientific"
        onClick={() => onInput('^')}
        className={`${btnHeight} ${symText} font-bold`}
      />
      <CalculatorButton
        {...commonProps}
        keyId="!"
        label="!"
        ariaLabel="Factorial"
        variant="scientific"
        onClick={() => onInput('!')}
        className={`${btnHeight} ${symText} font-semibold`}
      />

      {/* Row 3: Rad/Deg | sin | cos | tan */}
      <CalculatorButton
        {...commonProps}
        keyId="mode"
        label={angleMode === 'RAD' ? 'deg' : 'rad'}
        ariaLabel={`Switch to ${angleMode === 'RAD' ? 'Degrees' : 'Radians'}`}
        variant="scientific"
        onClick={onToggleAngleMode}
        className={`${btnHeight} ${fnText} lowercase`}
      />
      <CalculatorButton
        {...commonProps}
        keyId="sin"
        label={isInvActive ? 'sin⁻¹' : 'sin'}
        ariaLabel={isInvActive ? 'Inverse sine' : 'Sine'}
        variant="scientific"
        onClick={() => onInput(isInvActive ? 'asin(' : 'sin(')}
        className={`${btnHeight} ${fnText}`}
      />
      <CalculatorButton
        {...commonProps}
        keyId="cos"
        label={isInvActive ? 'cos⁻¹' : 'cos'}
        ariaLabel={isInvActive ? 'Inverse cosine' : 'Cosine'}
        variant="scientific"
        onClick={() => onInput(isInvActive ? 'acos(' : 'cos(')}
        className={`${btnHeight} ${fnText}`}
      />
      <CalculatorButton
        {...commonProps}
        keyId="tan"
        label={isInvActive ? 'tan⁻¹' : 'tan'}
        ariaLabel={isInvActive ? 'Inverse tangent' : 'Tangent'}
        variant="scientific"
        onClick={() => onInput(isInvActive ? 'atan(' : 'tan(')}
        className={`${btnHeight} ${fnText}`}
      />

      {/* Row 4: Inv | e | ln | log */}
      <CalculatorButton
        {...commonProps}
        keyId="INV"
        label="INV"
        ariaLabel="Toggle inverse functions"
        variant="scientific"
        isActive={isInvActive}
        onClick={onToggleInv}
        className={`${btnHeight} text-xs sm:text-sm tracking-wider`}
      />
      <CalculatorButton
        {...commonProps}
        keyId="e"
        label="e"
        ariaLabel="Euler's number"
        variant="scientific"
        onClick={() => onInput('e')}
        className={`${btnHeight} ${symText} italic`}
      />
      <CalculatorButton
        {...commonProps}
        keyId="ln"
        label="ln"
        ariaLabel="Natural logarithm"
        variant="scientific"
        onClick={() => onInput('ln(')}
        className={`${btnHeight} ${fnText}`}
      />
      <CalculatorButton
        {...commonProps}
        keyId="log"
        label="log"
        ariaLabel="Base 10 logarithm"
        variant="scientific"
        onClick={() => onInput('log(')}
        className={`${btnHeight} ${fnText}`}
      />
    </div>
  );
};
