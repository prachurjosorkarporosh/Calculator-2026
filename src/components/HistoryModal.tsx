/**
 * History Modal Sheet
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.pro.bd/
 * © 2026 Prachurjo Calculator. All rights reserved.
 *
 * Implements Android calculation history list with restore,
 * single delete, and clear all.
 */

import React from 'react';
import { ArrowLeft, Trash2, Clock } from 'lucide-react';
import { HistoryItem } from '../types.ts';
import { triggerHaptic } from '../utils/haptics.ts';

interface HistoryModalProps {
  isOpen: boolean;
  history: HistoryItem[];
  onClose: () => void;
  onSelectHistory: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  history,
  onClose,
  onSelectHistory,
  onDeleteItem,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-[#121316] text-slate-900 dark:text-slate-100 animate-in fade-in slide-in-from-left duration-200">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            aria-label="Back to calculator"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all text-slate-700 dark:text-slate-300"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <h2 className="text-xl font-medium tracking-tight">History</h2>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={() => {
              triggerHaptic('medium');
              onClearAll();
            }}
            className="text-sm font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 px-3 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* History List or Empty state */}
      <div className="flex-1 overflow-y-auto px-4 py-3 divide-y divide-slate-100 dark:divide-slate-800/60">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 dark:text-slate-500">
            <Clock className="w-16 h-16 stroke-[1.2] mb-3 opacity-40" />
            <p className="text-base font-medium">No history yet</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mt-1">
              Calculations you perform will appear here and are stored safely offline on your device.
            </p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="py-4 flex items-center justify-between group hover:bg-black/[0.02] dark:hover:bg-white/[0.02] px-2 rounded-xl transition-colors cursor-pointer"
              onClick={() => {
                triggerHaptic('light');
                onSelectHistory(item);
                onClose();
              }}
            >
              <div className="flex-1 pr-4">
                <div className="text-base text-slate-500 dark:text-slate-400 font-normal truncate">
                  {item.expression}
                </div>
                <div className="text-2xl sm:text-3xl font-medium text-slate-900 dark:text-white mt-0.5 tracking-tight">
                  = {item.result}
                </div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  {new Date(item.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {' · '}
                  {new Date(item.timestamp).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerHaptic('medium');
                  onDeleteItem(item.id);
                }}
                aria-label="Delete history entry"
                className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors opacity-70 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
