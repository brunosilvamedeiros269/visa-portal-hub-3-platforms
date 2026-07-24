import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // Interface pública em espanhol (fixo). Ver pedido do produto: "toda a interface deve estar em espanhol".
  const [language, setLanguageState] = useState('es');

  const setLanguage = () => {
    // Idioma fixo em espanhol; seletor removido do header.
    setLanguageState('es');
  };

  const t = (key, params = {}) => {
    let text = translations['es']?.[key] || translations['pt']?.[key] || key;
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
