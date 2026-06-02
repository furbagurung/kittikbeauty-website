import type { LucideIcon } from "lucide-react";

type AccountModule = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type AccountModuleCardsProps = {
  modules: AccountModule[];
};

export function AccountModuleCards({ modules }: AccountModuleCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {modules.map((module) => {
        const Icon = module.icon;

        return (
          <article
            key={module.title}
            className="rounded-[22px] border border-brandGold/30 bg-white p-5 opacity-90 shadow-[0_12px_35px_rgba(0,69,31,0.06)]"
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-brandCream text-brandEmerald">
              <Icon className="size-5" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-lg font-black text-brandEmerald">{module.title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#5F5F5F]">{module.description}</p>
          </article>
        );
      })}
    </div>
  );
}
