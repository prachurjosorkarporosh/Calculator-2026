/**
 * Phone Native Database Engine (IndexedDB) for All Mobile Phones
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.pro.bd/
 * © 2026 Prachurjo Calculator. All rights reserved.
 *
 * Implements high-capacity, persistent, offline-first IndexedDB database
 * that works seamlessly across all Android phones (Chrome, Samsung Internet, Mi Browser),
 * iPhones (Safari, WebKit), and desktop browsers.
 */

import { HistoryItem, CustomThemeColors, UserPreferences } from '../types.ts';

const DB_NAME = 'PrachurjoCalculator_PhoneDB';
const DB_VERSION = 2;

export interface PhoneDatabaseBackup {
  version: number;
  appName: string;
  developer: string;
  website: string;
  exportDate: string;
  timestamp: number;
  history: HistoryItem[];
  customColors: CustomThemeColors | null;
  preferences: Partial<UserPreferences>;
  meta: {
    deviceUserAgent: string;
    totalCalculations: number;
  };
}

export interface DatabaseStats {
  engine: 'IndexedDB (Phone Native Database)' | 'LocalStorage Fallback';
  isSupported: boolean;
  historyCount: number;
  hasCustomTheme: boolean;
  hasCustomWallpaper: boolean;
  estimatedSizeKb: number;
  lastBackupDate?: string;
}

export class PhoneDatabaseManager {
  private static dbInstance: IDBDatabase | null = null;
  private static isInitializing = false;

