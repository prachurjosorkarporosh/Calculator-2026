/**
 * Speech Synthesis (TTS) Utility for Calculator Results
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.pro.bd/
 * © 2026 Calculator. All rights reserved.
 *
 * Speaks calculation results naturally in Bengali or English via Web Speech API.
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

// Check if speech synthesis is available
export const isSpeechSupported = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
};

// Stop any ongoing speech
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
 * Speaks the calculation result cleanly and pleasantly.
 * @param resultText The result string to speak (e.g. "42", "-15.5", "Error")
 * @param preferredLang 'bn' for Bengali, 'en' for English (default 'bn' with smart fallback)
 */
export const speakCalculationResult = (
  resultText: string,
  preferredLang: 'bn' | 'en' = 'bn'
): boolean => {
  if (!isSpeechSupported() || !resultText) return false;

  stopSpeech();

  try {
    const cleanText = resultText.replace(/,/g, '').trim();

    // Check for error
    if (cleanText.toLowerCase().includes('error') || cleanText.toLowerCase().includes('ত্রুটি')) {
      const errUtterance = new SpeechSynthesisUtterance(
        preferredLang === 'bn' ? 'গণনায় ভুল হয়েছে' : 'Calculation Error'
      );
      errUtterance.lang = preferredLang === 'bn' ? 'bn-BD' : 'en-US';
      window.speechSynthesis.speak(errUtterance);
      return true;
    }

    let spokenMessage = '';
    let targetLangCode = 'en-US';

    if (preferredLang === 'bn') {
      // Bengali speech
      const isNegative = cleanText.startsWith('-') || cleanText.startsWith('−');
      const numPart = cleanText.replace(/^[-−]/, '');
      const prefix = isNegative ? 'মাইনাস ' : '';

      spokenMessage = `ফলাফল ${prefix}${numPart}`;
      targetLangCode = 'bn-BD';
    } else {
      // English speech
      const isNegative = cleanText.startsWith('-') || cleanText.startsWith('−');
      const numPart = cleanText.replace(/^[-−]/, '');
      const prefix = isNegative ? 'Minus ' : '';

      spokenMessage = `Result is ${prefix}${numPart}`;
      targetLangCode = 'en-US';
    }

    const utterance = new SpeechSynthesisUtterance(spokenMessage);
    utterance.rate = 0.95; // Clear and comfortable pacing
    utterance.pitch = 1.0;

    // Pick best available voice if available
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      if (preferredLang === 'bn') {
        const bnVoice = voices.find(
          (v) => v.lang.startsWith('bn') || v.lang.includes('Bengal')
        );
        if (bnVoice) {
          utterance.voice = bnVoice;
          utterance.lang = bnVoice.lang;
        } else {
          // If no Bengali voice installed on user's device/OS, speak English cleanly so user still hears it!
          utterance.text = `Result is ${cleanText}`;
          utterance.lang = 'en-US';
        }
      } else {
        const enVoice = voices.find((v) => v.lang.startsWith('en'));
        if (enVoice) {
          utterance.voice = enVoice;
          utterance.lang = enVoice.lang;
        }
      }
    } else {
      utterance.lang = targetLangCode;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('Speech synthesis error:', err);
    return false;
  }
};
