import { Reveal } from "@/components/marketing/reveal";
import { SectionHeading } from "@/components/marketing/section-heading";
import { howItWorks } from "@/lib/content/site";

export function HowItWorks() {
  return (
    <section className="section bg-background">
      <div className="container">
        <SectionHeading
          eyebrow="How it works"
          title="Four steps, and you know where your cargo is at each one."
          align="center"
        />

        <ol className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((step, index) => (
            <Reveal as="li" key={step.title} delay={index * 0.07}>
              <div className="relative h-full">
                {/* Connector line between steps on wide screens. */}
                {index < howItWorks.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute left-14 top-6 hidden h-px w-[calc(100%-3rem)] bg-gradient-to-r from-sand-300 to-transparent lg:block"
                  />
                ) : null}
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-sand-300 bg-background text-navy-700">
                  <step.icon className="h-5 w-5" aria-hidden="true" />
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-navy-800 text-[10px] font-bold text-white">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-navy-900">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
