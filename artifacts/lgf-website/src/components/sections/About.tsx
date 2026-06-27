import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const CameraGimbalScene = lazy(
  () => import("@/components/three/CameraGimbalScene"),
);

export default function About() {
  // The 3D column is the ScrollTrigger trigger, so the assembly always plays as
  // it scrolls into view — independent of column order (3D sits first on mobile).
  const sceneRef = useRef<HTMLDivElement>(null);
  // Live scroll progress (0 → 1) for the 3D scene. A plain ref so updating it
  // from ScrollTrigger never triggers a React re-render.
  const progress = useRef(0);
  // Only mount the heavy three.js scene (its ~1 MB chunk + models) once the
  // About section is near the viewport — keeps the initial page load light.
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
      // Start loading ~one screen early so it's ready by the time it's in view.
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;

    // Respect reduced-motion: skip the scroll choreography, show it assembled.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      progress.current = 1;
      return;
    }

    const st = ScrollTrigger.create({
      trigger: el,
      // Start a little after the scene enters and finish as it nears centre, so
      // the user actually scrolls through (and watches) the assembly.
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
    <section
      id="about"
      className="py-24 md:py-32 bg-black text-white border-t border-[#111] overflow-hidden"
    >
      <div className="container mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Text Column — below the 3D on mobile, left on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="relative pl-6 md:pl-10 order-2 lg:order-1"
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

          {/* 3D Column — camera + gimbal assemble as you scroll. First on mobile,
              right on desktop, so the animation is seen before the copy. */}
          <div
            ref={sceneRef}
            className="relative h-[420px] sm:h-[500px] lg:h-[620px] order-1 lg:order-2"
            style={{ zIndex: 1 }}
          >
            {show3D && (
              <Suspense fallback={null}>
                <CameraGimbalScene progress={progress} />
              </Suspense>
            )}
            {/* CC-BY attribution for the two Poly Pizza models */}
            <p className="absolute bottom-0 right-0 text-[10px] leading-tight text-gray-600/70 select-none pointer-events-none">
              {/* 3D: “DJI RS3 Mini gimbal” by MisterGoodDeal · “Video Camera” by dook (CC-BY) */}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
