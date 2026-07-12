import { useI18n } from "@/lib/i18n";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import portfolioData from "@/data/portfolio.json";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useLocation } from "wouter";
import KhalilProject from "./KhalilProject";

type MediaItem = {
  url: string;
  type: "image" | "video";
  sortOrder: number;
};

type PortfolioItem = {
  id: number | string;
  title: string;
  category: string;
  image: string;
  description: string;
  tags?: string | string[];
  projectLink?: string;
  isFullPage?: boolean;
  showImageOnHover?: boolean;
  media?: MediaItem[];
};

export default function Portfolio() {
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const [filter, setFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [activeProject, setActiveProject] = useState<PortfolioItem | null>(null);

  const { data: apiItems = [] } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/portfolio"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    staleTime: 30000,
  });

  const mergedItems = useMemo(() => {
    if (apiItems.length > 0) {
      return apiItems as PortfolioItem[];
    }
    return portfolioData as unknown as PortfolioItem[];
  }, [apiItems]);

  const filterButtons = ["Brands", "Print Design", "Social Media Design", "Image Editing", "Vector Tracing", "Infographic Design", "Video & Motion"];

  const buttonToCategoryMap: { [key: string]: string } = {
    "Brands": "Branding",
    "Print Design": "Print",
    "Social Media Design": "Social Media",
    "Image Editing": "Image Editing",
    "Vector Tracing": "Vector Tracing",
    "Infographic Design": "Infographic Design",
    "Video & Motion": "Video",
  };

  const categoryToLabelMap: { [key: string]: string } = {
    "Branding": "Brands",
    "Print": "Print Design",
    "Social Media": "Social Media",
    "Image Editing": "Image Editing",
    "Vector Tracing": "Vector Tracing",
    "Infographic Design": "Infographic Design",
    "Video": "Video & Motion",
  };

  const shouldShowNorthLeaves = (category: string) => {
    return category === "Branding" || category === "Print" || category === "Social Media";
  };

  const getCategoryLabel = (category: string): string => {
    return categoryToLabelMap[category] || category;
  };

  const filteredItems = useMemo(() => {
    let items = mergedItems;
    
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      items = items.filter(item => 
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower)
      );
    } else if (filter) {
      const dataCategory = buttonToCategoryMap[filter];
      items = items.filter(item => item.category === dataCategory || (item.tags && (Array.isArray(item.tags) ? item.tags : [item.tags]).includes(dataCategory)));
      if (shouldShowNorthLeaves(dataCategory)) {
        const northLeavesItem = mergedItems.find(item => item.title === "North Leaves");
        if (northLeavesItem && !items.some(item => item.title === "North Leaves")) {
          items = [northLeavesItem, ...items];
        }
      }
    }
    
    return items;
  }, [filter, searchTerm, mergedItems]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">{t("portfolio.title")}</h1>
      </div>

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

      <div className="flex flex-wrap justify-center gap-3 mb-12 py-6 bg-white/80 backdrop-blur-md">
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
                      item.title === "Khalil Barber Shop" || item.title === "Kick Off" ? "bg-transparent" : ""
                    }`}
                    onClick={() => {
                      setLocation(`/portfolio/${item.id}`);
                    }}
                  >
                    <div className={`w-full h-full ${item.title === "Khalil Barber Shop" || item.title === "Kick Off" ? "bg-transparent" : "bg-white"}`}>
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className={`w-full h-full transition-transform duration-500 ${
                        item.title === "Khalil Barber Shop" || item.title === "Kick Off"
                            ? "object-contain p-2 sm:p-4 md:p-6 group-hover:scale-100"
                            : "object-cover group-hover:scale-110"
                        }`}
                      />
                    </div>
                    {item.title === "Khalil Barber Shop" && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center" style={{ backgroundColor: 'rgba(163, 10, 10, 0.6)' }}>
                        <h3 className="text-2xl font-bold text-white">Khalil Barber Shop</h3>
                      </div>
                    )}
                    {item.title === "Kick Off" && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center" style={{ backgroundColor: 'rgba(163, 10, 10, 0.6)' }}>
                        <h3 className="text-2xl font-bold text-white">Kick Off</h3>
                      </div>
                    )}
                    {item.title !== "Khalil Barber Shop" && item.showImageOnHover !== false && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center" style={{ backgroundColor: 'rgba(163, 10, 10, 0.6)' }}>
                        <h3 className="text-2xl font-bold text-white">{
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

      {activeProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
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

          {activeProject.title === "Khalil Barber Shop" ? (
            <KhalilProject onClose={() => setActiveProject(null)} />
          ) : (
            <div className="pt-32 pb-12">
              {activeProject.title !== "Dry Eyes Problems" && (
                <div className="flex items-center justify-center px-4 py-20 m-0" style={{ backgroundColor: activeProject.title === "Kick Off" ? "#A51E1E" : activeProject.title === "Al Mamlaka TV NFC" ? "#8B1A1A" : activeProject.title === "Meet Me Again" ? "#875c49" : activeProject.title === "Honey Masters.jo" ? "#F0F4E8" : "#dc2626" }}>
                  <div className="max-w-5xl w-full">
                    <p className={`text-xl md:text-2xl font-bold leading-relaxed ${activeProject.title === "Honey Masters.jo" ? "text-[#3B2A1A]" : "text-white"}`}>
                      {activeProject.title === "Al Mamlaka TV NFC" ? <><span className="font-extrabold">Al Mamlaka TV NFC</span>{" \u2014 A bold identity card designed for power and presence, crafted exclusively for the CEO of Al Mamlaka TV. The pixelated red and gray pattern bursts from the corners like a digital signal, reflecting the brand's media-driven DNA. Clean white space at the center keeps the focus sharp on what matters \u2014 the name, the title, the legacy. Embedded with NFC technology, one tap or scan is all it takes for the CEO to make a lasting connection."}</> : activeProject.title === "Meet Me Again" ? "Meet Me Again coffee packaging stickers designed with a warm, earthy identity. Each label blends bilingual typography with origin details, flavor notes, and a personal touch \u2014 crafted to tell the story of every bean before the first sip." : activeProject.title === "Honey Masters.jo" ? "Honey Masters.jo \u2014 A premium honey jar label designed to be as sweet as what\u2019s inside. The playful bee mascot brings warmth and charm, while the clean cream-toned label keeps it elegant and trustworthy. Every detail \u2014 from the logo to the contact info \u2014 is crafted to make the product stand out on the shelf and leave a lasting impression." : `${activeProject.title} | ${activeProject.description}`}
                    </p>
                  </div>
                </div>
              )}
              {activeProject.title === "Dry Eyes Problems" && (
                <div className="bg-[#0A1A3B] px-4 py-20 m-0">
                  <div className="max-w-5xl mx-auto w-full">
                    <p className="text-2xl md:text-3xl font-bold leading-relaxed text-white">
                      This infographic highlights the key benefits of using trains for travel. From reducing environmental impact and saving costs, to offering comfort, speed, and scenic journeys trains combine efficiency with sustainability. Designed to visually engage and inform, this project aims to inspire greener and smarter travel choices.
                    </p>
                  </div>
                </div>
              )}
              <div className={`flex items-center justify-center bg-white px-4 py-20 m-0 ${activeProject.title === "Dry Eyes Problems" ? "mt-10" : ""}`}>
                <img
                  src={activeProject.image}
                  alt={activeProject.title}
                  className="w-full max-w-5xl object-contain"
                />
              </div>
              {activeProject.title === "Honey Masters.jo" && (
                <div className="flex items-center justify-center bg-white px-4 py-20 m-0">
                  <img
                    src="/images/honey.jpeg"
                    alt="Honey Masters.jo honey jar"
                    className="w-full max-w-5xl object-contain"
                  />
                </div>
              )}
              {activeProject.title === "Meet Me Again" && (
                <div className="bg-white px-4 py-20 m-0">
                  <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                    <img
                      src="/images/coffee-sticker.jpeg"
                      alt="Meet Me Again coffee packaging"
                      className="w-full object-contain rounded-lg"
                    />
                    <img
                      src="/images/coffee-sticker-2.jpeg"
                      alt="Meet Me Again coffee packaging detail"
                      className="w-full object-contain rounded-lg"
                    />
                  </div>
                </div>
              )}
              {activeProject.title === "Kick Off" && (
                <div className="flex items-center justify-center bg-white px-4 py-20 m-0">
                  <img
                    src="/images/kick-off-secondary.jpg"
                    alt="Kick Off secondary logo"
                    className="w-full max-w-5xl object-contain"
                  />
                </div>
              )}
              {activeProject.title === "Kick Off" && (
                <div className="bg-white px-4 py-20 m-0">
                  <div className="max-w-5xl mx-auto w-full">
                    <h2 className="text-4xl font-bold text-[#A51E1E] mb-10 text-center">Color Palette</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="rounded-2xl overflow-hidden shadow-lg border border-[#A51E1E]/10 bg-white">
                        <div className="h-44" style={{ backgroundColor: "#A51E1E" }} />
                        <div className="p-5">
                          <p className="text-lg font-bold text-gray-900">Kick Off Red</p>
                          <p className="text-sm text-gray-600">Primary brand color</p>
                          <p className="mt-3 text-xs font-mono text-[#A51E1E]">#A51E1E</p>
                        </div>
                      </div>
                      <div className="rounded-2xl overflow-hidden shadow-lg border border-[#A51E1E]/10 bg-white">
                        <div className="h-44" style={{ backgroundColor: "#124073" }} />
                        <div className="p-5">
                          <p className="text-lg font-bold text-gray-900">Kick Off Blue</p>
                          <p className="text-sm text-gray-600">Supporting accent color</p>
                          <p className="mt-3 text-xs font-mono text-[#A51E1E]">#124073</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeProject.title === "Kick Off" && (
                <div className="bg-[#A51E1E] px-4 py-20 m-0">
                  <div className="max-w-5xl mx-auto w-full">
                    <p className="text-2xl md:text-3xl font-bold leading-relaxed text-white">
                      Kick Off – Sports Channel Branding &amp; Identity Design : The concept focuses on a bold and energetic visual identity, using strong geometric shapes and a red–blue color palette to reflect the passion and excitement of the game. The result is a consistent, recognizable, and modern brand presence across all platforms.
                    </p>
                  </div>
                </div>
              )}
              {activeProject.title === "Kick Off" && (
                <div className="bg-transparent px-4 mt-10 pb-20 m-0">
                  <div className="max-w-3xl mx-auto">
                    <img
                      src="/images/Free_Logo_Mockup_2_1776804476547.png"
                      alt="Kick Off Logo Mockup"
                      className="w-full h-auto object-contain mx-auto"
                    />
                  </div>
                </div>
              )}
              {activeProject.title === "North Leaves" && (
                <>
                  <div className="flex items-center justify-center bg-white px-4 py-20 m-0">
                    <img
                      src="/images/north-leaves-logo-mockup.jpg"
                      alt="North Leaves logo mockup"
                      className="w-full max-w-5xl object-contain"
                    />
                  </div>
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
                  <div className="bg-[#1D695A] px-4 py-8 m-0">
                    <div className="max-w-5xl mx-auto w-full">
                      <p className="text-2xl md:text-3xl leading-relaxed text-white">
                        North Leaves is a modern brand identity project that blends natural, minimal, and eco-friendly design elements. The branding appears to cater to a business that values sustainability — possibly in the food, herbal, or organic retail sectors.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center bg-white px-4 py-20 m-0">
                    <img
                      src="/images/north-leaves-logo-mockup.jpg"
                      alt="North Leaves logo mockup"
                      className="w-full max-w-5xl object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-center bg-white px-4 py-20 m-0">
                    <img
                      src="/images/north-leaves-second-picture.jpg"
                      alt="North Leaves typography logo"
                      className="w-full max-w-5xl object-contain"
                    />
                  </div>
                  <div className="w-full bg-[#006653] py-4 px-4">
                    <div className="max-w-5xl mx-auto w-full text-center">
                      <span className="text-white font-bold uppercase tracking-wider text-2xl md:text-3xl">
                        Printables
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center bg-white px-4 py-20 m-0">
                    <img
                      src="/images/north-leaves-menu-mockup.jpg"
                      alt="North Leaves menu mockup"
                      className="w-full max-w-5xl object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-center bg-white px-4 py-20 m-0">
                    <img
                      src="/images/business-card.jpg"
                      alt="North Leaves business card mockup"
                      className="w-full max-w-5xl object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-center bg-white px-4 py-20 m-0">
                    <img
                      src="/images/north-leaves-sticker-mockup.jpg"
                      alt="North Leaves sticker mockup"
                      className="w-full max-w-5xl object-contain"
                    />
                  </div>
                </>
              )}
              {/* Gallery section for projects with media */}
              {activeProject.media && activeProject.media.length > 1 && (
                <div className="bg-white px-4 py-20 m-0">
                  <div className="max-w-5xl mx-auto w-full">
                    {activeProject.media.slice(1).map((mediaItem, idx) => (
                      <div key={idx} className="mb-6 last:mb-0">
                        {mediaItem.type === "video" || /\.(mp4|webm|mov|avi|mkv)$/i.test(mediaItem.url) ? (
                          <video
                            src={mediaItem.url}
                            controls
                            className="w-full max-w-5xl object-contain rounded-lg shadow-lg mx-auto"
                          />
                        ) : (
                          <img
                            src={mediaItem.url}
                            alt={`${activeProject.title} gallery ${idx + 1}`}
                            className="w-full max-w-5xl object-contain rounded-lg shadow-lg mx-auto"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

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
