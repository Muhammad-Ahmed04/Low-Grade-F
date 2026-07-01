import { InstagramLogo, LinkedinLogo } from "@phosphor-icons/react";
import { CONTACT } from "@/constants";

export default function Footer() {
  return (
    <footer className="bg-black py-8 md:py-10" style={{ borderTop: "1px solid rgba(192,192,192,0.2)" }}>
      <div className="container mx-auto px-5 md:px-6 lg:px-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 md:gap-6">

          <div className="flex items-center flex-shrink-0">
            <img src="/lgf-logo.png" alt="LOWGRADEFILMS" className="object-contain" style={{ height: 40, width: "auto", opacity: 0.8 }} />
          </div>

          <div className="text-gray-500 text-[11px] md:text-xs tracking-widest uppercase text-center order-3 md:order-2">
            © {new Date().getFullYear()} LOWGRADEFILMS. All rights reserved.
          </div>

          <div className="flex items-center gap-4 text-gray-400 order-2 md:order-3">
            <a
              data-testid="link-instagram"
              href={CONTACT.instagram}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors flex items-center justify-center"
              style={{ minWidth: 44, minHeight: 44 }}
              aria-label="Instagram"
            >
              <InstagramLogo size={24} weight="light" />
            </a>
            <a
              data-testid="link-linkedin"
              href={CONTACT.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors flex items-center justify-center"
              style={{ minWidth: 44, minHeight: 44 }}
              aria-label="LinkedIn"
            >
              <LinkedinLogo size={24} weight="light" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}
