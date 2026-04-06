import { useI18n } from "@/lib/i18n";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import portfolioData from "@/data/portfolio.json";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import KhalilProject from "./KhalilProject";

export default function Portfolio() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<typeof portfolioData[0] | null>(null);
  const [activeProject, setActiveProject] = useState<typeof portfolioData[0] | null>(null);

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
      <div className="sticky top-0 z-50 flex flex-wrap justify-center gap-3 mb-12 py-6 bg-white/80 backdrop-blur-md">
        {filterButtons.map((buttonLabel) => (
          <Button
            key={buttonLabel}
            variant={filter === buttonLabel ? "default" : "outline"}
            onClick={() => setFilter(buttonLabel)}
            className={`rounded-full font-bold transition-all ${
              (filter === buttonLabel || (activeProject && categoryToLabelMap[activeProject.category] === buttonLabel))
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
      {!activeProject && (
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
                      setActiveProject(item);
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

      {/* Active Project View - Universal for All Projects */}
      {activeProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          {/* Project Card - Fixed at Left Below Navbar */}
          <div className="fixed z-50" style={{ top: "80px", left: "20px", display: "flex", justifyContent: "flex-start" }}>
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.1 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="flex justify-center"
              onClick={() => setActiveProject(null)}
            >
              <div className="cursor-pointer relative overflow-hidden rounded-lg px-8 py-6 shadow-lg flex flex-col items-center justify-between min-w-max h-32" style={{ backgroundColor: 'rgba(163, 10, 10, 0.5)' }}>
                <div></div>
                <div className="flex items-center justify-center gap-3 mt-6">
                  <img 
                    src={activeProject.image}
                    alt={activeProject.title}
                    className="w-14 h-14 object-contain"
                  />
                  <h3 className="text-lg font-bold text-white">{activeProject.title}</h3>
                </div>
                <X size={24} className="text-white stroke-2" />
              </div>
            </motion.div>
          </div>

          {/* Project Details - Khalil uses dedicated component, others use generic */}
          {activeProject.title === "Khalil Barber Shop" ? (
            <KhalilProject onClose={() => setActiveProject(null)} />
          ) : (
            <div className="pt-32 pb-12">
              <div className="flex items-center justify-center px-4 py-20 m-0" style={{ backgroundColor: "#1D695A" }}>
                <div className="max-w-5xl w-full">
                  <p className="text-xl md:text-2xl font-bold text-white leading-relaxed">
                    {activeProject.title} | {activeProject.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center bg-white px-4 py-20 m-0">
                <img
                  src={activeProject.image}
                  alt={activeProject.title}
                  className="w-full max-w-5xl object-contain"
                />
              </div>
              {activeProject.title === "North Leaves" && (
                <>
                  <div className="bg-white px-4 py-20 m-0">
                    <div className="max-w-5xl mx-auto w-full">
                      <h2 className="text-4xl font-bold text-[#1D695A] mb-10 text-center">Color Palette</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="rounded-2xl overflow-hidden shadow-lg border border-[#1D695A]/10 bg-white">
                          <div className="h-44" style={{ backgroundColor: "#dbd399" }} />
                          <div className="p-5">
                            <p className="text-lg font-bold text-gray-900">Neutral Beige</p>
                            <p className="text-sm text-gray-600">Natural accent</p>
                            <p className="mt-3 text-xs font-mono text-[#1D695A]">#dbd399</p>
                          </div>
                        </div>
                        <div className="rounded-2xl overflow-hidden shadow-lg border border-[#1D695A]/10 bg-white">
                          <div className="h-44" style={{ backgroundColor: "#b1dbba" }} />
                          <div className="p-5">
                            <p className="text-lg font-bold text-gray-900">Soft Leaf Green</p>
                            <p className="text-sm text-gray-600">Supportive tone</p>
                            <p className="mt-3 text-xs font-mono text-[#1D695A]">#b1dbba</p>
                          </div>
                        </div>
                        <div className="rounded-2xl overflow-hidden shadow-lg border border-[#1D695A]/10 bg-white">
                          <div className="h-44" style={{ backgroundColor: "#006653" }} />
                          <div className="p-5">
                            <p className="text-lg font-bold text-gray-900">Dark Green</p>
                            <p className="text-sm text-gray-600">Primary identity color</p>
                            <p className="mt-3 text-xs font-mono text-[#1D695A]">#006653</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center bg-white px-4 py-20 m-0">
                  <img
                    src="/images/north-leaves-bottom.jpg"
                    alt="North Leaves Brand Layout"
                    className="w-full max-w-5xl object-contain"
                  />
                  </div>
                  <div className="bg-white px-4 py-20 m-0">
                    <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                      <img src="/images/image_1775509956332.png" alt="North Leaves mockup preview" className="w-full rounded-2xl object-contain shadow-lg bg-white" />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
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
