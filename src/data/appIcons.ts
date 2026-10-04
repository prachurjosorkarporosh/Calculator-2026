/**
/**
 * App Icon Catalog & Dynamic Icon Manager for Prachurjo Calculator
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Prachurjo Calculator. All rights reserved.
 */

export interface AppIconOption {
  id: string;
  name: string;
  nameBn: string;
  category: string;
  bgGradStart: string;
  bgGradEnd: string;
  accentGradStart: string;
  accentGradEnd: string;
  displayColor: string;
  symbolColor: string;
  description: string;
}

export const APP_ICONS: AppIconOption[] = [
  {
    id: 'emerald-pro',
    name: 'Emerald Pro (Signature)',
    nameBn: 'এমারেল্ড প্রো (ডিফল্ট)',
    category: 'Signature',
    bgGradStart: '#1E293B',
    bgGradEnd: '#0F172A',
    accentGradStart: '#10B981',
    accentGradEnd: '#087A36',
    displayColor: '#38BDF8',
    symbolColor: '#FFFFFF',
    description: 'Original signature deep slate & emerald green design',
  },
  {
    id: 'midnight-oled',
    name: 'Midnight Titanium',
    nameBn: 'মিডনাইট টাইটানিয়াম',
    category: 'Dark & OLED',
    bgGradStart: '#000000',
    bgGradEnd: '#111115',
    accentGradStart: '#E2E8F0',
    accentGradEnd: '#94A3B8',
    displayColor: '#FFFFFF',
    symbolColor: '#000000',
    description: 'Ultra-pure AMOLED pitch black with brushed titanium',
  },
  {
    id: 'cyber-neon',
    name: 'Cyberpunk Neon',
    nameBn: 'সাইবারপাঙ্ক নিয়ন',
    category: 'Neon & Glow',
    bgGradStart: '#0B0D19',
    bgGradEnd: '#1E1035',
    accentGradStart: '#EC4899',
    accentGradEnd: '#06B6D4',
    displayColor: '#22D3EE',
    symbolColor: '#FFFFFF',
    description: 'Electric cyan and neon magenta cyberpunk glow',
  },
  {
    id: 'sunset-gold',
    name: 'Royal Gold & Amber',
    nameBn: 'রয়্যাল গোল্ড ও অ্যাম্বার',
    category: 'Luxury',
    bgGradStart: '#1C1917',
    bgGradEnd: '#292524',
    accentGradStart: '#F59E0B',
    accentGradEnd: '#D97706',
    displayColor: '#FBBF24',
    symbolColor: '#000000',
    description: 'Opulent gold and warm amber luxury finish',
  },
  {
    id: 'royal-purple',
    name: 'Cosmic Violet Glass',
    nameBn: 'কসমিক ভায়োলেট গ্লাস',
    category: 'Glass & Gradient',
    bgGradStart: '#1E1B4B',
    bgGradEnd: '#0F172A',
    accentGradStart: '#A855F7',
    accentGradEnd: '#7C3AED',
    displayColor: '#C084FC',
    symbolColor: '#FFFFFF',
    description: 'Deep celestial purple and frosted glass style',
  },
  {
    id: 'crimson-ruby',
    name: 'Ruby Scarlet',
    nameBn: 'রুবি স্কারলেট',
    category: 'Vibrant',
    bgGradStart: '#2A080C',
    bgGradEnd: '#140305',
    accentGradStart: '#EF4444',
    accentGradEnd: '#DC2626',
    displayColor: '#F87171',
    symbolColor: '#FFFFFF',
    description: 'Passionate fiery ruby red and crimson glow',
  },
  {
    id: 'ocean-sapphire',
    name: 'Ocean Sapphire',
    nameBn: 'ওশান স্যাফায়ার',
    category: 'Vibrant',
    bgGradStart: '#082F49',
    bgGradEnd: '#020617',
    accentGradStart: '#0EA5E9',
    accentGradEnd: '#0284C7',
    displayColor: '#38BDF8',
    symbolColor: '#FFFFFF',
    description: 'Deep ocean marine blue and crisp sky tones',
  },
  {
    id: 'retro-digital',
    name: 'Retro 80s LCD',
    nameBn: 'রেট্রো আশির দশক এলসিডি',
    category: 'Retro & Tech',
    bgGradStart: '#27272A',
    bgGradEnd: '#18181B',
    accentGradStart: '#84CC16',
    accentGradEnd: '#65A30D',
    displayColor: '#A3E635',
    symbolColor: '#1A2E05',
    description: 'Vintage engineering calculator with olive green LCD glow',
  },
  {
    id: 'sakura-pink',
    name: 'Sakura Blossom',
    nameBn: 'সাকুরা ব্লসম',
    category: 'Pastel & Soft',
    bgGradStart: '#4C0519',
    bgGradEnd: '#1F030B',
    accentGradStart: '#F472B6',
    accentGradEnd: '#DB2777',
    displayColor: '#FBCFE8',
    symbolColor: '#FFFFFF',
    description: 'Soft pastel cherry blossom and rose gold',
  },
  {
    id: 'minimal-white',
    name: 'Ceramic White',
    nameBn: 'সিরামিক হোয়াইট',
    category: 'Light & Clean',
    bgGradStart: '#F8FAFC',
    bgGradEnd: '#E2E8F0',
    accentGradStart: '#0F172A',
    accentGradEnd: '#334155',
    displayColor: '#0F172A',
    symbolColor: '#FFFFFF',
    description: 'Clean high-contrast Scandinavian monochrome ceramic',
  },
];

