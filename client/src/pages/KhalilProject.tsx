import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function KhalilProject({ onClose }: { onClose: () => void }) {
  return (
    <div className="w-full bg-white overflow-y-auto">
      {/* Fixed Close Button */}
      <div className="fixed top-20 right-4 z-50">
        <Button
          onClick={onClose}
          className="bg-[#A30A0A] hover:bg-[#8B0808] text-white rounded-full p-3"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Logo Section - Clean White Background */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full min-h-screen flex items-center justify-center bg-white px-4"
      >
        <div className="max-w-xl w-full">
          <img
            src="/images/KHALIL-LOGO-RGB2.jpg"
            alt="Khalil Barber Shop Logo"
            className="w-full h-auto object-contain"
          />
        </div>
      </motion.section>

      {/* Text Block Section - Turquoise Background */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full min-h-screen flex items-center justify-center px-4 py-20"
        style={{ backgroundColor: "#1D695A" }}
      >
        <div className="max-w-3xl">
          <p className="text-lg md:text-2xl font-bold text-white leading-relaxed text-center md:text-left"
            style={{ fontFamily: "'Quicksand', sans-serif" }}>
            Khalil – Men's Barbershop | Amman, Jordan I designed a custom logo for Khalil, a men's barbershop located in Amman, Jordan. The business was built from the ground up, and the logo I created has become its official brand identity. I carefully selected colors that reflect the values of the brand — particularly turquoise, symbolizing cleanliness, renewal, and clarity. The logo was designed using Arabic typography, combining two classic yet still popular calligraphic styles: Thuluth and Diwani.
          </p>
        </div>
      </motion.section>

      {/* Brand Identity & Palette Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full min-h-screen flex items-center justify-center bg-white px-4 py-20"
      >
        <div className="max-w-6xl w-full">
          <img
            src="/images/image_0380f9.png"
            alt="Khalil Brand Identity and Color Palette"
            className="w-full h-auto object-contain"
          />
        </div>
      </motion.section>
    </div>
  );
}
