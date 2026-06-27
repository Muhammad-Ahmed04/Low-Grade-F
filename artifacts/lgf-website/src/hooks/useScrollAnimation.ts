import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface ScrollAnimationOptions {
  y?: number;
  x?: number;
  duration?: number;
  delay?: number;
  ease?: string;
  start?: string;
}

/**
 * Attaches a GSAP ScrollTrigger fade-up animation to a single element.
 * Returns a ref — attach it to the element you want animated.
 * Cleans up the GSAP animation when the component unmounts.
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: ScrollAnimationOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const anim = gsap.fromTo(
      el,
      { opacity: 0, y: options.y ?? 40, x: options.x ?? 0 },
      {
        opacity: 1,
        y: 0,
        x: 0,
        duration: options.duration ?? 0.8,
        ease: options.ease ?? "power2.out",
        delay: options.delay ?? 0,
        scrollTrigger: {
          trigger: el,
          start: options.start ?? "top 85%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      anim.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, []);

  return ref;
}
