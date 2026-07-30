import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useDragScroll } from "@/hooks/useDragScroll";
import { GALLERY_PHOTOS } from "@/constants";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function Gallery() {
  const introRef = useRef<HTMLDivElement>(null);
  const stripRef = useDragScroll<HTMLDivElement>();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activePhoto = activeIndex === null ? null : GALLERY_PHOTOS[activeIndex];

  const goToPrevious = () => {
    setActiveIndex((current) => {
      if (current === null) return current;
      return current === 0 ? GALLERY_PHOTOS.length - 1 : current - 1;
    });
  };

  const goToNext = () => {
    setActiveIndex((current) => {
      if (current === null) return current;
      return current === GALLERY_PHOTOS.length - 1 ? 0 : current + 1;
    });
  };

  useEffect(() => {
    const el = introRef.current;
    if (!el) return;

    const anim = gsap.fromTo(
      el.querySelectorAll("[data-gallery-intro-item]"),
      { opacity: 0, y: 22 },
      {
        opacity: 1,
        y: 0,
        duration: 0.72,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 85%" },
      },
    );

    return () => {
      anim.kill();
    };
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPrevious();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex]);

  return (
    <>
      <section id="work" className="section-shell bg-black pt-12 md:pt-0">
        <div ref={introRef} className="section-inner section-heading-wrap text-center">
          <h2
            data-gallery-intro-item
            className="section-heading-xl text-chrome"
            style={{ opacity: 0 }}
          >
            THE WORK
          </h2>
          <p
            data-gallery-intro-item
            className="ui-body mx-auto mt-4 text-white/70"
            style={{
              maxWidth: "42rem",
              fontSize: "clamp(0.98rem, 1.15vw, 1.08rem)",
              lineHeight: 1.62,
            }}
          >
            A tightly edited selection across automotive, tactical, and
            commercial productions. Open any frame to move through the full
            gallery.
          </p>
        </div>

        <div
          ref={stripRef}
          data-testid="gallery-strip"
          className="flex section-inner select-none work-strip"
          style={{
            gap: "clamp(0.5rem, 1vw, 0.85rem)",
            overflowX: "auto",
            overflowY: "visible",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-x pan-y pinch-zoom",
            overscrollBehaviorX: "contain",
          }}
        >
          {GALLERY_PHOTOS.map((photo, i) => (
            <button
              key={i}
              type="button"
              data-testid={`card-gallery-${i}`}
              aria-label={`Open ${photo.label.toLowerCase()} gallery image ${
                i + 1
              }`}
              className="group relative overflow-hidden bg-[#111] flex-shrink-0 surface-rounded work-card text-left"
              style={{
                width: "clamp(272px, 23vw, 342px)",
                height: "clamp(412px, 31vw, 520px)",
                scrollSnapAlign: "start",
              }}
              onClick={() => setActiveIndex(i)}
            >
              <img
                src={photo.src}
                alt={photo.label}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                draggable={false}
                style={{ pointerEvents: "none", display: "block" }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.04) 38%, rgba(0,0,0,0.28) 68%, rgba(0,0,0,0.74) 100%)",
                  zIndex: 1,
                  pointerEvents: "none",
                }}
              />
              <div
                className="absolute left-4 top-4 md:left-5 md:top-5"
                style={{
                  zIndex: 3,
                  pointerEvents: "none",
                  border: "1px solid rgba(232,232,232,0.16)",
                  background: "rgba(0,0,0,0.24)",
                  backdropFilter: "blur(4px)",
                  WebkitBackdropFilter: "blur(4px)",
                  borderRadius: "999px",
                  padding: "0.42rem 0.7rem",
                }}
              >
                <span className="ui-eyebrow text-white/76">{photo.label}</span>
              </div>
              <div
                className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-12 md:px-5 md:pb-5"
                style={{ zIndex: 3, pointerEvents: "none" }}
              >
              </div>
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  zIndex: 2,
                  border: "1px solid rgba(232,232,232,0.18)",
                  pointerEvents: "none",
                }}
              />
            </button>
          ))}
        </div>

        <style>{`
          [data-testid="gallery-strip"]::-webkit-scrollbar { display: none; }

          @media (max-width: 767px) {
            .work-strip {
              gap: 0.75rem;
            }

            .work-card {
              width: min(74vw, 300px) !important;
              height: min(112vw, 430px) !important;
            }
          }

          @media (min-width: 768px) {
            .work-strip {
              scroll-snap-type: x proximity;
            }

            .work-card:nth-child(3n + 2) {
              width: clamp(292px, 24.8vw, 370px) !important;
            }

            .work-card:nth-child(3n) {
              width: clamp(258px, 21.8vw, 320px) !important;
            }
          }
        `}</style>
      </section>

      <Dialog
        open={activeIndex !== null}
        onOpenChange={(open) => {
          if (!open) setActiveIndex(null);
        }}
      >
        <DialogContent
          className="max-h-[92vh] max-w-[min(94vw,1200px)] overflow-hidden border-white/10 bg-black/96 p-0 text-white shadow-[0_24px_120px_rgba(0,0,0,0.7)]"
        >
          {activePhoto && (
            <div className="relative overflow-hidden surface-rounded">
              <div className="relative flex h-[min(92vh,860px)] min-h-0 items-center justify-center bg-black">
                <img
                  src={activePhoto.src}
                  alt={activePhoto.label}
                  className="h-full max-h-full w-full object-contain"
                  draggable={false}
                />

                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/14 bg-black/42 text-white/82 backdrop-blur-sm transition hover:border-white/28 hover:bg-black/62 hover:text-white focus:outline-none"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  aria-label="Next image"
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/14 bg-black/42 text-white/82 backdrop-blur-sm transition hover:border-white/28 hover:bg-black/62 hover:text-white focus:outline-none"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                <div
                  className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/12 bg-black/46 px-4 py-2 backdrop-blur-sm"
                  style={{
                    fontFamily: "var(--font-primary)",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                  }}
                >
                  {String(activeIndex! + 1).padStart(2, "0")} /{" "}
                  {String(GALLERY_PHOTOS.length).padStart(2, "0")}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
