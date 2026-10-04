/**
 * Haptic & Touch Feedback Helper
 * Uses standard Web Vibration API when available on Android / mobile devices.
 */

let isHapticsGlobalEnabled = true;

export function setHapticsEnabled(enabled: boolean) {
  isHapticsGlobalEnabled = enabled;
}

export function triggerHaptic(type: 'light' | 'medium' | 'heavy' = 'light') {
  if (!isHapticsGlobalEnabled) return;
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      const duration = type === 'light' ? 10 : type === 'medium' ? 20 : 35;
      navigator.vibrate(duration);
    } catch {
      // Ignore vibration errors if blocked by browser policy
    }
  }
}
