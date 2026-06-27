import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { VIMEO_HERO } from "@/constants";

export default function Hero() {
  const logoRef   = useRef<HTMLImageElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const arrowRef  = useRef<HTMLDivElement>(null);
  // Show a lightweight poster instantly; defer the heavy Vimeo player until the
  // browser is idle so it never blocks first paint (big mobile win).
  const [showVideo, setShowVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    // On mobile or data-saver / slow connections, keep the poster only — the
    // heavy background video isn't worth the bandwidth there.
    const conn = (navigator as any).connection;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const saveData = conn?.saveData === true;
    const slow = typeof conn?.effectiveType === "string" && /(^|\b)(2g|slow-2g)/.test(conn.effectiveType);
    if (isMobile || saveData || slow) return;

    const start = () => setShowVideo(true);
    const ric = (window as any).requestIdleCallback as
      | ((cb: () => void, opts?: { timeout: number }) => number)
      | undefined;
    let idleId: number | undefined;
    let toId: number | undefined;
    if (ric) idleId = ric(start, { timeout: 2500 });
    else toId = window.setTimeout(start, 1200);
    return () => {
      if (idleId !== undefined) (window as any).cancelIdleCallback?.(idleId);
      if (toId !== undefined) clearTimeout(toId);
    };
  }, []);

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
      {/* Instant poster — keeps the hero rich while the video loads */}
      <img
        src="/photos/hero-car.JPG"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
        draggable={false}
      />

      {/* Vimeo ambient background — deferred until idle, fades in over the poster */}
      {showVideo && (
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            pointerEvents: "none",
            zIndex: 0,
            opacity: videoReady ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        >
          <iframe
            src={VIMEO_HERO}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="vimeo-cover"
            title="Hero background"
            style={{ pointerEvents: "none" }}
            onLoad={() => setVideoReady(true)}
          />
        </div>
      )}

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
