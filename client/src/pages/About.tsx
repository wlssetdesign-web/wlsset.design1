import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { useMemo } from "react";

type AboutSection = {
  id: string;
  sectionKey: string;
  titleEn: string;
  titleAr: string;
  textEn: string;
  textAr: string;
  image: string | null;
};

export default function About() {
  const { t, language } = useI18n();
  const isRTL = language === "ar";

  const { data: apiSections = [] } = useQuery<AboutSection[]>({
    queryKey: ["/api/about"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    staleTime: 30000,
  });

  const sections = useMemo(() => {
    if (apiSections.length === 0) return null;

    const map = new Map<string, AboutSection>(
      apiSections.map((s) => [s.sectionKey, s])
    );

    const getVal = (key: string, field: "title" | "text"): string => {
      const section = map.get(key);
      if (!section) return "";
      const langSuffix = language === "ar" ? "Ar" : "En";
      return section[(field + langSuffix) as keyof AboutSection] as string || "";
    };

    return {
      heading: getVal("heading", "title"),
      subtitle: getVal("heading", "text"),
      aboutUsTitle: getVal("aboutUs", "title"),
      aboutUsText: getVal("aboutUs", "text"),
      storyTitle: getVal("story", "title"),
      storyText: getVal("story", "text"),
      whatWeDoTitle: getVal("whatWeDo", "title"),
      whatWeDoText: getVal("whatWeDo", "text"),
      goalTitle: getVal("goal", "title"),
      goalText: getVal("goal", "text"),
      closingTitle: getVal("closing", "title"),
      closingText: getVal("closing", "text"),
    };
  }, [apiSections, language]);

  const heading = sections?.heading || t("about.heading");
  const subtitle = sections?.subtitle || t("about.subtitle");
  const aboutUsTitle = sections?.aboutUsTitle || t("about.aboutUsTitle");
  const aboutUsText = sections?.aboutUsText || t("about.aboutUsText");
  const storyTitle = sections?.storyTitle || t("about.storyTitle");
  const storyText = sections?.storyText || t("about.storyText");
  const whatWeDoTitle = sections?.whatWeDoTitle || t("about.whatWeDoTitle");
  const whatWeDoText = sections?.whatWeDoText || "";
  const goalTitle = sections?.goalTitle || t("about.goalTitle");
  const goalText = sections?.goalText || t("about.goalText");
  const closingTitle = sections?.closingTitle || t("about.closingTitle");
  const closingText = sections?.closingText || t("about.closingText");

  const whatWeDoList = whatWeDoText
    ? whatWeDoText.split(",").map((s: string) => s.trim())
    : ["Logo Design", "Brand Identity", "Social Media Content", "Creative Print Media"];

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
            {heading}
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <Card className="bg-card/50 backdrop-blur border-white/5">
          <CardContent className={`p-6 md:p-8 space-y-6 ${isRTL ? "text-right" : "text-left"}`}>
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold text-white">{aboutUsTitle}</h2>
              <p className="text-base md:text-lg leading-8 text-muted-foreground">
                {aboutUsText}
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold text-[#A30A0A]">{storyTitle}</h2>
              <p className="text-base md:text-lg leading-8 text-muted-foreground">
                {storyText}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white border-white/10">
            <CardContent className={`p-6 md:p-8 space-y-4 ${isRTL ? "text-right" : "text-left"}`}>
              <h3 className="text-2xl font-bold text-[#A30A0A]">{whatWeDoTitle}</h3>
              <ul className={`space-y-2 text-base md:text-lg text-gray-700 ${isRTL ? "pr-5" : "pl-5"} list-disc`}>
                {whatWeDoList.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-card/50 backdrop-blur border-white/5">
              <CardContent className={`p-6 md:p-8 space-y-3 ${isRTL ? "text-right" : "text-left"}`}>
                <h3 className="text-2xl font-bold text-[#A30A0A]">{goalTitle}</h3>
                <p className="text-base md:text-lg leading-8 text-muted-foreground">
                  {goalText}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-white/5">
              <CardContent className={`p-6 md:p-8 space-y-3 ${isRTL ? "text-right" : "text-left"}`}>
                <h3 className="text-2xl font-bold text-[#A30A0A]">{closingTitle}</h3>
                <p className="text-base md:text-lg leading-8 text-muted-foreground">
                  {closingText}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
