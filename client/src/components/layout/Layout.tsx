import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useI18n } from "@/lib/i18n";

export function Layout({ children }: { children: React.ReactNode }) {
  const { direction } = useI18n();

  return (
    <div className="min-h-screen flex flex-col relative bg-background" dir={direction}>
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
        <div 
          className="absolute inset-[-100px] animate-fall transition-all dark:invert-0 invert"
          style={{
            backgroundImage: "url('/assets/pattern.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "400px",
          }}
        />
        {/* Gradient Overlay to fade bottom/top */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background/80" />
      </div>

      <Navbar />
      
      <main className="flex-1 pt-20 relative z-10">
        {children}
      </main>

      <Footer />
    </div>
  );
}
