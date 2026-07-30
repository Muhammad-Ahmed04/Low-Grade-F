import PageShell from "@/components/layout/PageShell";
import PageIntro from "@/components/layout/PageIntro";
import RouteMeta from "@/components/seo/RouteMeta";
import Contact from "@/components/sections/Contact";
import Partners from "@/components/sections/Partners";

export default function ContactPage() {
  return (
    <PageShell>
      <RouteMeta path="/contact" />
      <PageIntro
        title="Contact"
        description="Start a conversation with LOWGRADEFILMS for automotive, tactical, commercial, and launch-focused productions."
      />
      <Contact />
      <Partners />
    </PageShell>
  );
}
