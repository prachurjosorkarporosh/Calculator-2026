/**
 * Prachurjo Calculator - Main Application Entry
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Prachurjo Calculator. All rights reserved.
 *
 * Full production-ready Android Scientific Calculator with
 * 50+ Google Fonts gallery, 18+ aesthetic themes, 100+ HD wallpapers,
 * adjustable keypad sizing, corner styles, audio sound styles, local history, and full scientific engine.
 */

import React, { useState, useEffect, useCallback, useTransition, useMemo } from 'react';
import {
  AngleMode,
  ButtonShape,
  CustomThemeColors,
  DisplaySize,
  HistoryItem,
  KeypadScale,
  SoundEffectType,
  ThemeMode,
  UserPreferences,
} from './types.ts';
import { CalculatorEngine } from './domain/calculatorEngine.ts';
import { LocalStorageManager } from './data/storage.ts';
import { THEME_PALETTES, ThemePalette } from './data/themes.ts';
import { FONTS_CATALOG, FontOption } from './data/fonts.ts';
import { TopBar } from './components/TopBar.tsx';
import { DisplayArea } from './components/DisplayArea.tsx';
import { ChevronToggle } from './components/ChevronToggle.tsx';
import { ScientificPad } from './components/ScientificPad.tsx';
import { BasicPad } from './components/BasicPad.tsx';
import { ThreeDotMenu } from './components/ThreeDotMenu.tsx';
import { HistoryModal } from './components/HistoryModal.tsx';
import { ThemeStudioPage } from './components/ThemeStudioPage.tsx';
import { ThemeCustomizerModal } from './components/ThemeCustomizerModal.tsx';
import { FontSelectorModal } from './components/FontSelectorModal.tsx';
import { CustomizationModal } from './components/CustomizationModal.tsx';
import { SettingsDialog } from './components/SettingsDialog.tsx';
import { PrivacyDialog } from './components/PrivacyDialog.tsx';
import { HelpDialog } from './components/HelpDialog.tsx';
import { AboutDialog } from './components/AboutDialog.tsx';
import { VoiceCalculatorModal } from './components/VoiceCalculatorModal.tsx';
import { PhoneDatabaseModal } from './components/PhoneDatabaseModal.tsx';
import { AppIconModal } from './components/AppIconModal.tsx';
import { OnboardingThemeModal } from './components/OnboardingThemeModal.tsx';
import { AndroidStatusBar } from './components/AndroidStatusBar.tsx';
import { AndroidNavigationBar } from './components/AndroidNavigationBar.tsx';
import { AndroidApkModal } from './components/AndroidApkModal.tsx';
import { SparkleEffect } from './components/SparkleEffect.tsx';
import { PhoneDatabaseManager } from './data/phoneDatabase.ts';
import { updateDocumentFavicon } from './data/appIcons.ts';
import { playKeypressSound, setMasterSoundVolume } from './utils/sound.ts';
import { speakCalculationResult } from './utils/speech.ts';
import { setHapticsEnabled, triggerHaptic } from './utils/haptics.ts';

