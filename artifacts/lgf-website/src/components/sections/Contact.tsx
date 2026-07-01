import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { WhatsappLogo } from "@phosphor-icons/react";
import { gsap } from "@/lib/gsap";
import { CONTACT } from "@/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  projectType: z.string().min(1, "Please select a project type"),
  message: z.string().min(10, "Please provide more details"),
});

type FormValues = z.infer<typeof formSchema>;

const inputClass =
  "bg-[#0a0a0a] border-[#333] text-white placeholder:text-gray-600 focus-visible:ring-1 focus-visible:ring-gray-400 surface-rounded-sm h-12";
const labelClass = "ui-eyebrow text-gray-300";

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
      gsap.fromTo(
        ".contact-anim",
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
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="section-shell bg-black">
      <div className="container mx-auto section-inner">
        <div className="text-center section-heading-wrap contact-anim">
          <h2 className="section-heading text-chrome mb-4 leading-tight">
            LET&apos;S CREATE SOMETHING.
          </h2>
          <p className="ui-body text-gray-400 text-base md:text-lg">
            Drop us a message or hit us on WhatsApp. We respond fast.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 max-w-5xl mx-auto">
          <div className="flex flex-col gap-6 md:gap-8 contact-anim order-1 lg:order-2">
            <div className="bg-[#0D0D0D] p-6 md:p-10 border border-[#1e1e1e] flex flex-col items-center text-center flex-1 justify-center min-h-[280px] md:min-h-[320px] surface-rounded">
              <div
                className="w-20 h-20 flex items-center justify-center mb-6"
                style={{ background: "rgba(37,211,102,0.1)", borderRadius: "50%" }}
              >
                <WhatsappLogo size={40} color="#25D366" weight="fill" />
              </div>
              <h3 className="ui-card-title text-white mb-3">Prefer to chat?</h3>
              <p className="ui-body text-gray-400 mb-8 text-sm md:text-base">
                Message us directly on WhatsApp. We&apos;re online and ready to roll.
              </p>
              <a
                data-testid="link-whatsapp"
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="ui-cta-text flex items-center justify-center gap-3 px-8 py-4 transition-colors animate-pulse-green w-full surface-rounded-sm"
                style={{ background: "#25D366", color: "#000", minHeight: 52 }}
              >
                <WhatsappLogo size={20} weight="fill" />
                Open WhatsApp
              </a>
            </div>

            <div className="text-center py-1 md:py-4">
              <p className="ui-eyebrow text-gray-600 mb-2">Or email us directly</p>
              <a
                data-testid="link-email"
                href={`mailto:${CONTACT.email}`}
                className="ui-cta-text text-chrome hover:text-white transition-colors break-all sm:break-normal"
              >
                {CONTACT.email}
              </a>
            </div>
          </div>

          <div className="contact-anim order-2 lg:order-1">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Name</FormLabel>
                      <FormControl>
                        <Input
                          data-testid="input-name"
                          placeholder="John Doe"
                          {...field}
                          className={inputClass}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Email</FormLabel>
                      <FormControl>
                        <Input
                          data-testid="input-email"
                          placeholder="john@example.com"
                          {...field}
                          className={inputClass}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="projectType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Project Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger
                            data-testid="select-project-type"
                            className="bg-[#0a0a0a] border-[#333] text-white focus:ring-1 focus:ring-gray-400 surface-rounded-sm h-12"
                          >
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#0a0a0a] border-[#333] text-white surface-rounded-sm">
                          <SelectItem value="Automobile">Automobile</SelectItem>
                          <SelectItem value="Tactical">Tactical / Firearms</SelectItem>
                          <SelectItem value="Commercial">Commercial / Brand</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          data-testid="textarea-message"
                          placeholder="Tell us about your project..."
                          className="bg-[#0a0a0a] border-[#333] text-white placeholder:text-gray-600 focus-visible:ring-1 focus-visible:ring-gray-400 surface-rounded-sm min-h-[130px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <button
                  data-testid="button-submit"
                  type="submit"
                  className="ui-cta-text group flex w-full items-center justify-center surface-rounded-sm border border-[rgba(232,232,232,0.6)] bg-transparent px-6 text-white transition-colors duration-300 hover:bg-white hover:text-black"
                  style={{ height: 56 }}
                >
                  Send Message
                </button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
