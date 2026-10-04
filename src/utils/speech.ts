/**
 * Enhanced Speech Synthesis (TTS) Utility for Calculator
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.pro.bd/
 * © 2026 Calculator. All rights reserved.
 *
 * Speaks calculation results and key clicks naturally across multiple languages and accents:
 * - Bengali (Bangladesh / India)
 * - English (US / UK / India)
 * - Hindi
 */

// Bengali digit mapping
const BN_DIGITS: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

export const toBengaliNumerals = (str: string): string => {
  return str.replace(/[0-9]/g, (d) => BN_DIGITS[d] || d);
};

export interface VoiceLanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_VOICE_LANGUAGES: VoiceLanguageOption[] = [
  { code: 'bn-BD', name: 'Bengali (Bangladesh)', nativeName: 'বাংলা (বাংলাদেশ)', flag: '🇧🇩' },
  { code: 'bn-IN', name: 'Bengali (India)', nativeName: 'বাংলা (ভারত)', flag: '🇮🇳' },
  { code: 'en-US', name: 'English (United States)', nativeName: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (United Kingdom)', nativeName: 'English (UK)', flag: '🇬🇧' },
  { code: 'en-IN', name: 'English (India)', nativeName: 'English (India)', flag: '🇮🇳' },
  { code: 'hi-IN', name: 'Hindi (India)', nativeName: 'हिन्दी', flag: '🇮🇳' },
];

export const isSpeechSupported = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
};

export const stopSpeech = (): void => {
  if (isSpeechSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }
};

/**
 * Key label to spoken phrase mapping for voice button click readout
 */
const KEY_SPOKEN_MAP: Record<string, { bn: string; en: string }> = {
  '0': { bn: 'শূন্য', en: 'Zero' },
  '1': { bn: 'এক', en: 'One' },
  '2': { bn: 'দুই', en: 'Two' },
  '3': { bn: 'তিন', en: 'Three' },
  '4': { bn: 'চার', en: 'Four' },
  '5': { bn: 'পাঁচ', en: 'Five' },
  '6': { bn: 'ছয়', en: 'Six' },
  '7': { bn: 'সাত', en: 'Seven' },
  '8': { bn: 'আট', en: 'Eight' },
  '9': { bn: 'নয়', en: 'Nine' },
  '.': { bn: 'দশমিক', en: 'Point' },
  '+': { bn: 'যোগ', en: 'Plus' },
  '−': { bn: 'বিয়োগ', en: 'Minus' },
  '-': { bn: 'বিয়োগ', en: 'Minus' },
  '×': { bn: 'গুণ', en: 'Multiplied by' },
  '*': { bn: 'গুণ', en: 'Multiply' },
  '÷': { bn: 'ভাগ', en: 'Divided by' },
  '/': { bn: 'ভাগ', en: 'Divide' },
  '=': { bn: 'সমান', en: 'Equals' },
  'AC': { bn: 'সব মুছুন', en: 'All Clear' },
  'C': { bn: 'ক্লিয়ার', en: 'Clear' },
  'Backspace': { bn: 'মুছুন', en: 'Delete' },
  '%': { bn: 'শতকরা', en: 'Percent' },
  '^': { bn: 'পাওয়ার', en: 'Power' },
  '√': { bn: 'বর্গমূল', en: 'Square Root' },
  'sin': { bn: 'সাইন', en: 'Sine' },
  'cos': { bn: 'কস', en: 'Cosine' },
  'tan': { bn: 'ট্যান', en: 'Tangent' },
  'ln': { bn: 'ন্যাচারাল লগ', en: 'Natural Log' },
  'log': { bn: 'লগ', en: 'Log' },
  'π': { bn: 'পাই', en: 'Pi' },
  'e': { bn: 'এক্সপোনেনশিয়াল', en: 'E' },
  '(': { bn: 'শুরু বন্ধনী', en: 'Open Bracket' },
  ')': { bn: 'শেষ বন্ধনী', en: 'Close Bracket' },
  '!': { bn: 'ফ্যাক্টোরিয়াল', en: 'Factorial' },
};

/**
 * Speaks an individual button when pressed (if enabled)
 */
export const speakKeyButton = (
  keyLabel: string,
  langCode: string = 'bn-BD',
  pitch: number = 1.0,
  rate: number = 1.1
): void => {
  if (!isSpeechSupported() || !keyLabel) return;
  stopSpeech();

  try {
    const isBn = langCode.startsWith('bn');
    const mapping = KEY_SPOKEN_MAP[keyLabel.trim()];
    const textToSay = mapping ? (isBn ? mapping.bn : mapping.en) : keyLabel;

    const utterance = new SpeechSynthesisUtterance(textToSay);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.lang = langCode;

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const match = voices.find(
        (v) => v.lang.toLowerCase() === langCode.toLowerCase() || v.lang.startsWith(langCode.slice(0, 2))
      );
      if (match) {
        utterance.voice = match;
      }
    }

    window.speechSynthesis.speak(utterance);
  } catch {
    // Ignore speech errors
  }
};

/**
 * Speaks calculation results naturally and fluently
 */
export const speakCalculationResult = (
  resultText: string,
  langCode: string = 'bn-BD',
  pitch: number = 1.0,
  rate: number = 0.95
): boolean => {
  if (!isSpeechSupported() || !resultText) return false;
  stopSpeech();

  try {
    const cleanText = resultText.replace(/,/g, '').trim();
    const isBn = langCode.startsWith('bn');

    // Error handling
    if (cleanText.toLowerCase().includes('error') || cleanText.toLowerCase().includes('ত্রুটি')) {
      const errUtterance = new SpeechSynthesisUtterance(
        isBn ? 'গণনায় ভুল হয়েছে' : 'Calculation Error'
      );
      errUtterance.lang = langCode;
      errUtterance.rate = rate;
      errUtterance.pitch = pitch;
      window.speechSynthesis.speak(errUtterance);
      return true;
    }

    const isNegative = cleanText.startsWith('-') || cleanText.startsWith('−');
    const numPart = cleanText.replace(/^[-−]/, '');

    let spokenMessage = '';
    if (isBn) {
      const prefix = isNegative ? 'মাইনাস ' : '';
      spokenMessage = `ফলাফল ${prefix}${numPart}`;
    } else if (langCode.startsWith('hi')) {
      const prefix = isNegative ? 'माइनस ' : '';
      spokenMessage = `उत्तर है ${prefix}${numPart}`;
    } else {
      const prefix = isNegative ? 'Minus ' : '';
      spokenMessage = `Result is ${prefix}${numPart}`;
    }

    const utterance = new SpeechSynthesisUtterance(spokenMessage);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.lang = langCode;

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const match = voices.find(
        (v) => v.lang.toLowerCase() === langCode.toLowerCase() || v.lang.startsWith(langCode.slice(0, 2))
      );
      if (match) {
        utterance.voice = match;
      } else if (isBn) {
        // Fallback for devices without Bengali TTS voice: speak English cleanly
        utterance.text = `Result is ${cleanText}`;
        utterance.lang = 'en-US';
      }
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('Speech synthesis error:', err);
    return false;
  }
};