export const DEFAULT_APP_ICON_ID = 'emerald-pro';

/**
 * Generates an SVG string for a given icon configuration
 */
export function generateAppIconSvg(icon: AppIconOption): string {
  const isLightBg = icon.bgGradStart === '#F8FAFC';
  const textColor = isLightBg ? '#0F172A' : '#F1F5F9';
  const circleFill = isLightBg ? '#CBD5E1' : '#334155';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${icon.bgGradStart}" />
      <stop offset="100%" stop-color="${icon.bgGradEnd}" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${icon.accentGradStart}" />
      <stop offset="100%" stop-color="${icon.accentGradEnd}" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="125%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>

  <rect x="32" y="32" width="448" height="448" rx="112" fill="url(#bgGrad)" filter="url(#shadow)"/>

  <g opacity="0.08" stroke="#FFFFFF" stroke-width="2">
    <line x1="32" y1="256" x2="480" y2="256"/>
    <line x1="256" y1="32" x2="256" y2="480"/>
  </g>

  <!-- Display bar mockup at top -->
  <rect x="80" y="86" width="352" height="88" rx="24" fill="${isLightBg ? '#E2E8F0' : '#1E293B'}" stroke="${isLightBg ? '#94A3B8' : '#334155'}" stroke-width="3"/>
  <text x="400" y="146" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="42" font-weight="700" fill="${icon.displayColor}" text-anchor="end">88.88</text>

  <!-- Button Grid Icons -->
  <circle cx="150" cy="240" r="42" fill="${circleFill}" />
  <path d="M150 220 V260 M130 240 H170" stroke="${textColor}" stroke-width="8" stroke-linecap="round"/>

  <circle cx="256" cy="240" r="42" fill="${circleFill}" />
  <path d="M236 240 H276" stroke="${textColor}" stroke-width="8" stroke-linecap="round"/>

  <circle cx="362" cy="240" r="42" fill="url(#accentGrad)" />
  <path d="M346 248 L352 254 L360 228 H376" stroke="${icon.symbolColor}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>

  <circle cx="150" cy="350" r="42" fill="${circleFill}" />
  <path d="M136 336 L164 364 M164 336 L136 364" stroke="${textColor}" stroke-width="8" stroke-linecap="round"/>

  <circle cx="256" cy="350" r="42" fill="${circleFill}" />
  <path d="M236 350 H276" stroke="${textColor}" stroke-width="8" stroke-linecap="round"/>
  <circle cx="256" cy="334" r="5" fill="${textColor}" />
  <circle cx="256" cy="366" r="5" fill="${textColor}" />

  <!-- Equals key -->
  <rect x="320" y="308" width="84" height="84" rx="30" fill="url(#accentGrad)" />
  <path d="M346 342 H378 M346 358 H378" stroke="${icon.symbolColor}" stroke-width="8" stroke-linecap="round"/>

  <circle cx="430" cy="80" r="8" fill="${icon.accentGradStart}"/>
</svg>`;
}

/**
 * Returns a data URI for the icon SVG
 */
export function getAppIconDataUri(iconId: string): string {
  const icon = APP_ICONS.find((i) => i.id === iconId) || APP_ICONS[0];
  const svg = generateAppIconSvg(icon);
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Sets the active browser tab favicon dynamically
 */
export function updateDocumentFavicon(iconId: string): void {
  try {
    const dataUri = getAppIconDataUri(iconId);
    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = dataUri;
  } catch (e) {
    console.warn('Could not update document favicon:', e);
  }
}