export default function App() {
  // Calculator States
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [evaluationKey, setEvaluationKey] = useState<number>(0);
  const [memoryValue, setMemoryValue] = useState<number | null>(null);

  // Preference & Customization States
  const [isScientificExpanded, setIsScientificExpanded] = useState<boolean>(
    LocalStorageManager.getScientificExpanded
  );
  const [angleMode, setAngleMode] = useState<AngleMode>(
    LocalStorageManager.getAngleMode
  );
  const [isInvActive, setIsInvActive] = useState<boolean>(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>(LocalStorageManager.getTheme);

  // Theme Palette & Custom Colors
  const [themeId, setThemeId] = useState<string>(LocalStorageManager.getThemeId);
  const [customColors, setCustomColors] = useState<CustomThemeColors | null>(
    LocalStorageManager.getCustomColors
  );

  // 50+ Typography / Font
  const [fontId, setFontId] = useState<string>(LocalStorageManager.getFontId);

  // Button Shape & Keypad Sizing
  const [buttonShape, setButtonShape] = useState<ButtonShape>(
    LocalStorageManager.getButtonShape
  );
  const [keypadScale, setKeypadScale] = useState<KeypadScale>(
    LocalStorageManager.getKeypadScale
  );
  const [displaySize, setDisplaySize] = useState<DisplaySize>(
    LocalStorageManager.getDisplaySize
  );
  const [personalName, setPersonalName] = useState<string>(
    LocalStorageManager.getPersonalName
  );

  // App Icon & Glass Blur Customization
  const [appIconId, setAppIconId] = useState<string>(
    LocalStorageManager.getAppIconId
  );
  const [buttonBlur, setButtonBlur] = useState<number>(
    LocalStorageManager.getButtonBlur
  );

  // Audio & Haptic Customization
  const [soundEnabled, setSoundEnabled] = useState<boolean>(
    LocalStorageManager.getKeypressSound
  );
  const [soundType, setSoundType] = useState<SoundEffectType>(
    LocalStorageManager.getSoundType
  );
  const [hapticEnabled, setHapticEnabled] = useState<boolean>(
    LocalStorageManager.getHapticEnabled
  );
  const [formatThousands, setFormatThousands] = useState<boolean>(
    LocalStorageManager.getFormatThousands
  );

  // History State
  const [history, setHistory] = useState<HistoryItem[]>(
    LocalStorageManager.getHistory
  );

  // UI Modals & Menus
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isThemesOpen, setIsThemesOpen] = useState<boolean>(false);
  const [isFontsOpen, setIsFontsOpen] = useState<boolean>(false);
  const [isAppIconOpen, setIsAppIconOpen] = useState<boolean>(false);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState<boolean>(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState<boolean>(false);
  const [isPrivacyDialogOpen, setIsPrivacyDialogOpen] = useState<boolean>(false);
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState<boolean>(false);
  const [isAboutDialogOpen, setIsAboutDialogOpen] = useState<boolean>(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState<boolean>(false);
  const [isDatabaseOpen, setIsDatabaseOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(
    !LocalStorageManager.getHasOnboarded()
  );
  const [systemTimeThemeEnabled, setSystemTimeThemeEnabled] = useState<boolean>(
    LocalStorageManager.getSystemTimeThemeEnabled()
  );
  const [currentPage, setCurrentPage] = useState<'calculator' | 'theme-studio'>('calculator');

  // New Sound, Voice, Animation, Wallpaper Sync & Android Mode States
  const [soundVolume, setSoundVolume] = useState<number>(LocalStorageManager.getSoundVolume());
  const [voiceAutoSpeak, setVoiceAutoSpeak] = useState<boolean>(LocalStorageManager.getVoiceAutoSpeak());
  const [voiceKeyClick, setVoiceKeyClick] = useState<boolean>(LocalStorageManager.getVoiceKeyClick());
  const [voiceLanguage, setVoiceLanguage] = useState<string>(LocalStorageManager.getVoiceLanguage());
  const [voicePitch, setVoicePitch] = useState<number>(LocalStorageManager.getVoicePitch());
  const [voiceRate, setVoiceRate] = useState<number>(LocalStorageManager.getVoiceRate());
  const [animationsEnabled, setAnimationsEnabled] = useState<boolean>(LocalStorageManager.getAnimationsEnabled());
  const [effectsEnabled, setEffectsEnabled] = useState<boolean>(LocalStorageManager.getEffectsEnabled());
  const [celebrationEnabled, setCelebrationEnabled] = useState<boolean>(LocalStorageManager.getCelebrationEnabled());
  const [syncWallpaperWithTheme, setSyncWallpaperWithTheme] = useState<boolean>(LocalStorageManager.getSyncWallpaperWithTheme());
  const [androidApkMode, setAndroidApkMode] = useState<boolean>(LocalStorageManager.getAndroidApkMode());
  const [navBarStyle, setNavBarStyle] = useState<'buttons' | 'gesture'>(LocalStorageManager.getNavBarStyle());
  const [isAndroidApkOpen, setIsAndroidApkOpen] = useState<boolean>(false);

  useEffect(() => {
    setMasterSoundVolume(soundVolume);
  }, [soundVolume]);

  // Automatic Day/Night Theme based on User's System Time
  useEffect(() => {
    if (!systemTimeThemeEnabled) return;

    const applySystemTimeTheme = () => {
      const hour = new Date().getHours();
      const isDay = hour >= 6 && hour < 18;
      const targetId = isDay ? 'pixel-light' : 'material-dark';
      setThemeId(targetId);
      LocalStorageManager.saveThemeId(targetId);
      setCustomColors(null);
    };

    applySystemTimeTheme();
    const interval = setInterval(applySystemTimeTheme, 60000);
    return () => clearInterval(interval);
  }, [systemTimeThemeEnabled]);

  // Sync document favicon dynamically
  useEffect(() => {
    updateDocumentFavicon(appIconId);
  }, [appIconId]);

  // Initialize Phone Native Database (IndexedDB)
  useEffect(() => {
    PhoneDatabaseManager.openDB().then((db) => {
      if (db) {
        // Sync any items from local storage to IndexedDB if needed
        const localHist = LocalStorageManager.getHistory();
        if (localHist.length > 0) {
          localHist.forEach((item) => PhoneDatabaseManager.saveHistoryItem(item));
        }
      }
    });
  }, []);

  // Non-blocking state transition
  const [, startTransition] = useTransition();

  // Sync haptic globally
  useEffect(() => {
    setHapticsEnabled(hapticEnabled);
  }, [hapticEnabled]);

  // Resolve Active Theme Palette
  const activePalette = useMemo<ThemePalette>(() => {
    if (themeId === 'custom' && customColors) {
      return {
        id: 'custom',
        name: 'Custom Theme',
        category: 'Glass & Aurora',
        isDark: true,
        bg: customColors.bg,
        surface: customColors.bg,
        frameBorder: customColors.numberBg,
        numberBg: customColors.numberBg,
        numberHover: customColors.numberBg,
        numberText: customColors.textColor,
        operatorBg: customColors.operatorBg,
        operatorHover: customColors.operatorBg,
        operatorText: customColors.textColor,
        scientificBg: customColors.scientificBg || customColors.operatorBg,
        scientificHover: customColors.scientificBg || customColors.operatorBg,
        scientificText: customColors.scientificTextColor || customColors.textColor,
        actionBg: customColors.actionBg || customColors.operatorBg,
        actionText: customColors.actionTextColor || customColors.textColor,
        backspaceBg: customColors.backspaceBg,
        equalsBg: customColors.equalsBg,
        equalsHover: customColors.equalsBg,
        equalsText: customColors.equalsTextColor || '#FFFFFF',
        displayText: customColors.textColor,
        secondaryText: customColors.textColor,
        accent: customColors.equalsBg,
        bgImage: customColors.bgImage,
        bgBlur: customColors.bgBlur,
        bgOverlayOpacity: customColors.bgOverlayOpacity,
        isGlassmorphic: customColors.isGlassmorphic,
        animatedBg: customColors.animatedBg,
        buttonBlur: customColors.buttonBlur !== undefined ? customColors.buttonBlur : buttonBlur,
        buttonBgImage: customColors.buttonBgImage,
        buttonOpacity: customColors.buttonOpacity,
        buttonGlassmorphic: customColors.buttonGlassmorphic,
        keyBgOverrides: customColors.keyBgOverrides,
        keyTextOverrides: customColors.keyTextOverrides,
      };
    }
    const found = THEME_PALETTES.find((t) => t.id === themeId);
    if (found) {
      return {
        ...found,
        buttonBlur: buttonBlur,
      };
    }
    return {
      ...THEME_PALETTES[0],
      buttonBlur: buttonBlur,
    };
  }, [themeId, customColors, buttonBlur]);

  // Resolve Active Font
  const activeFont = useMemo<FontOption>(() => {
    return FONTS_CATALOG.find((f) => f.id === fontId) || FONTS_CATALOG[0];
  }, [fontId]);

  // Synchronize Theme class with DOM
  useEffect(() => {
    const root = document.documentElement;
    if (activePalette.isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [activePalette]);

  // Live evaluation effect when typing
  useEffect(() => {
    if (isEvaluated || !expression.trim()) {
      if (!isEvaluated) {
        setResult('');
        setError(null);
      }
      return;
    }

    const hasOperation = /[+\-−*×/÷^%!√a-z]/.test(expression);
    if (!hasOperation) {
      setResult('');
      setError(null);
      return;
    }

    const evalRes = CalculatorEngine.evaluate(expression, angleMode);
    if (evalRes.success && evalRes.formatted) {
      if (evalRes.formatted !== expression) {
        setResult(evalRes.formatted);
      } else {
        setResult('');
      }
      setError(null);
    }
  }, [expression, angleMode, isEvaluated]);

  // Handle Character Input
  const handleInput = useCallback(
    (token: string) => {
      setError(null);

      // Decimal point validation
      if (token === '.') {
        if (isEvaluated) {
          setIsEvaluated(false);
          setExpression('0.');
          setResult('');
          return;
        }
        if (!expression || /[+−×÷^(]$/.test(expression)) {
          setExpression((prev) => prev + '0.');
          return;
        }
        if (!CalculatorEngine.canAppendDot(expression)) {
          return;
        }
      }

      // If user inputs directly after '=' evaluation:
      if (isEvaluated) {
        setIsEvaluated(false);
        // If user typed an operator, chain with previous result
        if (['+', '−', '×', '÷', '^', '%', '!'].includes(token)) {
          setExpression((prev) => (result ? `${result}${token}` : token));
          return;
        }
        // Otherwise start fresh
        setExpression(token);
        setResult('');
        return;
      }

      // Operator replacement if user enters consecutive operators (+, −, ×, ÷)
      if (['+', '−', '×', '÷'].includes(token)) {
        if (!expression) {
          if (token === '−') {
            setExpression('−');
            return;
          }
          if (result && !result.toLowerCase().includes('error')) {
            setExpression(`${result}${token}`);
            return;
          }
          return;
        }

        const lastChar = expression[expression.length - 1];
        const prevChar = expression.length > 1 ? expression[expression.length - 2] : '';

        // If ends with an operator like '5 +' and user taps '×', replace '+' with '×'
        if (['+', '−', '×', '÷'].includes(lastChar)) {
          // Allow negative sign after × or ÷ or ^ for negative numbers (e.g. 5 × −)
          if (token === '−' && ['×', '÷', '^'].includes(lastChar)) {
            setExpression((prev) => prev + token);
            return;
          }
          // If already has double operator e.g. '×−' and user taps '+', replace both with '+'
          if (['×', '÷'].includes(prevChar) && lastChar === '−') {
            setExpression((prev) => prev.slice(0, -2) + token);
            return;
          }
          // Otherwise replace the trailing operator
          setExpression((prev) => prev.slice(0, -1) + token);
          return;
        }
      }

      setExpression((prev) => prev + token);
    },
    [expression, isEvaluated, result]
  );

  // Parentheses Button
  const handleParentheses = useCallback(() => {
    setError(null);
    if (isEvaluated) {
      setIsEvaluated(false);
      setExpression('(');
      setResult('');
      return;
    }
    const paren = CalculatorEngine.getSmartParen(expression);
    setExpression((prev) => prev + paren);
  }, [expression, isEvaluated]);

  // Percentage Button
  const handlePercentage = useCallback(() => {
    handleInput('%');
  }, [handleInput]);

  // All Clear (AC)
  const handleClear = useCallback(() => {
    setExpression('');
    setResult('');
    setError(null);
    setIsEvaluated(false);
  }, []);

  // Backspace (⌫)
  const handleBackspace = useCallback(() => {
    if (isEvaluated) {
      setIsEvaluated(false);
      setResult('');
      return;
    }

    setError(null);
    setExpression((prev) => {
      if (!prev) return '';

      const functionTokens = [
        'asin(',
        'acos(',
        'atan(',
        'sin(',
        'cos(',
        'tan(',
        'ln(',
        'log(',
        '√(',
      ];

      for (const fn of functionTokens) {
        if (prev.endsWith(fn)) {
          return prev.slice(0, -fn.length);
        }
      }

      return prev.slice(0, -1);
    });
  }, [isEvaluated]);

  // Equals (=)
  const handleEquals = useCallback(() => {
    if (!expression.trim()) return;

    const evalRes = CalculatorEngine.evaluate(expression, angleMode);
    if (evalRes.success && evalRes.formatted !== undefined) {
      setResult(evalRes.formatted);
      setError(null);
      setIsEvaluated(true);
      setEvaluationKey((prev) => prev + 1);

      if (voiceAutoSpeak) {
        speakCalculationResult(evalRes.formatted, voiceLanguage, voicePitch, voiceRate);
      }

      const savedItem = LocalStorageManager.saveHistoryItem(
        expression,
        evalRes.formatted
      );
      PhoneDatabaseManager.saveHistoryItem(savedItem);
      setHistory((prev) => [savedItem, ...prev].slice(0, 200));
    } else {
      setError(evalRes.error || 'Error');
      setEvaluationKey((prev) => prev + 1);
      if (voiceAutoSpeak) {
        speakCalculationResult(evalRes.error || 'Error', voiceLanguage, voicePitch, voiceRate);
      }
    }
  }, [expression, angleMode, voiceAutoSpeak, voiceLanguage, voicePitch, voiceRate]);

  // Apply expression and calculate from Voice Calculator
  const handleApplyVoiceCalculation = useCallback(
    (voiceExpr: string, evaluateImmediately: boolean) => {
      setExpression(voiceExpr);
      if (evaluateImmediately) {
        const evalRes = CalculatorEngine.evaluate(voiceExpr, angleMode);
        if (evalRes.success && evalRes.formatted !== undefined) {
          setResult(evalRes.formatted);
          setError(null);
          setIsEvaluated(true);
          setEvaluationKey((prev) => prev + 1);

          if (voiceAutoSpeak) {
            speakCalculationResult(evalRes.formatted, voiceLanguage, voicePitch, voiceRate);
          }

          const savedItem = LocalStorageManager.saveHistoryItem(
            voiceExpr,
            evalRes.formatted
          );
          PhoneDatabaseManager.saveHistoryItem(savedItem);
          setHistory((prev) => [savedItem, ...prev].slice(0, 200));
        } else {
          setError(evalRes.error || 'Error');
          setEvaluationKey((prev) => prev + 1);
          if (voiceAutoSpeak) {
            speakCalculationResult(evalRes.error || 'Error', voiceLanguage, voicePitch, voiceRate);
          }
        }
      }
    },
    [angleMode, voiceAutoSpeak, voiceLanguage, voicePitch, voiceRate]
  );

  // Helper to extract active numeric value for memory operations
  const getActiveNumberForMemory = useCallback((): number | null => {
    if (result && !result.toLowerCase().includes('error')) {
      const num = parseFloat(result.replace(/,/g, ''));
      if (!isNaN(num)) return num;
    }
    if (expression) {
      const clean = expression.replace(/,/g, '');
      const evalRes = CalculatorEngine.evaluate(clean, angleMode);
      if (evalRes.success && evalRes.formatted) {
        const num = parseFloat(evalRes.formatted.replace(/,/g, ''));
        if (!isNaN(num)) return num;
      }
    }
    return null;
  }, [result, expression, angleMode]);

  // Memory Functions (M+, M-, MR, MC)
  const handleMemoryAdd = useCallback(() => {
    triggerHaptic('medium');
    const val = getActiveNumberForMemory();
    if (val !== null) {
      setMemoryValue((prev) => (prev ?? 0) + val);
    }
  }, [getActiveNumberForMemory]);

  const handleMemorySubtract = useCallback(() => {
    triggerHaptic('medium');
    const val = getActiveNumberForMemory();
    if (val !== null) {
      setMemoryValue((prev) => (prev ?? 0) - val);
    }
  }, [getActiveNumberForMemory]);

  const handleMemoryRecall = useCallback(() => {
    triggerHaptic('medium');
    if (memoryValue !== null) {
      const valStr = memoryValue.toString();
      if (isEvaluated) {
        setExpression(valStr);
        setResult('');
        setIsEvaluated(false);
      } else {
        setExpression((prev) => prev + valStr);
      }
    }
  }, [memoryValue, isEvaluated]);

  const handleMemoryClear = useCallback(() => {
    triggerHaptic('medium');
    setMemoryValue(null);
  }, []);

  // Toggle Scientific Mode
  const handleToggleScientific = useCallback(() => {
    startTransition(() => {
      setIsScientificExpanded((prev) => {
        const next = !prev;
        LocalStorageManager.saveScientificExpanded(next);
        return next;
      });
    });
  }, []);

  // Toggle Angle Mode (RAD <-> DEG)
  const handleToggleAngleMode = useCallback(() => {
    setAngleMode((prev) => {
      const next: AngleMode = prev === 'RAD' ? 'DEG' : 'RAD';
      LocalStorageManager.saveAngleMode(next);
      return next;
    });
  }, []);

  // Toggle INV Mode
  const handleToggleInv = useCallback(() => {
    setIsInvActive((prev) => !prev);
  }, []);

  // Toggle Keypress Sound
  const handleToggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      LocalStorageManager.saveKeypressSound(next);
      return next;
    });
  }, []);

  // Change Sound Type
  const handleChangeSoundType = useCallback((type: SoundEffectType) => {
    setSoundType(type);
    LocalStorageManager.saveSoundType(type);
  }, []);

  // Toggle Haptics
  const handleToggleHaptic = useCallback(() => {
    setHapticEnabled((prev) => {
      const next = !prev;
      LocalStorageManager.saveHapticEnabled(next);
      return next;
    });
  }, []);

  // Toggle Format Thousands
  const handleToggleFormatThousands = useCallback(() => {
    setFormatThousands((prev) => {
      const next = !prev;
      LocalStorageManager.saveFormatThousands(next);
      return next;
    });
  }, []);

  // Change Theme ID
  const handleSelectThemeId = useCallback((id: string) => {
    setThemeId(id);
    LocalStorageManager.saveThemeId(id);
    if (systemTimeThemeEnabled) {
      setSystemTimeThemeEnabled(false);
      LocalStorageManager.setSystemTimeThemeEnabled(false);
    }
  }, [systemTimeThemeEnabled]);

  // Save Custom Colors
  const handleSaveCustomColors = useCallback((colors: CustomThemeColors) => {
    setCustomColors(colors);
    LocalStorageManager.saveCustomColors(colors);
    PhoneDatabaseManager.saveCustomColors(colors);
    if (systemTimeThemeEnabled) {
      setSystemTimeThemeEnabled(false);
      LocalStorageManager.setSystemTimeThemeEnabled(false);
    }
  }, [systemTimeThemeEnabled]);

  // Change Font ID
  const handleSelectFontId = useCallback((id: string) => {
    setFontId(id);
    LocalStorageManager.saveFontId(id);
  }, []);

  // Change Button Shape
  const handleChangeButtonShape = useCallback((shape: ButtonShape) => {
    setButtonShape(shape);
    LocalStorageManager.saveButtonShape(shape);
  }, []);

  // Change Keypad Scale
  const handleChangeKeypadScale = useCallback((scale: KeypadScale) => {
    setKeypadScale(scale);
    LocalStorageManager.saveKeypadScale(scale);
  }, []);

  // Change Display Size
  const handleChangeDisplaySize = useCallback((size: DisplaySize) => {
    setDisplaySize(size);
    LocalStorageManager.saveDisplaySize(size);
  }, []);

  // Change Personal Name
  const handleChangePersonalName = useCallback((name: string) => {
    setPersonalName(name);
    LocalStorageManager.savePersonalName(name);
  }, []);

  // Change App Icon
  const handleSelectAppIcon = useCallback((iconId: string) => {
    setAppIconId(iconId);
    LocalStorageManager.saveAppIconId(iconId);
    updateDocumentFavicon(iconId);
  }, []);

  // Change Button Backdrop Blur
  const handleChangeButtonBlur = useCallback((blur: number) => {
    setButtonBlur(blur);
    LocalStorageManager.saveButtonBlur(blur);
    if (customColors) {
      const updated: CustomThemeColors = { ...customColors, buttonBlur: blur };
      setCustomColors(updated);
      LocalStorageManager.saveCustomColors(updated);
      PhoneDatabaseManager.saveCustomColors(updated);
    }
  }, [customColors]);

  // Toggle System Time Theme
  const handleToggleSystemTimeTheme = useCallback(() => {
    setSystemTimeThemeEnabled((prev) => {
      const next = !prev;
      LocalStorageManager.setSystemTimeThemeEnabled(next);
      if (next) {
        // Immediately apply current daytime/nighttime theme
        const hour = new Date().getHours();
        const isDay = hour >= 6 && hour < 18;
        const targetId = isDay ? 'pixel-light' : 'material-dark';
        setThemeId(targetId);
        LocalStorageManager.saveThemeId(targetId);
        setCustomColors(null);
      }
      return next;
    });
  }, []);

  // Complete First-Time Onboarding
  const handleCompleteOnboarding = useCallback(() => {
    setIsOnboardingOpen(false);
    LocalStorageManager.setHasOnboarded(true);
  }, []);

  // History restore
  const handleSelectHistoryItem = useCallback((item: HistoryItem) => {
    setExpression(item.expression);
    setResult(item.result);
    setError(null);
    setIsEvaluated(true);
    setEvaluationKey((prev) => prev + 1);
  }, []);

  // Delete history item
  const handleDeleteHistoryItem = useCallback((id: string) => {
    const updated = LocalStorageManager.deleteHistoryItem(id);
    PhoneDatabaseManager.deleteHistoryItem(id);
    setHistory(updated);
  }, []);

  // Clear all history
  const handleClearAllHistory = useCallback(() => {
    LocalStorageManager.clearHistory();
    PhoneDatabaseManager.clearAllHistory();
    setHistory([]);
  }, []);

  // Restore full Phone Database backup
  const handleRestoreDatabaseBackup = useCallback(
    (
      restoredHistory: HistoryItem[],
      restoredColors: CustomThemeColors | null,
      restoredPrefs: Partial<UserPreferences>
    ) => {
      setHistory(restoredHistory);
      LocalStorageManager.saveHistory(restoredHistory);

      if (restoredColors) {
        setCustomColors(restoredColors);
        LocalStorageManager.saveCustomColors(restoredColors);
        setThemeId('custom');
        LocalStorageManager.saveThemeId('custom');
      }

      if (restoredPrefs.buttonShape) {
        setButtonShape(restoredPrefs.buttonShape);
        LocalStorageManager.saveButtonShape(restoredPrefs.buttonShape);
      }
      if (restoredPrefs.keypadScale) {
        setKeypadScale(restoredPrefs.keypadScale);
        LocalStorageManager.saveKeypadScale(restoredPrefs.keypadScale);
      }
      if (restoredPrefs.fontId) {
        setFontId(restoredPrefs.fontId);
        LocalStorageManager.saveFontId(restoredPrefs.fontId);
      }
      if (restoredPrefs.formatThousands !== undefined) {
        setFormatThousands(restoredPrefs.formatThousands);
        LocalStorageManager.saveFormatThousands(restoredPrefs.formatThousands);
      }
    },
    []
  );

  // Send feedback
  const handleSendFeedback = useCallback(() => {
    const email = 'sorkarporosh6@gmail.com';
    const subject = encodeURIComponent('Prachurjo Calculator Feedback');
    const body = encodeURIComponent(
      'Hi Prachurjo,\n\nI am using Prachurjo Calculator and wanted to share my feedback:\n\n'
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  }, []);

  // Physical Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in form inputs, textareas, etc.
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      if (
        isThemesOpen ||
        isFontsOpen ||
        isCustomizationOpen ||
        isSettingsDialogOpen ||
        isPrivacyDialogOpen ||
        isHelpDialogOpen ||
        isAboutDialogOpen ||
        isHistoryOpen ||
        isVoiceOpen ||
        isDatabaseOpen ||
        isOnboardingOpen ||
        isAppIconOpen
      ) {
        if (e.key === 'Escape') {
          setIsThemesOpen(false);
          setIsFontsOpen(false);
          setIsCustomizationOpen(false);
          setIsSettingsDialogOpen(false);
          setIsPrivacyDialogOpen(false);
          setIsHelpDialogOpen(false);
          setIsAboutDialogOpen(false);
          setIsHistoryOpen(false);
          setIsVoiceOpen(false);
          setIsDatabaseOpen(false);
          setIsOnboardingOpen(false);
          setIsAppIconOpen(false);
        }
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        if (soundEnabled) playKeypressSound('number', soundType);
        handleInput(e.key);
      } else if (e.key === '.') {
        if (soundEnabled) playKeypressSound('number', soundType);
        handleInput('.');
      } else if (e.key === '+' || e.key === '-') {
        if (soundEnabled) playKeypressSound('operator', soundType);
        handleInput(e.key === '-' ? '−' : '+');
      } else if (e.key === '*') {
        if (soundEnabled) playKeypressSound('operator', soundType);
        handleInput('×');
      } else if (e.key === '/') {
        if (soundEnabled) playKeypressSound('operator', soundType);
        handleInput('÷');
      } else if (e.key === '^') {
        if (soundEnabled) playKeypressSound('scientific', soundType);
        handleInput('^');
      } else if (e.key === '%') {
        if (soundEnabled) playKeypressSound('action', soundType);
        handlePercentage();
      } else if (e.key === '!') {
        if (soundEnabled) playKeypressSound('scientific', soundType);
        handleInput('!');
      } else if (e.key === '(' || e.key === ')') {
        if (soundEnabled) playKeypressSound('action', soundType);
        handleInput(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        if (soundEnabled) playKeypressSound('equals', soundType);
        handleEquals();
      } else if (e.key === 'Backspace') {
        if (soundEnabled) playKeypressSound('number', soundType);
        handleBackspace();
      } else if (e.key === 'Escape') {
        if (soundEnabled) playKeypressSound('action', soundType);
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleInput,
    handleParentheses,
    handlePercentage,
    handleEquals,
    handleBackspace,
    handleClear,
    soundEnabled,
    soundType,
    isThemesOpen,
    isFontsOpen,
    isCustomizationOpen,
    isSettingsDialogOpen,
    isPrivacyDialogOpen,
    isHelpDialogOpen,
    isAboutDialogOpen,
    isHistoryOpen,
    isVoiceOpen,
    isDatabaseOpen,
    isOnboardingOpen,
    isAppIconOpen,
  ]);

  // Handlers for Audio, Voice, Animation, Wallpaper Sync & Android Mode
  const handleToggleSyncWallpaperWithTheme = useCallback(() => {
    setSyncWallpaperWithTheme((prev) => {
      const next = !prev;
      LocalStorageManager.saveSyncWallpaperWithTheme(next);
      return next;
    });
  }, []);

  const handleToggleAnimations = useCallback(() => {
    setAnimationsEnabled((prev) => {
      const next = !prev;
      LocalStorageManager.saveAnimationsEnabled(next);
      return next;
    });
  }, []);

  const handleToggleEffects = useCallback(() => {
    setEffectsEnabled((prev) => {
      const next = !prev;
      LocalStorageManager.saveEffectsEnabled(next);
      return next;
    });
  }, []);

  const handleToggleCelebration = useCallback(() => {
    setCelebrationEnabled((prev) => {
      const next = !prev;
      LocalStorageManager.saveCelebrationEnabled(next);
      return next;
    });
  }, []);

  const handleToggleAndroidApkMode = useCallback(() => {
    setAndroidApkMode((prev) => {
      const next = !prev;
      LocalStorageManager.saveAndroidApkMode(next);
      return next;
    });
  }, []);

  const handleToggleVoiceAutoSpeak = useCallback(() => {
    setVoiceAutoSpeak((prev) => {
      const next = !prev;
      LocalStorageManager.saveVoiceAutoSpeak(next);
      return next;
    });
  }, []);

  const handleToggleVoiceKeyClick = useCallback(() => {
    setVoiceKeyClick((prev) => {
      const next = !prev;
      LocalStorageManager.saveVoiceKeyClick(next);
      return next;
    });
  }, []);

  const handleChangeVoiceLanguage = useCallback((lang: string) => {
    setVoiceLanguage(lang);
    LocalStorageManager.saveVoiceLanguage(lang);
  }, []);

  const handleChangeVoicePitch = useCallback((pitch: number) => {
    setVoicePitch(pitch);
    LocalStorageManager.saveVoicePitch(pitch);
  }, []);

  const handleChangeVoiceRate = useCallback((rate: number) => {
    setVoiceRate(rate);
    LocalStorageManager.saveVoiceRate(rate);
  }, []);

  const handleChangeSoundVolume = useCallback((vol: number) => {
    setSoundVolume(vol);
    LocalStorageManager.saveSoundVolume(vol);
    setMasterSoundVolume(vol);
  }, []);

  const handleChangeNavBarStyle = useCallback((style: 'buttons' | 'gesture') => {
    setNavBarStyle(style);
    LocalStorageManager.saveNavBarStyle(style);
  }, []);

  const hasActiveModal = Boolean(
    currentPage === 'theme-studio' ||
    isThemesOpen ||
    isFontsOpen ||
    isAppIconOpen ||
    isCustomizationOpen ||
    isHistoryOpen ||
    isSettingsDialogOpen ||
    isAndroidApkOpen ||
    isOnboardingOpen ||
    isPrivacyDialogOpen ||
    isHelpDialogOpen ||
    isAboutDialogOpen ||
    isVoiceOpen ||
    isDatabaseOpen ||
    isMenuOpen
  );

  const handleAndroidBack = useCallback(() => {
    if (currentPage === 'theme-studio') {
      setCurrentPage('calculator');
      return;
    }
    if (isMenuOpen) {
      setIsMenuOpen(false);
      return;
    }
    if (isSettingsDialogOpen) {
      setIsSettingsDialogOpen(false);
      return;
    }
    if (isHistoryOpen) {
      setIsHistoryOpen(false);
      return;
    }
    if (isThemesOpen) {
      setIsThemesOpen(false);
      return;
    }
    if (isFontsOpen) {
      setIsFontsOpen(false);
      return;
    }
    if (isAppIconOpen) {
      setIsAppIconOpen(false);
      return;
    }
    if (isCustomizationOpen) {
      setIsCustomizationOpen(false);
      return;
    }
    if (isAndroidApkOpen) {
      setIsAndroidApkOpen(false);
      return;
    }
    if (isVoiceOpen) {
      setIsVoiceOpen(false);
      return;
    }
    if (isDatabaseOpen) {
      setIsDatabaseOpen(false);
      return;
    }
    if (isPrivacyDialogOpen) {
      setIsPrivacyDialogOpen(false);
      return;
    }
    if (isHelpDialogOpen) {
      setIsHelpDialogOpen(false);
      return;
    }
    if (isAboutDialogOpen) {
      setIsAboutDialogOpen(false);
      return;
    }
    if (isOnboardingOpen) {
      setIsOnboardingOpen(false);
      return;
    }
    // No modal is open -> delete last input character
    handleBackspace();
  }, [
    currentPage,
    isMenuOpen,
    isSettingsDialogOpen,
    isHistoryOpen,
    isThemesOpen,
    isFontsOpen,
    isAppIconOpen,
    isCustomizationOpen,
    isAndroidApkOpen,
    isVoiceOpen,
    isDatabaseOpen,
    isPrivacyDialogOpen,
    isHelpDialogOpen,
    isAboutDialogOpen,
    isOnboardingOpen,
    handleBackspace,
  ]);

  const handleAndroidHome = useCallback(() => {
    setCurrentPage('calculator');
    setIsMenuOpen(false);
    setIsSettingsDialogOpen(false);
    setIsHistoryOpen(false);
    setIsThemesOpen(false);
    setIsFontsOpen(false);
    setIsAppIconOpen(false);
    setIsCustomizationOpen(false);
    setIsAndroidApkOpen(false);
    setIsVoiceOpen(false);
    setIsDatabaseOpen(false);
    setIsPrivacyDialogOpen(false);
    setIsHelpDialogOpen(false);
    setIsAboutDialogOpen(false);
    setIsOnboardingOpen(false);
    // Soft reset calculator
    setExpression('');
    setResult('');
    setError(null);
    triggerHaptic('medium');
  }, []);

  const handleAndroidRecent = useCallback(() => {
    setIsHistoryOpen((prev) => !prev);
  }, []);

  // Dedicated Theme Studio Page View
  if (currentPage === 'theme-studio') {
    return (
      <ThemeStudioPage
        activeThemeId={themeId}
        customColors={customColors}
        onSelectThemeId={handleSelectThemeId}
        onSaveCustomColors={handleSaveCustomColors}
        onBackToCalculator={() => setCurrentPage('calculator')}
      />
    );
  }

  return (
    <div
      style={{
        fontFamily: activeFont.family,
        backgroundImage:
          syncWallpaperWithTheme && activePalette.bgImage
            ? `url(${activePalette.bgImage})`
            : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: activePalette.bg,
      }}
      className={`min-h-screen w-full flex items-center justify-center select-none transition-all duration-500 relative ${
        androidApkMode ? 'p-0' : 'p-0 sm:p-4'
      } ${activePalette.animatedBg ? 'animate-aurora-mesh' : ''}`}
    >
      {/* Ambient backdrop blur overlay for whole website */}
      {syncWallpaperWithTheme && activePalette.bgImage && !androidApkMode && (
        <div
          className="absolute inset-0 pointer-events-none z-0 backdrop-blur-2xl transition-all duration-500"
          style={{
            backgroundColor: activePalette.isDark
              ? 'rgba(0, 0, 0, 0.65)'
              : 'rgba(255, 255, 255, 0.45)',
          }}
        />
      )}

      {/* Android Device Container / Frame */}
      <main
        style={{
          backgroundColor: activePalette.bg,
          borderColor: activePalette.frameBorder,
          backgroundImage: activePalette.bgImage
            ? `url(${activePalette.bgImage})`
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className={`relative flex flex-col overflow-hidden transition-all duration-300 z-10 ${
          androidApkMode
            ? 'w-full h-screen max-w-full rounded-none border-none shadow-none'
            : 'w-full sm:max-w-[430px] h-screen sm:h-[890px] sm:max-h-[96vh] sm:rounded-[44px] sm:shadow-2xl sm:border-[8px]'
        } ${activePalette.animatedBg ? 'animate-aurora-mesh' : ''}`}
      >
        {/* Background Blur Overlay for Photo Wallpapers inside frame */}
        {activePalette.bgImage && (
          <div
            className="absolute inset-0 pointer-events-none z-0 transition-all duration-300"
            style={{
              backgroundColor: `rgba(0, 0, 0, ${
                (activePalette.bgOverlayOpacity ?? 35) / 100
              })`,
              backdropFilter: `blur(${activePalette.bgBlur ?? 2}px)`,
              WebkitBackdropFilter: `blur(${activePalette.bgBlur ?? 2}px)`,
            }}
          />
        )}

        {/* Real Android Status Bar at top */}
        <AndroidStatusBar palette={activePalette} />

        {/* Top Bar with History, Voice, APK Center & 3-Dot Menu */}
        <div className="relative z-10">
          <TopBar
            onOpenHistory={() => setIsHistoryOpen(true)}
            onOpenMenu={() => setIsMenuOpen(true)}
            onOpenVoice={() => setIsVoiceOpen(true)}
            onOpenThemeStudio={() => setCurrentPage('theme-studio')}
            onOpenAndroidApk={() => setIsAndroidApkOpen(true)}
            personalName={personalName}
            onOpenCustomization={() => setIsCustomizationOpen(true)}
            appIconId={appIconId}
            onOpenAppIcons={() => setIsAppIconOpen(true)}
            palette={activePalette}
          />
        </div>

        {/* Display Area for Expressions & Results + Celebration Sparkle Burst */}
        <div className="relative z-10 flex-1 flex flex-col justify-end min-h-0">
          <DisplayArea
            expression={expression}
            result={result}
            error={error}
            isEvaluated={isEvaluated}
            angleMode={angleMode}
            isInvActive={isInvActive}
            hasMemory={memoryValue !== null && memoryValue !== 0}
            displaySize={displaySize}
            fontFamily={activeFont.family}
            palette={activePalette}
            formatThousands={formatThousands}
            evaluationKey={evaluationKey}
          />
          <SparkleEffect
            triggerKey={celebrationEnabled ? evaluationKey : 0}
            accentColor={activePalette.equalsBg || activePalette.accent}
          />
        </div>

        {/* Chevron Expand/Collapse Control for Scientific Mode */}
        <div className="relative z-10">
          <ChevronToggle
            isExpanded={isScientificExpanded}
            onToggle={handleToggleScientific}
          />
        </div>

        {/* Keypad Container */}
        <div className="relative z-10 w-full px-4 pb-2 pt-1 flex flex-col justify-end">
          {/* Scientific Mode Panel (Collapsible) */}
          {isScientificExpanded && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-150">
              <ScientificPad
                angleMode={angleMode}
                isInvActive={isInvActive}
                onToggleAngleMode={handleToggleAngleMode}
                onToggleInv={handleToggleInv}
                onInput={handleInput}
                onMemoryAdd={handleMemoryAdd}
                onMemorySubtract={handleMemorySubtract}
                onMemoryRecall={handleMemoryRecall}
                onMemoryClear={handleMemoryClear}
                hasMemoryValue={memoryValue !== null}
                soundEnabled={soundEnabled}
                soundType={soundType}
                soundVolume={soundVolume}
                shape={buttonShape}
                scale={keypadScale}
                palette={activePalette}
                animationsEnabled={animationsEnabled}
                effectsEnabled={effectsEnabled}
                voiceKeyClick={voiceKeyClick}
                voiceLanguage={voiceLanguage}
                voicePitch={voicePitch}
                voiceRate={voiceRate}
              />
            </div>
          )}

          {/* Standard 4-Column Basic Keypad (Always Visible) */}
          <BasicPad
            onClear={handleClear}
            onParentheses={handleParentheses}
            onPercentage={handlePercentage}
            onBackspace={handleBackspace}
            onEquals={handleEquals}
            onInput={handleInput}
            soundEnabled={soundEnabled}
            soundType={soundType}
            soundVolume={soundVolume}
            shape={buttonShape}
            scale={keypadScale}
            palette={activePalette}
            animationsEnabled={animationsEnabled}
            effectsEnabled={effectsEnabled}
            voiceKeyClick={voiceKeyClick}
            voiceLanguage={voiceLanguage}
            voicePitch={voicePitch}
            voiceRate={voiceRate}
          />
        </div>

        {/* Working Android System Navigation Bar (3-Button or Gesture Bar) */}
        <AndroidNavigationBar
          palette={activePalette}
          navStyle={navBarStyle}
          hasActiveModal={hasActiveModal}
          onBack={handleAndroidBack}
          onHome={handleAndroidHome}
          onRecent={handleAndroidRecent}
          onToggleNavStyle={() => {
            const next = navBarStyle === 'buttons' ? 'gesture' : 'buttons';
            setNavBarStyle(next);
            LocalStorageManager.saveNavBarStyle(next);
          }}
        />

        {/* Overflow 3-Dot Popup Menu */}
        <ThreeDotMenu
          isOpen={isMenuOpen}
          palette={activePalette}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onClose={() => setIsMenuOpen(false)}
          onClearHistory={() => {
            handleClearAllHistory();
            setIsMenuOpen(false);
          }}
          onOpenVoice={() => setIsVoiceOpen(true)}
          onOpenDatabase={() => setIsDatabaseOpen(true)}
          onOpenAndroidApk={() => setIsAndroidApkOpen(true)}
          onOpenThemes={() => {
            setIsMenuOpen(false);
            setCurrentPage('theme-studio');
          }}
          onOpenFonts={() => setIsFontsOpen(true)}
          onOpenAppIcons={() => setIsAppIconOpen(true)}
          onOpenCustomization={() => setIsCustomizationOpen(true)}
          onOpenSettings={() => setIsSettingsDialogOpen(true)}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
          onOpenPrivacy={() => setIsPrivacyDialogOpen(true)}
          onSendFeedback={handleSendFeedback}
          onOpenHelp={() => setIsHelpDialogOpen(true)}
          onOpenAbout={() => setIsAboutDialogOpen(true)}
        />

        {/* 12+ Themes & Custom Colors Modal */}
        <ThemeCustomizerModal
          isOpen={isThemesOpen}
          activeThemeId={themeId}
          customColors={customColors}
          onSelectThemeId={handleSelectThemeId}
          onSaveCustomColors={handleSaveCustomColors}
          onClose={() => setIsThemesOpen(false)}
        />

        {/* 50+ Google Fonts Gallery Modal */}
        <FontSelectorModal
          isOpen={isFontsOpen}
          palette={activePalette}
          activeFontId={fontId}
          onSelectFont={handleSelectFontId}
          onClose={() => setIsFontsOpen(false)}
        />

        {/* App Icon Selector Modal */}
        <AppIconModal
          isOpen={isAppIconOpen}
          palette={activePalette}
          activeIconId={appIconId}
          onSelectIcon={handleSelectAppIcon}
          onClose={() => setIsAppIconOpen(false)}
        />

        {/* Personalize & Sizing Controls Modal */}
        <CustomizationModal
          isOpen={isCustomizationOpen}
          palette={activePalette}
          buttonShape={buttonShape}
          keypadScale={keypadScale}
          displaySize={displaySize}
          personalName={personalName}
          buttonBlur={buttonBlur}
          activeAppIconId={appIconId}
          soundEnabled={soundEnabled}
          soundType={soundType}
          hapticEnabled={hapticEnabled}
          formatThousands={formatThousands}
          activeFontId={fontId}
          activeThemeId={themeId}
          onChangeButtonShape={handleChangeButtonShape}
          onChangeKeypadScale={handleChangeKeypadScale}
          onChangeDisplaySize={handleChangeDisplaySize}
          onChangePersonalName={handleChangePersonalName}
          onChangeButtonBlur={handleChangeButtonBlur}
          onOpenAppIcons={() => {
            setIsCustomizationOpen(false);
            setIsAppIconOpen(true);
          }}
          onToggleSound={handleToggleSound}
          onChangeSoundType={handleChangeSoundType}
          onToggleHaptic={handleToggleHaptic}
          onToggleFormatThousands={handleToggleFormatThousands}
          onOpenFonts={() => {
            setIsCustomizationOpen(false);
            setIsFontsOpen(true);
          }}
          onOpenThemes={() => {
            setIsCustomizationOpen(false);
            setCurrentPage('theme-studio');
          }}
          onClose={() => setIsCustomizationOpen(false)}
        />

        {/* Fullscreen History Sheet */}
        <HistoryModal
          isOpen={isHistoryOpen}
          palette={activePalette}
          history={history}
          onClose={() => setIsHistoryOpen(false)}
          onSelectHistory={handleSelectHistoryItem}
          onDeleteItem={handleDeleteHistoryItem}
          onClearAll={handleClearAllHistory}
        />

        {/* Settings Dialog */}
        <SettingsDialog
          isOpen={isSettingsDialogOpen}
          palette={activePalette}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          soundType={soundType}
          onChangeSoundType={handleChangeSoundType}
          soundVolume={soundVolume}
          onChangeSoundVolume={handleChangeSoundVolume}
          voiceAutoSpeak={voiceAutoSpeak}
          onToggleVoiceAutoSpeak={handleToggleVoiceAutoSpeak}
          voiceKeyClick={voiceKeyClick}
          onToggleVoiceKeyClick={handleToggleVoiceKeyClick}
          voiceLanguage={voiceLanguage}
          onChangeVoiceLanguage={handleChangeVoiceLanguage}
          voicePitch={voicePitch}
          onChangeVoicePitch={handleChangeVoicePitch}
          voiceRate={voiceRate}
          onChangeVoiceRate={handleChangeVoiceRate}
          animationsEnabled={animationsEnabled}
          onToggleAnimations={handleToggleAnimations}
          effectsEnabled={effectsEnabled}
          onToggleEffects={handleToggleEffects}
          celebrationEnabled={celebrationEnabled}
          onToggleCelebration={handleToggleCelebration}
          syncWallpaperWithTheme={syncWallpaperWithTheme}
          onToggleSyncWallpaperWithTheme={handleToggleSyncWallpaperWithTheme}
          systemTimeThemeEnabled={systemTimeThemeEnabled}
          onToggleSystemTimeTheme={handleToggleSystemTimeTheme}
          androidApkMode={androidApkMode}
          onToggleAndroidApkMode={handleToggleAndroidApkMode}
          onOpenAndroidApkModal={() => {
            setIsSettingsDialogOpen(false);
            setIsAndroidApkOpen(true);
          }}
          hapticEnabled={hapticEnabled}
          onToggleHaptic={handleToggleHaptic}
          formatThousands={formatThousands}
          onToggleFormatThousands={handleToggleFormatThousands}
          appIconId={appIconId}
          onOpenAppIcons={() => {
            setIsSettingsDialogOpen(false);
            setIsAppIconOpen(true);
          }}
          onOpenOnboarding={() => {
            setIsSettingsDialogOpen(false);
            setIsOnboardingOpen(true);
          }}
          navBarStyle={navBarStyle}
          onChangeNavBarStyle={handleChangeNavBarStyle}
          onClose={() => setIsSettingsDialogOpen(false)}
        />

        {/* Android APK Download & Installation Modal */}
        <AndroidApkModal
          isOpen={isAndroidApkOpen}
          palette={activePalette}
          isAndroidApkMode={androidApkMode}
          onToggleAndroidApkMode={handleToggleAndroidApkMode}
          onClose={() => setIsAndroidApkOpen(false)}
        />

        {/* First-Time Onboarding Theme & Wallpaper Selector Modal */}
        <OnboardingThemeModal
          isOpen={isOnboardingOpen}
          activeThemeId={themeId}
          customColors={customColors}
          onSelectThemeId={handleSelectThemeId}
          onSaveCustomColors={handleSaveCustomColors}
          onComplete={handleCompleteOnboarding}
        />

        {/* Privacy Policy Dialog */}
        <PrivacyDialog
          isOpen={isPrivacyDialogOpen}
          palette={activePalette}
          onClose={() => setIsPrivacyDialogOpen(false)}
        />

        {/* Help Dialog */}
        <HelpDialog
          isOpen={isHelpDialogOpen}
          palette={activePalette}
          onClose={() => setIsHelpDialogOpen(false)}
        />

        {/* About Dialog */}
        <AboutDialog
          isOpen={isAboutDialogOpen}
          palette={activePalette}
          onClose={() => setIsAboutDialogOpen(false)}
        />

        {/* Voice Calculator Modal (মুখে বলে হিসাব) */}
        <VoiceCalculatorModal
          isOpen={isVoiceOpen}
          palette={activePalette}
          angleMode={angleMode}
          onApplyCalculation={handleApplyVoiceCalculation}
          onClose={() => setIsVoiceOpen(false)}
        />

        {/* Phone Database Manager & Backup Modal (সব ফোনের ডাটাবেজ) */}
        <PhoneDatabaseModal
          isOpen={isDatabaseOpen}
          palette={activePalette}
          history={history}
          customColors={customColors}
          preferences={{
            themeId,
            fontId,
            buttonShape,
            keypadScale,
            soundEnabled,
            soundType,
            hapticEnabled,
            formatThousands,
            angleMode,
            scientificExpanded: isScientificExpanded,
          }}
          onRestoreBackup={handleRestoreDatabaseBackup}
          onClearDatabase={handleClearAllHistory}
          onClose={() => setIsDatabaseOpen(false)}
        />
      </main>
    </div>
  );
}
