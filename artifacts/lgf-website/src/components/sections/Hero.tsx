import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { VIMEO_HERO } from "@/constants";

export default function Hero() {
  const logoRef    = useRef<HTMLImageElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const arrowRef   = useRef<HTMLDivElement>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
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
      gsap.fromTo(
        [logoRef.current, taglineRef.current, arrowRef.current],
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out", stagger: 0.22, delay: 0.3 }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative w-full h-[100dvh] overflow-hidden bg-black">

      {/* Instant poster — shows while video defers */}
      <img
        src="/photos/hero-car.JPG"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
        draggable={false}
      />

      {/* Vimeo background — deferred until idle, fades in over poster */}
      {showVideo && (
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            pointerEvents: "none",
            zIndex: 0,
            opacity: videoReady ? 1 : 0,
            transition: "opacity 0.8s ease"
          }}
        >
          <iframe
            src={VIMEO_HERO}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            className="vimeo-cover"
            title="Hero background"
            style={{ pointerEvents: "none" }}
            onLoad={() => setVideoReady(true)}
          />
        </div>
      )}

      {/* Vignette — darkens edges all around */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          background: `radial-gradient(ellipse 120% 100% at 50% 40%,
            transparent 30%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.82) 100%)`,
        }}
      />

      {/* Bottom fade — blends into black page below */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: "45%", zIndex: 2, pointerEvents: "none",
          background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.65) 55%, #000 100%)",
        }}
      />

      {/* Top fade — softens top edge behind logo */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: "22%", zIndex: 2, pointerEvents: "none",
          background: "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.35)", pointerEvents: "none", zIndex: 1 }}
      />

      {/* Centered content */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6"
        style={{ zIndex: 10 }}
      >
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

      {/* Bouncing arrow */}
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