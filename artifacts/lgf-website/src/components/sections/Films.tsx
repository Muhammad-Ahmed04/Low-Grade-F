import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { FILMS } from "@/constants";

const FILM_COPY = [
  {
    title: "GRAND REVEALS",
    label: "Corporate Event Filming",
  },
  {
    title: "STEEL & SMOKE",
    label: "Motorsports Event Coverages",
  },
] as const;

export default function Films() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".films-anim",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="films"
      ref={sectionRef}
      className="relative bg-black section-shell-tight"
    >
      <div className="text-center section-heading-wrap section-inner films-anim">
        <h2 className="section-heading text-white">SHORT FILMS</h2>
      </div>

      <div
        className="films-layout mx-auto px-4 md:px-6 lg:px-10"
        style={{ gap: "clamp(1.5rem, 5vw, 82px)" }}
      >
        {FILMS.map((film, index) => {
          const copy = FILM_COPY[index];
          return (
            <div key={film.id} className="films-card films-anim flex flex-col">
              <div
                className="films-panel-box surface-rounded relative overflow-hidden"
                style={{ background: "#000" }}
              >
                <div className="films-media-mask">
                  <iframe
                    src={film.vimeoSrc}
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    title={film.title}
                    className="vimeo-cover absolute inset-0"
                    style={{ pointerEvents: "none" }}
                  />
                </div>
              </div>

              <div className="mt-4 px-1">
                <p className="ui-card-title text-white" style={{ fontSize: 20 }}>
                  {copy.title}
                </p>
                <p
                  className="ui-cta-text mt-1 inline-block"
                  style={{ color: "#C0C0C0", textDecoration: "none" }}
                >
                  {copy.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
