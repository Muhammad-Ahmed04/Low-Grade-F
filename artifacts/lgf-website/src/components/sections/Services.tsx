import { useEffect, useRef, useState } from "react";
import { Car, Crosshair, Aperture } from "@phosphor-icons/react";
import { gsap } from "@/lib/gsap";
import { SERVICES } from "@/constants";

const ICON_MAP = { Car, Crosshair, Aperture } as const;
type IconName = keyof typeof ICON_MAP;

function ServiceCard({
  title,
  description,
  iconName,
  bgImage,
}: {
  title: string;
  description: string;
  iconName: IconName;
  bgImage: string;
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = ICON_MAP[iconName];

  return (
    <div
      className="group relative overflow-hidden bg-[#0a0a0a] surface-rounded services-anim"
      style={{
        minHeight: "clamp(320px, 34vw, 470px)",
        boxShadow: hovered ? "0 0 36px rgba(255,255,255,0.14)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={bgImage}
        alt={title}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out"
        style={{
          transform: "scale(1)",
          filter: hovered ? "brightness(1.16) saturate(1.08)" : "brightness(1) saturate(1)",
        }}
        draggable={false}
      />

      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: hovered ? 0.98 : 0.92,
          background:
            hovered
              ? "linear-gradient(to bottom, rgba(30,30,30,0.18) 0%, rgba(0,0,0,0.34) 34%, rgba(0,0,0,0.62) 100%)"
              : "linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.58) 34%, rgba(0,0,0,0.82) 100%)",
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: hovered ? 1 : 0,
          border: "1px solid rgba(255,255,255,0.18)",
        }}
      />

      <div className="relative h-full flex flex-col p-6 md:p-10" style={{ zIndex: 2 }}>
        <div
          className="mb-8 md:mb-10 text-white/90 transition-transform duration-300"
          style={{ transform: hovered ? "translateY(-2px)" : "translateY(0)" }}
        >
          <Icon size={42} weight="thin" />
        </div>

        <h3
          className="text-white uppercase font-bold"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(1.1rem, 1.7vw, 1.5rem)",
            lineHeight: 1.22,
            letterSpacing: "0.01em",
          }}
        >
          {title}
        </h3>

        <p
          className="mt-6 text-white/90"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(0.95rem, 1.15vw, 1.05rem)",
            lineHeight: 1.55,
            maxWidth: "20ch",
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".services-anim",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="section-shell bg-black">
      <div className="container mx-auto section-inner">
        <div className="text-center section-heading-wrap services-anim">
          <h2 className="section-heading text-chrome">WHAT WE DO</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8">
          {SERVICES.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              iconName={service.iconName}
              bgImage={service.bgImage}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
