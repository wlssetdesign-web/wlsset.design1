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
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center gap-2">
            <img 
              src="/assets/logo.png" 
              alt="wlsset design" 
              className="h-10 w-auto object-contain"
            />
          </a>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <a 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.href) ? "text-primary font-bold" : "text-foreground"
                }`}
              >
                {t(link.label)}
              </a>
            </Link>
          ))}
          
          <div className="flex items-center gap-2 ml-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleLanguage}
              className="rounded-full hover:bg-black/5"
            >
              <Globe className="h-5 w-5" />
              <span className="sr-only">Toggle Language</span>
            </Button>
          </div>

          <Link href="/contact">
            <Button className="font-bold bg-primary hover:bg-primary/90 text-white">
              {t("hero.cta")}
            </Button>
          </Link>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleLanguage}
            className="rounded-full hover:bg-black/5"
          >
            <span className="font-bold text-xs">{language.toUpperCase()}</span>
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side={language === 'ar' ? 'right' : 'left'} className="w-[300px] border-black/5 bg-white/95 backdrop-blur-xl">
              <div className="flex flex-col gap-8 mt-10">
                {links.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <a 
                      onClick={() => setIsOpen(false)}
                      className={`text-lg font-medium transition-colors hover:text-primary ${
                        isActive(link.href) ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {t(link.label)}
                    </a>
                  </Link>
                ))}
                <Link href="/contact">
                  <Button 
                    className="w-full font-bold bg-primary hover:bg-primary/90"
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
