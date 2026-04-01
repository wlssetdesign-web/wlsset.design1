import { useI18n } from "@/lib/i18n";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import portfolioData from "@/data/portfolio.json";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import KhalilProject from "./KhalilProject";

export default function Portfolio() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<typeof portfolioData[0] | null>(null);
  const [khalilFocused, setKhalilFocused] = useState(false);

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

  // Reverse mapping: from data category to display label
  const categoryToLabelMap: { [key: string]: string } = {
    "Branding": "Brands",
    "Print": "Print Design",
    "Social Media": "Social Media Design",
    "Image Editing": "Image Editing",
    "Vector Tracing": "Vector Tracing",
    "Infographic Design": "Infographic Design",
    "Video": "Video & Motion",
  };

  const getCategoryLabel = (category: string): string => {
    return categoryToLabelMap[category] || category;
  };

  const filteredItems = useMemo(() => {
    let items = portfolioData;
    
    // Search takes priority: if user is typing, search ALL projects across all categories
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      items = items.filter(item => 
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower)
      );
    } else if (filter) {
      // Only apply category filter if no search term is active
      const dataCategory = buttonToCategoryMap[filter];
      items = items.filter(item => item.category === dataCategory);
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
            placeholder="Search here"
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
              (filter === buttonLabel || (khalilFocused && buttonLabel === "Brands"))
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
      {!khalilFocused && (
        <>
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
                    className={`group cursor-pointer relative aspect-video overflow-hidden rounded-xl border border-white/10 ${
                      item.title === "Khalil Barber Shop" ? "bg-white" : ""
                    }`}
                    onClick={() => {
                      if (item.title === "Khalil Barber Shop") {
                        setKhalilFocused(true);
                      } else {
                        setSelectedItem(item);
                      }
                    }}
                  >
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className={`w-full h-full transition-transform duration-500 ${
                        item.title === "Khalil Barber Shop"
                          ? "object-contain p-6 group-hover:scale-100"
                          : "object-cover group-hover:scale-110"
                      }`}
                    />
                    {/* Khalil Barber Shop: Always show hover overlay with text */}
                    {item.title === "Khalil Barber Shop" && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center" style={{ backgroundColor: 'rgba(163, 10, 10, 0.6)' }}>
                        <h3 className="text-2xl font-bold text-white">Khalil Barber Shop</h3>
                      </div>
                    )}
                    {/* Other projects: Show hover overlay only if showImageOnHover is not false */}
                    {item.title !== "Khalil Barber Shop" && item.showImageOnHover !== false && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center" style={{ backgroundColor: 'rgba(163, 10, 10, 0.6)' }}>
                        <h3 className="text-2xl font-bold text-white">{
                          item.title === "Eco Packaging" ? t("portfolio.ecoPackaging") :
                          item.title === "Lumina Tech Brochure" ? t("portfolio.luminaTechBrochure") :
                          item.title
                        }</h3>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </>
      )}

      {/* Khalil Focused View */}
      {khalilFocused && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          {/* Centered Khalil Card */}
          <div className="fixed z-40 bg-background pt-4 pb-8" style={{ bottom: "5%", left: 0, right: 0, display: "flex", justifyContent: "center" }}>
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.2 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="w-full flex justify-center px-4"
              onClick={() => setKhalilFocused(false)}
            >
              <div className="group cursor-pointer relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-white w-full max-w-md hover:shadow-lg transition-shadow duration-300">
                <img 
                  src="/public/images/KHALIL-LOGO-RGB2.jpg"
                  alt="Khalil Barber Shop"
                  className="w-full h-full object-contain p-6"
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center" style={{ backgroundColor: 'rgba(163, 10, 10, 0.6)' }}>
                  <h3 className="text-2xl font-bold text-white">Khalil Barber Shop</h3>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Project Details */}
          <KhalilProject onClose={() => setKhalilFocused(false)} />
        </motion.div>
      )}

      {/* Full-Page Project View or Regular Lightbox Modal */}
      {selectedItem && selectedItem.title === "Khalil Barber Shop" ? (
        <KhalilProject onClose={() => setSelectedItem(null)} />
      ) : (
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
                      {getCategoryLabel(selectedItem.category)}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{selectedItem.description}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
