/**
 * Basic Keypad Panel with Granular Key Customization
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.pro.bd/
 * © 2026 Prachurjo Calculator. All rights reserved.
 */

import React from 'react';
import { Delete } from 'lucide-react';
import { ButtonShape, KeypadScale, SoundEffectType } from '../types.ts';
import { ThemePalette } from '../data/themes.ts';
import { CalculatorButton } from './CalculatorButton.tsx';

interface BasicPadProps {
  onClear: () => void;
  onParentheses: () => void;
  onPercentage: () => void;
  onBackspace: () => void;
  onEquals: () => void;
  onInput: (char: string) => void;
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

export const BasicPad: React.FC<BasicPadProps> = ({
  onClear,
  onParentheses,
  onPercentage,
  onBackspace,
  onEquals,
  onInput,
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
          btnHeight: 'h-12 sm:h-14',
          numText: 'text-xl sm:text-2xl',
          opText: 'text-xl sm:text-2xl',
          actionText: 'text-lg sm:text-xl',
          eqText: 'text-2xl font-medium',
          gridGap: 'gap-2 sm:gap-2.5',
        };
      case 'spacious':
        return {
          btnHeight: 'h-16 sm:h-18',
          numText: 'text-2xl sm:text-3xl',
          opText: 'text-2xl sm:text-3xl',
          actionText: 'text-xl sm:text-2xl',
          eqText: 'text-3xl font-medium',
          gridGap: 'gap-3 sm:gap-3.5',
        };
      case 'jumbo':
        return {
          btnHeight: 'h-16 sm:h-20',
          numText: 'text-3xl sm:text-4xl',
          opText: 'text-3xl sm:text-4xl',
          actionText: 'text-2xl sm:text-3xl',
          eqText: 'text-4xl font-semibold',
          gridGap: 'gap-3 sm:gap-4',
        };
      case 'ultra':
        return {
          btnHeight: 'h-18 sm:h-22',
          numText: 'text-3xl sm:text-4xl font-bold',
          opText: 'text-3xl sm:text-4xl font-bold',
          actionText: 'text-2xl sm:text-3xl font-bold',
          eqText: 'text-4xl sm:text-5xl font-bold',
          gridGap: 'gap-3.5 sm:gap-4',
        };
      case 'standard':
      default:
        return {
          btnHeight: 'h-14 sm:h-16',
          numText: 'text-2xl sm:text-3xl',
          opText: 'text-2xl sm:text-3xl font-medium',
          actionText: 'text-xl sm:text-2xl font-semibold',
          eqText: 'text-3xl font-medium',
          gridGap: 'gap-2.5 sm:gap-3',
        };
    }
  };

  const { btnHeight, numText, opText, actionText, eqText, gridGap } = getHeightAndTextSize();

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
    <div className={`grid grid-cols-4 ${gridGap} w-full`}>
      {/* Row 1: AC | () | % | ÷ */}
      <CalculatorButton
        {...commonProps}
        keyId="AC"
        label="AC"
        ariaLabel="All Clear"
        variant="action"
        onClick={onClear}
        className={`${btnHeight} ${actionText}`}
      />
      <CalculatorButton
        {...commonProps}
        keyId="()"
        label="( )"
        ariaLabel="Parentheses"
        variant="action"
        onClick={onParentheses}
        className={`${btnHeight} ${actionText}`}
      />
      <CalculatorButton
        {...commonProps}
        keyId="%"
        label="%"
        ariaLabel="Percentage"
        variant="action"
        onClick={onPercentage}
        className={`${btnHeight} ${actionText}`}
      />
      <CalculatorButton
        {...commonProps}
        keyId="÷"
        label="÷"
        ariaLabel="Divide"
        variant="operator"
        onClick={() => onInput('÷')}
        className={`${btnHeight} ${opText}`}
      />

      {/* Row 2: 7 | 8 | 9 | × */}
      <CalculatorButton
        {...commonProps}
        keyId="7"
        label="7"
        ariaLabel="Seven"
        variant="number"
        onClick={() => onInput('7')}
        className={`${btnHeight} ${numText}`}
      />
      <CalculatorButton
        {...commonProps}
        keyId="8"
        label="8"
        ariaLabel="Eight"
        variant="number"
        onClick={() => onInput('8')}
        className={`${btnHeight} ${numText}`}
      />
      <CalculatorButton
        {...commonProps}
        keyId="9"
        label="9"
        ariaLabel="Nine"
        variant="number"
        onClick={() => onInput('9')}
        className={`${btnHeight} ${numText}`}
      />
      <CalculatorButton
        {...commonProps}
        keyId="×"
        label="×"
        ariaLabel="Multiply"
        variant="operator"
        onClick={() => onInput('×')}
        className={`${btnHeight} ${opText}`}
      />

      {/* Row 3: 4 | 5 | 6 | − */}
      <CalculatorButton
        {...commonProps}
        keyId="4"
        label="4"
        ariaLabel="Four"
        variant="number"
        onClick={() => onInput('4')}
        className={`${btnHeight} ${numText}`}
      />
      <CalculatorButton
        {...commonProps}
        keyId="5"
        label="5"
        ariaLabel="Five"
        variant="number"
        onClick={() => onInput('5')}
        className={`${btnHeight} ${numText}`}
      />
      <CalculatorButton
        {...commonProps}
        keyId="6"
        label="6"
        ariaLabel="Six"
        variant="number"
        onClick={() => onInput('6')}
        className={`${btnHeight} ${numText}`}
      />
      <CalculatorButton
        {...commonProps}
        keyId="−"
        label="−"
        ariaLabel="Subtract"
        variant="operator"
        onClick={() => onInput('−')}
        className={`${btnHeight} ${opText}`}
      />

      {/* Row 4: 1 | 2 | 3 | + */}
      <CalculatorButton
        {...commonProps}
        keyId="1"
        label="1"
        ariaLabel="One"
        variant="number"
        onClick={() => onInput('1')}
        className={`${btnHeight} ${numText}`}
      />
      <CalculatorButton
        {...commonProps}
        keyId="2"
        label="2"
        ariaLabel="Two"
        variant="number"
        onClick={() => onInput('2')}
        className={`${btnHeight} ${numText}`}
      />
      <CalculatorButton
        {...commonProps}
        keyId="3"
        label="3"
        ariaLabel="Three"
        variant="number"
        onClick={() => onInput('3')}
        className={`${btnHeight} ${numText}`}
      />
      <CalculatorButton
        {...commonProps}
        keyId="+"
        label="+"
        ariaLabel="Add"
        variant="operator"
        onClick={() => onInput('+')}
        className={`${btnHeight} ${opText}`}
      />

      {/* Row 5: 0 | . | ⌫ | = */}
      <CalculatorButton
        {...commonProps}
        keyId="0"
        label="0"
        ariaLabel="Zero"
        variant="number"
        onClick={() => onInput('0')}
        className={`${btnHeight} ${numText}`}
      />
      <CalculatorButton
        {...commonProps}
        keyId="."
        label="."
        ariaLabel="Decimal point"
        variant="number"
        onClick={() => onInput('.')}
        className={`${btnHeight} ${numText} font-bold`}
      />
      <CalculatorButton
        {...commonProps}
        keyId="⌫"
        label={<Delete className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />}
        ariaLabel="Backspace"
        variant="number"
        onClick={onBackspace}
        className={btnHeight}
      />
      <CalculatorButton
        {...commonProps}
        keyId="="
        label="="
        ariaLabel="Equals"
        variant="equals"
        onClick={onEquals}
        className={`${btnHeight} ${eqText}`}
      />
    </div>
  );
};
