import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  const { t } = useI18n();

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto space-y-12"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">{t("about.title")}</h1>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
        </div>

        <Card className="bg-card/50 backdrop-blur border-white/5">
          <CardContent className="p-8 space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>
              wlsset design is not just a creative agency; we are architects of visual identity. 
              Founded on the principles of precision, luxury, and innovation, we strive to elevate 
              brands beyond the ordinary.
            </p>
            <p>
              Our philosophy is rooted in the belief that design should be purposeful. Every pixel, 
              every color, and every motion is calculated to tell a story—your story. We merge 
              artistic intuition with strategic thinking to deliver high-end results that resonate.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">{t("about.vision")}</h2>
            <p className="text-muted-foreground">
              To define the visual language of the future, empowering brands to connect with their 
              audience through immersive and premium design experiences.
            </p>
          </div>
          <div className="space-y-4">
             <h2 className="text-2xl font-bold text-white">Style</h2>
            <p className="text-muted-foreground">
              Clean, bold, and sophisticated. We embrace minimalism with impact, ensuring that 
              every design element serves a distinct purpose while maintaining an aura of exclusivity.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
