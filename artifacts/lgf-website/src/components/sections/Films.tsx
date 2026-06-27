import { useRef, useEffect, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { FILMS } from "@/constants";

export default function Films() {
  const sectionRef = useRef<HTMLElement>(null);
  // Defer the two Vimeo players until the section is near the viewport so they
  // don't load on initial page load.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".films-anim",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="films" ref={sectionRef} className="bg-black border-t border-[#111] py-20 md:py-28">
      {/* Heading */}
      <div className="text-center mb-10 md:mb-14 px-6 films-anim">
        <h2
          className="font-display text-white uppercase tracking-wider"
          style={{ fontSize: "clamp(3rem, 7vw, 7rem)", lineHeight: 0.95 }}
        >
          SHORT FILMS
        </h2>
      </div>

      {/* Panels */}
      <div className="flex flex-col md:flex-row items-start justify-center mx-auto px-6" style={{ gap: 24 }}>
        {/* Film 1 */}
        <div className="flex flex-col films-card films-anim">
          <div className="relative overflow-hidden films-panel-box" style={{ borderRadius: 12, background: "#000" }}>
            {visible && (
              <iframe
                src="https://player.vimeo.com/video/1204904726?autoplay=1&muted=1&loop=1&background=1&playsinline=1&quality=auto"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="DESERT MACHINES"
                className="vimeo-cover"
                style={{ pointerEvents: "none" }}
              />
            )}
          </div>
          <div className="mt-4 px-1">
            <p className="font-display text-white uppercase" style={{ fontSize: 20, letterSpacing: "0.04em", lineHeight: 1.2 }}>
              DESERT MACHINES
            </p>
            <a href="#" className="inline-block mt-1 uppercase font-semibold tracking-widest" style={{ fontSize: 12, color: "#C0C0C0", textDecoration: "none" }}>
              EXPERIENCE ›
            </a>
          </div>
        </div>

        {/* Film 2 */}
        <div className="flex flex-col films-card films-anim">
          <div className="relative overflow-hidden films-panel-box" style={{ borderRadius: 12, background: "#000" }}>
            {visible && (
              <iframe
                src="https://player.vimeo.com/video/1204904725?autoplay=1&muted=1&loop=1&background=1&playsinline=1&quality=auto"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="STEEL & SMOKE"
                className="vimeo-cover"
                style={{ pointerEvents: "none" }}
              />
            )}
          </div>
          <div className="mt-4 px-1">
            <p className="font-display text-white uppercase" style={{ fontSize: 20, letterSpacing: "0.04em", lineHeight: 1.2 }}>
              STEEL & SMOKE
            </p>
            <a href="#" className="inline-block mt-1 uppercase font-semibold tracking-widest" style={{ fontSize: 12, color: "#C0C0C0", textDecoration: "none" }}>
              EXPLORE ›
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
