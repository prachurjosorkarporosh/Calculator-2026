/**
 * Voice Speech to Math Expression Parser
 * Supports Bengali (বাংলা) and English natural speech calculation commands
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.pro.bd/
 * © 2026 Prachurjo Calculator. All rights reserved.
 */

export interface VoiceParseResult {
  action: 'EVALUATE' | 'INPUT' | 'CLEAR';
  expression: string;
  transcript: string;
  detectedLang: 'bn-BD' | 'en-US';
}

const BENGALI_NUM_MAP: Record<string, string> = {
  '০': '0',
  '১': '1',
  '২': '2',
  '৩': '3',
  '৪': '4',
  '৫': '5',
  '৬': '6',
  '৭': '7',
  '৮': '8',
  '৯': '9',
  'শূন্য': '0',
  'এক': '1',
  'দুই': '2',
  'তিন': '3',
  'চার': '4',
  'পাঁচ': '5',
  'ছয়': '6',
  'সাত': '7',
  'আট': '8',
  'নয়': '9',
  'দশ': '10',
  'এগারো': '11',
  'বারো': '12',
  'তেরো': '13',
  'চৌদ্দ': '14',
  'পনেরো': '15',
  'ষোল': '16',
  'সতেরো': '17',
  'আঠারো': '18',
  'উনিশ': '19',
  'বিশ': '20',
  'একুশ': '21',
  'বাইশ': '22',
  'তেইশ': '23',
  'চব্বিশ': '24',
  'পঁচিশ': '25',
  'ছাব্বিশ': '26',
  'সাতাশ': '27',
  'আঠাশ': '28',
  'উনত্রিশ': '29',
  'ত্রিশ': '30',
  'চল্লিশ': '40',
  'পঞ্চাশ': '50',
  'ষাট': '60',
  'সত্তর': '70',
  'আশি': '80',
  'নব্বই': '90',
  'একশত': '100',
  'একশো': '100',
  'দুইশো': '200',
  'তিনশো': '300',
  'চারশো': '400',
  'পাঁচশো': '500',
};

const ENGLISH_NUM_MAP: Record<string, string> = {
  zero: '0',
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
  ten: '10',
  eleven: '11',
  twelve: '12',
  thirteen: '13',
  fourteen: '14',
  fifteen: '15',
  sixteen: '16',
  seventeen: '17',
  eighteen: '18',
  nineteen: '19',
  twenty: '20',
  thirty: '30',
  forty: '40',
  fifty: '50',
  sixty: '60',
  seventy: '70',
  eighty: '80',
  ninety: '90',
  hundred: '100',
  thousand: '1000',
  million: '1000000',
};

/**
 * Parses spoken natural language string into a clean mathematical expression
 */
