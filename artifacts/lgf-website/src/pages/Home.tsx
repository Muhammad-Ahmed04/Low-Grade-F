import PageShell from "@/components/layout/PageShell";
import RouteMeta from "@/components/seo/RouteMeta";
import Hero from "@/components/sections/Hero";
import Films from "@/components/sections/Films";
import About from "@/components/sections/About";
import Gallery from "@/components/sections/Gallery";
import Services from "@/components/sections/Services";
import Community from "@/components/sections/Community";
import Partners from "@/components/sections/Partners";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <PageShell>
      <RouteMeta path="/" />
      <Hero />
      <Films />
      <About />
      <Gallery />
      <Services />
      <Community />
      <Partners />
      <Contact />
    </PageShell>
  );
}
