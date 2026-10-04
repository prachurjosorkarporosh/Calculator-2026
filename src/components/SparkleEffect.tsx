/**
 * Particle Celebration & Sparkle Effect
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Calculator. All rights reserved.
 *
 * Emits vibrant glowing particles when a calculation is evaluated.
 */

import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

interface SparkleEffectProps {
  triggerKey: number;
  accentColor?: string;
}

export const SparkleEffect: React.FC<SparkleEffectProps> = ({
  triggerKey,
  accentColor = '#10B981',
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (triggerKey === 0) return;

    const colors = [accentColor, '#F59E0B', '#38BDF8', '#EC4899', '#A855F7', '#FFFFFF'];
    const newParticles: Particle[] = Array.from({ length: 24 }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / 24 + (Math.random() - 0.5) * 0.4;
      const speed = Math.random() * 90 + 50;
      return {
        id: Math.random(),
        x: 50, // center %
        y: 60, // display area bottom %
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 30,
        size: Math.random() * 4 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
      };
    });

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
    }, 750);

    return () => clearTimeout(timer);
  }, [triggerKey, accentColor]);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-sparkle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 10px ${p.color}`,
            '--vx': `${p.vx}px`,
            '--vy': `${p.vy}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};
