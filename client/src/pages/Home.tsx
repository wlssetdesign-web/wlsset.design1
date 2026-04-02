import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const { t, language } = useI18n();
  const isRTL = language === 'ar';

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="w-full flex justify-center mb-8">
           <img 
              src="/assets/logo.png" 
              alt="wlsset design" 
              className="h-56 md:h-80 object-contain drop-shadow-2xl"
            />
        </div>
        
        <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-[#191919]">
          {t("hero.intro")}
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1.2 }}
          className="h-20 flex items-center justify-center"
        >
          <p 
            className="text-2xl md:text-4xl font-bold text-[#A30A0A] tracking-wide"
            style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : "'Quicksand', sans-serif" }}
          >
            {t("hero.slogan")}
          </p>
        </motion.div>
        
        <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          {t("hero.subtitle")}
        </p>

        <div className="pt-8">
          <Link href="/services">
            <Button size="lg" className="text-lg px-8 py-6 rounded-full group bg-[#A30A0A] hover:bg-[#8B0808] shadow-lg hover:shadow-[0_0_30px_rgba(163,10,10,0.6)] transition-all duration-300 text-white">
              {t("hero.cta")}
              <ArrowRight className={`ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
