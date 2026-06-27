import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { VIMEO_HERO } from "@/constants";

export default function Hero() {
  const logoRef   = useRef<HTMLImageElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const arrowRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered entrance: logo → tagline → arrow
      gsap.fromTo(
        [logoRef.current, taglineRef.current, arrowRef.current],
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          stagger: 0.22,
          delay: 0.3,
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative w-full h-[100dvh] overflow-hidden bg-black">
      {/* Vimeo ambient background */}
      <div className="absolute inset-0 overflow-hidden" style={{ pointerEvents: "none", zIndex: 0 }}>
        <iframe
          src={VIMEO_HERO}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="vimeo-cover"
          title="Hero background"
          style={{ pointerEvents: "none" }}
        />
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.45)", pointerEvents: "none", zIndex: 1 }}
      />

      {/* Centered content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6" style={{ zIndex: 10 }}>
        <img
          ref={logoRef}
          src="/lgf-logo.png"
          alt="LOWGRADEFILMS"
          className="object-contain mb-8"
          style={{ height: "clamp(80px, 14vw, 180px)", width: "auto", opacity: 0 }}
          draggable={false}
        />
        <p
          ref={taglineRef}
          className="font-display text-chrome text-center uppercase tracking-[0.35em]"
          style={{ fontSize: "clamp(0.9rem, 2.2vw, 1.5rem)", opacity: 0 }}
        >
          Automobile.&nbsp; Tactical.&nbsp; Commercial.
        </p>
      </div>

      {/* Bouncing down arrow */}
      <div
        ref={arrowRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 arrow-bounce"
        style={{ zIndex: 10, width: 24, height: 24, opacity: 0 }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="rgba(192,192,192,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  );
}
