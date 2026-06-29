import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { useDragScroll } from "@/hooks/useDragScroll";
import { GALLERY_PHOTOS } from "@/constants";

export default function Gallery() {
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const stripRef    = useDragScroll<HTMLDivElement>();

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;

    const anim = gsap.fromTo(el,
      { opacity: 0, x: -40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      }
    );

    return () => { anim.kill(); };
  }, []);

  return (
    // ✅ FIX: Removed border-t border-[#111] — same white line cause as Films.tsx
    <section id="work" className="py-24 md:py-32 bg-black">
      <div className="px-6 lg:px-16 mb-12">
        <h2
          ref={headingRef}
          className="font-display uppercase tracking-wider text-chrome"
          style={{ fontSize: "clamp(4rem, 10vw, 10rem)", lineHeight: 0.9, opacity: 0 }}
        >
          THE WORK
        </h2>
      </div>

      <div
        ref={stripRef}
        data-testid="gallery-strip"
        className="flex px-6 lg:px-16 select-none touch-pan-x"
        style={{
          gap: 0,
          overflowX: "auto",
          overflowY: "visible",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {GALLERY_PHOTOS.map((photo, i) => (
          <div
            key={i}
            data-testid={`card-gallery-${i}`}
            className="group relative overflow-hidden bg-[#111] flex-shrink-0"
            style={{ width: 320, height: 480, marginRight: 3 }}
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
              style={{ background: "rgba(0,0,0,0.55)", zIndex: 2, pointerEvents: "none" }}
            >
              <span className="font-display text-xl tracking-[0.25em] text-chrome uppercase">
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