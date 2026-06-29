import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { BTS_PHOTOS } from "@/constants";

export default function BehindTheLens() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".bts-anim",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const [large, ...rest] = BTS_PHOTOS;

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-black">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="mb-10 bts-anim">
          <h2 className="font-display text-5xl md:text-7xl uppercase tracking-wider text-chrome leading-tight">
            BEHIND THE LENS
          </h2>
          <p className="text-gray-500 tracking-widest uppercase text-sm mt-3">
            The craft behind every frame.
          </p>
        </div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-10">
          {/* Large left tile */}
          <div
            className="group relative overflow-hidden bg-[#0a0a0a] bts-anim"
            style={{ height: "clamp(300px, 55vw, 620px)" }}
          >
            <img
              src={large.src}
              alt={large.caption}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div
              className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"
              style={{ border: "1px solid rgba(192,192,192,0.3)" }}
            />
            <div
              className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)", zIndex: 2 }}
            >
              <p className="text-xs tracking-widest uppercase text-[#C0C0C0] font-medium">
                {large.caption}
              </p>
            </div>
          </div>

          {/* Right column: 2 stacked */}
          <div className="flex flex-col gap-3">
            {rest.map((item, i) => (
              <div
                key={i}
                className="group relative overflow-hidden bg-[#0a0a0a] bts-anim"
                style={{ height: "clamp(140px, 26vw, 300px)" }}
              >
                <img
                  src={item.src}
                  alt={item.caption}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"
                  style={{ border: "1px solid rgba(192,192,192,0.3)" }}
                />
                <div
                  className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)", zIndex: 2 }}
                >
                  <p className="text-xs tracking-widest uppercase text-[#C0C0C0] font-medium">
                    {item.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
