import { Link, useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Globe } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { t, toggleLanguage, language } = useI18n();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "nav.home" },
    { href: "/about", label: "nav.about" },
    { href: "/services", label: "nav.services" },
    { href: "/portfolio", label: "nav.portfolio" },
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
