import { Reveal } from "@/components/marketing/reveal";
import { stats } from "@/lib/content/site";

export function StatsBand() {
  return (
    <section className="border-y border-sand-200 bg-sand-100">
      <div className="container py-14 md:py-16">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.05}>
              <div className="border-l-2 border-gold-500 pl-5">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="font-display text-4xl font-semibold tracking-tight text-navy-900 sm:text-5xl">
                    {stat.value}
                    <span className="text-gold-600">{stat.suffix}</span>
                  </span>
                  <span className="mt-2 block text-sm text-muted-foreground">{stat.label}</span>
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
