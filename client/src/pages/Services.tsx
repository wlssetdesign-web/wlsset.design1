import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { useState } from "react";
import ServiceRequestForm from "@/components/ServiceRequestForm";
import { 
  Palette, 
  Printer, 
  Share2, 
  Image as ImageIcon, 
  PenTool, 
  BarChart, 
  Video 
} from "lucide-react";

export default function Services() {
  const { t } = useI18n();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const services = [
    {
      icon: Palette,
      title: "Brand Identity Design",
      items: ["Logo Design", "Complete Identity", "Brand Guidelines", "Color & Typography", "Rebranding"]
    },
    {
      icon: Printer,
      title: "Print Design",
      items: ["Business Cards", "Brochures & Flyers", "Posters", "Roll-Up Banners", "Menus", "Letterheads", "Packaging"]
    },
    {
      icon: Share2,
      title: "Social Media Design",
      items: ["Instagram Posts/Stories", "Facebook Covers", "Ad Creatives", "Grid Layouts"]
    },
    {
      icon: ImageIcon,
      title: "Image Editing",
      items: ["High-End Retouching", "Background Removal", "Color Correction", "Compositing"]
    },
    {
      icon: PenTool,
      title: "Vector Tracing",
      items: ["Logo Vectorization", "Sketch to Vector", "High-Res Scaling"]
    },
    {
      icon: BarChart,
      title: "Infographic Design",
      items: ["Data Visualization", "Process Flowcharts", "Educational Graphics"]
    },
    {
      icon: Video,
      title: "Video & Motion",
      items: ["Video Editing", "VFX", "Intro/Outro", "Social Media Video", "Motion Graphics"]
    }
  ];

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
          Comprehensive creative solutions tailored to elevate your brand's presence across all mediums.
        </p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {services.map((service, index) => (
          <motion.div 
            key={index}
            variants={item}
            onClick={() => setSelectedService(service.title)}
            className="group bg-card/40 backdrop-blur border border-white/5 rounded-xl p-6 hover:bg-card/60 transition-all duration-300 hover:border-[#A30A0A]/50 hover:-translate-y-1 cursor-pointer"
          >
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-[#A30A0A]/20 transition-colors">
              <service.icon className="h-6 w-6 text-primary group-hover:text-[#A30A0A] transition-colors" />
            </div>
            
            <h3 className="text-xl font-bold mb-4 group-hover:text-[#A30A0A] transition-colors">{service.title}</h3>
            
            <ul className="space-y-2">
              {service.items.map((subItem, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-primary/50 group-hover:bg-[#A30A0A]/50 transition-colors" />
                  {subItem}
                </li>
              ))}
            </ul>

            <div className="mt-4 pt-4 border-t border-white/10 group-hover:border-[#A30A0A]/30 transition-colors">
              <p className="text-xs text-[#A30A0A] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Click to request this service
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <ServiceRequestForm 
        isOpen={selectedService !== null}
        onClose={() => setSelectedService(null)}
        serviceName={selectedService || ""}
      />
    </div>
  );
}
