import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('visa_portal_lang') || 'pt';
  });

  const setLanguage = (lang) => {
    if (lang === 'pt' || lang === 'es') {
      setLanguageState(lang);
      localStorage.setItem('visa_portal_lang', lang);
    }
  };

  const t = (key, params = {}) => {
    let text = translations[language]?.[key] || translations['pt']?.[key] || key;
    Object.keys(params).forEach((paramKey) => {
      text = text.replace(`{${paramKey}}`, params[paramKey]);
    });
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
