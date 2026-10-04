/**
 * Privacy Policy Dialog
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.pro.bd/
 * © 2026 Prachurjo Calculator. All rights reserved.
 */

import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics.ts';

interface PrivacyDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyDialog: React.FC<PrivacyDialogProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#EEF2F6] dark:bg-[#25282D] rounded-3xl p-6 shadow-2xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-slate-100 max-h-[85vh] flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-[#087A36] dark:text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-medium tracking-tight">Privacy Policy</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Prachurjo Calculator · 100% Offline
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <p>
            Your privacy is completely respected. <strong>Prachurjo Calculator</strong> is built as a pure, privacy-first offline calculator application.
          </p>

          <div className="space-y-2.5 bg-white/70 dark:bg-black/20 p-3.5 rounded-2xl border border-slate-200/50 dark:border-slate-700/40">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#087A36] dark:text-emerald-400 mt-0.5 shrink-0" />
              <span><strong>100% Offline:</strong> No internet connection is ever needed or used.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#087A36] dark:text-emerald-400 mt-0.5 shrink-0" />
              <span><strong>Local Calculations:</strong> All math expressions are parsed and evaluated strictly on your device.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#087A36] dark:text-emerald-400 mt-0.5 shrink-0" />
              <span><strong>Local History & Settings:</strong> History entries and theme preferences are saved locally in internal device storage.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#087A36] dark:text-emerald-400 mt-0.5 shrink-0" />
              <span><strong>No Accounts or Tracking:</strong> No registration, logins, telemetry, ads, or analytics.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#087A36] dark:text-emerald-400 mt-0.5 shrink-0" />
              <span><strong>Zero Intrusive Permissions:</strong> Does not request access to camera, location, contacts, or storage.</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Developer: Prachurjo Sorkar Porosh<br />
            Website:{' '}
            <a
              href="https://prachurjo.dev.cv"
              target="_blank"
              rel="noreferrer"
              className="text-[#087A36] dark:text-emerald-400 hover:underline"
            >
              https://prachurjo.dev.cv
            </a>
          </p>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="px-6 py-2 text-sm font-semibold text-white bg-[#087A36] hover:bg-[#076c30] rounded-full transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
