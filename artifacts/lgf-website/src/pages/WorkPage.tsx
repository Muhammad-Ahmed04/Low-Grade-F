import PageShell from "@/components/layout/PageShell";
import PageIntro from "@/components/layout/PageIntro";
import RouteMeta from "@/components/seo/RouteMeta";
import Films from "@/components/sections/Films";
import Gallery from "@/components/sections/Gallery";
import Services from "@/components/sections/Services";
import Community from "@/components/sections/Community";

export default function WorkPage() {
  return (
    <PageShell>
      <RouteMeta path="/work" />
      <PageIntro
        title="Work"
        description="Short films, gallery features, and campaign production across automotive, tactical, and commercial storytelling."
      />
      <Films />
      <Gallery />
      <Services />
      <Community />
    </PageShell>
  );
}