export function parseSpokenMath(rawTranscript: string): VoiceParseResult {
  const clean = rawTranscript.trim();
  const lower = clean.toLowerCase();

  // Detect Bengali characters
  const isBengali = /[\u0980-\u09FF]/.test(clean);
  const detectedLang: 'bn-BD' | 'en-US' = isBengali ? 'bn-BD' : 'en-US';

  // Check for clear command
  if (
    lower.includes('ক্লিয়ার') ||
    lower.includes('মুছে') ||
    lower.includes('মুছে ফেলো') ||
    lower.includes('clear') ||
    lower.includes('reset') ||
    lower.includes('all clear')
  ) {
    return {
      action: 'CLEAR',
      expression: '',
      transcript: clean,
      detectedLang,
    };
  }

  let text = lower;

  // Replace Bengali digits directly
  text = text.replace(/[০-৯]/g, (digit) => BENGALI_NUM_MAP[digit] || digit);

  // Normalize Bengali words
  for (const [bnWord, numVal] of Object.entries(BENGALI_NUM_MAP)) {
    const reg = new RegExp(`(^|\\s)${bnWord}(\\s|$)`, 'gi');
    text = text.replace(reg, `$1${numVal}$2`);
  }

  // Normalize English words
  for (const [enWord, numVal] of Object.entries(ENGLISH_NUM_MAP)) {
    const reg = new RegExp(`(^|\\s)${enWord}(\\s|$)`, 'gi');
    text = text.replace(reg, `$1${numVal}$2`);
  }

  // Replace Operators - Bengali
  text = text
    .replace(/যোগ|প্লাস|সাথে|এবং/gi, '+')
    .replace(/বিয়োগ|মাইনাস|বাদ/gi, '−')
    .replace(/গুণ|পূরণ|বার|ইনটু/gi, '×')
    .replace(/ভাগ|বাই/gi, '÷')
    .replace(/দশমিক|পয়েন্ট/gi, '.')
    .replace(/শতাংশ|শতকরা|পারসেন্ট/gi, '%')
    .replace(/বর্গমূল|রুট/gi, '√(')
    .replace(/পাওয়ার/gi, '^')
    .replace(/সাইন/gi, 'sin(')
    .replace(/কস/gi, 'cos(')
    .replace(/ট্যান/gi, 'tan(')
    .replace(/পাই/gi, 'π');

  // Replace Operators - English
  text = text
    .replace(/plus|add|and/gi, '+')
    .replace(/minus|subtract|take away/gi, '−')
    .replace(/multiplied by|times|into|multiplied|multiply/gi, '×')
    .replace(/divided by|divide by|divided|over/gi, '÷')
    .replace(/point|dot/gi, '.')
    .replace(/percent of|percent|percentage/gi, '%')
    .replace(/square root of|square root|root/gi, '√(')
    .replace(/to the power of|to the power|power/gi, '^')
    .replace(/sine of|sine|sin/gi, 'sin(')
    .replace(/cosine of|cosine|cos/gi, 'cos(')
    .replace(/tangent of|tangent|tan/gi, 'tan(')
    .replace(/natural log of|natural log|ln of|ln/gi, 'ln(')
    .replace(/log of|logarithm of|logarithm|log/gi, 'log(')
    .replace(/pi/gi, 'π');

  // Remove common question phrases & filler prepositions in Bengali & English
  text = text
    .replace(/সমান কত|হিসাব করো|সমান|কত হয়|কত হবে/gi, '')
    .replace(/equals|equal to|equal|what is|how much is|calculate|result/gi, '')
    .replace(/\b(of|the|is|in|please)\b/gi, '');

  // Keep only valid calculator characters
  // 0-9, +, −, -, ×, *, ÷, /, ., %, (, ), ^, √, π, e, s, i, n, c, o, t, a
  text = text
    .replace(/\*/g, '×')
    .replace(/\//g, '÷')
    .replace(/-/g, '−')
    .replace(/\s+/g, '');

  // Filter out stray non-calculator characters
  let parsed = '';
  for (const ch of text) {
    if (/[0-9+−×÷.%()^√π!esincotalgqr]/.test(ch)) {
      parsed += ch;
    }
  }

  // Auto-close any unclosed parenthesis e.g. √(16 -> √(16)
  const openParens = (parsed.match(/\(/g) || []).length;
  const closeParens = (parsed.match(/\)/g) || []).length;
  if (openParens > closeParens) {
    parsed += ')'.repeat(openParens - closeParens);
  }

  return {
    action: parsed.length > 0 ? 'EVALUATE' : 'INPUT',
    expression: parsed,
    transcript: clean,
    detectedLang,
  };
}

/**
 * Text-to-speech announcement of the calculation result
 */
export function speakResult(
  result: string,
  lang: 'bn-BD' | 'en-US' = 'bn-BD',
  enabled = true
) {
  if (!enabled || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  const isBengali = lang === 'bn-BD';
  const cleanNumber = result.replace(/,/g, '');

  let textToSpeak = '';
  if (isBengali) {
    textToSpeak = `ফলাফল হলো ${cleanNumber}`;
  } else {
    textToSpeak = `The result is ${cleanNumber}`;
  }

  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  utterance.lang = isBengali ? 'bn-BD' : 'en-US';
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  window.speechSynthesis.speak(utterance);
}
