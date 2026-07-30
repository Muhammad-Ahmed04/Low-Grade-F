import PageShell from "@/components/layout/PageShell";
import PageIntro from "@/components/layout/PageIntro";
import RouteMeta from "@/components/seo/RouteMeta";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Partners from "@/components/sections/Partners";

export default function AboutPage() {
  return (
    <PageShell>
      <RouteMeta path="/about" />
      <PageIntro
        title="About"
        description="An international production house turning machines, metal, and motion into distinctive visual work."
      />
      <About />
      <Services />
      <Partners />
    </PageShell>
  );
}
