import { useI18n } from "@/lib/i18n";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import portfolioData from "@/data/portfolio.json";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function Portfolio() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<typeof portfolioData[0] | null>(null);

  // Clean array of exactly 7 buttons - NO DUPLICATES
  const filterButtons = ["Brands", "Print Design", "Social Media Design", "Image Editing", "Vector Tracing", "Infographic Design", "Video & Motion"];

  // Mapping from button label to actual portfolio data category
  const buttonToCategoryMap: { [key: string]: string } = {
    "Brands": "Branding",
    "Print Design": "Print",
    "Social Media Design": "Social Media",
    "Image Editing": "Image Editing",
    "Vector Tracing": "Vector Tracing",
    "Infographic Design": "Infographic Design",
    "Video & Motion": "Video",
  };

  const filteredItems = useMemo(() => {
    let items = portfolioData;
    
    // If a filter is selected, filter by category
    if (filter) {
      const dataCategory = buttonToCategoryMap[filter];
      items = items.filter(item => item.category === dataCategory);
    }
    
    // Apply search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      items = items.filter(item => 
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower)
      );
    }
    
    return items;
  }, [filter, searchTerm]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">{t("portfolio.title")}</h1>
      </div>

      {/* Search Bar */}
      <div className="mb-12 flex justify-center">
        <div className="relative w-full max-w-2xl group">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#A30A0A] transition-colors group-focus-within:text-[#A30A0A]" />
          <Input
            type="text"
            placeholder={t("portfolio.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-5 py-4 text-base bg-white border-2 border-gray-200 rounded-2xl focus:border-[#A30A0A] focus:outline-none transition-all duration-300 shadow-sm focus:shadow-lg focus:shadow-[rgba(163,10,10,0.15)]"
            style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: "600" }}
          />
        </div>
      </div>

      {/* Filters - CLEAN 7 BUTTONS ONLY */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {filterButtons.map((buttonLabel) => (
          <Button
            key={buttonLabel}
            variant={filter === buttonLabel ? "default" : "outline"}
            onClick={() => setFilter(buttonLabel)}
            className={`rounded-full font-bold transition-all ${
              filter === buttonLabel 
                ? 'bg-[#A30A0A] hover:bg-[#8B0808] text-white border-2 border-[#A30A0A]' 
                : 'border-2 border-gray-300 text-foreground hover:border-[#A30A0A] hover:bg-gray-50'
            }`}
            style={{ fontFamily: "'Quicksand', sans-serif" }}
          >
            {buttonLabel}
          </Button>
        ))}
      </div>

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-xl text-muted-foreground text-center">
            {t("portfolio.noResults")}
          </p>
        </div>
      ) : (
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
      )}

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
