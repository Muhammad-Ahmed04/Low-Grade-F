import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Films from "@/components/sections/Films";
import About from "@/components/sections/About";
import Gallery from "@/components/sections/Gallery";
import Services from "@/components/sections/Services";
import BehindTheLens from "@/components/sections/BehindTheLens";
import Community from "@/components/sections/Community";
import Partners from "@/components/sections/Partners";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="bg-black min-h-screen text-white w-full overflow-x-hidden selection:bg-white selection:text-black">
      <Navbar />
      <main>
        <Hero />
        <Films />
        <Gallery />
        <About />
        <Services />
        <BehindTheLens />
        <Community />
        <Partners />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
