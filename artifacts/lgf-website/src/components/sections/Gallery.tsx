import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { useDragScroll } from "@/hooks/useDragScroll";
import { GALLERY_PHOTOS } from "@/constants";

export default function Gallery() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const stripRef = useDragScroll<HTMLDivElement>();

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;

    const anim = gsap.fromTo(
      el,
      { opacity: 0, x: -40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      },
    );

    return () => {
      anim.kill();
    };
  }, []);

  return (
    <section id="work" className="section-shell bg-black" style={{ paddingTop: 0 }}>
      <div className="section-inner section-heading-wrap text-center">
        <h2
          ref={headingRef}
          className="section-heading-xl text-chrome"
          style={{ opacity: 0 }}
        >
          THE WORK
        </h2>
      </div>

      <div
        ref={stripRef}
        data-testid="gallery-strip"
        className="flex section-inner select-none"
        style={{
          gap: "clamp(0.4rem, 1vw, 0.75rem)",
          overflowX: "auto",
          overflowY: "visible",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-y pinch-zoom",
        }}
      >
        {GALLERY_PHOTOS.map((photo, i) => (
          <div
            key={i}
            data-testid={`card-gallery-${i}`}
            className="group relative overflow-hidden bg-[#111] flex-shrink-0 surface-rounded"
            style={{
              width: "clamp(260px, 78vw, 320px)",
              height: "clamp(390px, 112vw, 480px)",
            }}
          >
            <img
              src={photo.src}
              alt={photo.label}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              draggable={false}
              style={{ pointerEvents: "none", display: "block" }}
            />
            <div
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-500 opacity-0 group-hover:opacity-100"
              style={{
                background: "rgba(0,0,0,0.55)",
                zIndex: 2,
                pointerEvents: "none",
              }}
            >
              <span className="ui-card-title text-chrome" style={{ fontSize: 20 }}>
                {photo.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      <style>{`[data-testid="gallery-strip"]::-webkit-scrollbar { display: none; }`}</style>
    </section>
  );
}
