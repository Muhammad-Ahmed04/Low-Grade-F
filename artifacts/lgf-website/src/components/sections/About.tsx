import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOutCubic = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const CameraGimbalScene = lazy(
  () => import("@/components/three/CameraGimbalScene"),
);

const TITLE_LINES = [
  { text: "BEING SEEN",       className: "text-white",  marginTop: "0",       align:"left", paddingLeft: "2.1em"},
  { text: "IS EASY.",         className: "text-white",  marginTop: "0.08em",  align: "center"},
  { text: "BEING REMEMBERED", className: "text-chrome", marginTop: "0.08em",  align: "center"},
  { text: "IS NOT.",          className: "text-chrome", marginTop: "0.08em",  align: "center", paddingLeft: "1.1em"},
];

export default function About() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinRef     = useRef<HTMLDivElement>(null);
  const rigProgressRef = useRef(1);
  const rigPanRef = useRef(1);
  const targetProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const track = wrapperRef.current;
    const pinEl = pinRef.current;
    if (!track || !pinEl) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targetProgressRef.current = 1;
      smoothProgressRef.current = 1;
      setProgress(1);
      return;
    }

    targetProgressRef.current = smoothProgressRef.current;

    const refresh = () => ScrollTrigger.refresh();
    const trigger = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: () => `+=${Math.max(1, track.offsetHeight - window.innerHeight)}`,
      pin: pinEl,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      scrub: true,
      fastScrollEnd: false,
      onUpdate: (self) => {
        targetProgressRef.current = self.progress;
      },
      onRefresh: (self) => {
        targetProgressRef.current = self.progress;
        smoothProgressRef.current = self.progress;
        setProgress(self.progress);
      },
    });

    const tick = () => {
      const target = targetProgressRef.current;
      const current = smoothProgressRef.current;
      const delta = target - current;
      const ease = isMobile ? 0.16 : 0.11;
      const next =
        Math.abs(delta) < 0.0015 ? target : current + delta * ease;

      smoothProgressRef.current = next;

      setProgress((prev) => {
        if (Math.abs(prev - next) < 0.0008) return prev;
        return next;
      });

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    const rafA = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(refresh);
    });
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh).catch(() => undefined);

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      window.cancelAnimationFrame(rafA);
      window.removeEventListener("load", refresh);
      trigger.kill();
    };
  }, [isMobile]);

  /*
   * TIMELINE
   * 0.00–0.15  HOLD — user sees text1 centered, nothing moves
   * 0.15–0.22  seam line grows across
   * 0.22–0.42  panels close (eye-close)
   * 0.42–0.50  text1 fades out
   * 0.50–0.72  text2 rises in
   * 0.72–1.00  HOLD — user sees text2, then scrolls past
   */
  const visualProgress = clamp01(progress / (isMobile ? 0.92 : 0.94));

  const linePhase    = clamp01((visualProgress - 0.12) / 0.06);
  const panelPhase   = clamp01((visualProgress - 0.18) / 0.15);
  const text1Fade    = clamp01((visualProgress - 0.33) / 0.07);
  const swapPhase    = clamp01((visualProgress - 0.4) / 0.18);

  const panelVisible = visualProgress >= 0.12 ? 1 : 0;
  const lineVisible  = panelPhase < 0.96 ? panelVisible : 0;
  const stagePhase = clamp01((visualProgress - 0.72) / 0.16);
  const rigPhase = isMobile
    ? clamp01((visualProgress - 0.66) / 0.3)
    : clamp01((visualProgress - 0.62) / 0.36);
  const rigSettlePhase = isMobile
    ? clamp01((visualProgress - 0.84) / 0.1)
    : clamp01((visualProgress - 0.86) / 0.1);
  // Hero line: fade in 0.40–0.48, hold 0.48–0.58, fade out 0.58–0.66.
  // Fully opaque during the hold, fully gone (0 opacity) by 0.66 —
  // guaranteed no overlap with the paragraph, which starts at 0.66.
  const heroInPhase = clamp01((visualProgress - 0.4) / 0.07);
  const heroFillPhase = clamp01((visualProgress - 0.48) / 0.18);
  const heroOutPhase = clamp01((visualProgress - 0.68) / 0.06);
  const heroLineOpacity = heroInPhase * (1 - heroOutPhase);
  const heroLinePhase = heroInPhase; // drives the slide-in transform only
  const paragraphPhase = clamp01((visualProgress - 0.72) / 0.1);
  const easedRigSettlePhase = easeInOutCubic(rigSettlePhase);

  rigProgressRef.current = rigPhase;
  rigPanRef.current = 0;

  return (
    <div
      ref={wrapperRef}
      id="about"
      style={{
        height: isMobile ? "360vh" : "320vh",
        position: "relative",
        background: "#000",
      }}
    >
      <div
        ref={pinRef}
        style={{
          width: "100%",
          height: "100vh",
          background: "#18181b",
          overflow: isMobile ? "clip" : "hidden",
          position: "relative",
          color: "#fff",
        }}
      >

        {/* ── Text 1 — already settled, no fly-in ──────────────────────── */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "clamp(140px, 18vw, 240px)",
            pointerEvents: "none",
            background:
              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.86) 18%, rgba(0,0,0,0.54) 42%, rgba(0,0,0,0.18) 68%, rgba(0,0,0,0) 100%)",
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            display: "flex",
            alignItems: "center",
            padding: "0 clamp(1.5rem, 4vw, 4rem)",
            opacity: 1 - text1Fade,
            willChange: "opacity",
          }}
        >
          <div style={{ width: "100%" }}>
            {TITLE_LINES.map((line) => (
              <div
                key={line.text}
                className={`${line.className} font-sans`}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: line.align as "left" | "right",
                  marginTop: line.marginTop,
                  paddingLeft: isMobile
                    ? line.text === "BEING SEEN"
                      ? "1.15em"
                      : line.text === "IS NOT."
                        ? "0.62em"
                        : "0"
                    : line.paddingLeft ?? "0",
                  fontSize: isMobile
                    ? "clamp(2.15rem, 10vw, 3.4rem)"
                    : "clamp(2.8rem, 6.8vw, 7rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  fontWeight: 900,
                  textTransform: "uppercase",
                }}
              >
                {isMobile && line.text === "BEING REMEMBERED" ? (
                  <>
                    <span
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        paddingLeft: "1.32em",
                      }}
                    >
                      BEING
                    </span>
                    <span style={{ display: "block" }}>REMEMBERED</span>
                  </>
                ) : (
                  line.text
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Eye-close panels ─────────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          {/* Seam line */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              width: "100%",
              height: "2px",
              transform: `translateY(-50%) scaleX(${linePhase})`,
              transformOrigin: "center center",
              background: "#000",
              opacity: lineVisible,
              willChange: "transform, opacity",
            }}
          />

          {/* TOP panel */}
          <div
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0,
              height: "50%",
              transform: `scaleY(${panelPhase})`,
              transformOrigin: "bottom center",
              background: "#000",
              opacity: panelVisible,
              willChange: "transform",
            }}
          />

          {/* BOTTOM panel */}
          <div
            style={{
              position: "absolute",
              bottom: 0, left: 0, right: 0,
              height: "50%",
              transform: `scaleY(${panelPhase})`,
              transformOrigin: "top center",
              background: "#000",
              opacity: panelVisible,
              willChange: "transform",
            }}
          />
        </div>

        {/* ── Text 2 ───────────────────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: isMobile
              ? "0 clamp(1.25rem, 5vw, 1.75rem)"
              : "0 clamp(2rem, 4vw, 3rem)",
            overflow: isMobile ? "clip" : "hidden",
          }}
        >
          {/*
            NOTE: the rig used to live *inside* this clip-path box, which meant
            two independent reveal animations (the clip-path sweep AND the
            rig's own opacity/transform) were fighting over the same tall
            element — that's what produced the visible "cut" as you scrolled.
            The rig now lives outside this box as its own sibling layer, so
            only the text block is masked by the clip-path.
          */}
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              clipPath: `inset(0 0 ${(1 - swapPhase) * 100}% 0)`,
              willChange: "clip-path",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: isMobile ? "clamp(1.25rem, 6vw, 1.75rem)" : "clamp(2rem, 8vw, 7rem)",
                right: isMobile ? "clamp(1.25rem, 6vw, 1.75rem)" : "auto",
                top: isMobile ? "70%" : "50%",
                width: isMobile ? "auto" : "min(34rem, 44vw)",
                transform: isMobile
                  ? `translate3d(0, ${56 - stagePhase * 56}px, 0)`
                  : `translate3d(0, calc(${72 - stagePhase * 72}px - 50%), 0)`,
                willChange: "transform",
                opacity: paragraphPhase,
                textAlign: isMobile ? "left" : "initial",
              }}
            >
              <div
                style={{
                  position: "relative",
                  paddingTop: "clamp(1rem, 1.4vw, 1.25rem)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "clamp(3.5rem, 5vw, 5.25rem)",
                    height: "1px",
                    background:
                      "linear-gradient(90deg, rgba(192,192,192,0.95), rgba(232,232,232,0.55), rgba(232,232,232,0))",
                    opacity: 0.92,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "-0.22rem",
                    width: "0.42rem",
                    height: "0.42rem",
                    borderRadius: "999px",
                    background: "#d9d9d9",
                    boxShadow: "0 0 16px rgba(255,255,255,0.22)",
                  }}
                />
                <p
                  style={{
                    margin: 0,
                    color: "#ffffff",
                    fontSize: isMobile
                      ? "clamp(1.1rem, 5vw, 1.45rem)"
                      : "clamp(1.35rem, 2vw, 2rem)",
                    lineHeight: 1.45,
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                  }}
                >
                  LGF develops visual productions designed to stand apart from
                  the ordinary, combining refined execution with a relentless
                  attention to detail.
                </p>
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                left: isMobile ? "50%" : "50%",
                top: isMobile ? "36%" : "50%",
                width: isMobile ? "min(18rem, 76vw)" : "min(28rem, 42vw)",
                transform: isMobile
                  ? `translate3d(-50%, ${18 - heroLinePhase * 18}px, 0)`
                  : `translate3d(${20 - heroLinePhase * 10}px, ${20 - heroLinePhase * 20}px, 0)`,
                opacity: heroLineOpacity,
                willChange: "transform, opacity",
                textAlign: isMobile ? "center" : "left",
              }}
            >
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  fontSize: "clamp(1.5rem, 2.4vw, 2.35rem)",
                  lineHeight: 1.18,
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                }}
              >
                <span
                  style={{
                    display: "block",
                    color: "rgba(255,255,255,0.28)",
                  }}
                >
                  Machines. Metal. Motion.
                </span>
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "block",
                    color: "#ffffff",
                    clipPath: `inset(0 ${100 - heroFillPhase * 100}% 0 0)`,
                    willChange: "clip-path",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  Machines. Metal. Motion.
                </span>
              </div>
            </div>
          </div>

          {/* ── 3D rig — now a sibling of the clip-path box, not a child ──
              It handles its own reveal entirely via opacity/transform below,
              and is properly centered with translateY(-50%) so its tall
              bounding box doesn't overflow into the section beneath. */}
          <div
            style={{
              position: "absolute",
              left: isMobile ? "48.5%" : "auto",
              right: isMobile ? "auto" : "clamp(5rem, 16vw, 14rem)",
              top: isMobile ? "35%" : "50%",
              width: isMobile ? "min(88vw, 500px)" : "min(46vw, 700px)",
              height: isMobile ? "min(52vh, 460px)" : "min(68vh, 720px)",
              pointerEvents: "none",
              filter: "drop-shadow(0 28px 70px rgba(0,0,0,0.46))",
              transform: isMobile
                ? `translate3d(calc(-50% + ${14 - easedRigSettlePhase * 14}px), calc(-50% + ${10 - easedRigSettlePhase * 10}px), 0)`
                : `translate3d(${48 - easedRigSettlePhase * 58}px, calc(-50% + ${18 - easedRigSettlePhase * 8}px), 0)`,
              transformOrigin: "center center",
              overflow: "visible",
              opacity: 0.14 + rigPhase * 0.86,
              willChange: "transform, opacity",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: isMobile
                  ? "0 0.55rem 0 0"
                  : "clamp(0.2rem, 0.8vw, 0.8rem) clamp(1.4rem, 3vw, 2.6rem) clamp(0.8rem, 1.8vw, 1.6rem) clamp(0.2rem, 0.8vw, 0.8rem)",
              }}
            >
              <Suspense fallback={null}>
                <CameraGimbalScene
                  progress={rigProgressRef}
                  panProgress={rigPanRef}
                />
              </Suspense>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
