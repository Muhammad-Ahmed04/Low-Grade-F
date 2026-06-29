import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const CameraGimbalScene = lazy(
  () => import("@/components/three/CameraGimbalScene"),
);

export default function About() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [show3D, setShow3D] = useState(false);

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow3D(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      progress.current = 1;
      return;
    }

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 78%",
      end: "center 48%",
      scrub: true,
      onUpdate: (self) => {
        progress.current = self.progress;
      },
    });

    return () => st.kill();
  }, []);

  return (
    // ✅ overflow-visible so the 3D scene can bleed outside section bounds
    <section
      id="about"
      className="relative py-24 md:py-32 bg-black text-white"
      style={{ overflow: "visible" }}
    >
      <div className="container mx-auto px-6 lg:px-16">
        {/*
         * ✅ The grid is now just a layout scaffold for the text column.
         * The 3D column is position:absolute so it escapes the grid box
         * and can overlap the text and bleed outside section edges.
         */}
        <div className="relative grid grid-cols-1 lg:grid-cols-2 items-center"
          style={{ minHeight: 620 }}
        >

          {/* Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="relative pl-6 md:pl-10 order-2 lg:order-1 py-12"
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

          {/*
           * ✅ 3D column — position:absolute so it's pulled out of grid flow.
           * It starts at the right half of the section and is intentionally
           * oversized (wider + taller than its grid slot) so the rig visually
           * spills over the text column and the section edges — the "flying" effect.
           * pointer-events:none means text/links behind it remain clickable.
           */}
          <div
            ref={sceneRef}
            className="order-1 lg:order-2"
            style={{
              position: "absolute",
              // Sit it in the right half but let it bleed left into the text
              right: "-8%",
              top: "50%",
              transform: "translateY(-50%)",
              // Deliberately oversized — wider than its grid column
              width: "70%",
              height: 780,
              zIndex: 10,
              pointerEvents: "none",
              // Mobile: full width, sits above text
              ...(typeof window !== "undefined" && window.innerWidth < 1024
                ? { position: "relative", right: "auto", top: "auto", transform: "none", width: "100%", height: 420 }
                : {}),
            }}
          >
            {show3D && (
              <Suspense fallback={null}>
                <CameraGimbalScene progress={progress} />
              </Suspense>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}