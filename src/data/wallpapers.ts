/**
 * 60+ Unique HD Curated Wallpapers Catalog for Prachurjo Calculator
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.dev.cv
 * © 2026 Prachurjo Calculator. All rights reserved.
 *
 * 100% Unique - Zero Duplicate Photos
 * High-performance, categorized responsive wallpapers optimized for mobile phones & desktops.
 */

export interface WallpaperOption {
  id: string;
  name: string;
  nameBn: string;
  url: string;
  category:
    | 'Nature & Landscapes'
    | 'AMOLED & Deep Dark'
    | 'Cyberpunk & Neon'
    | 'Space & Cosmos'
    | 'Abstract & 3D Glass'
    | 'Gradient & Pastel'
    | 'Anime & Dream'
    | 'Architecture & Urban';
  isPopular?: boolean;
}

export const WALLPAPER_CATEGORIES = [
  'All',
  'Nature & Landscapes',
  'AMOLED & Deep Dark',
  'Cyberpunk & Neon',
  'Space & Cosmos',
  'Abstract & 3D Glass',
  'Gradient & Pastel',
  'Anime & Dream',
  'Architecture & Urban',
] as const;

export const CURATED_WALLPAPERS: WallpaperOption[] = [
  // 1. Nature & Landscapes (12 Unique)
  {
    id: 'alpine-sunset',
    name: 'Alpine Mountain Twilight',
    nameBn: 'আলপাইন পর্বত গোধূলি',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
    category: 'Nature & Landscapes',
    isPopular: true,
  },
  {
    id: 'ocean-waves',
    name: 'Deep Blue Wave',
    nameBn: 'নীল সমুদ্র তরঙ্গ',
    url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=1200&auto=format&fit=crop',
    category: 'Nature & Landscapes',
    isPopular: true,
  },
  {
    id: 'desert-dunes',
    name: 'Golden Sahara Dunes',
    nameBn: 'সোনালী সাহারা বালিয়াড়ি',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200&auto=format&fit=crop',
    category: 'Nature & Landscapes',
  },
  {
    id: 'cherry-blossom',
    name: 'Sakura Night Bloom',
    nameBn: 'চেরি ব্লসম রাতের সুবাস',
    url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=1200&auto=format&fit=crop',
    category: 'Nature & Landscapes',
    isPopular: true,
  },
  {
    id: 'misty-forest',
    name: 'Emerald Misty Pine Forest',
    nameBn: 'কুয়াশাচ্ছন্ন পাইন অরণ্য',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop',
    category: 'Nature & Landscapes',
  },
  {
    id: 'mountain-lake',
    name: 'Glacial Turquoise Lake',
    nameBn: 'হিমবাহের ফিরোজা হ্রদ',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    category: 'Nature & Landscapes',
  },
  {
    id: 'golden-field',
    name: 'Tuscany Sunset Glow',
    nameBn: 'টাস্কানি সূর্যাস্তের আভা',
    url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop',
    category: 'Nature & Landscapes',
  },
  {
    id: 'bamboo-zen',
    name: 'Kyoto Bamboo Grove',
    nameBn: 'কিয়োটো বাঁশবাগান',
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop',
    category: 'Nature & Landscapes',
  },
  {
    id: 'tropical-palms',
    name: 'Paradise Palm Twilight',
    nameBn: 'পাম গাছ ও গোধূলি আকাশ',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    category: 'Nature & Landscapes',
  },
  {
    id: 'fjord-norway',
    name: 'Nordic Fjord Reflections',
    nameBn: 'নরওয়ের শান্ত ফিয়র্ড',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200&auto=format&fit=crop',
    category: 'Nature & Landscapes',
  },
  {
    id: 'waterfall-iceland',
    name: 'Mighty Seljalandsfoss',
    nameBn: 'আইসল্যান্ডের সুবিশাল জলপ্রপাত',
    url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=1200&auto=format&fit=crop',
    category: 'Nature & Landscapes',
  },
  {
    id: 'autumn-leaves',
    name: 'Vermont Maple Autumn',
    nameBn: 'শরতের লাল ম্যাপেল পাতা',
    url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=1200&auto=format&fit=crop',
    category: 'Nature & Landscapes',
  },

  // 2. AMOLED & Deep Dark (10 Unique)
  {
    id: 'amoled-obsidian',
    name: 'Pure Obsidian Void',
    nameBn: 'অ্যাবসলিউট ব্ল্যাক ওবসিডিয়ান',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop',
    category: 'AMOLED & Deep Dark',
    isPopular: true,
  },
  {
    id: 'dark-mineral',
    name: 'Black Volcanic Basalt',
    nameBn: 'আগ্নেয়গিরির কালো ব্যাসাল্ট',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200&auto=format&fit=crop',
    category: 'AMOLED & Deep Dark',
    isPopular: true,
  },
  {
    id: 'carbon-fiber',
    name: 'Matte Carbon Texture',
    nameBn: 'ম্যাট কার্বন টেক্সচার',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
    category: 'AMOLED & Deep Dark',
  },
  {
    id: 'dark-nebula',
    name: 'Nocturnal Deep Space',
    nameBn: 'নিশাচর মহাকাশ শূন্যতা',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
    category: 'AMOLED & Deep Dark',
    isPopular: true,
  },
  {
    id: 'charcoal-monolith',
    name: 'Minimal Charcoal Geometry',
    nameBn: 'ন্যূনতম চারকোল জ্যামিতি',
    url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop',
    category: 'AMOLED & Deep Dark',
  },
  {
    id: 'dark-botanical',
    name: 'Monstera Shadow Leaf',
    nameBn: 'মনস্টেরা ছায়া পাতা',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop',
    category: 'AMOLED & Deep Dark',
  },
  {
    id: 'amoled-swirl',
    name: 'Dark Ink Vortex',
    nameBn: 'কালো কালির ঘূর্ণি',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    category: 'AMOLED & Deep Dark',
  },
  {
    id: 'dark-minimal-arch',
    name: 'Brutalist Monolith Shadow',
    nameBn: 'ব্রুটালিস্ট মনোলিথ আর্কিটেকচার',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop',
    category: 'AMOLED & Deep Dark',
  },
  {
    id: 'dark-ocean-abyss',
    name: 'Midnight Ocean Trench',
    nameBn: 'মধ্যরাতের গভীর মহাসমুদ্র',
    url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1200&auto=format&fit=crop',
    category: 'AMOLED & Deep Dark',
  },
  {
    id: 'shadow-minimalism',
    name: 'Subtle Beam & Shadow',
    nameBn: 'আলো ও অন্ধকারের সুরভী',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
    category: 'AMOLED & Deep Dark',
  },

  // 3. Cyberpunk & Neon (8 Unique)
  {
    id: 'neon-city-rain',
    name: 'Hong Kong Neon Rain',
    nameBn: 'হংকং নিয়ন বৃষ্টি',
    url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1200&auto=format&fit=crop',
    category: 'Cyberpunk & Neon',
    isPopular: true,
  },
  {
    id: 'cyber-terminal',
    name: 'Matrix Cyber Code Flow',
    nameBn: 'ম্যাট্রিক্স সাইবার কোড',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
    category: 'Cyberpunk & Neon',
    isPopular: true,
  },
  {
    id: 'akihabara-lights',
    name: 'Tokyo Cyber Akihabara',
    nameBn: 'টোকিও আকিহাবারার রাতের আলো',
    url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1200&auto=format&fit=crop',
    category: 'Cyberpunk & Neon',
  },
  {
    id: 'synthwave-horizon',
    name: 'Retro 80s Synthwave Grid',
    nameBn: 'সিন্থওয়েভ দিগন্ত গ্রিড',
    url: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=1200&auto=format&fit=crop',
    category: 'Cyberpunk & Neon',
    isPopular: true,
  },
  {
    id: 'neon-violet-tubes',
    name: 'Electric Ultraviolet Tubes',
    nameBn: 'আল্ট্রাভায়োলেট নিয়ন টিউব',
    url: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1200&auto=format&fit=crop',
    category: 'Cyberpunk & Neon',
  },
  {
    id: 'arcade-glow',
    name: 'Retro Arcade Cabinet Glow',
    nameBn: 'রেট্রো আর্কেড নিয়ন আলো',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
    category: 'Cyberpunk & Neon',
  },
  {
    id: 'cyber-battlestation',
    name: 'Futuristic Battle Station',
    nameBn: 'ফিউচারিস্টিক ওয়ার্কস্টেশন',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
    category: 'Cyberpunk & Neon',
  },
  {
    id: 'neon-geometric',
    name: 'Prismatic Laser Grid',
    nameBn: 'প্রিজম্যাটিক লেজার বিম',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
    category: 'Cyberpunk & Neon',
  },

  // 4. Space & Cosmos (8 Unique)
  {
    id: 'hubble-deep-nebula',
    name: 'Deep Hubble Cosmic Nebula',
    nameBn: 'গভীর মহাজাগতিক নেবুলা',
    url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1200&auto=format&fit=crop',
    category: 'Space & Cosmos',
    isPopular: true,
  },
  {
    id: 'orion-cloud',
    name: 'Orion Stellar Nursery',
    nameBn: 'কালপুরুষ নক্ষত্র নার্সারি',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop',
    category: 'Space & Cosmos',
    isPopular: true,
  },
  {
    id: 'starlight-mountains',
    name: 'Milky Way Alpine Panorama',
    nameBn: 'ছায়াপথ ও পার্বত্য দিগন্ত',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop',
    category: 'Space & Cosmos',
  },
  {
    id: 'earth-orbit',
    name: 'Blue Planet Orbital Horizon',
    nameBn: 'মহাকাশ থেকে নীল পৃথিবী',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    category: 'Space & Cosmos',
    isPopular: true,
  },
  {
    id: 'saturn-rings',
    name: 'Deep Space Orbit',
    nameBn: 'গভীর মহাকাশ ও গ্রহবলয়',
    url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1200&auto=format&fit=crop',
    category: 'Space & Cosmos',
  },
  {
    id: 'supernova-stellar',
    name: 'Cosmic Stellar Flare',
    nameBn: 'মহাজাগতিক নক্ষত্র বিস্ফোরণ',
    url: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=1200&auto=format&fit=crop',
    category: 'Space & Cosmos',
  },
  {
    id: 'solar-eclipse',
    name: 'Total Solar Eclipse Corona',
    nameBn: 'পূর্ণগ্রাস সূর্যগ্রহণ করোনা',
    url: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?q=80&w=1200&auto=format&fit=crop',
    category: 'Space & Cosmos',
  },
  {
    id: 'stargazer-arch',
    name: 'Desert Stargazer Night',
    nameBn: 'মরুভূমির তারকারাজি আকাশ',
    url: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=1200&auto=format&fit=crop',
    category: 'Space & Cosmos',
  },

  // 5. Abstract & 3D Glass (8 Unique)
  {
    id: 'glass-orb-3d',
    name: 'Holographic Glass Sphere',
    nameBn: 'হলোগ্রাফিক কাঁচের গোলক',
    url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop',
    category: 'Abstract & 3D Glass',
    isPopular: true,
  },
  {
    id: 'prismatic-caustics',
    name: 'Prismatic Light Refraction',
    nameBn: 'প্রিজম আলোর বিচ্ছুরণ',
    url: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1200&auto=format&fit=crop',
    category: 'Abstract & 3D Glass',
    isPopular: true,
  },
  {
    id: 'fluid-wave-hologram',
    name: 'Liquid Holographic Swirl',
    nameBn: 'তরল হলোগ্রাফিক তরঙ্গ',
    url: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=1200&auto=format&fit=crop',
    category: 'Abstract & 3D Glass',
  },
  {
    id: 'silk-gradient-waves',
    name: 'Volumetric Silk Fluid',
    nameBn: 'রেশমি তরল ভলিউম্যাট্রিক ওয়েভ',
    url: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1200&auto=format&fit=crop',
    category: 'Abstract & 3D Glass',
  },
  {
    id: 'minimal-sculpture-3d',
    name: 'Minimalist Spatial Form',
    nameBn: 'ন্যূনতম স্থানিক ভাস্কর্য',
    url: 'https://images.unsplash.com/photo-1633493106115-0d40f8e12156?q=80&w=1200&auto=format&fit=crop',
    category: 'Abstract & 3D Glass',
  },
  {
    id: 'iridescent-sheen',
    name: 'Liquid Pearlescent Sheen',
    nameBn: 'মুক্তার আভা তরল প্রতিফলন',
    url: 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?q=80&w=1200&auto=format&fit=crop',
    category: 'Abstract & 3D Glass',
  },
  {
    id: 'glass-prism-facets',
    name: 'Crystalline Geometric Facets',
    nameBn: 'স্ফটিক জ্যামিতিক তল',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
    category: 'Abstract & 3D Glass',
  },
  {
    id: 'acrylic-fluid-swirl',
    name: 'Fluid Chrome Ripples',
    nameBn: 'তরল ক্রোম তরঙ্গমালার ধারা',
    url: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?q=80&w=1200&auto=format&fit=crop',
    category: 'Abstract & 3D Glass',
  },

  // 6. Gradient & Pastel (8 Unique)
  {
    id: 'warm-sunset-gradient',
    name: 'Peach Sunset Glow',
    nameBn: 'পীচ সূর্যাস্ত মসৃণ গ্রেডিয়েন্ট',
    url: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1200&auto=format&fit=crop',
    category: 'Gradient & Pastel',
    isPopular: true,
  },
  {
    id: 'pastel-rainbow-mesh',
    name: 'Rainbow Aura Mesh',
    nameBn: 'রংধনু অরা প্যাস্টেল ব্লেন্ড',
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1200&auto=format&fit=crop',
    category: 'Gradient & Pastel',
    isPopular: true,
  },
  {
    id: 'azure-indigo-gradient',
    name: 'Azure Deep Indigo',
    nameBn: 'নীল ও আসমানি গভীরতা',
    url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1200&auto=format&fit=crop',
    category: 'Gradient & Pastel',
  },
  {
    id: 'rose-coral-gradient',
    name: 'Rose Coral Dusk',
    nameBn: 'গোলাপী কোরাল সন্ধ্যার আভা',
    url: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?q=80&w=1200&auto=format&fit=crop',
    category: 'Gradient & Pastel',
  },
  {
    id: 'emerald-mint-gradient',
    name: 'Sage & Emerald Mint',
    nameBn: 'সেজ ও পান্না পুদিনা পাতা',
    url: 'https://images.unsplash.com/photo-1557682268-e4b2d35889a7?q=80&w=1200&auto=format&fit=crop',
    category: 'Gradient & Pastel',
  },
  {
    id: 'lavender-dream-mesh',
    name: 'Lavender Dusk Mist',
    nameBn: 'ল্যাভেন্ডার সন্ধ্যার কুয়াশা',
    url: 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?q=80&w=1200&auto=format&fit=crop',
    category: 'Gradient & Pastel',
  },
  {
    id: 'warm-lemon-dawn',
    name: 'Lemon Citrus Twilight',
    nameBn: 'লেবুর হলুদ প্রভাত কিরণ',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
    category: 'Gradient & Pastel',
  },
  {
    id: 'frost-ice-gradient',
    name: 'Alpine Glacial Frost',
    nameBn: 'তুহিন বরফের স্বচ্ছতা',
    url: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?q=80&w=1200&auto=format&fit=crop',
    category: 'Gradient & Pastel',
  },

  // 7. Anime & Dream (6 Unique)
  {
    id: 'ghibli-meadow',
    name: 'Summer Ghibli Meadow',
    nameBn: 'গ্রীষ্মের শান্ত ঘাসভূমি',
    url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop',
    category: 'Anime & Dream',
    isPopular: true,
  },
  {
    id: 'tokyo-lantern-night',
    name: 'Warm Paper Lantern Alley',
    nameBn: 'উষ্ণ কাগজের লণ্ঠন গলি',
    url: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=80&w=1200&auto=format&fit=crop',
    category: 'Anime & Dream',
    isPopular: true,
  },
  {
    id: 'fuji-cherry-blossom',
    name: 'Mount Fuji Spring Bloom',
    nameBn: 'ফুজি পর্বত ও চেরি ব্লসম',
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop',
    category: 'Anime & Dream',
  },
  {
    id: 'shrine-sunset-torii',
    name: 'Sacred Torii Gate Sunset',
    nameBn: 'পবিত্র তোরিই গেট সূর্যাস্ত',
    url: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?q=80&w=1200&auto=format&fit=crop',
    category: 'Anime & Dream',
  },
  {
    id: 'starry-anime-lake',
    name: 'Twilight Reflection Lake',
    nameBn: 'গোধূলি আকাশের শান্ত হ্রদ',
    url: 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?q=80&w=1200&auto=format&fit=crop',
    category: 'Anime & Dream',
  },
  {
    id: 'winter-kyoto-pagoda',
    name: 'Winter Kyoto Snow Pagoda',
    nameBn: 'শীতের কিয়োটো তুষার প্যাগোডা',
    url: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?q=80&w=1200&auto=format&fit=crop',
    category: 'Anime & Dream',
  },

  // 8. Architecture & Urban (6 Unique)
  {
    id: 'chicago-night-skyline',
    name: 'Metropolis Skyline Night',
    nameBn: 'মহানগরীর রাতের স্কাইলাইন',
    url: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?q=80&w=1200&auto=format&fit=crop',
    category: 'Architecture & Urban',
    isPopular: true,
  },
  {
    id: 'glass-tower-geometry',
    name: 'Futuristic Glass Skyscraper',
    nameBn: 'ফিউচারিস্টিক গ্লাস স্কাইস্ক্র্যাপার',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    category: 'Architecture & Urban',
  },
  {
    id: 'minimal-spiral-stair',
    name: 'Pure White Spiral Form',
    nameBn: 'সাদা বৃত্তাকার সিঁড়ির নান্দনিকতা',
    url: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?q=80&w=1200&auto=format&fit=crop',
    category: 'Architecture & Urban',
  },
  {
    id: 'tokyo-geometric-hall',
    name: 'Tokyo Modern Architecture Hall',
    nameBn: 'টোকিও মডার্ন জ্যামিতিক হল',
    url: 'https://images.unsplash.com/photo-1502472584811-0a2f2feb8968?q=80&w=1200&auto=format&fit=crop',
    category: 'Architecture & Urban',
  },
  {
    id: 'urban-traffic-stream',
    name: 'Urban Light Stream Lines',
    nameBn: 'শহরের আলো ও গতির রেখা',
    url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1200&auto=format&fit=crop',
    category: 'Architecture & Urban',
  },
  {
    id: 'cyber-urban-bridge',
    name: 'Illuminated Suspension Bridge',
    nameBn: 'আলোকিত কেবল ব্রিজ ও নদী',
    url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1200&auto=format&fit=crop',
    category: 'Architecture & Urban',
  },
];
