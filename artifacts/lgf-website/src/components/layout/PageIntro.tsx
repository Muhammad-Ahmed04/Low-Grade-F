export default function PageIntro({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="bg-black pt-28 md:pt-32 lg:pt-36 pb-8 md:pb-10">
      <div className="container mx-auto section-inner">
        <div className="max-w-3xl">
          <h1
            className="text-white"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.75rem)",
              lineHeight: 0.95,
              fontWeight: "var(--fw-heading)",
              letterSpacing: "-0.045em",
              textTransform: "uppercase",
            }}
          >
            {title}
          </h1>
          <p className="ui-body text-gray-400 mt-5 text-base md:text-lg max-w-xl">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
