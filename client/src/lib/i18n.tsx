import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';
type Direction = 'ltr' | 'rtl';

interface I18nContextType {
  language: Language;
  direction: Direction;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.about": "About Us",
    "nav.services": "Services",
    "nav.portfolio": "Portfolio",
    "nav.contact": "Contact",
    "hero.intro": "We are wlsset design",
    "hero.subtitle": "Crafting premium digital experiences and visual identities.",
    "hero.cta": "Request a Project",
    "about.title": "Our Story",
    "about.vision": "Vision",
    "services.title": "Our Services",
    "portfolio.title": "Selected Works",
    "portfolio.all": "All",
    "contact.title": "Start a Project",
    "contact.name": "Name",
    "contact.email": "Email",
    "contact.company": "Company (Optional)",
    "contact.service": "Service Type",
    "contact.message": "Project Details",
    "contact.submit": "Send Request",
    "footer.rights": "© 2026 wlsset design. All rights reserved.",
  },
  ar: {
    "nav.home": "الرئيسية",
    "nav.about": "من نحن",
    "nav.services": "خدماتنا",
    "nav.portfolio": "أعمالنا",
    "nav.contact": "تواصل معنا",
    "hero.intro": "نحن wlsset design",
    "hero.subtitle": "نصنع تجارب رقمية وهويات بصرية فاخرة.",
    "hero.cta": "اطلب مشروعاً",
    "about.title": "قصتنا",
    "about.vision": "رؤيتنا",
    "services.title": "خدماتنا",
    "portfolio.title": "مختارات من أعمالنا",
    "portfolio.all": "الكل",
    "contact.title": "ابدأ مشروعاً",
    "contact.name": "الاسم",
    "contact.email": "البريد الإلكتروني",
    "contact.company": "الشركة (اختياري)",
    "contact.service": "نوع الخدمة",
    "contact.message": "تفاصيل المشروع",
    "contact.submit": "إرسال الطلب",
    "footer.rights": "© 2024 wlsset design. جميع الحقوق محفوظة.",
  }
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, direction: language === 'ar' ? 'rtl' : 'ltr', toggleLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
