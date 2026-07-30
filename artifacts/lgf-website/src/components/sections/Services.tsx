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
        minHeight: "clamp(340px, 35vw, 490px)",
        boxShadow: hovered ? "0 0 34px rgba(255,255,255,0.12)" : "none",
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
          transform: hovered ? "scale(1.025)" : "scale(1)",
          filter: hovered
            ? "brightness(1.12) saturate(1.06)"
            : "brightness(0.98) saturate(0.98)",
        }}
        draggable={false}
      />

      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: hovered ? 0.97 : 0.9,
          background:
            hovered
              ? "linear-gradient(to bottom, rgba(18,18,18,0.08) 0%, rgba(0,0,0,0.24) 34%, rgba(0,0,0,0.58) 100%)"
              : "linear-gradient(to bottom, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.5) 34%, rgba(0,0,0,0.82) 100%)",
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: hovered ? 1 : 0,
          border: "1px solid rgba(255,255,255,0.16)",
        }}
      />

      <div className="relative h-full flex flex-col p-6 md:p-10" style={{ zIndex: 2 }}>
        <div
          className="mb-8 md:mb-10 flex items-center justify-between transition-transform duration-300"
          style={{ transform: hovered ? "translateY(-2px)" : "translateY(0)" }}
        >
          <div
            className="text-white/92"
            style={{
              border: "1px solid rgba(232,232,232,0.16)",
              background: "rgba(0,0,0,0.24)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              borderRadius: "999px",
              padding: "0.75rem",
            }}
          >
            <Icon size={36} weight="thin" />
          </div>
        </div>

        <h3
          className="text-white uppercase font-bold"
          style={{
            fontSize: "clamp(1.08rem, 1.65vw, 1.42rem)",
            lineHeight: 1.08,
            letterSpacing: "0.01em",
            fontWeight: "var(--fw-heading)",
            maxWidth: "12ch",
          }}
        >
          {title}
        </h3>

        <p
          className="mt-4 text-white/68"
          style={{
            fontSize: "clamp(0.92rem, 0.98vw, 0.98rem)",
            lineHeight: 1.5,
            maxWidth: "22ch",
            fontWeight: "var(--fw-body)",
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
          <p
            className="ui-body mx-auto mt-4 text-white/70"
            style={{
              maxWidth: "42rem",
              fontSize: "clamp(0.98rem, 1.15vw, 1.08rem)",
              lineHeight: 1.62,
            }}
          >
            Purpose-built productions for machines, products, and brands that
            need sharper visual presence without losing clarity or restraint.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-10">
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
