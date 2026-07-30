import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOutCubic = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const CameraGimbalScene = lazy(
  () => import("@/components/three/CameraGimbalScene"),
);

const TITLE_LINES = [
  { text: "BEING SEEN", className: "text-white", marginTop: "0", align: "left" },
  { text: "IS EASY.", className: "text-white", marginTop: "0.08em", align: "right" },
  {
    text: "BEING REMEMBERED",
    className: "text-chrome",
    marginTop: "0.08em",
    align: "left",
  },
  { text: "IS NOT.", className: "text-chrome", marginTop: "0.08em", align: "right" },
] as const;

const HUD_STATS = [
  {
    key: "activeClients",
    label: "ACTIVE CLIENTS",
    target: 15,
    suffix: "+",
    dot: { top: "37.2%", left: "74.6%" },
    text: { top: "30.4%", left: "78.1%", width: "8.2rem" },
    line: { x2: "78.0%", y2: "33.6%" },
  },
  {
    key: "projectsDone",
    label: "PROJECTS DONE",
    target: 250,
    suffix: "+",
    dot: { top: "50.1%", left: "61.1%" },
    text: { top: "46.5%", left: "52%", width: "7.8rem" },
    line: { x2: "59.85%", y2: "49.25%" },
  },
  {
    key: "gloriousYears",
    label: "GLORIOUS YEARS",
    target: 7,
    suffix: "+",
    dot: { top: "61.4%", left: "73.1%" },
    text: { top: "65.6%", left: "76.2%", width: "7.8rem" },
    line: { x2: "76.1%", y2: "67.8%" },
  },
] as const;

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
  const [hudValues, setHudValues] = useState({
    activeClients: 0,
    projectsDone: 0,
    gloriousYears: 0,
  });
  const hudStartedRef = useRef(false);
  const hudTweenRef = useRef<gsap.core.Tween | null>(null);

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

        // On aggressive flick-scrolls, the extra RAF smoothing can lag behind
        // enough to make the sequence look "broken". Rather than snapping
        // directly to the trigger progress, increase the catch-up strength so
        // the motion stays coherent without visibly popping.
        const delta = Math.abs(self.progress - smoothProgressRef.current);
        const velocity = Math.abs(self.getVelocity());
        const catchUpDelta = isMobile ? 0.2 : 0.15;
        const catchUpVelocity = isMobile ? 2400 : 1800;

        if (delta > catchUpDelta && velocity > catchUpVelocity) {
          const boostedProgress = gsap.utils.interpolate(
            smoothProgressRef.current,
            self.progress,
            isMobile ? 0.48 : 0.42,
          );
          smoothProgressRef.current = boostedProgress;
          setProgress(boostedProgress);
        }
      },
      onRefresh: (self) => {
        targetProgressRef.current = self.progress;
        smoothProgressRef.current = self.progress;
        setProgress(self.progress);
      },
      onLeave: () => {
        targetProgressRef.current = 1;
        smoothProgressRef.current = 1;
        setProgress(1);
      },
      onLeaveBack: () => {
        targetProgressRef.current = 0;
        smoothProgressRef.current = 0;
        setProgress(0);
      },
    });

    const tick = () => {
      const target = targetProgressRef.current;
      const current = smoothProgressRef.current;
      const delta = target - current;
      const magnitude = Math.abs(delta);
      const baseEase = isMobile ? 0.18 : 0.13;
      const adaptiveEase = Math.min(
        isMobile ? 0.34 : 0.28,
        baseEase + magnitude * (isMobile ? 0.38 : 0.32),
      );
      const next =
        magnitude < 0.0012 ? target : current + delta * adaptiveEase;

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

  useEffect(() => {
    const triggerPoint = 0.8;
    const resetPoint = 0.62;

    if (progress < resetPoint) {
      hudTweenRef.current?.kill();
      hudTweenRef.current = null;
      hudStartedRef.current = false;
      setHudValues((prev) => {
        if (
          prev.activeClients === 0 &&
          prev.projectsDone === 0 &&
          prev.gloriousYears === 0
        ) {
          return prev;
        }
        return {
          activeClients: 0,
          projectsDone: 0,
          gloriousYears: 0,
        };
      });
      return;
    }

    if (hudStartedRef.current || progress < triggerPoint) return;
    hudStartedRef.current = true;

    const proxy = {
      activeClients: 0,
      projectsDone: 0,
      gloriousYears: 0,
    };

    setHudValues({
      activeClients: 0,
      projectsDone: 0,
      gloriousYears: 0,
    });

    hudTweenRef.current?.kill();
    hudTweenRef.current = gsap.to(proxy, {
      activeClients: 15,
      projectsDone: 250,
      gloriousYears: 7,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        setHudValues({
          activeClients: Math.round(proxy.activeClients),
          projectsDone: Math.round(proxy.projectsDone),
          gloriousYears: Math.round(proxy.gloriousYears),
        });
      },
    });
  }, [progress]);

  useEffect(
    () => () => {
      hudTweenRef.current?.kill();
      hudTweenRef.current = null;
    },
    [],
  );

  /*
   * TIMELINE
   * 0.00–0.15  HOLD — user sees text1 centered, nothing moves
   * 0.15–0.22  seam line grows across
   * 0.22–0.42  panels close (eye-close)
   * 0.42–0.50  text1 fades out
   * 0.50–0.72  text2 rises in
   * 0.72–1.00  HOLD — user sees text2, then scrolls past
   */
  const visualProgress = clamp01(progress / (isMobile ? 0.9 : 0.86));

  const linePhase = clamp01(
    (visualProgress - (isMobile ? 0.12 : 0.08)) / (isMobile ? 0.08 : 0.06),
  );
  const panelPhase = clamp01(
    (visualProgress - (isMobile ? 0.2 : 0.14)) / (isMobile ? 0.18 : 0.14),
  );
  const text1Fade = clamp01(
    (visualProgress - (isMobile ? 0.38 : 0.28)) / (isMobile ? 0.08 : 0.07),
  );
  const swapPhase = clamp01(
    (visualProgress - (isMobile ? 0.48 : 0.35)) / (isMobile ? 0.2 : 0.18),
  );
  const titleDriftPhase = easeInOutCubic(
    clamp01((visualProgress - 0.01) / (isMobile ? 0.22 : 0.16)),
  );

  const panelVisible = visualProgress >= 0.08 ? 1 : 0;
  const lineVisible = panelPhase < (isMobile ? 0.88 : 0.96) ? panelVisible : 0;
  const stagePhase = clamp01(
    (visualProgress - (isMobile ? 0.76 : 0.7)) / (isMobile ? 0.12 : 0.14),
  );
  const rigPhase = isMobile
    ? clamp01((visualProgress - 0.67) / 0.2)
    : clamp01((visualProgress - 0.55) / 0.28);
  const rigSettlePhase = isMobile
    ? clamp01((visualProgress - 0.84) / 0.08)
    : clamp01((visualProgress - 0.78) / 0.08);
  // Hero line: fade in 0.40–0.48, hold 0.48–0.58, fade out 0.58–0.66.
  // Fully opaque during the hold, fully gone (0 opacity) by 0.66 —
  // guaranteed no overlap with the paragraph, which starts at 0.66.
  const paragraphPhase = clamp01(
    (visualProgress - (isMobile ? 0.73 : 0.65)) /
      (isMobile ? 0.08 : 0.09),
  );
  const easedRigSettlePhase = easeInOutCubic(rigSettlePhase);
  const titleDriftOffset = isMobile ? 4 : 9;

  rigProgressRef.current = rigPhase;
  rigPanRef.current = 0;

  return (
    <div
      ref={wrapperRef}
      id="about"
      style={{
        height: isMobile ? "252vh" : "306vh",
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
          <div
            style={{
              width: "100%",
              maxWidth: isMobile ? "22.5rem" : "min(70rem, 92vw)",
              margin: "0 auto",
              paddingInline: isMobile
                ? "clamp(0.65rem, 3.2vw, 1rem)"
                : "clamp(0.75rem, 1.5vw, 1.4rem)",
              overflow: "visible",
            }}
          >
            {TITLE_LINES.map((line, index) => (
              <div
                key={line.text}
                className={`${line.className} font-sans`}
                style={{
                  display: "block",
                  width: "100%",
                  boxSizing: "border-box",
                  textAlign: line.align as "left" | "right",
                  marginTop: line.marginTop,
                  paddingRight:
                    !isMobile && line.text === "BEING REMEMBERED"
                      ? "0.42em"
                      : isMobile && line.text === "BEING REMEMBERED"
                        ? "0.12em"
                        : "0",
                  transform: `translate3d(${index < 2 ? -titleDriftPhase * titleDriftOffset : titleDriftPhase * titleDriftOffset}px, 0, 0)`,
                  willChange: "transform",
                  fontSize:
                    isMobile
                      ? "clamp(1.38rem, 7.2vw, 2.4rem)"
                      : line.text === "BEING REMEMBERED"
                        ? "clamp(2.48rem, 6.15vw, 6.32rem)"
                        : "clamp(2.8rem, 6.8vw, 7rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.035em",
                  fontWeight: 850,
                  textTransform: "uppercase",
                }}
              >
                {isMobile && line.text === "BEING REMEMBERED" ? (
                  <>
                    <span style={{ display: "block", width: "100%", textAlign: "left" }}>
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
                top: isMobile ? "55.5%" : "50%",
                width: isMobile ? "auto" : "min(34rem, 44vw)",
                transform: isMobile
                  ? `translate3d(0, ${56 - stagePhase * 56}px, 0)`
                  : `translate3d(0, calc(${72 - stagePhase * 72}px - 50%), 0)`,
                willChange: "transform",
                opacity: paragraphPhase,
                textAlign: isMobile ? "center" : "initial",
              }}
            >
              <div
                style={{
                  position: "relative",
                  paddingTop: "clamp(1rem, 1.4vw, 1.25rem)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isMobile ? "center" : "stretch",
                }}
              >
                {!isMobile && (
                  <>
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
                  </>
                )}
                {isMobile && (
                  <div
                    style={{
                      display: "none",
                    }}
                  >
                    <span />
                  </div>
                )}
                <p
                  style={{
                    margin: 0,
                    color: "rgba(255,255,255,0.84)",
                    fontSize: isMobile
                      ? "clamp(0.95rem, 3.9vw, 1.1rem)"
                      : "clamp(1.02rem, 1.18vw, 1.28rem)",
                    lineHeight: isMobile ? 1.72 : 1.66,
                    fontWeight: 500,
                    letterSpacing: "-0.008em",
                    maxWidth: isMobile ? "18.5rem" : "29rem",
                    textAlign: isMobile ? "center" : "left",
                  }}
                >
                  LGF develops visual productions designed to stand apart from
                  the ordinary, combining refined execution with a relentless
                  attention to detail.
                </p>
                {isMobile && (
                  <div
                    style={{
                      marginTop: "1.35rem",
                      width: "100%",
                      maxWidth: "18.5rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "1rem",
                    }}
                  >
                    {HUD_STATS.map((stat) => (
                      <div
                        key={stat.key}
                        style={{
                          flex: 1,
                          minWidth: 0,
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "24px",
                            fontWeight: 700,
                            color: "#fff",
                            lineHeight: 1,
                          }}
                        >
                          {hudValues[stat.key]}
                          {stat.suffix}
                        </div>
                        <div
                          style={{
                            fontSize: "8px",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            color: "rgba(255,255,255,0.58)",
                            marginTop: "7px",
                            lineHeight: 1.3,
                          }}
                        >
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
              top: isMobile ? "35.5%" : "50%",
              width: isMobile ? "min(86vw, 480px)" : "min(46vw, 700px)",
              height: isMobile ? "min(48vh, 420px)" : "min(68vh, 720px)",
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

          {!isMobile && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 24,
                pointerEvents: "none",
                opacity: paragraphPhase,
                transition: "opacity 220ms linear",
              }}
            >
              <svg
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  overflow: "visible",
                }}
              >
                {HUD_STATS.map((stat) => (
                  <line
                    key={`${stat.key}-line`}
                    x1={stat.dot.left}
                    y1={stat.dot.top}
                    x2={stat.line.x2}
                    y2={stat.line.y2}
                    stroke="rgba(255,255,255,0.55)"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                ))}
              </svg>
              {HUD_STATS.map((stat) => (
                <div
                  key={stat.key}
                  style={{
                    position: "absolute",
                    inset: 0,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: stat.dot.top,
                      left: stat.dot.left,
                      width: "0.92rem",
                      height: "0.92rem",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "999px",
                        border: "1px solid rgba(255,255,255,0.4)",
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: "0.34rem",
                        height: "0.34rem",
                        borderRadius: "999px",
                        background: "#fff",
                        transform: "translate(-50%, -50%)",
                        boxShadow: "0 0 10px rgba(255,255,255,0.25)",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: stat.text.top,
                      left: stat.text.left,
                      width: stat.text.width,
                      padding: "0",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "2px",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "8px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.66)",
                        fontWeight: 600,
                        lineHeight: 1.1,
                      }}
                    >
                      {stat.label}
                    </div>
                    <div
                      style={{
                        fontSize: "clamp(1.55rem, 1.9vw, 2rem)",
                        lineHeight: 0.95,
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.96)",
                        textShadow: "0 0 10px rgba(255,255,255,0.1)",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {hudValues[stat.key]}
                      {stat.suffix}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
