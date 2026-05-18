import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function SectionHeading({ title, action }: SectionHeadingProps) {
  return (
    <div className="flex flex-col items-start gap-4 text-left">
      <div className="max-w-2xl">
        <h2 className="text-[24px] font-bold leading-tight tracking-tight text-stone-950 uppercase">{title}</h2>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
