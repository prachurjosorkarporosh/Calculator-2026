/**
 * History Modal Sheet (Theme-Adaptive)
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Prachurjo Calculator. All rights reserved.
 *
 * Dynamically adapts to the currently active Theme Palette (Light, Dark, OLED, Cyber, Pastel, Custom).
 */

import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Trash2,
  Clock,
  Search,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { HistoryItem } from '../types.ts';
import { triggerHaptic } from '../utils/haptics.ts';
import { ThemePalette } from '../data/themes.ts';
import { getModalThemeStyles } from '../utils/themeStyles.ts';

interface HistoryModalProps {
  isOpen: boolean;
  palette?: ThemePalette;
  history: HistoryItem[];
  onClose: () => void;
  onSelectHistory: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  palette,
  history,
  onClose,
  onSelectHistory,
  onDeleteItem,
  onClearAll,
}) => {
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const theme = getModalThemeStyles(palette);

  // Filter history by search query
  const filteredHistory = useMemo(() => {
    if (!search.trim()) return history;
    const q = search.toLowerCase();
    return history.filter(
      (item) =>
        item.expression.toLowerCase().includes(q) ||
        item.result.toLowerCase().includes(q)
    );
  }, [history, search]);

  if (!isOpen) return null;

  const handleCopy = (e: React.MouseEvent, item: HistoryItem) => {
    e.stopPropagation();
    triggerHaptic('light');
    navigator.clipboard?.writeText(item.result);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleDeleteOne = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    triggerHaptic('medium');
    onDeleteItem(id);
  };

  return (
    <div
      style={{
        backgroundColor: theme.dialogBg,
        color: theme.textPrimary,
      }}
      className="fixed inset-0 z-50 flex flex-col backdrop-blur-2xl animate-in fade-in slide-in-from-left duration-200 transition-colors"
    >
      {/* Top Header */}
      <div
        style={{
          borderColor: theme.headerBorder,
          backgroundColor: theme.headerBg,
        }}
        className="w-full flex items-center justify-between px-4 py-3.5 border-b"
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            aria-label="Back to calculator"
            style={{
              backgroundColor: theme.itemBg,
              color: theme.textPrimary,
            }}
            className="w-10 h-10 flex items-center justify-center rounded-xl active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
              <span>Calculation History</span>
              <span
                style={{
                  backgroundColor: theme.subtleAccentBg,
                  color: theme.accentColor,
                }}
                className="text-[11px] font-mono px-2 py-0.5 rounded-full font-bold"
              >
                {history.length}
              </span>
            </h2>
            <p style={{ color: theme.textSecondary }} className="text-[11px]">
              Offline device storage
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={() => {
              triggerHaptic('medium');
              setShowClearConfirm(true);
            }}
            className="text-xs font-semibold text-rose-500 hover:text-rose-400 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Search Input Bar */}
      {history.length > 0 && (
        <div
          style={{
            borderColor: theme.headerBorder,
            backgroundColor: theme.headerBg,
          }}
          className="px-4 py-2.5 border-b"
        >
          <div className="relative">
            <Search style={{ color: theme.textMuted }} className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search equations, numbers, or results..."
              style={{
                backgroundColor: theme.itemBg,
                borderColor: theme.itemBorder,
                color: theme.textPrimary,
              }}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border outline-none transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                style={{ color: theme.textMuted }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs hover:opacity-100"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* History Items List */}
      <div
        style={{ borderColor: theme.headerBorder }}
        className="flex-1 overflow-y-auto px-4 py-3 divide-y"
      >
        {history.length === 0 ? (
          <div className="h-full min-h-[320px] flex flex-col items-center justify-center text-center p-8">
            <div
              style={{
                backgroundColor: theme.itemBg,
                borderColor: theme.itemBorder,
                color: theme.textMuted,
              }}
              className="w-16 h-16 rounded-2xl border flex items-center justify-center mb-4"
            >
              <Clock className="w-8 h-8" />
            </div>
            <p className="text-base font-bold">No Calculations Recorded</p>
            <p style={{ color: theme.textSecondary }} className="text-xs max-w-xs mt-1.5 leading-relaxed">
              Every math expression and scientific calculation you compute is saved automatically to your device's local database.
            </p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="h-60 flex flex-col items-center justify-center text-center">
            <Search style={{ color: theme.textMuted }} className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm font-medium">No results matching "{search}"</p>
            <button
              type="button"
              onClick={() => setSearch('')}
              style={{ color: theme.accentColor }}
              className="text-xs hover:underline mt-2 font-bold cursor-pointer"
            >
              Reset search
            </button>
          </div>
        ) : (
          filteredHistory.map((item) => {
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => {
                  triggerHaptic('light');
                  onSelectHistory(item);
                  onClose();
                }}
                style={{ borderColor: theme.itemBorder }}
                className={`py-3.5 px-3 rounded-2xl transition-all cursor-pointer group flex items-start justify-between gap-3 border my-1 ${
                  theme.isDark
                    ? 'hover:bg-white/[0.04]'
                    : 'hover:bg-black/[0.04]'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div style={{ color: theme.textSecondary }} className="text-xs font-mono truncate">
                    {item.expression}
                  </div>
                  <div
                    style={{ color: theme.textPrimary }}
                    className="text-2xl font-bold tracking-tight mt-0.5 truncate"
                  >
                    = {item.result}
                  </div>
                  <div style={{ color: theme.textMuted }} className="flex items-center gap-2 mt-1.5 text-[10px]">
                    <span>
                      {new Date(item.timestamp).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(item.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span
                      style={{ color: theme.accentColor }}
                      className="font-bold group-hover:inline-block hidden transition-opacity"
                    >
                      Tap to reuse
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0 pt-1">
                  <button
                    type="button"
                    onClick={(e) => handleCopy(e, item)}
                    title="Copy result"
                    style={{
                      backgroundColor: theme.itemBg,
                      color: theme.textPrimary,
                    }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDeleteOne(e, item.id)}
                    title="Delete item"
                    className="w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation Dialog for Clear All */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4 animate-in fade-in duration-100">
          <div
            style={{
              backgroundColor: theme.dialogBg,
              borderColor: theme.dialogBorder,
              color: theme.textPrimary,
            }}
            className="w-full max-w-xs rounded-2xl p-5 border shadow-2xl text-center"
          >
            <div className="w-11 h-11 rounded-xl bg-rose-500/20 text-rose-500 mx-auto flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold">Clear All History?</h3>
            <p style={{ color: theme.textSecondary }} className="text-xs mt-1 mb-4 leading-relaxed">
              This will remove all {history.length} calculations from your device storage. This action cannot be undone.
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
                  onClearAll();
                  setShowClearConfirm(false);
                }}
                className="flex-1 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white cursor-pointer"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
