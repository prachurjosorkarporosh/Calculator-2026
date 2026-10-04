/**
 * 50+ Curated Fonts Directory for Prachurjo Calculator
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Prachurjo Calculator. All rights reserved.
 */

export interface FontOption {
  id: string;
  name: string;
  family: string;
  category: 'Modern Sans' | 'Tech & Mono' | 'Futuristic' | 'Editorial Serif' | 'Handwriting';
  sample: string;
  isPinned?: boolean;
}

export const SYSTEM_FONT: FontOption = {
  id: 'system',
  name: 'Phone System Font (ডিফল্ট ফোন ফন্ট)',
  family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  category: 'Modern Sans',
  sample: '123,456.78 × 90',
  isPinned: true,
};

export const FONTS_CATALOG: FontOption[] = [
  SYSTEM_FONT,
  // Modern Sans (18)
  { id: 'roboto', name: 'Roboto', family: "'Roboto', sans-serif", category: 'Modern Sans', sample: '123,456.78 × 90' },
  { id: 'inter', name: 'Inter', family: "'Inter', sans-serif", category: 'Modern Sans', sample: '123,456.78 × 90' },
  { id: 'poppins', name: 'Poppins', family: "'Poppins', sans-serif", category: 'Modern Sans', sample: '123,456.78 × 90' },
  { id: 'outfit', name: 'Outfit', family: "'Outfit', sans-serif", category: 'Modern Sans', sample: '123,456.78 × 90' },
  { id: 'plus-jakarta-sans', name: 'Plus Jakarta Sans', family: "'Plus Jakarta Sans', sans-serif", category: 'Modern Sans', sample: '123,456.78 × 90' },
  { id: 'montserrat', name: 'Montserrat', family: "'Montserrat', sans-serif", category: 'Modern Sans', sample: '123,456.78 × 90' },
  { id: 'dm-sans', name: 'DM Sans', family: "'DM Sans', sans-serif", category: 'Modern Sans', sample: '123,456.78 × 90' },
  { id: 'lexend', name: 'Lexend', family: "'Lexend', sans-serif", category: 'Modern Sans', sample: '123,456.78 × 90' },
  { id: 'sora', name: 'Sora', family: "'Sora', sans-serif", category: 'Modern Sans', sample: '123,456.78 × 90' },
  { id: 'raleway', name: 'Raleway', family: "'Raleway', sans-serif", category: 'Modern Sans', sample: '123,456.78 × 90' },
  { id: 'nunito', name: 'Nunito', family: "'Nunito', sans-serif", category: 'Modern Sans', sample: '123,456.78 × 90' },
  { id: 'work-sans', name: 'Work Sans', family: "'Work Sans', sans-serif", category: 'Modern Sans', sample: '123,456.78 × 90' },
  { id: 'figtree', name: 'Figtree', family: "'Figtree', sans-serif", category: 'Modern Sans', sample: '123,456.78 × 90' },
  { id: 'urbanist', name: 'Urbanist', family: "'Urbanist', sans-serif", category: 'Modern Sans', sample: '123,456.78 × 90' },
  { id: 'rubik', name: 'Rubik', family: "'Rubik', sans-serif", category: 'Modern Sans', sample: '123,456.78 × 90' },
  { id: 'albert-sans', name: 'Albert Sans', family: "'Albert Sans', sans-serif", category: 'Modern Sans', sample: '123,456.78 × 90' },
  { id: 'quicksand', name: 'Quicksand', family: "'Quicksand', sans-serif", category: 'Modern Sans', sample: '123,456.78 × 90' },
  { id: 'epilogue', name: 'Epilogue', family: "'Epilogue', sans-serif", category: 'Modern Sans', sample: '123,456.78 × 90' },

  // Tech & Mono (10)
  { id: 'jetbrains-mono', name: 'JetBrains Mono', family: "'JetBrains Mono', monospace", category: 'Tech & Mono', sample: '123,456.78 × 90' },
  { id: 'fira-code', name: 'Fira Code', family: "'Fira Code', monospace", category: 'Tech & Mono', sample: '123,456.78 × 90' },
  { id: 'space-mono', name: 'Space Mono', family: "'Space Mono', monospace", category: 'Tech & Mono', sample: '123,456.78 × 90' },
  { id: 'roboto-mono', name: 'Roboto Mono', family: "'Roboto Mono', monospace", category: 'Tech & Mono', sample: '123,456.78 × 90' },
  { id: 'inconsolata', name: 'Inconsolata', family: "'Inconsolata', monospace", category: 'Tech & Mono', sample: '123,456.78 × 90' },
  { id: 'source-code-pro', name: 'Source Code Pro', family: "'Source Code Pro', monospace", category: 'Tech & Mono', sample: '123,456.78 × 90' },
  { id: 'share-tech-mono', name: 'Share Tech Mono', family: "'Share Tech Mono', monospace", category: 'Tech & Mono', sample: '123,456.78 × 90' },
  { id: 'anonymous-pro', name: 'Anonymous Pro', family: "'Anonymous Pro', monospace", category: 'Tech & Mono', sample: '123,456.78 × 90' },
  { id: 'vt323', name: 'VT323 (Retro Terminal)', family: "'VT323', monospace", category: 'Tech & Mono', sample: '123,456.78 × 90' },
  { id: 'major-mono', name: 'Major Mono Display', family: "'Major Mono Display', monospace", category: 'Tech & Mono', sample: '123,456.78 × 90' },

  // Futuristic & Digital Display (12)
  { id: 'orbitron', name: 'Orbitron', family: "'Orbitron', sans-serif", category: 'Futuristic', sample: '123,456.78 × 90' },
  { id: 'audiowide', name: 'Audiowide (Default)', family: "'Audiowide', cursive", category: 'Futuristic', sample: '123,456.78 × 90' },
  { id: 'exo-2', name: 'Exo 2', family: "'Exo 2', sans-serif", category: 'Futuristic', sample: '123,456.78 × 90' },
  { id: 'quantico', name: 'Quantico', family: "'Quantico', sans-serif", category: 'Futuristic', sample: '123,456.78 × 90' },
  { id: 'chakra-petch', name: 'Chakra Petch', family: "'Chakra Petch', sans-serif", category: 'Futuristic', sample: '123,456.78 × 90' },
  { id: 'michroma', name: 'Michroma', family: "'Michroma', sans-serif", category: 'Futuristic', sample: '123,456.78 × 90' },
  { id: 'rajdhani', name: 'Rajdhani', family: "'Rajdhani', sans-serif", category: 'Futuristic', sample: '123,456.78 × 90' },
  { id: 'electrolize', name: 'Electrolize', family: "'Electrolize', sans-serif", category: 'Futuristic', sample: '123,456.78 × 90' },
  { id: 'syne', name: 'Syne', family: "'Syne', sans-serif", category: 'Futuristic', sample: '123,456.78 × 90' },
  { id: 'bruno-ace-sc', name: 'Bruno Ace SC', family: "'Bruno Ace SC', cursive", category: 'Futuristic', sample: '123,456.78 × 90' },
  { id: 'righteous', name: 'Righteous', family: "'Righteous', cursive", category: 'Futuristic', sample: '123,456.78 × 90' },
  { id: 'press-start-2p', name: 'Press Start 2P (8-Bit)', family: "'Press Start 2P', monospace", category: 'Futuristic', sample: '123,456.78 × 90' },

  // Editorial Serif (8)
  { id: 'playfair', name: 'Playfair Display', family: "'Playfair Display', serif", category: 'Editorial Serif', sample: '123,456.78 × 90' },
  { id: 'cinzel', name: 'Cinzel', family: "'Cinzel', serif", category: 'Editorial Serif', sample: '123,456.78 × 90' },
  { id: 'merriweather', name: 'Merriweather', family: "'Merriweather', serif", category: 'Editorial Serif', sample: '123,456.78 × 90' },
  { id: 'cormorant', name: 'Cormorant Garamond', family: "'Cormorant Garamond', serif", category: 'Editorial Serif', sample: '123,456.78 × 90' },
  { id: 'lora', name: 'Lora', family: "'Lora', serif", category: 'Editorial Serif', sample: '123,456.78 × 90' },
  { id: 'bodoni-moda', name: 'Bodoni Moda', family: "'Bodoni Moda', serif", category: 'Editorial Serif', sample: '123,456.78 × 90' },
  { id: 'crimson-text', name: 'Crimson Text', family: "'Crimson Text', serif", category: 'Editorial Serif', sample: '123,456.78 × 90' },
  { id: 'spectral', name: 'Spectral', family: "'Spectral', serif", category: 'Editorial Serif', sample: '123,456.78 × 90' },

  // Handwriting & Playful (6)
  { id: 'caveat', name: 'Caveat', family: "'Caveat', cursive", category: 'Handwriting', sample: '123,456.78 × 90' },
  { id: 'pacifico', name: 'Pacifico', family: "'Pacifico', cursive", category: 'Handwriting', sample: '123,456.78 × 90' },
  { id: 'kalam', name: 'Kalam', family: "'Kalam', cursive", category: 'Handwriting', sample: '123,456.78 × 90' },
  { id: 'comfortaa', name: 'Comfortaa', family: "'Comfortaa', cursive", category: 'Handwriting', sample: '123,456.78 × 90' },
  { id: 'fredoka', name: 'Fredoka', family: "'Fredoka', sans-serif", category: 'Handwriting', sample: '123,456.78 × 90' },
  { id: 'patrick-hand', name: 'Patrick Hand', family: "'Patrick Hand', cursive", category: 'Handwriting', sample: '123,456.78 × 90' },
];

export const DEFAULT_FONT_ID = 'system';
