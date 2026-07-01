import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export default function Films() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

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
    <section id="films" ref={sectionRef} className="bg-black section-shell-tight">
      <div className="text-center section-heading-wrap section-inner films-anim">
        <h2 className="section-heading text-white">SHORT FILMS</h2>
      </div>

      <div
        className="flex flex-col md:flex-row items-start justify-center mx-auto px-4 md:px-8 lg:px-10"
        style={{ gap: "clamp(1.5rem, 5vw, 82px)" }}
      >
        <div className="flex flex-col films-card films-anim">
          <div className="relative overflow-hidden films-panel-box" style={{ background: "#000" }}>
            {visible && (
              <iframe
                src="https://player.vimeo.com/video/1204904726?autoplay=1&muted=1&loop=1&background=1&playsinline=1&quality=auto"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="DESERT MACHINES"
                className="vimeo-cover"
                style={{ pointerEvents: "none" }}
              />
            )}
          </div>
          <div className="mt-4 px-1">
            <p
              className="ui-card-title text-white"
              style={{ fontSize: 20 }}
            >
              COMMERCIAL VENTURES
            </p>
            <a
              href="#"
              className="ui-cta-text inline-block mt-1"
              style={{ color: "#C0C0C0", textDecoration: "none" }}
            >
            Vision - Brand - Story
            </a>
          </div>
        </div>

        <div className="flex flex-col films-card films-anim">
          <div className="relative overflow-hidden films-panel-box" style={{ background: "#000" }}>
            {visible && (
              <iframe
                src="https://player.vimeo.com/video/1204904725?autoplay=1&muted=1&loop=1&background=1&playsinline=1&quality=auto"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="STEEL & SMOKE"
                className="vimeo-cover"
                style={{ pointerEvents: "none" }}
              />
            )}
          </div>
          <div className="mt-4 px-1">
            <p
              className="ui-card-title text-white"
              style={{ fontSize: 20 }}
            >
              DRIFT FEST
            </p>
            <a
              href="#"
              className="ui-cta-text inline-block mt-1"
              style={{ color: "#C0C0C0", textDecoration: "none" }}
            >
              Heat - Smoke - Slide
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
