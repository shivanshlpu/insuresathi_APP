import { useLanguage } from "@/contexts/language-context";
import en from "@/lib/translations/en.json";
import hi from "@/lib/translations/hi.json";

const translations = { en, hi };

// Helper to access nested keys like 'personal.name'
const getNestedValue = (obj: any, path: string): string | undefined => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export const useTranslation = () => {
  const { language } = useLanguage();
  
  const t = (key: string): string => {
    const lang = translations[language];
    const fallbackLang = translations.en;
    
    const value = getNestedValue(lang, key);
    if (value !== undefined) {
        return value;
    }

    const fallbackValue = getNestedValue(fallbackLang, key);
    if (fallbackValue !== undefined) {
        return fallbackValue;
    }

    // In development, it's helpful to see which keys are missing.
    if (import.meta.env.DEV) {
        console.warn(`Translation key "${key}" not found.`);
        return key;
    }
    
    return "";
  };

  return { t, language };
};
