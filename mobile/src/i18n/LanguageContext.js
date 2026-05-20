import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { NotoNastaliqUrdu_400Regular, NotoNastaliqUrdu_700Bold } from '@expo-google-fonts/noto-nastaliq-urdu';
import { translations } from './translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState('en');
  const [fontsLoaded] = useFonts({
    Inter: Inter_400Regular,
    InterMedium: Inter_500Medium,
    InterSemiBold: Inter_600SemiBold,
    InterBold: Inter_700Bold,
    NotoNastaliqUrdu: NotoNastaliqUrdu_400Regular,
    NotoNastaliqUrduBold: NotoNastaliqUrdu_700Bold,
  });

  useEffect(() => {
    // Load stored language preference
    const loadLanguage = async () => {
      try {
        const stored = await AsyncStorage.getItem('user_lang');
        if (stored === 'en' || stored === 'ur') {
          setCurrentLang(stored);
        }
      } catch (err) {
        console.warn('Failed to load language preference', err);
      }
    };
    loadLanguage();
  }, []);

  const toggleLanguage = async () => {
    const nextLang = currentLang === 'en' ? 'ur' : 'en';
    setCurrentLang(nextLang);
    try {
      await AsyncStorage.setItem('user_lang', nextLang);
    } catch (err) {
      console.warn('Failed to save language preference', err);
    }
  };

  const t = (key) => {
    return translations[currentLang]?.[key] || translations['en']?.[key] || key;
  };

  const isRTL = currentLang === 'ur';

  // Dynamic RTL styles utility
  const rtlText = isRTL ? { textAlign: 'right', writingDirection: 'rtl' } : { textAlign: 'left', writingDirection: 'ltr' };
  const rtlRow = isRTL ? { flexDirection: 'row-reverse' } : { flexDirection: 'row' };

  return (
    <LanguageContext.Provider value={{ currentLang, toggleLanguage, t, isRTL, fontsLoaded, rtlText, rtlRow }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
