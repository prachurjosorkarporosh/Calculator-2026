/**
 * Persistent Device Custom Wallpaper Storage Engine
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Prachurjo Calculator. All rights reserved.
 *
 * Saves custom uploaded wallpapers persistently on the phone/browser (IndexedDB & LocalStorage).
 * Allows users to switch wallpapers, upload new ones, and re-apply any previously uploaded wallpaper anytime.
 */

export interface CustomUploadedWallpaper {
  id: string;
  name: string;
  dataUrl: string;
  thumbnailUrl?: string;
  timestamp: number;
}

const STORAGE_KEY = 'prachurjo_calc_uploaded_wallpapers_v2';
const DB_NAME = 'PrachurjoCalculator_PhoneDB';
const DB_VERSION = 2;

/**
 * Resizes an image dataUrl using HTML Canvas so it doesn't overload storage
 */
export async function optimizeWallpaperImage(
  file: File,
  maxWidth = 1280,
  maxHeight = 1280,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Use JPEG for compressed photos
        const optimized = canvas.toDataURL('image/jpeg', quality);
        resolve(optimized);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export class CustomWallpaperManager {
  /**
   * Retrieves all saved uploaded wallpapers from device storage
   */
  static getSavedWallpapers(): CustomUploadedWallpaper[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  /**
   * Saves a new uploaded wallpaper into device storage
   */
  static saveWallpaper(
    name: string,
    dataUrl: string
  ): CustomUploadedWallpaper[] {
    const list = this.getSavedWallpapers();
    const newItem: CustomUploadedWallpaper = {
      id: `wall_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim() || `My Wallpaper ${list.length + 1}`,
      dataUrl,
      timestamp: Date.now(),
    };

    // Store up to 30 custom wallpapers
    const updated = [newItem, ...list.filter((w) => w.dataUrl !== dataUrl)].slice(0, 30);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage wallpaper save warning (trying trimmed list):', e);
      // If quota exceeded, keep fewer items
      try {
        const trimmed = [newItem, ...list.slice(0, 5)];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      } catch (err) {
        console.error('Failed to store in localStorage:', err);
      }
    }

    // Also persist in IndexedDB asynchronously
    this.saveToIndexedDB(newItem).catch((err) =>
      console.warn('IndexedDB wallpaper sync err:', err)
    );

    return updated;
  }

  /**
   * Deletes a saved wallpaper by ID
   */
  static deleteWallpaper(id: string): CustomUploadedWallpaper[] {
    const list = this.getSavedWallpapers();
    const updated = list.filter((w) => w.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update localStorage after delete:', e);
    }

    // Also delete from IndexedDB
    this.deleteFromIndexedDB(id).catch(console.warn);

    return updated;
  }

  /**
   * Syncs wallpaper to IndexedDB
   */
  private static async saveToIndexedDB(wallpaper: CustomUploadedWallpaper): Promise<void> {
    if (typeof window === 'undefined' || !window.indexedDB) return;
    return new Promise((resolve) => {
      try {
        const req = window.indexedDB.open(DB_NAME, DB_VERSION);
        req.onsuccess = () => {
          const db = req.result;
          if (db.objectStoreNames.contains('themes_and_photos')) {
            const tx = db.transaction('themes_and_photos', 'readwrite');
            const store = tx.objectStore('themes_and_photos');
            store.put({ key: `custom_wall_${wallpaper.id}`, value: wallpaper });
            tx.oncomplete = () => resolve();
            tx.onerror = () => resolve();
          } else {
            resolve();
          }
        };
        req.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  /**
   * Deletes from IndexedDB
   */
  private static async deleteFromIndexedDB(id: string): Promise<void> {
    if (typeof window === 'undefined' || !window.indexedDB) return;
    return new Promise((resolve) => {
      try {
        const req = window.indexedDB.open(DB_NAME, DB_VERSION);
        req.onsuccess = () => {
          const db = req.result;
          if (db.objectStoreNames.contains('themes_and_photos')) {
            const tx = db.transaction('themes_and_photos', 'readwrite');
            const store = tx.objectStore('themes_and_photos');
            store.delete(`custom_wall_${id}`);
            tx.oncomplete = () => resolve();
            tx.onerror = () => resolve();
          } else {
            resolve();
          }
        };
        req.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }
}
