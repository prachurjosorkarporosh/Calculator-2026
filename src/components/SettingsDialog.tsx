/**
 * Comprehensive Theme-Adaptive Settings Dialog
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Prachurjo Calculator. All rights reserved.
 *
 * Provides granular toggles and controls for:
 * - Wallpaper & Theme synchronization
 * - Sound effects, 10 sound types, volume slider & audio preview
 * - Voice speech announcer, language selection, pitch, speed & test voice
 * - Keypad touch ripple animations, glow effects, celebration sparkles
 * - Android Native APK mode & APK installer center
 * - Haptic feedback, thousand commas, and time-based auto theme
 */

import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Smartphone,
  Settings,
  Sun,
  Moon,
  Clock,
  Sparkles,
  Sliders,
  CheckCircle2,
  X,
  Mic,
  Activity,
  Zap,
  Play,
  Download,
  Image,
  Vibrate,
  Hash,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics.ts';
import { playKeypressSound } from '../utils/sound.ts';
import {
  speakCalculationResult,
  SUPPORTED_VOICE_LANGUAGES,
  stopSpeech,
} from '../utils/speech.ts';
import { SoundEffectType } from '../types.ts';
import { ThemePalette } from '../data/themes.ts';
import { getModalThemeStyles } from '../utils/themeStyles.ts';

interface SettingsDialogProps {
  isOpen: boolean;
  palette?: ThemePalette;

  // Sound settings
  soundEnabled: boolean;
  onToggleSound: () => void;
  soundType: SoundEffectType;
  onChangeSoundType: (type: SoundEffectType) => void;
  soundVolume: number;
  onChangeSoundVolume: (vol: number) => void;

  // Voice settings
  voiceAutoSpeak: boolean;
  onToggleVoiceAutoSpeak: () => void;
  voiceKeyClick: boolean;
  onToggleVoiceKeyClick: () => void;
  voiceLanguage: string;
  onChangeVoiceLanguage: (lang: string) => void;
  voicePitch: number;
  onChangeVoicePitch: (pitch: number) => void;
  voiceRate: number;
  onChangeVoiceRate: (rate: number) => void;

  // Animation & Visual Effects
  animationsEnabled: boolean;
  onToggleAnimations: () => void;
  effectsEnabled: boolean;
  onToggleEffects: () => void;
  celebrationEnabled: boolean;
  onToggleCelebration: () => void;

  // Wallpaper & Theme Sync
  syncWallpaperWithTheme: boolean;
  onToggleSyncWallpaperWithTheme: () => void;
  systemTimeThemeEnabled?: boolean;
  onToggleSystemTimeTheme?: () => void;

  // Optional legacy hooks
  androidApkMode?: boolean;
  onToggleAndroidApkMode?: () => void;
  onOpenAndroidApkModal?: () => void;

  // Haptic & Format
  hapticEnabled: boolean;
  onToggleHaptic: () => void;
  formatThousands: boolean;
  onToggleFormatThousands: () => void;

  appIconId?: string;
  onOpenAppIcons?: () => void;
  onOpenOnboarding?: () => void;

  // Android Navigation Style
  navBarStyle?: 'buttons' | 'gesture';
  onChangeNavBarStyle?: (style: 'buttons' | 'gesture') => void;

  onClose: () => void;
}

