import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  
  return (
    <footer className="border-t border-white/10 bg-background py-8 mt-auto z-10 relative">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-muted-foreground text-center">
          {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
