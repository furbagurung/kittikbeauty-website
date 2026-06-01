import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function SectionHeading({ title, action }: SectionHeadingProps) {
  return (
    <div className="flex items-end justify-between gap-4 text-left">
      <div className="max-w-2xl">
        <h2 className="text-[22px] font-black leading-tight tracking-tight text-brandEmerald sm:text-[28px]">{title}</h2>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
