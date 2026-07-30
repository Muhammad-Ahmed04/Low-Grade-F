import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { PARTNER_LOGOS } from "@/constants";

function LogoItem({
  src,
  alt,
  scale = 1,
}: {
  src: string;
  alt: string;
  scale?: number;
}) {
  return (
    <div
      style={{
        flex: "0 0 clamp(132px, 12vw, 190px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "clamp(132px, 12vw, 190px)",
        padding: "0 clamp(12px, 2.2vw, 22px)",
        height: "clamp(68px, 7vw, 88px)",
        overflow: "visible",
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="partner-logo"
        style={{ transform: `scale(${scale})` }}
      />
    </div>
  );
}

export default function Partners() {
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;

    const anim = gsap.fromTo(el,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      }
    );

    return () => { anim.kill(); };
  }, []);

  return (
    <section id="partners" className="section-shell-tight bg-black overflow-hidden">
      <div ref={headingRef} className="text-center section-heading-wrap">
        <h2 className="section-heading text-chrome">
          TRUSTED BY
        </h2>
      </div>

      <div
        className="relative w-full overflow-hidden bg-[#050505] marquee-wrapper"
        style={{
          borderTop: "1px solid rgba(192,192,192,0.15)",
          borderBottom: "1px solid rgba(192,192,192,0.15)",
          borderRadius: 0,
        }}
      >
        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 pointer-events-none" style={{ width: "clamp(60px, 10vw, 160px)", background: "linear-gradient(to right, #050505 20%, transparent)", zIndex: 10 }} />
        <div className="absolute right-0 top-0 bottom-0 pointer-events-none" style={{ width: "clamp(60px, 10vw, 160px)", background: "linear-gradient(to left, #050505 20%, transparent)", zIndex: 10 }} />

        {/* Marquee track — two sets for seamless loop */}
        <div className="marquee-track" style={{ padding: "clamp(18px, 4vw, 28px) 0" }}>
          {PARTNER_LOGOS.map((logo, i) => <LogoItem key={`a-${i}`} src={logo.src} alt={logo.alt} scale={logo.scale} />)}
          {PARTNER_LOGOS.map((logo, i) => <LogoItem key={`b-${i}`} src={logo.src} alt={logo.alt} scale={logo.scale} />)}
        </div>
      </div>
    </section>
  );
}
