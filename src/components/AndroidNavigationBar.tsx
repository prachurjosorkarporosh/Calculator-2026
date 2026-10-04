/**
 * Interactive Android System Navigation Bar (বাটন ও জেসচার নেভিগেশন)
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Calculator. All rights reserved.
 *
 * Provides 100% functional Android 3-Button & Gesture Navigation:
 * - ◀ Back: Closes active modal / dialog, or undoes current calculation input
 * - ● Home: Returns to clean Calculator home screen and closes all menus
 * - ■ Recent: Opens calculation history and overview
 * - Gesture Bar: Interactive swipeable / clickable pill
 */

import React, { useState, useRef } from 'react';
import { ThemePalette } from '../data/themes.ts';
import { triggerHaptic } from '../utils/haptics.ts';

interface AndroidNavigationBarProps {
  palette?: ThemePalette;
  navStyle: 'buttons' | 'gesture';
  hasActiveModal: boolean;
  onBack: () => void;
  onHome: () => void;
  onRecent: () => void;
  onToggleNavStyle?: () => void;
}

export const AndroidNavigationBar: React.FC<AndroidNavigationBarProps> = ({
  palette,
  navStyle,
  hasActiveModal,
  onBack,
  onHome,
  onRecent,
  onToggleNavStyle,
}) => {
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [gestureSwiping, setGestureSwiping] = useState<boolean>(false);
  const [activeBtn, setActiveBtn] = useState<'back' | 'home' | 'recent' | 'pill' | null>(null);

  const isDark = palette ? palette.isDark : true;
  const iconColor = isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(15, 23, 42, 0.85)';
  const activeColor = isDark ? '#FFFFFF' : '#000000';

  // Handle gesture touch start
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setTouchStartX(clientX);
    setTouchStartY(clientY);
    setGestureSwiping(true);
    setActiveBtn('pill');
    triggerHaptic('light');
  };

  // Handle gesture touch end
  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (touchStartX === null || touchStartY === null) {
      setActiveBtn(null);
      setGestureSwiping(false);
      return;
    }

    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : (e as React.MouseEvent).clientY;

    const deltaX = clientX - touchStartX;
    const deltaY = clientY - touchStartY;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (deltaY < -25 && absY > absX) {
      // Swiped UP -> Home action
      triggerHaptic('medium');
      onHome();
    } else if (absX > 30) {
      // Swiped LEFT or RIGHT -> Recent History action
      triggerHaptic('light');
      onRecent();
    } else {
      // Quick Tap -> Back action (close active modal or backspace)
      triggerHaptic('light');
      onBack();
    }

    setTouchStartX(null);
    setTouchStartY(null);
    setActiveBtn(null);
    setGestureSwiping(false);
  };

  return (
    <nav
      aria-label="Android System Navigation Bar"
      className="w-full shrink-0 flex items-center justify-center select-none z-30 transition-colors py-1.5 px-4"
    >
      {navStyle === 'buttons' ? (
        /* Classic Android 3-Button Navigation Bar */
        <div className="w-full max-w-sm flex items-center justify-around py-1">
          {/* Back Button (◀ Triangle) */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onBack();
            }}
            onMouseDown={() => setActiveBtn('back')}
            onMouseUp={() => setActiveBtn(null)}
            onTouchStart={() => setActiveBtn('back')}
            onTouchEnd={() => setActiveBtn(null)}
            className="group w-14 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-90 cursor-pointer relative"
            title={hasActiveModal ? "Back (Close active window)" : "Back (Delete last digit)"}
            aria-label="Android Back Button"
          >
            <div
              className={`w-9 h-7 rounded-xl flex items-center justify-center transition-all ${
                activeBtn === 'back'
                  ? isDark ? 'bg-white/20 scale-95' : 'bg-black/15 scale-95'
                  : 'group-hover:bg-white/5'
              }`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform group-active:-translate-x-0.5"
              >
                <path
                  d="M15 19L7 12L15 5"
                  stroke={activeBtn === 'back' ? activeColor : iconColor}
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>

          {/* Home Button (● Circle) */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('medium');
              onHome();
            }}
            onMouseDown={() => setActiveBtn('home')}
            onMouseUp={() => setActiveBtn(null)}
            onTouchStart={() => setActiveBtn('home')}
            onTouchEnd={() => setActiveBtn(null)}
            className="group w-14 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-90 cursor-pointer relative"
            title="Home (Return to Calculator)"
            aria-label="Android Home Button"
          >
            <div
              className={`w-9 h-7 rounded-xl flex items-center justify-center transition-all ${
                activeBtn === 'home'
                  ? isDark ? 'bg-white/20 scale-95' : 'bg-black/15 scale-95'
                  : 'group-hover:bg-white/5'
              }`}
            >
              <div
                style={{
                  borderColor: activeBtn === 'home' ? activeColor : iconColor,
                  backgroundColor: activeBtn === 'home' ? (isDark ? 'white' : 'black') : 'transparent',
                }}
                className="w-4 h-4 rounded-full border-[2.6px] transition-all"
              />
            </div>
          </button>

          {/* Recent Apps / Overview Button (■ Square) */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onRecent();
            }}
            onMouseDown={() => setActiveBtn('recent')}
            onMouseUp={() => setActiveBtn(null)}
            onTouchStart={() => setActiveBtn('recent')}
            onTouchEnd={() => setActiveBtn(null)}
            className="group w-14 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-90 cursor-pointer relative"
            title="Recent (History & Records)"
            aria-label="Android Recent Apps Button"
          >
            <div
              className={`w-9 h-7 rounded-xl flex items-center justify-center transition-all ${
                activeBtn === 'recent'
                  ? isDark ? 'bg-white/20 scale-95' : 'bg-black/15 scale-95'
                  : 'group-hover:bg-white/5'
              }`}
            >
              <div
                style={{
                  borderColor: activeBtn === 'recent' ? activeColor : iconColor,
                  backgroundColor: activeBtn === 'recent' ? (isDark ? 'white' : 'black') : 'transparent',
                }}
                className="w-3.5 h-3.5 rounded-[3px] border-[2.4px] transition-all"
              />
            </div>
          </button>
        </div>
      ) : (
        /* Modern Android Gesture Navigation Bar Pill */
        <div
          className="w-full flex flex-col items-center justify-center py-1 cursor-grab active:cursor-grabbing touch-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseUp={handleTouchEnd}
          title="Gesture Bar: Tap to Go Back/Clear • Swipe Up for Home • Swipe Sides for Recent History"
        >
          <div
            className={`h-1.25 rounded-full transition-all duration-150 ${
              activeBtn === 'pill' || gestureSwiping
                ? 'w-40 scale-y-125 opacity-100 shadow-md'
                : 'w-32 opacity-65 hover:opacity-90'
            }`}
            style={{
              backgroundColor: isDark ? '#FFFFFF' : '#0F172A',
            }}
          />
        </div>
      )}
    </nav>
  );
};
