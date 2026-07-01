import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const CameraGimbalScene = lazy(
  () => import("@/components/three/CameraGimbalScene"),
);

export default function About() {
  const trackRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const panProgress = useRef(0);
  const [show3D, setShow3D] = useState(false);
  const [copyOpacity, setCopyOpacity] = useState(0);

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
      { rootMargin: "900px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      progress.current = 1;
      panProgress.current = 1;
      setCopyOpacity(1);
      return;
    }

    const dockTrigger = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "center 66%",
      scrub: true,
      onUpdate: (self) => {
        progress.current = self.progress;
      },
    });

    const panTrigger = ScrollTrigger.create({
      trigger: el,
      start: "center 66%",
      end: "center center",
      scrub: 0.35,
      onUpdate: (self) => {
        panProgress.current = self.progress;
        setCopyOpacity(self.progress);
      },
    });

    return () => {
      dockTrigger.kill();
      panTrigger.kill();
    };
  }, []);

  return (
    <section
      id="about"
      className="relative section-shell-tight bg-black text-white pb-0"
      style={{
        overflow: "visible",
        zIndex: 1,
        paddingTop: "clamp(3rem, 5vw, 5rem)",
        paddingBottom: 0,
      }}
    >
      <div className="container mx-auto section-inner">
        <div
          ref={trackRef}
          className="relative grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-0 min-h-[760px] lg:min-h-[740px]"
        >
          <motion.div
            className="relative pl-6 md:pl-10 order-2 lg:order-1 py-4 md:py-12 max-w-[34rem]"
            style={{
              zIndex: 5,
              opacity: copyOpacity,
              transform: `translate3d(0, ${40 - copyOpacity * 40}px, 0)`,
            }}
          >
            <div
              className="absolute left-0 top-0 bottom-0 w-[2px]"
              style={{
                background:
                  "linear-gradient(to bottom, #C0C0C0, #E8E8E8, #C0C0C0)",
                opacity: 0.8,
              }}
            />
            <h2 className="section-heading text-chrome mb-8 leading-tight">
              LOWGRADEFILMS
            </h2>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light mb-4">
              Machines. Metal. Motion.
            </p>
            <p className="text-base text-gray-500 leading-relaxed font-light">
              An international production house that turns horsepower and steel
              into cinema. If it's fast, loud, or dangerous — we know how to
              make it look like it.
            </p>
          </motion.div>

          <div
            ref={sceneRef}
            className="order-1 lg:order-2 mb-2 lg:mb-0"
            style={{
              position: "absolute",
              left: "50%",
              top: "34%",
              transform: "translate(-50%, -50%)",
              width: "min(1680px, 146vw)",
              height: 700,
              zIndex: 20,
              pointerEvents: "none",
              ...(typeof window !== "undefined" && window.innerWidth < 1024
                ? {
                    position: "relative",
                    left: "auto",
                    top: "auto",
                    transform: "none",
                    width: "100%",
                    height: 360,
                    zIndex: 10,
                    marginBottom: 8,
                  }
                : {}),
            }}
          >
            {show3D && (
              <Suspense fallback={null}>
                <CameraGimbalScene progress={progress} panProgress={panProgress} />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
