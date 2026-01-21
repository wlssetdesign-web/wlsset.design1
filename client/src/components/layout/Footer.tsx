import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  
  return (
    <footer className="border-t border-white/10 bg-background py-8 mt-auto z-10 relative">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
           <img 
              src="/assets/logo.png" 
              alt="wlsset design" 
              className="h-12 w-auto opacity-80 transition-transform hover:opacity-100"
            />
        </div>
        <p className="text-sm text-muted-foreground text-center md:text-right">
          {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
