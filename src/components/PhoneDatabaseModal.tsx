/**
 * Phone Database Manager & Backup Modal (Theme-Adaptive)
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Prachurjo Calculator. All rights reserved.
 *
 * Dynamically adapts to the currently active Theme Palette (Light, Dark, OLED, Cyber, Pastel, Custom).
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Database,
  X,
  Download,
  Upload,
  CheckCircle2,
  HardDrive,
  RefreshCw,
  Smartphone,
  ShieldCheck,
  AlertCircle,
  FileJson,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import {
  PhoneDatabaseManager,
  DatabaseStats,
  PhoneDatabaseBackup,
} from '../data/phoneDatabase.ts';
import { HistoryItem, CustomThemeColors, UserPreferences } from '../types.ts';
import { triggerHaptic } from '../utils/haptics.ts';
import { ThemePalette } from '../data/themes.ts';
import { getModalThemeStyles } from '../utils/themeStyles.ts';

interface PhoneDatabaseModalProps {
  isOpen: boolean;
  palette?: ThemePalette;
  history: HistoryItem[];
  customColors: CustomThemeColors | null;
  preferences: Partial<UserPreferences>;
  onRestoreBackup: (
    history: HistoryItem[],
    customColors: CustomThemeColors | null,
    preferences: Partial<UserPreferences>
  ) => void;
  onClearDatabase: () => void;
  onClose: () => void;
}

export const PhoneDatabaseModal: React.FC<PhoneDatabaseModalProps> = ({
  isOpen,
  palette,
  history,
  customColors,
  preferences,
  onRestoreBackup,
  onClearDatabase,
  onClose,
}) => {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const theme = getModalThemeStyles(palette);

  useEffect(() => {
    if (isOpen) {
      PhoneDatabaseManager.getDatabaseStats(history, customColors).then(setStats);
      setStatusMessage(null);
    }
  }, [isOpen, history, customColors]);

  if (!isOpen) return null;

  // Handle Export / Download Database Backup
  const handleExportBackup = async () => {
    try {
      triggerHaptic('medium');
      setIsExporting(true);
      const jsonStr = await PhoneDatabaseManager.exportFullBackup(
        history,
        customColors,
        preferences
      );

      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `prachurjo_calculator_phonedb_backup_${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsSuccess(true);
      setStatusMessage('ডাটাবেজ ফাইল ডাউনলোড সম্পন্ন হয়েছে (Backup downloaded)!');
    } catch {
      setIsSuccess(false);
      setStatusMessage('ব্যাকআপ তৈরিতে ত্রুটি হয়েছে।');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle Import / Restore Database Backup File
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    triggerHaptic('medium');
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const res = await PhoneDatabaseManager.importFullBackup(content);
      if (res.success) {
        setIsSuccess(true);
        setStatusMessage(res.message);
        onRestoreBackup(res.history, res.customColors, res.preferences);
        PhoneDatabaseManager.getDatabaseStats(res.history, res.customColors).then(setStats);
      } else {
        setIsSuccess(false);
        setStatusMessage(res.message);
      }
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-md animate-in fade-in duration-150 select-none">
      <div
        style={{
          backgroundColor: theme.dialogBg,
          borderColor: theme.dialogBorder,
          color: theme.textPrimary,
          boxShadow: theme.isDark
            ? '0 25px 60px rgba(0,0,0,0.7)'
            : '0 20px 50px rgba(0,0,0,0.18)',
        }}
        className="w-full max-w-lg rounded-3xl border overflow-hidden flex flex-col max-h-[92vh] transition-colors"
      >
        {/* Header */}
        <div
          style={{
            borderColor: theme.headerBorder,
            backgroundColor: theme.headerBg,
          }}
          className="px-5 py-4 border-b flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/15 text-sky-500 flex items-center justify-center border border-sky-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-2">
                <span>Phone Database & Backup</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-300 font-mono font-bold">
                  IndexedDB
                </span>
              </h3>
              <p style={{ color: theme.textSecondary }} className="text-[11px]">
                স্থানীয় হার্ডওয়্যার স্টোরেজ, পূর্ণ ব্যাকআপ ও স্থানান্তর
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
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* Status Message Notification */}
          {statusMessage && (
            <div
              className={`p-3 rounded-2xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in duration-150 ${
                isSuccess
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300'
                  : 'bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300'
              }`}
            >
              {isSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              )}
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Database Metrics Card */}
          <div
            style={{
              backgroundColor: theme.itemBg,
              borderColor: theme.itemBorder,
            }}
            className="p-4 rounded-2xl border space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-sky-500" />
                <span>Internal Hardware Engine</span>
              </span>
              <span
                style={{
                  backgroundColor: theme.subtleAccentBg,
                  color: theme.accentColor,
                }}
                className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full"
              >
                <span
                  style={{ backgroundColor: theme.accentColor }}
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                />
                Active & Encrypted
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div
                style={{
                  backgroundColor: theme.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                  borderColor: theme.itemBorder,
                }}
                className="p-3 rounded-xl border"
              >
                <div style={{ color: theme.textSecondary }} className="text-[10px] font-medium">History Entries</div>
                <div className="text-xl font-bold mt-0.5">
                  {stats?.historyCount ?? history.length}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: theme.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                  borderColor: theme.itemBorder,
                }}
                className="p-3 rounded-xl border"
              >
                <div style={{ color: theme.textSecondary }} className="text-[10px] font-medium">Database Footprint</div>
                <div className="text-xl font-bold mt-0.5">
                  ~{stats?.estimatedSizeKb ?? 2} KB
                </div>
              </div>

              <div
                style={{
                  backgroundColor: theme.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                  borderColor: theme.itemBorder,
                }}
                className="p-3 rounded-xl border col-span-2 flex items-center justify-between"
              >
                <div>
                  <div style={{ color: theme.textSecondary }} className="text-[10px] font-medium">Storage Engine</div>
                  <div className="text-xs font-bold text-sky-500 mt-0.5 font-mono">
                    {stats?.engine ?? 'IndexedDB (Phone Native Database v2)'}
                  </div>
                </div>
                <Smartphone style={{ color: theme.textMuted }} className="w-5 h-5" />
              </div>
            </div>

            <div style={{ color: theme.textSecondary }} className="flex items-center gap-2 pt-1 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                ১০০% অফলাইন: কোনো ইন্টারনেট সংযোগ বা ক্লাউড সার্ভারের প্রয়োজন নেই।
              </span>
            </div>
          </div>

          {/* Backup & Restore Action Buttons */}
          <div className="space-y-2.5">
            <span style={{ color: theme.textSecondary }} className="text-xs font-bold">
              ডাটা স্থানান্তর ও ব্যাকআপ (Backup & Transfer):
            </span>

            {/* Export Backup Button */}
            <button
              type="button"
              disabled={isExporting}
              onClick={handleExportBackup}
              style={{
                backgroundColor: theme.itemBg,
                borderColor: theme.itemBorder,
                color: theme.textPrimary,
              }}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all active:scale-[0.99] text-left cursor-pointer group ${
                theme.isDark ? 'hover:bg-white/[0.08]' : 'hover:bg-black/[0.08]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">
                    {isExporting ? 'তৈরি হচ্ছে...' : 'ব্যাকআপ ডাউনলোড করুন (Export JSON)'}
                  </div>
                  <div style={{ color: theme.textSecondary }} className="text-[11px]">
                    সব হিসাব, কাস্টম থিম ও সেটিংস ব্যাকআপ ফাইল হিসেবে সংরক্ষণ করুন
                  </div>
                </div>
              </div>
              <FileJson style={{ color: theme.textMuted }} className="w-4 h-4 group-hover:text-emerald-500 transition-colors" />
            </button>

            {/* Import Backup Button */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                backgroundColor: theme.itemBg,
                borderColor: theme.itemBorder,
                color: theme.textPrimary,
              }}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all active:scale-[0.99] text-left cursor-pointer group ${
                theme.isDark ? 'hover:bg-white/[0.08]' : 'hover:bg-black/[0.08]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">
                    ব্যাকআপ রিস্টোর করুন (Restore JSON)
                  </div>
                  <div style={{ color: theme.textSecondary }} className="text-[11px]">
                    পূর্বের বা অন্য ফোনের ব্যাকআপ ফাইল আপলোড করে পুনরায় ফিরে পান
                  </div>
                </div>
              </div>
              <FileJson style={{ color: theme.textMuted }} className="w-4 h-4 group-hover:text-sky-500 transition-colors" />
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Clear Database Button */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic('medium');
                setShowClearConfirm(true);
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 transition-all active:scale-[0.99] text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-rose-500">
                    ডাটাবেজ রিসেট করুন (Reset Database)
                  </div>
                  <div className="text-[11px] text-rose-500/80">
                    সকল হিস্ট্রি ও ক্যাশ মুছে দিয়ে ডিফল্ট অবস্থায় ফিরিয়ে আনে
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            borderColor: theme.footerBorder,
            backgroundColor: theme.footerBg,
          }}
          className="px-5 py-3.5 border-t flex items-center justify-end"
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              backgroundColor: theme.accentBg,
              color: theme.accentText,
            }}
            className="px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            Done
          </button>
        </div>

        {/* Confirmation Modal for Reset */}
        {showClearConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-100">
            <div
              style={{
                backgroundColor: theme.dialogBg,
                borderColor: theme.dialogBorder,
                color: theme.textPrimary,
              }}
              className="w-full max-w-xs rounded-2xl p-5 border shadow-2xl text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-500 mx-auto flex items-center justify-center mb-3">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold">Reset Phone Database?</h3>
              <p style={{ color: theme.textSecondary }} className="text-xs mt-1 mb-4 leading-relaxed">
                This will wipe all calculation history and reset custom color palettes to factory default.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  style={{
                    backgroundColor: theme.itemBg,
                    color: theme.textPrimary,
                  }}
                  className="flex-1 py-2 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('medium');
                    onClearDatabase();
                    setShowClearConfirm(false);
                    setStatusMessage('ডাটাবেজ সফলভাবে রিসেট করা হয়েছে!');
                    setIsSuccess(true);
                  }}
                  className="flex-1 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white cursor-pointer"
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
