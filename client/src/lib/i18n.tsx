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
    "hero.slogan": "An idea becomes reality",
    "hero.cta": "Request a Project",
    "about.title": "About Us",
    "about.heading": "WLSSET Design – Where Ideas Happen",
    "about.subtitle": "Transforming your vision into unique, high-impact designs.",
    "about.aboutUsTitle": "About Us",
    "about.aboutUsText": "At WLSSET Design, we believe every idea deserves its moment in the spotlight. What started as a simple passion and a bold dream has become our mission: to turn your concepts into authentic designs that speak your language and power your projects.",
    "about.storyTitle": "Our Story",
    "about.storyText": "WLSSET is more than just a name; it represents the start of a journey and a path that never ends. It’s a reflection of our daily hustle and our drive to evolve. We don’t just design; we bridge the gap between imagination and reality.",
    "about.whatWeDoTitle": "What We Do",
    "about.goalTitle": "Our Goal",
    "about.goalText": "We aim to be your partners in success. We’re here to help you turn your 'what if' into a 'what’s next,' creating projects that capture attention and leave a lasting legacy.",
    "about.closingTitle": "Closing",
    "about.closingText": "WLSSET Design – An Idea Realized. Launch your idea today… and let it reach its destination.",
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
    "about.storyParagraph1": "wlsset design is not just a creative agency; we are architects of visual identity. Founded on the principles of precision, luxury, and innovation, we strive to elevate brands beyond the ordinary.",
    "about.storyParagraph2": "Our philosophy is rooted in the belief that design should be purposeful. Every pixel, every color, and every motion is calculated to tell a story—your story. We merge artistic intuition with strategic thinking to deliver high-end results that resonate.",
    "about.styleTitle": "Style",
    "about.styleText": "Clean, bold, and sophisticated. We embrace minimalism with impact, ensuring that every design element serves a distinct purpose while maintaining an aura of exclusivity.",
    "about.visionText": "To define the visual language of the future, empowering brands to connect with their audience through immersive and premium design experiences.",
    "contact.getInTouchTitle": "Get in Touch",
    "contact.getInTouchDescription": "Have questions or general inquiries? We'd love to hear from you. For project requests, please use the Services section above",
    "contact.messageLabel": "Your message or inquiry",
    "portfolio.branding": "Branding",
    "portfolio.print": "Print",
    "portfolio.socialMedia": "Social Media",
    "portfolio.video": "Video",
    "portfolio.ecoPackaging": "Eco Packaging",
    "portfolio.luminaTechBrochure": "Lumina Tech Brochure",
    "portfolio.searchPlaceholder": "Search for a service or project...",
    "portfolio.noResults": "No projects found. Try searching for another service!",
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
    "hero.slogan": "فكرة تتحقق",
    "hero.cta": "اطلب مشروعاً",
    "about.title": "من نحن",
    "about.heading": "WLSSET Design فكرة تتحقق",
    "about.subtitle": "نحوّل أفكارك لتصاميم واقعية تميزك.",
    "about.aboutUsTitle": "من نحن",
    "about.aboutUsText": "في WLSSET Design نؤمن أن كل فكرة تستحق أن ترى النور. بدأنا من شغف بسيط وحلم كبير، وهدفنا ان نحول أي فكرة إلى تصميم حقيقي يعبّر عنك ويخدم مشروعك.",
    "about.storyTitle": "قصتنا",
    "about.storyText": "اسم WLSSET يعبر عن البداية، عن الطريق المستمر. هو انعكاس لرحلتنا اليومية، وسعينا الدائم نحو التطور والوصول. ومن خلال عملنا، نحول الأفكار من مجرد تصور… إلى واقع ملموس.",
    "about.whatWeDoTitle": "ماذا نقدم",
    "about.goalTitle": "هدفنا",
    "about.goalText": "هدفنا ان نكون شركاء في نجاحك، و نساعدك في تحويل فكرتك إلى مشروع حقيقي يلفت الانتباه ويترك أثر كبير.",
    "about.closingTitle": "الخاتمة",
    "about.closingText": "ولصت ديزاين – فكرة تتحقق. ابدأ فكرتك اليوم… وخليها توصل.",
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
    "about.storyParagraph1": "wlsset design ليست مجرد وكالة إبداعية؛ نحن مهندسو الهوية البصرية. تأسست على مبادئ الدقة والفخامة والابتكار، ونسعى جاهدين للارتقاء بالعلامات التجارية لتبهر الجميع.",
    "about.storyParagraph2": "تتجذر فلسفتنا في الإيمان بأن التصميم يجب أن يكون هادفاً. يتم حساب كل بكسل ولون وحركة لسرد قصة—قصتك. ندمج الحدس الفني مع التفكير الاستراتيجي لتقديم نتائج راقية تلقى صدى.",
    "about.styleTitle": "أسلوبنا",
    "about.styleText": "نظيفة وجريئة ومتطورة. نحن نتبنى البساطة ذات التأثير، ونضمن أن كل عنصر تصميم يخدم هدفاً متميزاً مع الحفاظ على هالة من الحصرية.",
    "about.visionText": "لتحديد اللغة البصرية للمستقبل، وتمكين العلامات التجارية من التواصل مع جمهورها من خلال تجارب تصميم غامرة وممتازة.",
    "contact.getInTouchTitle": "تواصل معنا",
    "contact.getInTouchDescription": "لديك أسئلة أو استفسارات عامة؟ يسعدنا أن نسمع منك. لطلبات المشاريع، يرجى استخدام قسم الخدمات في الأعلى",
    "contact.messageLabel": "...رسالتك أو استفسارك",
    "portfolio.branding": "هويات بصرية",
    "portfolio.print": "مطبوعات",
    "portfolio.socialMedia": "سوشيال ميديا",
    "portfolio.video": "فيديو",
    "portfolio.ecoPackaging": "تغليف صديق للبيئة",
    "portfolio.luminaTechBrochure": "بروشور لومينا تيك",
    "portfolio.searchPlaceholder": "ابحث عن خدمة أو مشروع...",
    "portfolio.noResults": "لم يتم العثور على مشاريع. جرب البحث عن خدمة أخرى!",
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
