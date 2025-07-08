import { useState, useMemo, useCallback } from 'react';
import { LanguageContext } from './LanguageContext';

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('focuslist-lang') || 'ja');

  const changeLanguage = useCallback((newLang) => {
    if (['ja', 'en'].includes(newLang)) {
      setLang(newLang);
      localStorage.setItem('focuslist-lang', newLang);
    }
  }, []);

  const value = useMemo(() => ({ lang, setLang: changeLanguage }), [lang, changeLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
