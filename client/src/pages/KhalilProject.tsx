import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import khalilLogo from "@assets/KHALIL-LOGO-RGB2_1774922516039.jpg";

export default function KhalilProject({ onClose }: { onClose: () => void }) {
  const colors = [
    { hex: "#206D5F", rgb: "32 109 95", cmyk: "85 34 65 21" },
    { hex: "#1D695A", rgb: "29 105 90", cmyk: "86 38 67 24" },
    { hex: "#1A5B50", rgb: "26 91 80", cmyk: "87 42 67 32" },
    { hex: "#FFFFFF", rgb: "255 255 255", cmyk: "0 0 0 0" },
    { hex: "#1C1C1C", rgb: "28 28 28", cmyk: "0 0 0 89" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Close Button */}
      <div className="fixed top-20 right-4 z-50">
        <Button
          onClick={onClose}
          className="bg-[#A30A0A] hover:bg-[#8B0808] text-white rounded-full px-6"
        >
          Close
        </Button>
      </div>

      {/* Logo Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen flex items-center justify-center bg-white px-4"
      >
        <img
          src={khalilLogo}
          alt="Khalil Barber Shop Logo"
          className="max-w-md w-full object-contain"
        />
      </motion.div>

      {/* Text Block Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: "#1D695A" }}
      >
        <div className="max-w-2xl">
          <p className="text-xl md:text-2xl font-bold text-white leading-relaxed">
            Khalil – Men's Barbershop | Amman, Jordan I designed a custom logo
            for Khalil, a men's barbershop located in Amman, Jordan. The
            business was built from the ground up, and the logo I created has
            become its official identity. The design reflects the barbershop's
            commitment to precision, craftsmanship, and modern elegance. Through
            careful calligraphy and geometric shapes, the logo captures the
            essence of traditional barbering merged with contemporary style.
          </p>
        </div>
      </motion.div>

      {/* Color Palette Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-16"
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-12">Color Palette</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 w-full max-w-6xl">
          {colors.map((color) => (
            <motion.div
              key={color.hex}
              whileHover={{ scale: 1.05 }}
              className="rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200 transition-all"
            >
              <div
                className="aspect-square"
                style={{ backgroundColor: color.hex }}
              />
              <div className="p-4 bg-white">
                <p className="font-bold text-gray-800 mb-2">{color.hex}</p>
                <p className="text-xs text-gray-600 mb-1">RGB: {color.rgb}</p>
                <p className="text-xs text-gray-600">CMYK: {color.cmyk}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
