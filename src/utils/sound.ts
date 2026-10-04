/**
 * Enhanced Sound Synthesizer via Web Audio API
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.pro.bd/
 * © 2026 Prachurjo Calculator. All rights reserved.
 *
 * Provides multiple sound effect styles:
 * - 'tactile': Crisp Android keypress click
 * - 'pop': Soft bubble pop
 * - 'mechanical': Mechanical keyboard switch snap
 * - 'beep': Retro digital calculator chirp
 * - 'cyberpunk': Futuristic synth wave pulse
 * - 'marimba': Tuned harmonic marimba chime
 * - 'typewriter': Vintage typewriter clack
 * - 'bubble': Water droplet pop
 * - 'laser': Sci-fi arcade laser zap
 * - 'woodblock': Acoustic woodblock tap
 */

import { SoundEffectType } from '../types.ts';

let audioCtx: AudioContext | null = null;
let masterVolume = 0.8;

export function setMasterSoundVolume(volume: number) {
  masterVolume = Math.max(0, Math.min(1, volume));
}

export function getMasterSoundVolume(): number {
  return masterVolume;
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playKeypressSound(
  variant: 'number' | 'operator' | 'scientific' | 'action' | 'equals' = 'number',
  style: SoundEffectType = 'tactile',
  customVol?: number
) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const vol = (customVol !== undefined ? customVol : masterVolume);
    if (vol <= 0.001) return;

    if (style === 'pop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startFreq = variant === 'equals' ? 350 : 500;
      const endFreq = variant === 'equals' ? 600 : 800;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.03);

      gain.gain.setValueAtTime(0.08 * vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.035);
      return;
    }

    if (style === 'beep') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const baseFreq = variant === 'equals' ? 1760 : variant === 'operator' ? 1480 : 1200;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);

      gain.gain.setValueAtTime(0.05 * vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
      return;
    }

    if (style === 'mechanical') {
      // Mechanical switch click: two rapid distinct acoustic transients
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();

      osc1.type = 'square';
      osc1.frequency.setValueAtTime(variant === 'equals' ? 800 : 1300, now);
      osc1.frequency.exponentialRampToValueAtTime(200, now + 0.018);

      gain1.gain.setValueAtTime(0.06 * vol, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.018);
      return;
    }

    if (style === 'cyberpunk') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const freq = variant === 'equals' ? 950 : variant === 'operator' ? 750 : 540;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq * 1.5, now);
      osc.frequency.exponentialRampToValueAtTime(freq, now + 0.04);

      gain.gain.setValueAtTime(0.05 * vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
      return;
    }

    if (style === 'marimba') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const notes = {
        equals: 880,
        operator: 659.25,
        action: 587.33,
        scientific: 523.25,
        number: 440,
      };
      const freq = notes[variant] || 440;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.09 * vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
      return;
    }

    if (style === 'typewriter') {
      const bufferSize = ctx.sampleRate * 0.012;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(variant === 'equals' ? 1800 : 3200, now);
      filter.Q.setValueAtTime(2.0, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12 * vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.015);
      return;
    }

    if (style === 'bubble') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = variant === 'equals' ? 400 : 700;
      const end = variant === 'equals' ? 900 : 1300;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(start, now);
      osc.frequency.exponentialRampToValueAtTime(end, now + 0.025);

      gain.gain.setValueAtTime(0.08 * vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
      return;
    }

    if (style === 'laser') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

      gain.gain.setValueAtTime(0.04 * vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.045);
      return;
    }

    if (style === 'woodblock') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const freq = variant === 'equals' ? 620 : 860;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, now + 0.02);

      gain.gain.setValueAtTime(0.1 * vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.025);
      return;
    }

    // Default 'tactile' Android click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    let freq = 1200;
    let duration = 0.018;
    let peakGain = 0.07;

    switch (variant) {
      case 'equals':
        freq = 880;
        duration = 0.024;
        peakGain = 0.09;
        break;
      case 'operator':
      case 'action':
        freq = 1400;
        duration = 0.02;
        peakGain = 0.08;
        break;
      case 'scientific':
        freq = 1600;
        duration = 0.016;
        peakGain = 0.07;
        break;
      case 'number':
      default:
        freq = 1100;
        duration = 0.018;
        peakGain = 0.06;
        break;
    }

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + duration);

    gain.gain.setValueAtTime(peakGain * vol, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    const bufferSize = ctx.sampleRate * 0.005;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.2;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(2500, now);
    noiseFilter.Q.setValueAtTime(1.5, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(peakGain * 0.5 * vol, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.006);

    osc.connect(gain);
    gain.connect(ctx.destination);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    osc.start(now);
    noise.start(now);

    osc.stop(now + duration);
    noise.stop(now + 0.006);
  } catch {
    // Graceful fallback
  }
}
