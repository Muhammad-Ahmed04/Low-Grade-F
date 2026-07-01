import { useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { NAV_LINKS } from "@/constants";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
        className="absolute top-0 left-0 right-0"
        style={{ zIndex: 1000 }}
      >
        <div className="relative flex items-center justify-between px-6 lg:px-10 pt-5 md:pt-6">
          <a
            href="#"
            data-testid="link-logo"
            className="inline-flex items-center justify-center"
          >
            <img
              src="/lgf-logo.png"
              alt="LOWGRADEFILMS"
              className="h-8 md:h-10 w-auto object-contain"
            />
          </a>

          <button
            data-testid="button-hamburger"
            className="text-white/85 hover:text-white transition-colors flex items-center justify-center"
            style={{ minWidth: 44, minHeight: 44 }}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <List size={26} weight="light" />
          </button>
        </div>
      </header>

      <div
        className="fixed inset-0 bg-black/98 flex flex-col justify-center items-center"
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

        <nav className="flex flex-col gap-7 text-center">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              data-testid={`link-mobile-nav-${label.toLowerCase()}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(href);
              }}
              className="ui-card-title text-white"
              style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)" }}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
