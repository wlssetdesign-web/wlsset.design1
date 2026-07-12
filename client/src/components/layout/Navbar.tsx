import { Link, useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Menu, Globe, Instagram, ShoppingBag, X, Trash2, MessageCircle, Check } from "lucide-react";
import { useState } from "react";
import { useBasket } from "@/lib/BasketContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function Navbar() {
  const { t, toggleLanguage, language } = useI18n();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "nav.home" },
    { href: "/portfolio", label: "nav.portfolio" },
    { href: "/services", label: "nav.services" },
    { href: "/about", label: "nav.about" },
    { href: "/contact", label: "nav.contact" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 md:h-28 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center gap-2">
            <img 
              src="/assets/logo.png" 
              alt="wlsset design" 
              className="h-10 md:h-14 w-auto object-contain transition-transform hover:scale-105"
            />
          </a>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <a 
                className={`text-lg font-bold transition-colors hover:text-primary ${
                  isActive(link.href) ? "text-primary underline underline-offset-8" : "text-foreground"
                }`}
              >
                {t(link.label)}
              </a>
            </Link>
          ))}
          
          <div className="flex items-center gap-4 ml-4">
            <a
              href="https://www.instagram.com/wlsset.design"
              target="_blank"
              rel="noreferrer"
              className="text-foreground transition-all duration-200 hover:text-primary hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram className="h-6 w-6" />
            </a>
            <a
              href="https://www.behance.net/essamzibdeh3"
              target="_blank"
              rel="noreferrer"
              className="text-foreground transition-all duration-200 hover:text-primary hover:scale-110"
              aria-label="Behance"
            >
              <img src="/assets/behance.png" alt="Behance" className="h-6 w-6 object-contain" />
            </a>
            <BasketNavButton />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleLanguage}
              className="rounded-full hover:bg-black/5 h-12 w-12"
            >
              <Globe className="h-6 w-6" />
              <span className="sr-only">Toggle Language</span>
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-2">
          <a
            href="https://www.instagram.com/wlsset.design"
            target="_blank"
            rel="noreferrer"
            className="text-foreground transition-all duration-200 hover:text-primary hover:scale-110"
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <a
            href="https://www.behance.net/essamzibdeh3"
            target="_blank"
            rel="noreferrer"
            className="text-foreground transition-all duration-200 hover:text-primary hover:scale-110"
            aria-label="Behance"
          >
            <img src="/assets/behance.png" alt="Behance" className="h-5 w-5 object-contain" />
          </a>
          <BasketNavButton />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleLanguage}
            className="rounded-full hover:bg-black/5 h-10 w-10"
          >
            <span className="font-bold text-xs">{language.toUpperCase()}</span>
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side={language === 'ar' ? 'right' : 'left'} className="w-[85vw] max-w-sm border-black/5 bg-white/95 backdrop-blur-xl px-6">
              <div className="flex flex-col gap-6 mt-12">
                {links.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <a 
                      onClick={() => setIsOpen(false)}
                      className={`text-2xl font-semibold transition-colors hover:text-primary ${
                        isActive(link.href) ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {t(link.label)}
                    </a>
                  </Link>
                ))}
                <a
                  href="https://www.instagram.com/wlsset.design"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-foreground font-semibold transition-colors hover:text-primary"
                >
                  <Instagram className="h-5 w-5" />
                  Instagram
                </a>
                <a
                  href="https://www.behance.net/essamzibdeh3"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-foreground font-semibold transition-colors hover:text-primary"
                >
                  <img src="/assets/behance.png" alt="Behance" className="h-5 w-5 object-contain" />
                  Behance
                </a>
                <Link href="/contact">
                  <Button 
                    className="w-full font-bold bg-primary hover:bg-primary/90 py-6 text-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    {t("hero.cta")}
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

function BasketNavButton() {
  const { items, removeItem, clear, count } = useBasket();
  const { toast } = useToast();
  const [showSendOptions, setShowSendOptions] = useState(false);

  const buildMessage = () => {
    const lines = ["New service request:"];
    items.forEach((item) => {
      lines.push("");
      lines.push(`--- ${item.title} ---`);
      lines.push(`Name: ${item.details.name}`);
      lines.push(`Phone: ${item.details.phone}`);
      lines.push(`Email: ${item.details.email}`);
      lines.push(`Required Product: ${item.details.requiredProduct}`);
      lines.push(`Preferred Colors: ${item.details.preferredColors}`);
      lines.push(`Font Style: ${item.details.fontStyle}`);
      lines.push(`Design Notes: ${item.details.designNotes}`);
    });
    return lines.join("\n");
  };

  const saveOrder = async (channel: string) => {
    if (count === 0) return;
    const first = items[0].details;
    try {
      await apiRequest("POST", "/api/orders", {
        customerName: first.name,
        customerPhone: first.phone,
        customerEmail: first.email,
        channel,
        items: items.map((i) => ({
          title: i.title,
          requiredProduct: i.details.requiredProduct,
          preferredColors: i.details.preferredColors,
          fontStyle: i.details.fontStyle,
          designNotes: i.details.designNotes,
        })),
      });
    } catch {
      // silently fail — order delivery is more important than saving
    }
  };

  const handleSendWhatsApp = async () => {
    if (count === 0) return;
    await saveOrder("whatsapp");
    const msg = buildMessage();
    window.open(`https://wa.me/962775734836?text=${encodeURIComponent(msg)}`, "_blank");
    clear();
    setShowSendOptions(false);
  };

  const handleSendInstagram = async () => {
    if (count === 0) return;
    await saveOrder("instagram");
    const msg = buildMessage();
    try {
      await navigator.clipboard.writeText(msg);
      toast({
        title: "Order details copied!",
        description: "Paste this into your Instagram message to @wlsset.design",
      });
    } catch {
      toast({
        title: "Could not copy automatically",
        description: "Please copy the order manually.",
        variant: "destructive",
      });
    }
    window.open("https://www.instagram.com/wlsset.design", "_blank");
    clear();
    setShowSendOptions(false);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative rounded-full hover:bg-black/5 p-1 inline-flex items-center justify-center">
          <ShoppingBag className="h-5 w-5 md:h-6 md:w-6" />
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center text-[10px] font-bold bg-primary text-white rounded-full leading-none h-[18px] min-w-[18px] px-[4px]">
              {count}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="w-80 sm:w-96 p-0 bg-white border border-gray-200 shadow-xl">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-gray-900 font-bold text-base">Basket ({count})</h3>
          {count > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clear}
              className="text-gray-500 hover:text-gray-700 h-auto px-2 py-1 text-xs"
            >
              Clear all
            </Button>
          )}
        </div>

        {count === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            <ShoppingBag className="h-8 w-8 mx-auto mb-2 opacity-40" />
            No services selected
          </div>
        ) : (
          <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.id} className="px-4 py-3 group relative">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                    <div className="mt-1 text-xs text-gray-500 space-y-0.5">
                      <p>Product: {item.details.requiredProduct}</p>
                      <p>Colors: {item.details.preferredColors}</p>
                      <p>Font: {item.details.fontStyle}</p>
                      {item.details.designNotes && (
                        <p className="truncate" title={item.details.designNotes}>
                          Notes: {item.details.designNotes}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors shrink-0 mt-0.5"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {count > 0 && !showSendOptions && (
          <div className="p-4 border-t border-gray-100">
            <Button
              onClick={() => setShowSendOptions(true)}
              className="w-full bg-[#A30A0A] hover:bg-[#8B0808] text-white gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Complete Order
            </Button>
          </div>
        )}

        {count > 0 && showSendOptions && (
          <div className="p-4 border-t border-gray-100 space-y-2">
            <Button
              onClick={handleSendWhatsApp}
              className="w-full bg-[#A30A0A] hover:bg-[#8B0808] text-white gap-2 justify-start"
            >
              <MessageCircle className="h-4 w-4" />
              Send via WhatsApp
            </Button>
            <Button
              onClick={handleSendInstagram}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 gap-2 justify-start"
            >
              <Instagram className="h-4 w-4" />
              Send via Instagram
            </Button>
            <button
              onClick={() => setShowSendOptions(false)}
              className="w-full text-xs text-gray-400 hover:text-gray-600 text-center pt-1"
            >
              Back
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
