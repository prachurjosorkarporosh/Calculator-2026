/**
 * Phone Database Manager & Backup Modal (ফোন ডাটাবেজ ও ব্যাকআপ)
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.pro.bd/
 * © 2026 Prachurjo Calculator. All rights reserved.
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
} from 'lucide-react';
import {
  PhoneDatabaseManager,
  DatabaseStats,
  PhoneDatabaseBackup,
} from '../data/phoneDatabase.ts';
import { HistoryItem, CustomThemeColors, UserPreferences } from '../types.ts';
import { triggerHaptic } from '../utils/haptics.ts';

interface PhoneDatabaseModalProps {
  isOpen: boolean;
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setStatusMessage('ডাটাবেজ ফাইল সফলভাবে ডাউনলোড হয়েছে (Backup downloaded)!');
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

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 animate-in fade-in duration-150 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#EEF2F6] dark:bg-[#1E2126] text-slate-800 dark:text-slate-100 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700/60 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between bg-white/50 dark:bg-black/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-1.5">
                <span>ফোন ডাটাবেজ ও ব্যাকআপ</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold uppercase">
                  Phone DB
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                সব ফোনে স্থায়ী ডাটা সংরক্ষণ, ব্যাকআপ ও রিস্টোর
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* Status Message Alert */}
          {statusMessage && (
            <div
              className={`p-3 rounded-2xl flex items-center gap-2.5 text-xs font-medium animate-in fade-in duration-150 ${
                isSuccess
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200'
                  : 'bg-rose-500/15 border border-rose-500/30 text-rose-800 dark:text-rose-200'
              }`}
            >
              {isSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Phone Database Status Card */}
          <div className="p-4 rounded-2xl bg-white dark:bg-black/30 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-blue-500" />
                <span>ডাটাবেজ অবস্থা (Database Status)</span>
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                সক্রিয় (Active)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50">
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  সংরক্ষিত হিসাব (Calculations)
                </div>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {stats?.historyCount ?? history.length} টি
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50">
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  ডাটাবেজ সাইজ (Size)
                </div>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  ~{stats?.estimatedSizeKb ?? 2} KB
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 col-span-2 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    স্টোরেজ ইঞ্জিন (Storage Engine)
                  </div>
                  <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                    {stats?.engine ?? 'IndexedDB (Phone Native Database)'}
                  </div>
                </div>
                <Smartphone className="w-5 h-5 text-slate-400" />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                অফলাইন-ফার্স্ট: ইন্টারনেট না থাকলেও আপনার ফোনের ইন্টারনাল ডাটাবেজে সবকিছু সুরক্ষিত থাকে।
              </span>
            </div>
          </div>

          {/* Backup & Restore Action Buttons */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              ব্যাকআপ ও স্থানান্তর (Backup & Cross-Phone Sync):
            </span>

            {/* Export Backup Button */}
            <button
              type="button"
              disabled={isExporting}
              onClick={handleExportBackup}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-black/20 hover:bg-black/5 dark:hover:bg-white/10 border border-slate-200 dark:border-slate-700/60 shadow-sm transition-all active:scale-[0.99] text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    ডাটাবেজ ব্যাকআপ ফাইল ডাউনলোড করুন (Export Backup)
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    সব হিসাব ও থিম .json ফাইল হিসেবে আপনার ফোনে সেভ হবে
                  </div>
                </div>
              </div>
              <FileJson className="w-4 h-4 text-slate-400 shrink-0" />
            </button>

            {/* Hidden File Input for Restore */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Import / Restore Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-black/20 hover:bg-black/5 dark:hover:bg-white/10 border border-slate-200 dark:border-slate-700/60 shadow-sm transition-all active:scale-[0.99] text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    যেকোনো ফোনে ডাটাবেজ রিস্টোর করুন (Import to Any Phone)
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    আগের ব্যাকআপ ফাইল সিলেক্ট করে সব হিসাব তাৎক্ষণিক ফিরিয়ে আনুন
                  </div>
                </div>
              </div>
              <Upload className="w-4 h-4 text-slate-400 shrink-0" />
            </button>

            {/* Clear Database */}
            <button
              type="button"
              onClick={() => {
                if (window.confirm('আপনি কি নিশ্চিত যে ডাটাবেজের সব হিসাব মুছে ফেলতে চান?')) {
                  triggerHaptic('medium');
                  onClearDatabase();
                  PhoneDatabaseManager.clearAllHistory();
                  setStatusMessage('ডাটাবেজ সম্পূর্ণ পরিষ্কার করা হয়েছে (Cleared)');
                  setIsSuccess(true);
                }
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                <span>ডাটাবেজের সব হিসেব পরিষ্কার করুন (Clear DB)</span>
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-700/60 bg-white/50 dark:bg-black/20 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5" />
            <span>সকল অ্যান্ড্রয়েড ও আইফোনে সামঞ্জস্যপূর্ণ</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#087A36] hover:bg-[#076c30] text-white font-semibold transition-colors shadow-sm"
          >
            সম্পন্ন (Done)
          </button>
        </div>
      </div>
    </div>
  );
};
