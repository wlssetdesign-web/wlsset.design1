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
    "services.description": "Comprehensive creative solutions tailored to elevate your brand's presence across all mediums.",
    "services.brandIdentity": "Brand Identity Design",
    "services.brandIdentity.items": "Logo Design, Complete Identity, Brand Guidelines, Color & Typography, Rebranding",
    "services.printDesign": "Print Design",
    "services.printDesign.items": "Business Cards, Brochures & Flyers, Posters, Roll-Up Banners, Menus, Letterheads, Packaging",
    "services.socialMedia": "Social Media Design",
    "services.socialMedia.items": "Instagram Posts/Stories, Facebook Covers, Ad Creatives, Grid Layouts",
    "services.imageEditing": "Image Editing",
    "services.imageEditing.items": "High-End Retouching, Background Removal, Color Correction, Compositing",
    "services.vectorTracing": "Vector Tracing",
    "services.vectorTracing.items": "Logo Vectorization, Sketch to Vector, High-Res Scaling",
    "services.infographic": "Infographic Design",
    "services.infographic.items": "Data Visualization, Process Flowcharts, Educational Graphics",
    "services.video": "Video & Motion",
    "services.video.items": "Video Editing, VFX, Intro/Outro, Social Media Video, Motion Graphics",
    "services.clickToRequest": "Click to request this service",
    "portfolio.title": "Selected Works",
    "portfolio.all": "All",
    "contact.title": "Start a Project",
    "contact.name": "Name",
    "contact.email": "Email",
    "contact.company": "Company (Optional)",
    "contact.service": "Service Type",
    "contact.message": "Project Details",
    "contact.submit": "Send Request",
    "form.fullName": "Full Name",
    "form.phone": "Phone Number",
    "form.email": "Email Address",
    "form.next": "Next",
    "form.back": "Back",
    "form.preferredColors": "Preferred Colors",
    "form.fontStyle": "Font Style Preference",
    "form.designNotes": "Design Notes & Details",
    "form.vibrant": "Vibrant & Bold",
    "form.minimal": "Minimal & Neutral",
    "form.warm": "Warm & Earthy",
    "form.cool": "Cool & Modern",
    "form.custom": "Custom Palette",
    "form.modern": "Modern & Clean",
    "form.serif": "Classic Serif",
    "form.display": "Bold Display",
    "form.playful": "Playful & Creative",
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
    "services.description": "حلول إبداعية شاملة مخصصة لرفع مستوى تواجد علامتك التجارية عبر جميع الوسائط.",
    "services.brandIdentity": "تصميم الهوية البصرية",
    "services.brandIdentity.items": "تصميم الشعار، الهوية الكاملة، إرشادات العلامة التجارية، الألوان والطباعة، إعادة العلامة التجارية",
    "services.printDesign": "تصميم المطبوعات",
    "services.printDesign.items": "بطاقات العمل، الكتيبات والمنشورات، الملصقات، لافتات الرول آب، القوائم، رؤوس الرسائل، التغليف",
    "services.socialMedia": "تصميم وسائل التواصل",
    "services.socialMedia.items": "منشورات/قصص إنستجرام، أغلفة فيسبوك، الإعلانات الإبداعية، تخطيطات الشبكة",
    "services.imageEditing": "تحرير الصور",
    "services.imageEditing.items": "إعادة اللمس العالية، إزالة الخلفية، تصحيح الألوان، المركبات",
    "services.vectorTracing": "تتبع المتجهات",
    "services.vectorTracing.items": "متجه الشعار، من الرسم إلى المتجه، القياس عالي الدقة",
    "services.infographic": "تصميم الرسوم البيانية",
    "services.infographic.items": "تصور البيانات، مخططات العمليات، الرسومات التعليمية",
    "services.video": "الفيديو والحركة",
    "services.video.items": "تحرير الفيديو، المؤثرات البصرية، المقدمات والنهايات، فيديو وسائل التواصل، الرسوميات المتحركة",
    "services.clickToRequest": "اضغط لطلب هذه الخدمة",
    "portfolio.title": "مختارات من أعمالنا",
    "portfolio.all": "الكل",
    "contact.title": "ابدأ مشروعاً",
    "contact.name": "الاسم",
    "contact.email": "البريد الإلكتروني",
    "contact.company": "الشركة (اختياري)",
    "contact.service": "نوع الخدمة",
    "contact.message": "تفاصيل المشروع",
    "contact.submit": "إرسال الطلب",
    "form.fullName": "الاسم الثلاثي",
    "form.phone": "رقم الهاتف",
    "form.email": "عنوان البريد الإلكتروني",
    "form.next": "التالي",
    "form.back": "السابق",
    "form.preferredColors": "الألوان المفضلة",
    "form.fontStyle": "تفضيل نمط الخط",
    "form.designNotes": "ملاحظات التصميم والتفاصيل",
    "form.vibrant": "جريء ومتحيز",
    "form.minimal": "بسيط ومحايد",
    "form.warm": "دافئ وطبيعي",
    "form.cool": "بارد وحديث",
    "form.custom": "لوحة ألوان مخصصة",
    "form.modern": "حديث ونظيف",
    "form.serif": "سيريف كلاسيكي",
    "form.display": "عرض جريء",
    "form.playful": "مرح وإبداعي",
    "footer.rights": "© 2026 wlsset design. جميع الحقوق محفوظة.",
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
