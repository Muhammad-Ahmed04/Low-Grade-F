import type { ReactNode } from "react";
import { useEffect } from "react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

export default function PageShell({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      window.requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
      });
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return (
    <div className="bg-black min-h-screen text-white w-full overflow-x-hidden selection:bg-white selection:text-black">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
