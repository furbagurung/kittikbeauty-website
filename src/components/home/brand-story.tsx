import { SectionHeading } from "@/components/shared/section-heading";

export function BrandStory() {
  return (
    <section id="story" className="bg-white">
      <div className="mx-auto grid w-full max-w-[1304px] items-center gap-8 border-b border-stone-200 px-4 py-7 sm:px-6 sm:py-9 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <SectionHeading
          title="A practical beauty catalog with a premium eye."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-5">
            <p className="text-2xl font-bold text-stone-950">01</p>
            <p className="mt-3 text-base font-semibold text-stone-950">Curated products</p>
            <p className="mt-2 text-sm leading-6 text-stone-600">A focused catalog instead of clutter.</p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-5">
            <p className="text-2xl font-bold text-stone-950">02</p>
            <p className="mt-3 text-base font-semibold text-stone-950">WhatsApp support</p>
            <p className="mt-2 text-sm leading-6 text-stone-600">Ask questions before you buy.</p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-5">
            <p className="text-2xl font-bold text-stone-950">03</p>
            <p className="mt-3 text-base font-semibold text-stone-950">Everyday glow</p>
            <p className="mt-2 text-sm leading-6 text-stone-600">Beauty essentials for repeat routines.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
