import { useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { WhatsappLogo } from "@phosphor-icons/react";
import { gsap } from "@/lib/gsap";
import { CONTACT } from "@/constants";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  name:        z.string().min(2, "Name is required"),
  email:       z.string().email("Invalid email address"),
  projectType: z.string().min(1, "Please select a project type"),
  message:     z.string().min(10, "Please provide more details"),
});

type FormValues = z.infer<typeof formSchema>;

const inputClass = "bg-[#0a0a0a] border-[#333] text-white placeholder:text-gray-600 focus-visible:ring-1 focus-visible:ring-gray-400 rounded-none h-12";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", projectType: "", message: "" },
  });

  const onSubmit = (values: FormValues) => {
    console.log(values);
    alert("Message received. We'll be in touch.");
    form.reset();
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".contact-anim",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="py-24 md:py-32 bg-black">
      <div className="container mx-auto px-6 lg:px-16">
        {/* Heading */}
        <div className="text-center mb-16 contact-anim">
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl uppercase tracking-wider text-chrome mb-4 leading-tight">
            LET'S CREATE SOMETHING.
          </h2>
          <p className="text-gray-400 text-base md:text-lg">
            Drop us a message or hit us on WhatsApp — we respond fast.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-5xl mx-auto">
          {/* Form */}
          <div className="contact-anim">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 uppercase tracking-widest text-xs">Name</FormLabel>
                    <FormControl>
                      <Input data-testid="input-name" placeholder="John Doe" {...field} className={inputClass} />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )} />

                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 uppercase tracking-widest text-xs">Email</FormLabel>
                    <FormControl>
                      <Input data-testid="input-email" placeholder="john@example.com" {...field} className={inputClass} />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )} />

                <FormField control={form.control} name="projectType" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 uppercase tracking-widest text-xs">Project Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-project-type" className="bg-[#0a0a0a] border-[#333] text-white focus:ring-1 focus:ring-gray-400 rounded-none h-12">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#0a0a0a] border-[#333] text-white rounded-none">
                        <SelectItem value="Automobile">Automobile</SelectItem>
                        <SelectItem value="Tactical">Tactical / Firearms</SelectItem>
                        <SelectItem value="Commercial">Commercial / Brand</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )} />

                <FormField control={form.control} name="message" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 uppercase tracking-widest text-xs">Message</FormLabel>
                    <FormControl>
                      <Textarea
                        data-testid="textarea-message"
                        placeholder="Tell us about your project..."
                        className="bg-[#0a0a0a] border-[#333] text-white placeholder:text-gray-600 focus-visible:ring-1 focus-visible:ring-gray-400 rounded-none min-h-[130px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )} />

                <button
                  data-testid="button-submit"
                  type="submit"
                  className="relative group w-full overflow-hidden"
                  style={{ height: 56 }}
                >
                  <div className="absolute inset-0 bg-chrome opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0" style={{ border: "1.5px solid rgba(232,232,232,0.6)" }} />
                  <span className="relative z-10 font-medium tracking-widest uppercase text-sm text-white group-hover:text-black transition-colors duration-300">
                    Send Message
                  </span>
                </button>
              </form>
            </Form>
          </div>

          {/* WhatsApp CTA */}
          <div className="flex flex-col gap-8 contact-anim">
            <div className="bg-[#0D0D0D] p-8 md:p-10 border border-[#1e1e1e] flex flex-col items-center text-center flex-1 justify-center min-h-[320px]">
              <div className="w-20 h-20 flex items-center justify-center mb-6" style={{ background: "rgba(37,211,102,0.1)", borderRadius: "50%" }}>
                <WhatsappLogo size={40} color="#25D366" weight="fill" />
              </div>
              <h3 className="font-display text-2xl md:text-3xl uppercase tracking-wide text-white mb-3">
                Prefer to chat?
              </h3>
              <p className="text-gray-400 mb-8 text-sm md:text-base">
                Message us directly on WhatsApp. We're online and ready to roll.
              </p>
              <a
                data-testid="link-whatsapp"
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-3 font-semibold px-8 py-4 uppercase tracking-widest text-sm transition-colors animate-pulse-green w-full"
                style={{ background: "#25D366", color: "#000", minHeight: 52 }}
              >
                <WhatsappLogo size={20} weight="fill" />
                Open WhatsApp
              </a>
            </div>

            <div className="text-center py-4">
              <p className="text-gray-600 uppercase tracking-widest text-xs mb-2">Or email us directly</p>
              <a
                data-testid="link-email"
                href={`mailto:${CONTACT.email}`}
                className="text-chrome font-medium tracking-wider hover:text-white transition-colors text-sm"
              >
                {CONTACT.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
