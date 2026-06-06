import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  const { t, language } = useI18n();
  const isRTL = language === "ar";

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto space-y-10"
      >
        <div className={`text-center space-y-4 ${isRTL ? "rtl" : "ltr"}`}>
          <h1 className="text-3xl md:text-5xl font-bold text-primary leading-tight">
            {t("about.heading")}
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            {t("about.subtitle")}
          </p>
        </div>

        <Card className="bg-card/50 backdrop-blur border-white/5">
          <CardContent className={`p-6 md:p-8 space-y-6 ${isRTL ? "text-right" : "text-left"}`}>
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold text-white">{t("about.aboutUsTitle")}</h2>
              <p className="text-base md:text-lg leading-8 text-muted-foreground">
                {t("about.aboutUsText")}
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold text-[#A30A0A]">{t("about.storyTitle")}</h2>
              <p className="text-base md:text-lg leading-8 text-muted-foreground">
                {t("about.storyText")}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white border-white/10">
            <CardContent className={`p-6 md:p-8 space-y-4 ${isRTL ? "text-right" : "text-left"}`}>
              <h3 className="text-2xl font-bold text-[#A30A0A]">{t("about.whatWeDoTitle")}</h3>
              <ul className={`space-y-2 text-base md:text-lg text-gray-700 ${isRTL ? "pr-5" : "pl-5"} list-disc`}>
                <li>Logo Design</li>
                <li>Brand Identity</li>
                <li>Social Media Content</li>
                <li>Creative Print Media</li>
              </ul>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-card/50 backdrop-blur border-white/5">
              <CardContent className={`p-6 md:p-8 space-y-3 ${isRTL ? "text-right" : "text-left"}`}>
                <h3 className="text-2xl font-bold text-[#A30A0A]">{t("about.goalTitle")}</h3>
                <p className="text-base md:text-lg leading-8 text-muted-foreground">
                  {t("about.goalText")}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-white/5">
              <CardContent className={`p-6 md:p-8 space-y-3 ${isRTL ? "text-right" : "text-left"}`}>
                <h3 className="text-2xl font-bold text-[#A30A0A]">{t("about.closingTitle")}</h3>
                <p className="text-base md:text-lg leading-8 text-muted-foreground">
                  {t("about.closingText")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}