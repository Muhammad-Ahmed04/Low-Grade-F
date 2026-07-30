import { useEffect, useRef, useState } from "react";

type LazyVimeoBackgroundProps = {
  src: string;
  poster: string;
  title: string;
  className?: string;
  rootMargin?: string;
  iframeClassName?: string;
};

export default function LazyVimeoBackground({
  src,
  poster,
  title,
  className,
  rootMargin = "320px 0px",
  iframeClassName = "vimeo-cover",
}: LazyVimeoBackgroundProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setActive(entry.isIntersecting);
        if (!entry.isIntersecting) {
          setReady(false);
        }
      },
      {
        rootMargin,
        threshold: 0.01,
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={shellRef} className={`relative ${className ?? ""}`.trim()}>
      <img
        src={poster}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      {active ? (
        <div
          className="absolute inset-0 overflow-hidden hero-video-shell"
          style={{
            opacity: ready ? 1 : 0,
            transition: "opacity 0.55s ease",
            pointerEvents: "none",
          }}
        >
          <iframe
            src={src}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            className={iframeClassName}
            title={title}
            style={{ pointerEvents: "none" }}
            onLoad={() => setReady(true)}
          />
        </div>
      ) : null}
    </div>
  );
}
