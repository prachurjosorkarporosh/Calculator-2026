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
import { PhoneDatabaseManager } from './data/phoneDatabase.ts';
import { updateDocumentFavicon } from './data/appIcons.ts';
import { playKeypressSound } from './utils/sound.ts';
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
        if (!CalculatorEngine.canAppendDot(isEvaluated ? '' : expression)) {
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
      return;
    }

    setError(null);
    setExpression((prev) => {
      if (!prev) return '';

      const functionTokens = [
        'sin(',
        'cos(',
        'tan(',
        'asin(',
        'acos(',
        'atan(',
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

      const savedItem = LocalStorageManager.saveHistoryItem(
        expression,
        evalRes.formatted
      );
      PhoneDatabaseManager.saveHistoryItem(savedItem);
      setHistory((prev) => [savedItem, ...prev].slice(0, 200));
    } else {
      setError(evalRes.error || 'Error');
      setEvaluationKey((prev) => prev + 1);
    }
  }, [expression, angleMode]);

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

          const savedItem = LocalStorageManager.saveHistoryItem(
            voiceExpr,
            evalRes.formatted
          );
          PhoneDatabaseManager.saveHistoryItem(savedItem);
          setHistory((prev) => [savedItem, ...prev].slice(0, 200));
        } else {
          setError(evalRes.error || 'Error');
          setEvaluationKey((prev) => prev + 1);
        }
      }
    },
    [angleMode]
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
      if (
        isThemesOpen ||
        isFontsOpen ||
        isCustomizationOpen ||
        isSettingsDialogOpen ||
        isPrivacyDialogOpen ||
        isHelpDialogOpen ||
        isAboutDialogOpen ||
        isHistoryOpen
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
  ]);

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
      style={{ fontFamily: activeFont.family }}
      className="min-h-screen w-full bg-[#E5E9F0] dark:bg-[#0B0D0F] flex items-center justify-center p-0 sm:p-4 select-none transition-colors"
    >
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
        className={`relative w-full sm:max-w-[430px] h-screen sm:h-[890px] sm:max-h-[96vh] sm:rounded-[44px] sm:shadow-2xl sm:border-[8px] flex flex-col overflow-hidden transition-all duration-300 ${
          activePalette.animatedBg ? 'animate-aurora-mesh' : ''
        }`}
      >
        {/* Background Blur Overlay for Photo Wallpapers */}
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

        {/* Subtle Android Notch / Punch Hole on Desktop Frame */}
        <div className="hidden sm:block absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-800 dark:bg-slate-900 z-30 pointer-events-none" />

        {/* Top Bar with History, Voice & 3-Dot Menu */}
        <div className="relative z-10">
          <TopBar
            onOpenHistory={() => setIsHistoryOpen(true)}
            onOpenMenu={() => setIsMenuOpen(true)}
            onOpenVoice={() => setIsVoiceOpen(true)}
            onOpenThemeStudio={() => setCurrentPage('theme-studio')}
            personalName={personalName}
            onOpenCustomization={() => setIsCustomizationOpen(true)}
            appIconId={appIconId}
            onOpenAppIcons={() => setIsAppIconOpen(true)}
          />
        </div>

        {/* Display Area for Expressions & Results */}
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
        </div>

        {/* Chevron Expand/Collapse Control for Scientific Mode */}
        <div className="relative z-10">
          <ChevronToggle
            isExpanded={isScientificExpanded}
            onToggle={handleToggleScientific}
          />
        </div>

        {/* Keypad Container */}
        <div className="relative z-10 w-full px-4 pb-6 pt-1 flex flex-col justify-end">
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
                shape={buttonShape}
                scale={keypadScale}
                palette={activePalette}
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
            shape={buttonShape}
            scale={keypadScale}
            palette={activePalette}
          />
        </div>

        {/* Overflow 3-Dot Popup Menu */}
        <ThreeDotMenu
          isOpen={isMenuOpen}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onClose={() => setIsMenuOpen(false)}
          onClearHistory={() => {
            handleClearAllHistory();
            setIsMenuOpen(false);
          }}
          onOpenVoice={() => setIsVoiceOpen(true)}
          onOpenDatabase={() => setIsDatabaseOpen(true)}
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
          activeFontId={fontId}
          onSelectFont={handleSelectFontId}
          onClose={() => setIsFontsOpen(false)}
        />

        {/* App Icon Selector Modal */}
        <AppIconModal
          isOpen={isAppIconOpen}
          activeIconId={appIconId}
          onSelectIcon={handleSelectAppIcon}
          onClose={() => setIsAppIconOpen(false)}
        />

        {/* Personalize & Sizing Controls Modal */}
        <CustomizationModal
          isOpen={isCustomizationOpen}
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
          history={history}
          onClose={() => setIsHistoryOpen(false)}
          onSelectHistory={handleSelectHistoryItem}
          onDeleteItem={handleDeleteHistoryItem}
          onClearAll={handleClearAllHistory}
        />

        {/* Settings Dialog */}
        <SettingsDialog
          isOpen={isSettingsDialogOpen}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          systemTimeThemeEnabled={systemTimeThemeEnabled}
          onToggleSystemTimeTheme={handleToggleSystemTimeTheme}
          appIconId={appIconId}
          onOpenAppIcons={() => {
            setIsSettingsDialogOpen(false);
            setIsAppIconOpen(true);
          }}
          onOpenOnboarding={() => {
            setIsSettingsDialogOpen(false);
            setIsOnboardingOpen(true);
          }}
          onClose={() => setIsSettingsDialogOpen(false)}
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
          onClose={() => setIsPrivacyDialogOpen(false)}
        />

        {/* Help Dialog */}
        <HelpDialog
          isOpen={isHelpDialogOpen}
          onClose={() => setIsHelpDialogOpen(false)}
        />

        {/* About Dialog */}
        <AboutDialog
          isOpen={isAboutDialogOpen}
          onClose={() => setIsAboutDialogOpen(false)}
        />

        {/* Voice Calculator Modal (মুখে বলে হিসাব) */}
        <VoiceCalculatorModal
          isOpen={isVoiceOpen}
          angleMode={angleMode}
          onApplyCalculation={handleApplyVoiceCalculation}
          onClose={() => setIsVoiceOpen(false)}
        />

        {/* Phone Database Manager & Backup Modal (সব ফোনের ডাটাবেজ) */}
        <PhoneDatabaseModal
          isOpen={isDatabaseOpen}
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
