import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function SectionHeading({ eyebrow, title, description, action }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="mb-3 text-[9px] font-bold tracking-[0.14em] text-stone-500 uppercase border border-stone-300  rounded-full w-fit p-2 pl-4">{eyebrow}</p>
        ) : null}
        <h2 className="text-[22px] font-bold leading-[1.05] tracking-tight text-stone-950 sm:text-[36px] sm:leading-none">{title}</h2>
        {description ? <p className="mt-3 text-base leading-7 text-stone-600 sm:mt-4 sm:text-lg sm:leading-8">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
