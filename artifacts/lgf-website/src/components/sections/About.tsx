import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-black text-white border-t border-[#111] overflow-hidden">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-center">

          {/* Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="relative pl-6 md:pl-10"
            style={{ zIndex: 2 }}
          >
            <div
              className="absolute left-0 top-0 bottom-0 w-[2px]"
              style={{ background: "linear-gradient(to bottom, #C0C0C0, #E8E8E8, #C0C0C0)", opacity: 0.8 }}
            />
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl uppercase tracking-wider text-chrome mb-8 leading-tight">
              LOWGRADEFILMS
            </h2>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light mb-4">
              A Karachi-based creative production house built for the bold. We specialize in making machines, metal, and firepower look extraordinary on camera. From supercar shoots in the desert to tactical firearms content — we don't just document. We craft cinema.
            </p>
            <p className="text-base text-gray-500 leading-relaxed font-light">
              Every frame is intentional. Every angle is earned. This is filmmaking at full throttle.
            </p>
          </motion.div>

          {/* Image Column — gun barrel breakout on desktop */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
            style={{ zIndex: 1 }}
          >
            {/* Desktop: breakout effect — image overflows left into text area */}
            <div
              className="hidden lg:block relative"
              style={{ overflow: "visible" }}
            >
              <img
                src="/photos/about-photo.JPG"
                alt="LOWGRADEFILMS — tactical photography"
                className="w-full object-cover object-center"
                style={{
                  height: "clamp(400px, 55vh, 650px)",
                  transform: "translateX(-60px)",
                  boxShadow: "-24px 0 60px rgba(0,0,0,0.7)",
                  filter: "contrast(1.05) brightness(0.95)",
                  display: "block",
                }}
              />
            </div>

            {/* Mobile: standard image, no breakout */}
            <div className="lg:hidden relative h-[50vh] overflow-hidden">
              <img
                src="/photos/about-photo.JPG"
                alt="LOWGRADEFILMS — tactical photography"
                className="w-full h-full object-cover object-center"
                style={{ filter: "contrast(1.05) brightness(0.95)" }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