const SOUND_STYLES: { id: SoundEffectType; label: string; desc: string }[] = [
  { id: 'tactile', label: 'Tactile Android', desc: 'Crisp phone click' },
  { id: 'pop', label: 'Soft Pop', desc: 'Gentle bubble sound' },
  { id: 'mechanical', label: 'Mechanical', desc: 'Tactile blue switch' },
  { id: 'beep', label: 'Retro Digital', desc: '80s Casio beep' },
  { id: 'cyberpunk', label: 'Cyberpunk', desc: 'Synth wave pulse' },
  { id: 'marimba', label: 'Marimba Chime', desc: 'Tuned acoustic chime' },
  { id: 'typewriter', label: 'Typewriter', desc: 'Vintage mechanical clack' },
  { id: 'bubble', label: 'Water Drop', desc: 'Liquid droplet pop' },
  { id: 'laser', label: 'Sci-Fi Laser', desc: 'Futuristic arcade zap' },
  { id: 'woodblock', label: 'Woodblock', desc: 'Organic percussion' },
];

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  isOpen,
  palette,
  soundEnabled,
  onToggleSound,
  soundType,
  onChangeSoundType,
  soundVolume,
  onChangeSoundVolume,
  voiceAutoSpeak,
  onToggleVoiceAutoSpeak,
  voiceKeyClick,
  onToggleVoiceKeyClick,
  voiceLanguage,
  onChangeVoiceLanguage,
  voicePitch,
  onChangeVoicePitch,
  voiceRate,
  onChangeVoiceRate,
  animationsEnabled,
  onToggleAnimations,
  effectsEnabled,
  onToggleEffects,
  celebrationEnabled,
  onToggleCelebration,
  syncWallpaperWithTheme,
  onToggleSyncWallpaperWithTheme,
  systemTimeThemeEnabled = false,
  onToggleSystemTimeTheme,
  androidApkMode,
  onToggleAndroidApkMode,
  onOpenAndroidApkModal,
  hapticEnabled,
  onToggleHaptic,
  formatThousands,
  onToggleFormatThousands,
  appIconId,
  onOpenAppIcons,
  onOpenOnboarding,
  navBarStyle = 'buttons',
  onChangeNavBarStyle,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'audio' | 'voice' | 'effects' | 'system'>('all');
  const [isTestingVoice, setIsTestingVoice] = useState<boolean>(false);

  if (!isOpen) return null;

  const theme = getModalThemeStyles(palette);

  const handleTestSound = (type: SoundEffectType) => {
    triggerHaptic('light');
    playKeypressSound('equals', type, soundVolume);
  };

  const handleTestVoice = () => {
    triggerHaptic('light');
    setIsTestingVoice(true);
    speakCalculationResult('2026', voiceLanguage, voicePitch, voiceRate);
    setTimeout(() => setIsTestingVoice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-4 backdrop-blur-md animate-in fade-in duration-150 select-none">
      <div
        style={{
          backgroundColor: theme.dialogBg,
          borderColor: theme.dialogBorder,
          color: theme.textPrimary,
          boxShadow: theme.isDark
            ? '0 25px 65px rgba(0,0,0,0.85)'
            : '0 20px 50px rgba(0,0,0,0.22)',
        }}
        className="w-full max-w-lg rounded-3xl p-5 border overflow-hidden flex flex-col max-h-[92vh] transition-colors"
      >
        {/* Header */}
        <div
          style={{ borderColor: theme.headerBorder }}
          className="flex items-center justify-between pb-3.5 mb-2.5 border-b"
        >
          <div className="flex items-center gap-3">
            <div
              style={{
                backgroundColor: theme.subtleAccentBg,
                color: theme.accentColor,
                borderColor: theme.subtleAccentBorder,
              }}
              className="w-11 h-11 rounded-2xl flex items-center justify-center border shadow-sm"
            >
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">Settings & Controls</h3>
              <p style={{ color: theme.textSecondary }} className="text-[11px]">
                Audio, Voice, Animations, Wallpapers & Android APK
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ color: theme.textSecondary }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              theme.isDark ? 'hover:bg-white/10 hover:text-white' : 'hover:bg-black/10 hover:text-black'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-[11px] font-semibold">
          {[
            { id: 'all', label: 'All Settings' },
            { id: 'audio', label: '🔊 Audio & Sounds' },
            { id: 'voice', label: '🗣️ Voice Speech' },
            { id: 'effects', label: '✨ Animations' },
            { id: 'system', label: '📱 Android APK' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setActiveTab(tab.id as any);
              }}
              style={{
                backgroundColor: activeTab === tab.id ? theme.accentBg : theme.itemBg,
                color: activeTab === tab.id ? theme.accentText : theme.textSecondary,
                borderColor: theme.itemBorder,
              }}
              className="px-3 py-1 rounded-full border whitespace-nowrap transition-all cursor-pointer"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 scrollbar-thin">
          {/* SECTION 1: Wallpaper & Theme Synchronization */}
          {(activeTab === 'all' || activeTab === 'effects') && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-1 text-xs font-bold uppercase tracking-wider text-emerald-500">
                <Image className="w-3.5 h-3.5" />
                <span>Wallpaper & Theme Sync (ওয়ালপেপার ও থিম)</span>
              </div>

              {/* Wallpaper & Theme Unified Sync Toggle */}
              <div
                onClick={() => {
                  triggerHaptic('light');
                  onToggleSyncWallpaperWithTheme();
                }}
                style={{
                  backgroundColor: theme.itemBg,
                  borderColor: theme.itemBorder,
                }}
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  theme.isDark ? 'hover:bg-white/[0.07]' : 'hover:bg-black/[0.07]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      backgroundColor: syncWallpaperWithTheme ? theme.subtleAccentBg : theme.itemBg,
                      color: syncWallpaperWithTheme ? theme.accentColor : theme.textSecondary,
                    }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Image className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Auto-Sync Wallpaper with Theme</div>
                    <div style={{ color: theme.textSecondary }} className="text-[11px]">
                      {syncWallpaperWithTheme
                        ? 'Active: Wallpaper changes together with theme across app & website'
                        : 'Manual wallpaper selection'}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: syncWallpaperWithTheme
                      ? theme.accentBg
                      : theme.isDark
                      ? 'rgba(255,255,255,0.2)'
                      : 'rgba(0,0,0,0.2)',
                  }}
                  className="w-11 h-6 rounded-full p-0.5 transition-colors relative"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      syncWallpaperWithTheme ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>

              {/* Day/Night Auto-Theme based on System Time */}
              {onToggleSystemTimeTheme && (
                <div
                  onClick={() => {
                    triggerHaptic('light');
                    onToggleSystemTimeTheme();
                  }}
                  style={{
                    backgroundColor: theme.itemBg,
                    borderColor: theme.itemBorder,
                  }}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    theme.isDark ? 'hover:bg-white/[0.07]' : 'hover:bg-black/[0.07]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        backgroundColor: systemTimeThemeEnabled ? theme.subtleAccentBg : theme.itemBg,
                        color: systemTimeThemeEnabled ? theme.accentColor : theme.textSecondary,
                      }}
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                    >
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">Day & Night System Auto-Theme</div>
                      <div style={{ color: theme.textSecondary }} className="text-[11px]">
                        {systemTimeThemeEnabled
                          ? 'Active: Pixel White by day (6 AM-6 PM), Charcoal Dark at night'
                          : 'Manual theme selection active'}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: systemTimeThemeEnabled
                        ? theme.accentBg
                        : theme.isDark
                        ? 'rgba(255,255,255,0.2)'
                        : 'rgba(0,0,0,0.2)',
                    }}
                    className="w-11 h-6 rounded-full p-0.5 transition-colors relative"
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                        systemTimeThemeEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION 2: Sound Effects Studio */}
          {(activeTab === 'all' || activeTab === 'audio') && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Keypress Audio Sounds (সাউন্ড এফেক্ট)</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleTestSound(soundType)}
                  style={{
                    backgroundColor: theme.subtleAccentBg,
                    color: theme.accentColor,
                    borderColor: theme.subtleAccentBorder,
                  }}
                  className="px-2.5 py-0.5 rounded-lg border text-[11px] font-bold flex items-center gap-1 hover:opacity-80 transition-all cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" /> Test Sound
                </button>
              </div>

              {/* Master Sound Switch */}
              <div
                onClick={() => {
                  triggerHaptic('light');
                  onToggleSound();
                  if (!soundEnabled) {
                    setTimeout(() => playKeypressSound('equals', soundType, soundVolume), 50);
                  }
                }}
                style={{
                  backgroundColor: theme.itemBg,
                  borderColor: theme.itemBorder,
                }}
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  theme.isDark ? 'hover:bg-white/[0.07]' : 'hover:bg-black/[0.07]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      backgroundColor: soundEnabled ? theme.subtleAccentBg : theme.itemBg,
                      color: soundEnabled ? theme.accentColor : theme.textSecondary,
                    }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold">Audio Sound Effects</div>
                    <div style={{ color: theme.textSecondary }} className="text-[11px]">
                      {soundEnabled ? 'Synthesizer audio on button click' : 'Mute / Silent keypress'}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: soundEnabled
                      ? theme.accentBg
                      : theme.isDark
                      ? 'rgba(255,255,255,0.2)'
                      : 'rgba(0,0,0,0.2)',
                  }}
                  className="w-11 h-6 rounded-full p-0.5 transition-colors relative"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      soundEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>

              {/* Sound Volume Slider */}
              {soundEnabled && (
                <div
                  style={{
                    backgroundColor: theme.itemBg,
                    borderColor: theme.itemBorder,
                  }}
                  className="p-3.5 rounded-2xl border space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>Sound Volume</span>
                    <span className="font-mono text-emerald-400">{Math.round(soundVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={soundVolume}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      onChangeSoundVolume(v);
                    }}
                    onMouseUp={() => handleTestSound(soundType)}
                    onTouchEnd={() => handleTestSound(soundType)}
                    className="w-full accent-emerald-500 cursor-pointer h-1.5 rounded-lg bg-black/20"
                  />
                </div>
              )}

              {/* 10 Sound Styles Selection Grid */}
              {soundEnabled && (
                <div
                  style={{
                    backgroundColor: theme.itemBg,
                    borderColor: theme.itemBorder,
                  }}
                  className="p-3.5 rounded-2xl border space-y-2.5"
                >
                  <div className="text-xs font-bold">Select Audio Sound Style (১০টি সাউন্ড)</div>
                  <div className="grid grid-cols-2 gap-2">
                    {SOUND_STYLES.map((s) => {
                      const isSel = soundType === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            onChangeSoundType(s.id);
                            handleTestSound(s.id);
                          }}
                          style={{
                            backgroundColor: isSel ? theme.subtleAccentBg : 'transparent',
                            borderColor: isSel ? theme.accentColor : theme.itemBorder,
                            color: isSel ? theme.accentColor : theme.textPrimary,
                          }}
                          className="p-2.5 rounded-xl border text-left flex flex-col gap-0.5 transition-all cursor-pointer hover:border-emerald-500/50"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold">{s.label}</span>
                            {isSel && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                          </div>
                          <span style={{ color: theme.textSecondary }} className="text-[10px]">
                            {s.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION 3: Voice Assistant & Speech Announcer */}
          {(activeTab === 'all' || activeTab === 'voice') && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
                  <Mic className="w-3.5 h-3.5" />
                  <span>Voice & Speech Announcer (ভয়েস)</span>
                </div>
                <button
                  type="button"
                  onClick={handleTestVoice}
                  disabled={isTestingVoice}
                  style={{
                    backgroundColor: theme.subtleAccentBg,
                    color: theme.accentColor,
                    borderColor: theme.subtleAccentBorder,
                  }}
                  className="px-2.5 py-0.5 rounded-lg border text-[11px] font-bold flex items-center gap-1 hover:opacity-80 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3 h-3 fill-current" /> {isTestingVoice ? 'Speaking...' : 'Test Voice'}
                </button>
              </div>

              {/* Auto-Speak Result on Equals */}
              <div
                onClick={() => {
                  triggerHaptic('light');
                  onToggleVoiceAutoSpeak();
                }}
                style={{
                  backgroundColor: theme.itemBg,
                  borderColor: theme.itemBorder,
                }}
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  theme.isDark ? 'hover:bg-white/[0.07]' : 'hover:bg-black/[0.07]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      backgroundColor: voiceAutoSpeak ? theme.subtleAccentBg : theme.itemBg,
                      color: voiceAutoSpeak ? theme.accentColor : theme.textSecondary,
                    }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Auto-Announce Results on Equals</div>
                    <div style={{ color: theme.textSecondary }} className="text-[11px]">
                      {voiceAutoSpeak
                        ? 'Speaks final calculation result out loud'
                        : 'Silent calculation without voice speech'}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: voiceAutoSpeak
                      ? theme.accentBg
                      : theme.isDark
                      ? 'rgba(255,255,255,0.2)'
                      : 'rgba(0,0,0,0.2)',
                  }}
                  className="w-11 h-6 rounded-full p-0.5 transition-colors relative"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      voiceAutoSpeak ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>

              {/* Speak Button Readout on Tap */}
              <div
                onClick={() => {
                  triggerHaptic('light');
                  onToggleVoiceKeyClick();
                }}
                style={{
                  backgroundColor: theme.itemBg,
                  borderColor: theme.itemBorder,
                }}
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  theme.isDark ? 'hover:bg-white/[0.07]' : 'hover:bg-black/[0.07]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      backgroundColor: voiceKeyClick ? theme.subtleAccentBg : theme.itemBg,
                      color: voiceKeyClick ? theme.accentColor : theme.textSecondary,
                    }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Speak Keypad Buttons on Tap</div>
                    <div style={{ color: theme.textSecondary }} className="text-[11px]">
                      {voiceKeyClick ? 'Pronounces button name as you tap' : 'Disabled'}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: voiceKeyClick
                      ? theme.accentBg
                      : theme.isDark
                      ? 'rgba(255,255,255,0.2)'
                      : 'rgba(0,0,0,0.2)',
                  }}
                  className="w-11 h-6 rounded-full p-0.5 transition-colors relative"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      voiceKeyClick ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>

              {/* Voice Language Selector */}
              <div
                style={{
                  backgroundColor: theme.itemBg,
                  borderColor: theme.itemBorder,
                }}
                className="p-3.5 rounded-2xl border space-y-2.5"
              >
                <div className="text-xs font-bold">Voice Language & Accent</div>
                <div className="grid grid-cols-2 gap-2">
                  {SUPPORTED_VOICE_LANGUAGES.map((l) => {
                    const isSel = voiceLanguage === l.code;
                    return (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => {
                          triggerHaptic('light');
                          onChangeVoiceLanguage(l.code);
                        }}
                        style={{
                          backgroundColor: isSel ? theme.subtleAccentBg : 'transparent',
                          borderColor: isSel ? theme.accentColor : theme.itemBorder,
                          color: isSel ? theme.accentColor : theme.textPrimary,
                        }}
                        className="p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer hover:border-purple-500/50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{l.flag}</span>
                          <div>
                            <div className="text-xs font-bold leading-none">{l.nativeName}</div>
                            <div style={{ color: theme.textSecondary }} className="text-[10px]">
                              {l.name}
                            </div>
                          </div>
                        </div>
                        {isSel && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />}
                      </button>
                    );
                  })}
                </div>

                {/* Voice Speed & Pitch */}
                <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span>Speed: {voiceRate}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.7"
                      max="1.3"
                      step="0.05"
                      value={voiceRate}
                      onChange={(e) => onChangeVoiceRate(parseFloat(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer h-1.5 rounded-lg bg-black/20"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span>Pitch: {voicePitch}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.7"
                      max="1.3"
                      step="0.05"
                      value={voicePitch}
                      onChange={(e) => onChangeVoicePitch(parseFloat(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer h-1.5 rounded-lg bg-black/20"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: Animations & Visual Effects */}
          {(activeTab === 'all' || activeTab === 'effects') && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 px-1 text-xs font-bold uppercase tracking-wider text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Animations & Visual Effects (অ্যানিমেশন)</span>
              </div>

              {/* Keypad Press Ripples & Bounce */}
              <div
                onClick={() => {
                  triggerHaptic('light');
                  onToggleAnimations();
                }}
                style={{
                  backgroundColor: theme.itemBg,
                  borderColor: theme.itemBorder,
                }}
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  theme.isDark ? 'hover:bg-white/[0.07]' : 'hover:bg-black/[0.07]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      backgroundColor: animationsEnabled ? theme.subtleAccentBg : theme.itemBg,
                      color: animationsEnabled ? theme.accentColor : theme.textSecondary,
                    }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Button Press Ripples & Bounce</div>
                    <div style={{ color: theme.textSecondary }} className="text-[11px]">
                      {animationsEnabled ? 'Fluid Material 3 ripples on touch' : 'Flat touch without ripples'}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: animationsEnabled
                      ? theme.accentBg
                      : theme.isDark
                      ? 'rgba(255,255,255,0.2)'
                      : 'rgba(0,0,0,0.2)',
                  }}
                  className="w-11 h-6 rounded-full p-0.5 transition-colors relative"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      animationsEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>

              {/* Neon Glow & Lighting Effects */}
              <div
                onClick={() => {
                  triggerHaptic('light');
                  onToggleEffects();
                }}
                style={{
                  backgroundColor: theme.itemBg,
                  borderColor: theme.itemBorder,
                }}
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  theme.isDark ? 'hover:bg-white/[0.07]' : 'hover:bg-black/[0.07]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      backgroundColor: effectsEnabled ? theme.subtleAccentBg : theme.itemBg,
                      color: effectsEnabled ? theme.accentColor : theme.textSecondary,
                    }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Keypad Glow & Lighting Effects</div>
                    <div style={{ color: theme.textSecondary }} className="text-[11px]">
                      {effectsEnabled ? 'Accent illumination under action buttons' : 'Subtle standard lighting'}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: effectsEnabled
                      ? theme.accentBg
                      : theme.isDark
                      ? 'rgba(255,255,255,0.2)'
                      : 'rgba(0,0,0,0.2)',
                  }}
                  className="w-11 h-6 rounded-full p-0.5 transition-colors relative"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      effectsEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>

              {/* Calculation Celebration Sparkles */}
              <div
                onClick={() => {
                  triggerHaptic('light');
                  onToggleCelebration();
                }}
                style={{
                  backgroundColor: theme.itemBg,
                  borderColor: theme.itemBorder,
                }}
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  theme.isDark ? 'hover:bg-white/[0.07]' : 'hover:bg-black/[0.07]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      backgroundColor: celebrationEnabled ? theme.subtleAccentBg : theme.itemBg,
                      color: celebrationEnabled ? theme.accentColor : theme.textSecondary,
                    }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Result Celebration Sparkles</div>
                    <div style={{ color: theme.textSecondary }} className="text-[11px]">
                      {celebrationEnabled ? 'Golden particle burst on = evaluation' : 'No celebration particles'}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: celebrationEnabled
                      ? theme.accentBg
                      : theme.isDark
                      ? 'rgba(255,255,255,0.2)'
                      : 'rgba(0,0,0,0.2)',
                  }}
                  className="w-11 h-6 rounded-full p-0.5 transition-colors relative"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      celebrationEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: Preferences & Interface (প্রিফারেন্স ও সিস্টেম) */}
          {(activeTab === 'all' || activeTab === 'system') && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 px-1 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Sliders className="w-3.5 h-3.5" />
                <span>Preferences & System (প্রিফারেন্স ও সিস্টেম)</span>
              </div>

              {/* Haptic Vibration Switch */}
              <div
                onClick={() => {
                  triggerHaptic('medium');
                  onToggleHaptic();
                }}
                style={{
                  backgroundColor: theme.itemBg,
                  borderColor: theme.itemBorder,
                }}
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  theme.isDark ? 'hover:bg-white/[0.07]' : 'hover:bg-black/[0.07]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      backgroundColor: hapticEnabled ? theme.subtleAccentBg : theme.itemBg,
                      color: hapticEnabled ? theme.accentColor : theme.textSecondary,
                    }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Vibrate className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Haptic Touch Vibration</div>
                    <div style={{ color: theme.textSecondary }} className="text-[11px]">
                      {hapticEnabled ? 'Subtle tactile motor vibration on keypress' : 'Disabled'}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: hapticEnabled
                      ? theme.accentBg
                      : theme.isDark
                      ? 'rgba(255,255,255,0.2)'
                      : 'rgba(0,0,0,0.2)',
                  }}
                  className="w-11 h-6 rounded-full p-0.5 transition-colors relative"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      hapticEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>

              {/* Thousands Formatting */}
              <div
                onClick={() => {
                  triggerHaptic('light');
                  onToggleFormatThousands();
                }}
                style={{
                  backgroundColor: theme.itemBg,
                  borderColor: theme.itemBorder,
                }}
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  theme.isDark ? 'hover:bg-white/[0.07]' : 'hover:bg-black/[0.07]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      backgroundColor: formatThousands ? theme.subtleAccentBg : theme.itemBg,
                      color: formatThousands ? theme.accentColor : theme.textSecondary,
                    }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Hash className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Thousands Grouping Comma</div>
                    <div style={{ color: theme.textSecondary }} className="text-[11px]">
                      {formatThousands ? 'Formats large numbers (e.g. 1,000,000)' : 'No comma separators'}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: formatThousands
                      ? theme.accentBg
                      : theme.isDark
                      ? 'rgba(255,255,255,0.2)'
                      : 'rgba(0,0,0,0.2)',
                  }}
                  className="w-11 h-6 rounded-full p-0.5 transition-colors relative"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      formatThousands ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{ borderColor: theme.headerBorder }}
          className="pt-3 mt-3 border-t flex items-center justify-between"
        >
          <span style={{ color: theme.textSecondary }} className="text-[11px] font-mono">
            Prachurjo Calculator v1.0.0
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              backgroundColor: theme.accentBg,
              color: theme.accentText,
            }}
            className="px-5 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer hover:opacity-90 active:scale-95 transition-all"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
