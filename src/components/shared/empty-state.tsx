import { SearchX } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-stone-300 bg-white px-6 py-12 text-center">
      <SearchX className="size-8 text-stone-400" />
      <h3 className="mt-4 text-lg font-semibold text-stone-950">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-stone-600">{description}</p>
    </div>
  );
}
