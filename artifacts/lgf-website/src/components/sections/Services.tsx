import { useState, useRef, useEffect } from "react";
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
  delay,
}: {
  title: string;
  description: string;
  iconName: IconName;
  bgImage: string;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = ICON_MAP[iconName];

  return (
    <div
      className="relative overflow-hidden transition-all duration-500"
      style={{
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? "0 0 40px rgba(192,192,192,0.22)" : "none",
        animationDelay: `${delay}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* BG photo */}
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: hovered ? "scale(1.06)" : "scale(1)",
        }}
      />

      {/* Overlay */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          background: hovered
            ? "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.72) 100%)"
            : "linear-gradient(180deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.88) 100%)",
        }}
      />

      {/* Silver top border */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] bg-chrome transition-opacity duration-500"
        style={{ opacity: hovered ? 1 : 0.4, zIndex: 2 }}
      />

      {/* Content */}
      <div className="relative p-8 md:p-10" style={{ zIndex: 1 }}>
        <div
          className="mb-8 transition-all duration-300"
          style={{
            color: hovered ? "#ffffff" : "#c8c8c8",
            filter: hovered
              ? "drop-shadow(0px 4px 24px rgba(220,220,220,0.6))"
              : "drop-shadow(0px 4px 12px rgba(180,180,180,0.2))",
          }}
        >
          <Icon size={56} weight="thin" />
        </div>
        <h3 className="font-display text-2xl md:text-3xl uppercase tracking-wide text-white mb-4 leading-tight">
          {title}
        </h3>
        <p className="text-gray-300 font-light leading-relaxed text-sm md:text-base">
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
      gsap.fromTo(".services-anim",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="py-24 md:py-32 bg-black border-t border-[#111]">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="text-center mb-16 services-anim">
          <h2 className="font-display text-5xl md:text-7xl uppercase tracking-wider text-chrome mb-4">
            WHAT WE DO
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {SERVICES.map((svc, i) => (
            <div key={svc.id} className="services-anim">
              <ServiceCard
                title={svc.title}
                description={svc.description}
                iconName={svc.iconName}
                bgImage={svc.bgImage}
                delay={i * 0.15}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
