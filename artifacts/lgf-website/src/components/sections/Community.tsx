import { useRef, useEffect, useState } from "react";
import { gsap } from "@/lib/gsap";
import { BEHOLD_FEED_ID, CONTACT } from "@/constants";

export default function Community() {
  const sectionRef = useRef<HTMLElement>(null);
  // Defer the third-party Instagram widget (script + feed images) until the
  // section nears the viewport, so it never loads on initial page load.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Load Behold widget script once, only after the section is near.
  useEffect(() => {
    if (!visible) return;
    const d = document;
    if (d.querySelector('script[src="https://w.behold.so/widget.js"]')) return;
    const s = d.createElement("script");
    s.type = "module";
    s.src = "https://w.behold.so/widget.js";
    d.head.append(s);
  }, [visible]);

  // GSAP scroll reveal
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".community-anim",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
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

  return (
    <section id="community" ref={sectionRef} className="section-shell bg-black">
      <div className="container mx-auto section-inner">
        {/* Heading */}
        <div className="text-center section-heading-wrap community-anim">
          <h2 className="section-heading text-chrome mb-4">
            COMMUNITY
          </h2>
          <a
            href={CONTACT.instagram}
            target="_blank"
            rel="noreferrer"
            className="ui-eyebrow text-gray-400 hover:text-white transition-colors"
          >
            @lowgradefilms
          </a>
        </div>

        {/* Behold widget — mounts only when the section is near the viewport */}
        {visible && (
          <div
            className="community-anim"
            style={{ maxWidth: 1200, width: "100%", margin: "0 auto 48px" }}
            dangerouslySetInnerHTML={{
              __html: `<behold-widget feed-id="${BEHOLD_FEED_ID}"></behold-widget>`,
            }}
          />
        )}

        {/* Follow Us button */}
        <div className="flex justify-center community-anim">
          <a
            href={CONTACT.instagram}
            target="_blank"
            rel="noreferrer"
            className="group relative inline-flex items-center justify-center px-12 py-4 text-white transition-all duration-300 overflow-hidden surface-rounded"
            style={{ border: "1.5px solid rgba(192,192,192,0.5)", minHeight: 52 }}
          >
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(135deg, #C0C0C0, #E8E8E8, #A8A8A8)" }}
            />
            <span className="ui-cta-text relative z-10 group-hover:text-black transition-colors duration-300">
              FOLLOW US
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