  /**
   * Initializes and opens the Phone Native IndexedDB Database
   */
  static async openDB(): Promise<IDBDatabase | null> {
    if (this.dbInstance) return this.dbInstance;
    if (typeof window === 'undefined' || !window.indexedDB) {
      console.warn('IndexedDB not supported on this phone, falling back to LocalStorage.');
      return null;
    }

    return new Promise((resolve) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
          const db = (event.target as IDBOpenDBRequest).result;

          // Store 1: Calculations history
          if (!db.objectStoreNames.contains('history')) {
            const historyStore = db.createObjectStore('history', { keyPath: 'id' });
            historyStore.createIndex('timestamp', 'timestamp', { unique: false });
          }

          // Store 2: Custom Themes & Photo Wallpapers
          if (!db.objectStoreNames.contains('themes_and_photos')) {
            db.createObjectStore('themes_and_photos', { keyPath: 'key' });
          }

          // Store 3: User Preferences & Settings
          if (!db.objectStoreNames.contains('preferences')) {
            db.createObjectStore('preferences', { keyPath: 'key' });
          }
        };

        request.onsuccess = (event) => {
          this.dbInstance = (event.target as IDBOpenDBRequest).result;
          resolve(this.dbInstance);
        };

        request.onerror = (event) => {
          console.error('IndexedDB open error:', event);
          resolve(null);
        };
      } catch (err) {
        console.error('IndexedDB exception:', err);
        resolve(null);
      }
    });
  }

  /**
   * Saves a calculation history item to the Phone Database
   */
  static async saveHistoryItem(item: HistoryItem): Promise<boolean> {
    const db = await this.openDB();
    if (!db) return false;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction('history', 'readwrite');
        const store = tx.objectStore('history');
        store.put(item);

        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  }

  /**
   * Retrieves all calculation items from the Phone Database
   */
  static async getAllHistory(): Promise<HistoryItem[]> {
    const db = await this.openDB();
    if (!db) return [];

    return new Promise((resolve) => {
      try {
        const tx = db.transaction('history', 'readonly');
        const store = tx.objectStore('history');
        const index = store.index('timestamp');
        const request = index.getAll();

        request.onsuccess = () => {
          const items: HistoryItem[] = request.result || [];
          // Sort descending (newest first)
          items.sort((a, b) => b.timestamp - a.timestamp);
          resolve(items);
        };

        request.onerror = () => resolve([]);
      } catch {
        resolve([]);
      }
    });
  }

  /**
   * Clears all calculation history in the Phone Database
   */
  static async clearAllHistory(): Promise<boolean> {
    const db = await this.openDB();
    if (!db) return false;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction('history', 'readwrite');
        const store = tx.objectStore('history');
        store.clear();

        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  }

  /**
   * Delete a single history item by id
   */
  static async deleteHistoryItem(id: string): Promise<boolean> {
    const db = await this.openDB();
    if (!db) return false;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction('history', 'readwrite');
        const store = tx.objectStore('history');
        store.delete(id);

        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  }

  /**
   * Save custom theme and photo wallpaper in Phone Database
   */
  static async saveCustomColors(colors: CustomThemeColors): Promise<boolean> {
    const db = await this.openDB();
    if (!db) return false;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction('themes_and_photos', 'readwrite');
        const store = tx.objectStore('themes_and_photos');
        store.put({ key: 'active_custom_colors', value: colors });

        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  }

  /**
   * Exports full phone database backup as JSON
   */
  static async exportFullBackup(
    history: HistoryItem[],
    customColors: CustomThemeColors | null,
    preferences: Partial<UserPreferences>
  ): Promise<string> {
    const backup: PhoneDatabaseBackup = {
      version: DB_VERSION,
      appName: 'Prachurjo Calculator',
      developer: 'Prachurjo Sorkar Porosh',
      website: 'https://prachurjo.dev.cv',
      exportDate: new Date().toISOString(),
      timestamp: Date.now(),
      history,
      customColors,
      preferences,
      meta: {
        deviceUserAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Phone',
        totalCalculations: history.length,
      },
    };

    return JSON.stringify(backup, null, 2);
  }

  /**
   * Imports and restores a full backup file into the Phone Database
   */
  static async importFullBackup(jsonContent: string): Promise<{
    success: boolean;
    history: HistoryItem[];
    customColors: CustomThemeColors | null;
    preferences: Partial<UserPreferences>;
    message: string;
  }> {
    try {
      const parsed: PhoneDatabaseBackup = JSON.parse(jsonContent);

      if (!parsed.history || !Array.isArray(parsed.history)) {
        return {
          success: false,
          history: [],
          customColors: null,
          preferences: {},
          message: 'অকার্যকর ডাটাবেজ ফাইল (Invalid database file structure).',
        };
      }

      // Sync into IndexedDB
      const db = await this.openDB();
      if (db) {
        try {
          const tx = db.transaction(['history', 'themes_and_photos'], 'readwrite');
          const histStore = tx.objectStore('history');
          histStore.clear();
          for (const item of parsed.history) {
            histStore.put(item);
          }

          if (parsed.customColors) {
            const themeStore = tx.objectStore('themes_and_photos');
            themeStore.put({ key: 'active_custom_colors', value: parsed.customColors });
          }
        } catch (e) {
          console.warn('Error batch saving into IndexedDB:', e);
        }
      }

      return {
        success: true,
        history: parsed.history,
        customColors: parsed.customColors || null,
        preferences: parsed.preferences || {},
        message: `${parsed.history.length}টি হিসাব এবং থিম সফলভাবে রিস্টোর হয়েছে!`,
      };
    } catch {
      return {
        success: false,
        history: [],
        customColors: null,
        preferences: {},
        message: 'ফাইলটি পড়তে ত্রুটি হয়েছে। অনুগ্রহ করে সঠিক .json ফাইল নির্বাচন করুন।',
      };
    }
  }

  /**
   * Get database statistics
   */
  static async getDatabaseStats(
    history: HistoryItem[],
    customColors: CustomThemeColors | null
  ): Promise<DatabaseStats> {
    const isSupported = typeof window !== 'undefined' && !!window.indexedDB;
    const historyCount = history.length;
    const hasCustomTheme = !!customColors;
    const hasCustomWallpaper = !!customColors?.bgImage;

    // Approximate size calculation
    const rawSize = JSON.stringify({ history, customColors }).length * 2;
    const estimatedSizeKb = Math.max(1, Math.round(rawSize / 1024));

    return {
      engine: isSupported ? 'IndexedDB (Phone Native Database)' : 'LocalStorage Fallback',
      isSupported,
      historyCount,
      hasCustomTheme,
      hasCustomWallpaper,
      estimatedSizeKb,
    };
  }
}
