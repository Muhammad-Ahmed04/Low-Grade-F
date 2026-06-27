import { useState, useEffect } from "react";
import { List, X } from "@phosphor-icons/react";
import { NAV_LINKS } from "@/constants";

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <>
      <header
        data-testid="navbar"
        className="fixed top-0 w-full transition-all duration-300"
        style={{
          zIndex: 1000,
          backgroundColor: scrolled ? "rgba(0,0,0,0.96)" : "transparent",
          borderBottom: scrolled ? "1px solid rgba(192,192,192,0.18)" : "none",
          backdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <div className="w-full px-6 lg:px-16 h-20 md:h-24 flex items-center justify-between">
          <a href="#" data-testid="link-logo" className="flex items-center flex-shrink-0">
            <img src="/lgf-logo.png" alt="LOWGRADEFILMS" className="h-10 md:h-14 w-auto object-contain" />
          </a>

          <nav className="hidden md:flex gap-8 lg:gap-10 items-center">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                data-testid={`link-nav-${label.toLowerCase()}`}
                onClick={(e) => { e.preventDefault(); handleNavClick(href); }}
                className="text-xs font-medium tracking-widest uppercase text-gray-300 hover:text-white transition-colors whitespace-nowrap"
              >
                {label}
              </a>
            ))}
          </nav>

          <button
            data-testid="button-hamburger"
            className="md:hidden text-white flex items-center justify-center flex-shrink-0"
            style={{ minWidth: 44, minHeight: 44 }}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <List size={28} weight="light" />
          </button>
        </div>
      </header>

      {/* Mobile full-screen overlay — CSS transition, no library needed */}
      <div
        className="fixed inset-0 bg-black flex flex-col justify-center items-center"
        style={{
          zIndex: 1100,
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <button
          data-testid="button-close-menu"
          className="absolute top-6 right-6 text-white flex items-center justify-center"
          style={{ minWidth: 44, minHeight: 44 }}
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >
          <X size={32} weight="light" />
        </button>

        <nav className="flex flex-col gap-8 text-center">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              data-testid={`link-mobile-nav-${label.toLowerCase()}`}
              onClick={(e) => { e.preventDefault(); handleNavClick(href); }}
              className="font-display text-4xl text-chrome uppercase tracking-widest"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
