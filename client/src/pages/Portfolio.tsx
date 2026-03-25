import { useI18n } from "@/lib/i18n";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import portfolioData from "@/data/portfolio.json";
import { Button } from "@/components/ui/button";

export default function Portfolio() {
  const { t } = useI18n();
  const [filter, setFilter] = useState("All");
  const [selectedItem, setSelectedItem] = useState<typeof portfolioData[0] | null>(null);

  const categoryMap: { [key: string]: string } = {
    "Branding": "portfolio.branding",
    "Print": "portfolio.print",
    "Social Media": "portfolio.socialMedia",
    "Video": "portfolio.video",
  };

  const categories = ["All", ...Array.from(new Set(portfolioData.map(item => item.category)))];

  const filteredItems = filter === "All" 
    ? portfolioData 
    : portfolioData.filter(item => item.category === filter);

  const translateCategoryName = (cat: string): string => {
    return categoryMap[cat] ? t(categoryMap[cat]) : cat;
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">{t("portfolio.title")}</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={filter === cat ? "default" : "outline"}
            onClick={() => setFilter(cat)}
            className={`rounded-full ${filter === cat ? 'bg-primary hover:bg-primary/90' : 'hover:border-primary/50'}`}
          >
            {cat === "All" ? t("portfolio.all") : translateCategoryName(cat)}
          </Button>
        ))}
      </div>

      {/* Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredItems.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={item.id}
              className="group cursor-pointer relative aspect-video overflow-hidden rounded-xl border border-white/10"
              onClick={() => setSelectedItem(item)}
            >
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                <h3 className="text-xl font-bold text-white mb-2">{
                  item.title === "Eco Packaging" ? t("portfolio.ecoPackaging") :
                  item.title === "Lumina Tech Brochure" ? t("portfolio.luminaTechBrochure") :
                  item.title
                }</h3>
                <p className="text-sm text-primary font-medium">{translateCategoryName(item.category)}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-4xl bg-black/95 border-white/10 p-0 overflow-hidden">
          {selectedItem && (
            <div className="flex flex-col">
              <div className="relative aspect-video w-full bg-black">
                <img 
                  src={selectedItem.image} 
                  alt={selectedItem.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold">{
                    selectedItem.title === "Eco Packaging" ? t("portfolio.ecoPackaging") :
                    selectedItem.title === "Lumina Tech Brochure" ? t("portfolio.luminaTechBrochure") :
                    selectedItem.title
                  }</h2>
                  <span className="text-primary text-sm font-medium px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                    {translateCategoryName(selectedItem.category)}
                  </span>
                </div>
                <p className="text-muted-foreground">{selectedItem.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
