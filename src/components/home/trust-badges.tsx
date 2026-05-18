import { Headphones, LockKeyhole, ShieldCheck, Truck } from "lucide-react";

const badges = [
  { title: "Authentic products", icon: ShieldCheck },
  { title: "Fast delivery", icon: Truck },
  { title: "Secure shopping", icon: LockKeyhole },
  { title: "Beauty support", icon: Headphones },
];

export function TrustBadges() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid w-full max-w-[1304px] gap-4 border-b border-stone-200 px-4 py-7 sm:grid-cols-2 sm:px-6 sm:py-8 lg:grid-cols-4 lg:px-8">
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div key={badge.title} className="flex items-center gap-4 rounded-lg border border-stone-200 bg-white p-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-stone-950 text-white">
                <Icon className="size-5" />
              </span>
              <p className="text-sm font-bold text-stone-950">{badge.title}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
