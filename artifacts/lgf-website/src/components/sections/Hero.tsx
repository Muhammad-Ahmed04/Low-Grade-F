import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { VIMEO_HERO } from "@/constants";

const HERO_LOADER_MIN_DURATION = 900;
const HERO_LOADER_CURSOR_SIZE = 170;
const HERO_LOADER_MOBILE_QUERY = "(max-width: 767px)";

function LoaderLogo({
  tone,
}: {
  tone: "dark" | "chrome";
}) {
  const filter =
    tone === "dark"
      ? "brightness(0) saturate(100%)"
      : "grayscale(1) brightness(1.16) contrast(1.06) drop-shadow(0 0 16px rgba(255,255,255,0.14))";

  return (
    <img
      src="/lgf-logo.png"
      alt="LGF"
      style={{
        width: "64%",
        height: "auto",
        display: "block",
        filter,
        animation: "lgf-loader-logo-breathe 3.2s ease-in-out infinite",
      }}
    />
  );
}

export default function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const loaderLogoRef = useRef<HTMLDivElement>(null);
  const loaderCardRef = useRef<HTMLDivElement>(null);
  const loaderCursorRef = useRef<HTMLDivElement>(null);
  const loaderCardRevealRef = useRef<HTMLDivElement>(null);
  const exitTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const loaderStartRef = useRef(0);
  const [showLoader, setShowLoader] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [isMobileLoader, setIsMobileLoader] = useState(false);

  useEffect(() => {
    loaderStartRef.current = performance.now();
    setShowLoader(true);
  }, []);

  useEffect(() => {
    const media = window.matchMedia(HERO_LOADER_MOBILE_QUERY);
    const sync = () => setIsMobileLoader(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!heroReady) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        [headlineRef.current, taglineRef.current, ctaRef.current, arrowRef.current],
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          stagger: 0.22,
          delay: 0.3,
        },
      );
    });

    return () => ctx.revert();
  }, [heroReady]);

  useEffect(() => {
    if (!showLoader) return;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const introTimeline = gsap.timeline();
    introTimeline.fromTo(
      loaderLogoRef.current,
      { autoAlpha: 0, y: 14, scale: 0.96 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
      },
    );

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      introTimeline.kill();
    };
  }, [showLoader]);

  useEffect(() => {
    if (!showLoader || !videoReady || !loaderRef.current) return;

    const elapsed = performance.now() - loaderStartRef.current;
    const remaining = Math.max(0, HERO_LOADER_MIN_DURATION - elapsed);

    const finishLoader = () => {
      exitTimelineRef.current?.kill();
      exitTimelineRef.current = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          document.documentElement.style.overflow = "";
          setShowLoader(false);
          setHeroReady(true);
        },
      });

      exitTimelineRef.current.to(
          loaderRef.current,
          {
            autoAlpha: 0,
            scale: 1.015,
            duration: 0.6,
            ease: "power2.out",
          },
        );
    };

    const timeout = window.setTimeout(finishLoader, remaining);

    return () => {
      window.clearTimeout(timeout);
      exitTimelineRef.current?.kill();
      exitTimelineRef.current = null;
    };
  }, [showLoader, videoReady]);

  useEffect(
    () => () => {
      exitTimelineRef.current?.kill();
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    },
    [],
  );

  const handleLoaderPointerMove = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (isMobileLoader) return;

    const loaderEl = loaderRef.current;
    const cardEl = loaderCardRef.current;
    const cursorEl = loaderCursorRef.current;
    const revealEl = loaderCardRevealRef.current;

    if (!loaderEl || !cursorEl) return;

    const loaderRect = loaderEl.getBoundingClientRect();
    const pointerX = event.clientX - loaderRect.left;
    const pointerY = event.clientY - loaderRect.top;

    cursorEl.style.opacity = "1";
    cursorEl.style.transform = `translate3d(${pointerX - HERO_LOADER_CURSOR_SIZE / 2}px, ${pointerY - HERO_LOADER_CURSOR_SIZE / 2}px, 0)`;

    if (!cardEl || !revealEl) {
      return;
    }

    const cardRect = cardEl.getBoundingClientRect();
    const insideCard =
      event.clientX >= cardRect.left &&
      event.clientX <= cardRect.right &&
      event.clientY >= cardRect.top &&
      event.clientY <= cardRect.bottom;

    if (!insideCard) {
      revealEl.style.opacity = "0";
      return;
    }

    const cardX = event.clientX - cardRect.left;
    const cardY = event.clientY - cardRect.top;
    revealEl.style.opacity = "1";
    revealEl.style.clipPath = `circle(${HERO_LOADER_CURSOR_SIZE / 2}px at ${cardX}px ${cardY}px)`;
    revealEl.style.webkitClipPath = `circle(${HERO_LOADER_CURSOR_SIZE / 2}px at ${cardX}px ${cardY}px)`;
  };

  const handleLoaderPointerLeave = () => {
    loaderCursorRef.current?.style.setProperty("opacity", "0");
    loaderCardRevealRef.current?.style.setProperty("opacity", "0");
  };

  return (
    <section className="relative h-[100dvh] w-full bg-black">
      {showLoader && (
        <div
          ref={loaderRef}
          onMouseMove={handleLoaderPointerMove}
          onMouseEnter={handleLoaderPointerMove}
          onMouseLeave={handleLoaderPointerLeave}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 5000,
            background: "#000000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            overflow: "hidden",
          }}
        >
          {!isMobileLoader && (
            <div
              ref={loaderCursorRef}
              aria-hidden="true"
              className="pointer-events-none absolute rounded-full bg-white"
              style={{
                left: 0,
                top: 0,
                width: HERO_LOADER_CURSOR_SIZE,
                height: HERO_LOADER_CURSOR_SIZE,
                mixBlendMode: "difference",
                zIndex: 2,
                opacity: 0,
                transform: "translate3d(-9999px, -9999px, 0)",
                willChange: "transform, opacity",
                transition: "opacity 120ms ease-out",
              }}
            />
          )}
          <div
            ref={loaderLogoRef}
            className="relative"
            style={{
              width: isMobileLoader ? "min(10rem, 42vw)" : "min(42rem, 92vw)",
              minHeight: isMobileLoader ? "min(10rem, 42vw)" : "min(42rem, 92vw)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: isMobileLoader ? "1.25rem" : "2rem",
              overflow: "visible",
              zIndex: 1,
            }}
          >
            {isMobileLoader ? (
              <>
                <div
                  aria-hidden="true"
                  style={{
                    pointerEvents: "none",
                    position: "absolute",
                    inset: "-18%",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.075), rgba(255,255,255,0.022) 34%, rgba(255,255,255,0.006) 54%, rgba(0,0,0,0) 76%)",
                    filter: "blur(24px)",
                    opacity: 0.8,
                  }}
                />
                <div
                  aria-hidden="true"
                  style={{
                    pointerEvents: "none",
                    position: "absolute",
                    inset: "-42%",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03), rgba(255,255,255,0.008) 42%, rgba(0,0,0,0) 74%)",
                    filter: "blur(38px)",
                    opacity: 0.55,
                  }}
                />
                <div
                  aria-hidden="true"
                  style={{
                    position: "relative",
                    zIndex: 1,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LoaderLogo tone="chrome" />
                </div>
              </>
            ) : (
              <>
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: "10%",
                    borderRadius: "999px",
                    background:
                      "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.045), rgba(255,255,255,0.012) 44%, rgba(0,0,0,0) 76%)",
                    pointerEvents: "none",
                    zIndex: 0,
                    filter: "blur(18px)",
                  }}
                />
                <div
                  ref={loaderCardRef}
                  className="relative overflow-hidden"
                  style={{
                    textAlign: "center",
                    zIndex: 1,
                    width: "min(18rem, 60vw)",
                    aspectRatio: "1 / 1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "2.5rem",
                    background: "#ffffff",
                    boxShadow:
                      "0 28px 90px rgba(0,0,0,0.32), 0 0 0 1px rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: "1px",
                      borderRadius: "calc(2.5rem - 1px)",
                      border: "1px solid rgba(0,0,0,0.04)",
                      pointerEvents: "none",
                      zIndex: 0,
                    }}
                  />
                  <div
                    style={{
                      position: "relative",
                      zIndex: 1,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LoaderLogo tone="dark" />
                  </div>
                  <div
                    ref={loaderCardRevealRef}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 overflow-hidden"
                    style={{
                      zIndex: 2,
                      transition: "opacity 120ms ease-out",
                      opacity: 0,
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <LoaderLogo tone="chrome" />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <style>{`
            @keyframes lgf-loader-logo-breathe {
              0%, 100% {
                transform: scale(1);
                opacity: 0.96;
              }
              50% {
                transform: scale(1.028);
                opacity: 1;
              }
            }
          `}</style>
        </div>
      )}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        <iframe
          src={VIMEO_HERO}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          title="Hero background"
          className="vimeo-cover absolute inset-0"
          style={{ pointerEvents: "none" }}
          onLoad={() => setVideoReady(true)}
        />
      </div>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 120% 100% at 50% 40%, transparent 30%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.82) 100%)",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: "rgba(0,0,0,0.35)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "22%",
          zIndex: 2,
          pointerEvents: "none",
          background:
            "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: -2,
          left: 0,
          right: 0,
          height: "45%",
          zIndex: 2,
          pointerEvents: "none",
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.65) 55%, #000000 100%)",
        }}
      />

      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6"
        style={{ zIndex: 10 }}
      >
        <h1
          ref={headlineRef}
          className="section-heading-xl text-white text-center max-w-[12ch]"
          style={{
            opacity: 0,
            fontSize: "clamp(2.35rem, 7.4vw, 5.8rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.04em",
            textWrap: "balance",
          }}
        >
          BUILT TO BE REMEMBERED.
        </h1>
        <p
          ref={taglineRef}
          className="ui-body text-center font-legacy"
          style={{
            fontSize: "clamp(0.98rem, 1.5vw, 1.18rem)",
            lineHeight: 1.55,
            color: "rgba(232,232,232,0.82)",
            maxWidth: "36rem",
            marginTop: "1rem",
            opacity: 0,
          }}
        >
          International visual productions for automotive, tactical, and
          commercial brands that need sharper presence and lasting recall.
        </p>
        <div
          ref={ctaRef}
          className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          style={{ opacity: 0 }}
        >
          <a
            href="#work"
            className="group relative inline-flex min-w-[190px] items-center justify-center overflow-hidden surface-rounded px-8 py-4 text-white transition-all duration-300"
            style={{
              minHeight: 52,
              border: "1.5px solid rgba(255,255,255,0.85)",
              background: "#ffffff",
              color: "#000000",
            }}
          >
            <span className="ui-cta-text relative z-10 transition-colors duration-300 group-hover:text-white">
              VIEW WORK
            </span>
            <span
              aria-hidden="true"
              className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: "linear-gradient(135deg, #0f0f12, #1b1b20)" }}
            />
          </a>
          <a
            href="#contact"
            className="group relative inline-flex min-w-[190px] items-center justify-center overflow-hidden surface-rounded px-8 py-4 text-white transition-all duration-300"
            style={{
              minHeight: 52,
              border: "1.5px solid rgba(192,192,192,0.48)",
              background: "rgba(0,0,0,0.24)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))" }}
            />
            <span className="ui-cta-text relative z-10 text-white transition-colors duration-300">
              START A PROJECT
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
