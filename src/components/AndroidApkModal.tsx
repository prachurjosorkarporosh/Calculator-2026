/**
 * Android APK & Mobile Installation Center
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Calculator. All rights reserved.
 *
 * Dedicated modal to install or download the Android APK, switch to
 * edge-to-edge Native Android Mode, and access GitHub releases.
 */

import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Maximize2,
  Minimize2,
  Terminal,
  Cpu,
  Layers,
  X,
  Sparkles,
} from 'lucide-react';
import { ThemePalette } from '../data/themes.ts';
import { getModalThemeStyles } from '../utils/themeStyles.ts';
import { triggerHaptic } from '../utils/haptics.ts';

interface AndroidApkModalProps {
  isOpen: boolean;
  palette?: ThemePalette;
  isAndroidApkMode: boolean;
  onToggleAndroidApkMode: () => void;
  onClose: () => void;
}

export const AndroidApkModal: React.FC<AndroidApkModalProps> = ({
  isOpen,
  palette,
  isAndroidApkMode,
  onToggleAndroidApkMode,
  onClose,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);
  const [showInstallTip, setShowInstallTip] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  if (!isOpen) return null;

  const theme = getModalThemeStyles(palette);

  const handleInstallClick = async () => {
    triggerHaptic('medium');
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setShowInstallTip((v) => !v);
    }
  };

  const handleCopyCommand = () => {
    triggerHaptic('light');
    navigator.clipboard.writeText('cd android && ./gradlew assembleDebug');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div
        style={{
          backgroundColor: theme.dialogBg,
          borderColor: theme.dialogBorder,
          color: theme.textPrimary,
          boxShadow: theme.isDark
            ? '0 25px 60px rgba(0,0,0,0.8)'
            : '0 20px 50px rgba(0,0,0,0.25)',
        }}
        className="w-full max-w-md rounded-3xl p-5 border overflow-hidden flex flex-col max-h-[92vh] transition-colors"
      >
        {/* Header */}
        <div
          style={{ borderColor: theme.headerBorder }}
          className="flex items-center justify-between pb-3.5 mb-3 border-b"
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
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-bold tracking-tight">Android APK Center</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Native
                </span>
              </div>
              <p style={{ color: theme.textSecondary }} className="text-[11px]">
                Install as Android App or Download APK
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

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-0.5 scrollbar-thin">
          {/* Edge-to-Edge Pure Android Mode Toggle */}
          <div
            onClick={() => {
              triggerHaptic('light');
              onToggleAndroidApkMode();
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
                  backgroundColor: isAndroidApkMode ? theme.subtleAccentBg : theme.itemBg,
                  color: isAndroidApkMode ? theme.accentColor : theme.textSecondary,
                }}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
              >
                {isAndroidApkMode ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </div>
              <div>
                <div className="text-xs font-bold">Pure Fullscreen Android Mode</div>
                <div style={{ color: theme.textSecondary }} className="text-[11px]">
                  {isAndroidApkMode
                    ? 'Active: Edge-to-edge mobile app screen'
                    : 'Windowed: Android phone frame on website'}
                </div>
              </div>
            </div>

            {/* Switch */}
            <div
              style={{
                backgroundColor: isAndroidApkMode
                  ? theme.accentBg
                  : theme.isDark
                  ? 'rgba(255,255,255,0.2)'
                  : 'rgba(0,0,0,0.2)',
              }}
              className="w-11 h-6 rounded-full p-0.5 transition-colors relative"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  isAndroidApkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </div>

          {/* 1-Click Install Android WebAPK */}
          <div
            style={{
              background: theme.isDark
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.05))'
                : 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(5, 150, 105, 0.03))',
              borderColor: 'rgba(16, 185, 129, 0.35)',
            }}
            className="p-4 rounded-2xl border flex flex-col gap-3 relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-500/30">
                  ⚡
                </div>
                <div>
                  <h4 className="text-sm font-bold">Install Native Android App</h4>
                  <p style={{ color: theme.textSecondary }} className="text-[11px]">
                    Zero-installation lag • Works 100% offline
                  </p>
                </div>
              </div>
              {isInstalled && (
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Installed
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleInstallClick}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              {isInstalled ? 'Launch Android App' : 'Install Directly to Android Home Screen'}
            </button>

            {showInstallTip && (
              <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/30 text-xs space-y-1.5 animate-in fade-in">
                <div className="font-bold text-emerald-400">📲 How to install directly on Android:</div>
                <div className="text-[11px] text-slate-300 space-y-1">
                  <div>1. Tap your browser menu (⋮ three dots at top-right).</div>
                  <div>2. Select <strong className="text-white">"Install app"</strong> or <strong className="text-white">"Add to Home screen"</strong>.</div>
                  <div>3. The full Calculator app will be installed on your Android home screen and app drawer!</div>
                </div>
              </div>
            )}
          </div>

          {/* Direct APK Download Link */}
          <div
            style={{
              backgroundColor: theme.itemBg,
              borderColor: theme.itemBorder,
            }}
            className="p-3.5 rounded-2xl border space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Download className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold">Download Calculator.apk</span>
              </div>
              <span className="text-[10px] opacity-75 font-mono">v1.0.0 (Release)</span>
            </div>

            <p style={{ color: theme.textSecondary }} className="text-[11px] leading-relaxed">
              Standalone compiled APK with Jetpack Compose, Room database, 10 synthesizer audio sounds, 52 fonts, and 21 themes.
            </p>

            {/* Direct File Download Button */}
            <a
              href="/Calculator.apk"
              download="Calculator.apk"
              onClick={() => triggerHaptic('medium')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Direct Download Calculator.apk (120 KB)</span>
            </a>

            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://github.com/prachurjosorkarporosh/Calculator-2026/releases"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerHaptic('light')}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/15 text-slate-200 transition-all border border-white/10"
              >
                <Download className="w-3.5 h-3.5" />
                GitHub APK Releases
                <ExternalLink className="w-3 h-3 opacity-80" />
              </a>

              <a
                href="https://github.com/prachurjosorkarporosh/Calculator-2026/actions"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerHaptic('light')}
                style={{
                  backgroundColor: theme.subtleAccentBg,
                  color: theme.accentColor,
                  borderColor: theme.subtleAccentBorder,
                }}
                className="py-2 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all hover:opacity-85"
              >
                <Terminal className="w-3.5 h-3.5" />
                Actions
              </a>
            </div>
          </div>

          {/* Local Android Gradle Build Guide */}
          <div
            style={{
              backgroundColor: theme.itemBg,
              borderColor: theme.itemBorder,
            }}
            className="p-3.5 rounded-2xl border space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold">Build Local APK via Gradle</span>
              </div>
              <button
                type="button"
                onClick={handleCopyCommand}
                className="text-[11px] font-bold text-emerald-400 hover:underline cursor-pointer"
              >
                {copiedCmd ? 'Copied!' : 'Copy Command'}
              </button>
            </div>

            <div className="bg-black/50 p-2.5 rounded-xl font-mono text-[11px] text-emerald-300 overflow-x-auto border border-white/10 select-all">
              cd android && ./gradlew assembleDebug
            </div>

            <div className="text-[10px] space-y-1 opacity-75 font-mono">
              <p>• Output: android/app/build/outputs/apk/debug/app-debug.apk</p>
              <p>• Namespace: bd.pro.prachurjo.calculator</p>
              <p>• Target SDK: 35 (Android 15)</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{ borderColor: theme.headerBorder }}
          className="pt-3 mt-3 border-t flex justify-end"
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              backgroundColor: theme.accentBg,
              color: theme.accentText,
            }}
            className="px-5 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer hover:opacity-90 active:scale-95 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
