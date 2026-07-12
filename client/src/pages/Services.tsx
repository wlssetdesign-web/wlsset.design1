import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import ServiceRequestForm from "@/components/ServiceRequestForm";
import { 
  Palette, 
  Printer, 
  Share2, 
  Image as ImageIcon, 
  PenTool, 
  BarChart, 
  Video,
} from "lucide-react";

type ApiService = {
  id: string;
  key: string;
  titleEn: string;
  titleAr: string;
  itemsEn: string;
  itemsAr: string;
  icon: string;
  productOptions?: string | null;
};

const iconMap: Record<string, React.ComponentType<any>> = {
  Palette, Printer, Share2, Image: ImageIcon, PenTool, BarChart, Video,
};

function splitItems(str: string): string[] {
  return str.split(/[,،]/).map(s => s.trim()).filter(Boolean);
}

export default function Services() {
  const { t, language } = useI18n();
  const [selectedService, setSelectedService] = useState<{ key: string; title: string } | null>(null);

  const { data: apiServices = [] } = useQuery<ApiService[]>({
    queryKey: ["/api/services"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    staleTime: 30000,
  });

  const services = useMemo(() => {
    if (apiServices.length > 0) {
      return apiServices.map((s) => ({
        key: s.key,
        icon: iconMap[s.icon] || Palette,
        displayTitle: language === "ar" ? s.titleAr : s.titleEn,
        itemsKey: s.id,
        items: splitItems(language === "ar" ? s.itemsAr : s.itemsEn),
        productOptions: s.productOptions ? splitItems(s.productOptions) : [],
      }));
    }

    const defaultServices = [
      { icon: Palette, titleKey: "services.brandIdentity", itemsKey: "services.brandIdentity" },
      { icon: Printer, titleKey: "services.printDesign", itemsKey: "services.printDesign" },
      { icon: Share2, titleKey: "services.socialMedia", itemsKey: "services.socialMedia" },
      { icon: ImageIcon, titleKey: "services.imageEditing", itemsKey: "services.imageEditing" },
      { icon: PenTool, titleKey: "services.vectorTracing", itemsKey: "services.vectorTracing" },
      { icon: BarChart, titleKey: "services.infographic", itemsKey: "services.infographic" },
      { icon: Video, titleKey: "services.video", itemsKey: "services.video" },
    ];
    return defaultServices.map((svc) => ({
      key: svc.titleKey.replace("services.", ""),
      icon: svc.icon,
      displayTitle: t(svc.titleKey),
      itemsKey: svc.itemsKey,
      items: splitItems(t(`${svc.itemsKey}.items`)),
      productOptions: [],
    }));
  }, [apiServices, language, t]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div id="services" className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">{t("services.title")}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t("services.description")}
        </p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {services.map((service: any, index: number) => {
          const Icon = service.icon;
          return (
            <motion.div 
              key={index}
              variants={item}
              onClick={() => setSelectedService({ key: service.key, title: service.displayTitle })}
              className="group bg-card/40 backdrop-blur border border-white/5 rounded-xl p-6 hover:bg-card/60 transition-all duration-300 hover:border-[#A30A0A]/50 hover:-translate-y-1 cursor-pointer"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-[#A30A0A]/20 transition-colors">
                <Icon className="h-6 w-6 text-primary group-hover:text-[#A30A0A] transition-colors" />
              </div>
              
              <h3 className="text-xl font-bold mb-4 group-hover:text-[#A30A0A] transition-colors">{service.displayTitle}</h3>
              
              <ul className="space-y-2">
                {service.items.map((subItem: string, i: number) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-primary/50 group-hover:bg-[#A30A0A]/50 transition-colors" />
                    {subItem}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </motion.div>

      <ServiceRequestForm 
        isOpen={selectedService !== null}
        onClose={() => setSelectedService(null)}
        serviceName={selectedService?.title || ""}
        serviceKey={selectedService?.key || ""}
        productOptions={(apiServices.find(s => s.key === selectedService?.key)?.productOptions?.split(/[,،]/).map(s => s.trim()).filter(Boolean)) || []}
      />
    </div>
  );
}
